import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { purchases } from "@/lib/db/schema"
import { verifyPaymentSignature } from "@/lib/razorpay"
import { eq } from "drizzle-orm"
import crypto from "crypto"

export async function POST(req: NextRequest) {
  try {
    const { purchaseId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = await req.json()

    if (!purchaseId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const isValid = verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)
    if (!isValid) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 })
    }

    // Generate a long-lived access token (no expiry — access is permanent once purchased)
    const accessToken = crypto.randomBytes(32).toString("hex")

    const [purchase] = await db
      .update(purchases)
      .set({
        razorpayPaymentId,
        downloadToken: accessToken,
      })
      .where(eq(purchases.id, purchaseId))
      .returning()

    if (!purchase) {
      return NextResponse.json({ error: "Purchase not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, accessToken })
  } catch (err) {
    console.error("products/verify-payment error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
