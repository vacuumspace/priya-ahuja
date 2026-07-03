import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getRazorpayInstance } from "@/lib/razorpay"
import { getTimePackages } from "@/lib/priya-gpt-packages"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  const minutes = Number(body?.minutes)

  const packages = await getTimePackages()
  const pkg = packages.find((p) => p.minutes === minutes)
  if (!pkg) {
    return NextResponse.json({ error: "Invalid time package" }, { status: 400 })
  }

  try {
    const razorpay = getRazorpayInstance()
    const order = await razorpay.orders.create({
      amount: pkg.price,
      currency: "INR",
      receipt: `priya_gpt_time_${Date.now()}`,
    })

    return NextResponse.json({
      orderId: order.id,
      amount: pkg.price,
      keyId: process.env.RAZORPAY_KEY_ID,
    })
  } catch (err) {
    console.error("priya-gpt time create-order error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
