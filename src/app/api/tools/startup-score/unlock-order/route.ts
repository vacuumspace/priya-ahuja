import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { siteSettings, toolUnlocks } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { getRazorpayInstance } from "@/lib/razorpay"

const DEFAULT_PRICE_PAISE = 49900

async function getPrice(): Promise<number> {
  const [row] = await db.select({ value: siteSettings.value }).from(siteSettings).where(eq(siteSettings.key, "price_startup_score")).limit(1)
  return row ? parseInt(row.value, 10) : DEFAULT_PRICE_PAISE
}

export async function POST() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const price = await getPrice()
    const razorpay = getRazorpayInstance()
    const order = await razorpay.orders.create({
      amount: price,
      currency: "INR",
      receipt: `startup_score_${Date.now()}`,
      notes: { product: "startup-score", userId: session.user.id },
    })

    // Durable record of who this order belongs to - the webhook marks it paid
    // even if the buyer's browser never comes back after checkout.
    await db.insert(toolUnlocks).values({
      tool: "startup-score",
      userId: session.user.id,
      razorpayOrderId: order.id,
      amountPaise: price,
    })

    return NextResponse.json({
      orderId: order.id,
      amount: price,
      keyId: process.env.RAZORPAY_KEY_ID,
    })
  } catch (err) {
    console.error("unlock-order error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
