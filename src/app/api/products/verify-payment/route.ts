import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { purchases, digitalProducts } from "@/lib/db/schema"
import { verifyPaymentSignature, fetchRazorpayOrder } from "@/lib/razorpay"
import { eq } from "drizzle-orm"
import crypto from "crypto"
import { sendPurchaseWelcome, sendAccessLink } from "@/lib/mailer"

export async function POST(req: NextRequest) {
  try {
    const { purchaseId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = await req.json()

    if (!purchaseId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    // Fetch purchase to verify ownership: the submitted orderId must match what we created
    const [purchase] = await db
      .select()
      .from(purchases)
      .where(eq(purchases.id, purchaseId))
      .limit(1)

    if (!purchase) {
      return NextResponse.json({ error: "Purchase not found" }, { status: 404 })
    }

    // Ownership: submitted orderId must match the one we stored at order-creation time
    if (purchase.razorpayOrderId !== razorpayOrderId) {
      return NextResponse.json({ error: "Order mismatch" }, { status: 400 })
    }

    // Idempotency: already confirmed - return the existing token
    if (purchase.downloadToken && purchase.razorpayPaymentId) {
      return NextResponse.json({ success: true, accessToken: purchase.downloadToken })
    }

    // Verify HMAC signature
    const isValid = verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)
    if (!isValid) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 })
    }

    // Verify amount matches product price (prevents under-payment)
    const [product] = await db
      .select({ slug: digitalProducts.slug, title: digitalProducts.title, price: digitalProducts.price })
      .from(digitalProducts)
      .where(eq(digitalProducts.id, purchase.productId))
      .limit(1)

    let amountPaid: number | undefined
    if (product) {
      try {
        const rzOrder = await fetchRazorpayOrder(razorpayOrderId)
        if (rzOrder.amount !== product.price) {
          console.error(`Amount mismatch: expected ${product.price}, got ${rzOrder.amount} for order ${razorpayOrderId}`)
          return NextResponse.json({ error: "Payment amount mismatch" }, { status: 400 })
        }
        amountPaid = rzOrder.amount
      } catch (err) {
        console.error("Razorpay order fetch failed (continuing):", err)
        amountPaid = product.price
      }
    }

    const accessToken = crypto.randomBytes(32).toString("hex")
    const tokenExpiresAt = new Date()
    tokenExpiresAt.setFullYear(tokenExpiresAt.getFullYear() + 1)

    const [updated] = await db
      .update(purchases)
      .set({
        razorpayPaymentId,
        amountPaid,
        downloadToken: accessToken,
        tokenExpiresAt,
      })
      .where(eq(purchases.id, purchaseId))
      .returning()

    if (!updated) {
      return NextResponse.json({ error: "Purchase not found" }, { status: 404 })
    }

    if (product && purchase.userEmail) {
      const ACCESS_URLS: Record<string, string> = {
        "angel-investor-list":  "/fundraise/investor-list/angel-investors",
        "early-stage-vc-list":  "/fundraise/investor-list/early-stage-vc",
        "family-offices-list":  "/fundraise/investor-list/family-offices",
        "incubators-list":      "/fundraise/investor-list/incubators",
      }
      const accessPath = ACCESS_URLS[product.slug] ?? "/my-activity"
      sendPurchaseWelcome({
        to: purchase.userEmail,
        name: purchase.userName || "there",
        productSlug: product.slug,
        productName: product.title,
      }).catch(err => console.error("sendPurchaseWelcome error:", err))
      sendAccessLink({
        to: purchase.userEmail,
        name: purchase.userName || "there",
        productName: product.title,
        accessUrl: `${process.env.NEXT_PUBLIC_APP_URL}${accessPath}`,
      }).catch(err => console.error("sendAccessLink error:", err))
    }

    return NextResponse.json({ success: true, accessToken })
  } catch (err) {
    console.error("products/verify-payment error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
