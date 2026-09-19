import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { courseGifts } from "@/lib/db/schema"
import { verifyPaymentSignature, fetchRazorpayOrder } from "@/lib/razorpay"
import { eq } from "drizzle-orm"
import { confirmGiftPayment, giftCardUrl, giftUrl } from "@/lib/course-gift"
import { cardVersion } from "@/lib/gift-card"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Sign in required" }, { status: 401 })
    }

    const { giftId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = await req.json()
    if (!giftId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const [gift] = await db.select().from(courseGifts).where(eq(courseGifts.id, giftId)).limit(1)
    if (!gift) return NextResponse.json({ error: "Gift not found" }, { status: 404 })
    if (gift.purchaserId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    if (gift.razorpayOrderId !== razorpayOrderId) {
      return NextResponse.json({ error: "Order mismatch" }, { status: 400 })
    }

    if (gift.razorpayPaymentId) {
      return NextResponse.json({ success: true, token: gift.token, link: giftUrl(gift.token), cardUrl: giftCardUrl(gift.token, cardVersion(gift), "") })
    }

    if (!verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)) {
      if (gift.status === "pending") {
        await db.update(courseGifts).set({ status: "cancelled" }).where(eq(courseGifts.id, gift.id))
      }
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 })
    }

    // The order amount was fixed at creation; this only reads back what was captured.
    let amountPaid: number
    try {
      amountPaid = (await fetchRazorpayOrder(razorpayOrderId)).amount
    } catch (err) {
      console.error("Razorpay order fetch failed (continuing):", err)
      amountPaid = gift.pricePaise
    }

    const confirmed = await confirmGiftPayment(gift, razorpayPaymentId, amountPaid)
    return NextResponse.json({ success: true, token: confirmed.token, link: giftUrl(confirmed.token), cardUrl: giftCardUrl(confirmed.token, cardVersion(confirmed), "") })
  } catch (err) {
    console.error("course gift verify-payment error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
