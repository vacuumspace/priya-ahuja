import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getRazorpayInstance } from "@/lib/razorpay"

const PRICE_PAISE = 100 // TEMP: ₹1 for testing (original: 9900)

export async function POST() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const razorpay = getRazorpayInstance()
    const order = await razorpay.orders.create({
      amount: PRICE_PAISE,
      currency: "INR",
      receipt: `startup_score_${Date.now()}`,
    })

    return NextResponse.json({
      orderId: order.id,
      amount: PRICE_PAISE,
      keyId: process.env.RAZORPAY_KEY_ID,
    })
  } catch (err) {
    console.error("unlock-order error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
