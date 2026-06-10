import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { startupScores } from "@/lib/db/schema"
import { getRazorpayInstance } from "@/lib/razorpay"
import { eq } from "drizzle-orm"

const UNLOCK_PRICE_PAISE = 9900 // ₹99

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { scoreId } = await req.json()
    if (!scoreId) {
      return NextResponse.json({ error: "scoreId required" }, { status: 400 })
    }

    const [score] = await db
      .select({ id: startupScores.id, userId: startupScores.userId, isPaid: startupScores.isPaid })
      .from(startupScores)
      .where(eq(startupScores.id, scoreId))
      .limit(1)

    if (!score || score.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    if (score.isPaid) {
      return NextResponse.json({ error: "Already unlocked" }, { status: 400 })
    }

    const razorpay = getRazorpayInstance()
    const order = await razorpay.orders.create({
      amount: UNLOCK_PRICE_PAISE,
      currency: "INR",
      receipt: `score_unlock_${Date.now()}`,
    })

    await db
      .update(startupScores)
      .set({ razorpayOrderId: order.id })
      .where(eq(startupScores.id, scoreId))

    return NextResponse.json({
      orderId: order.id,
      amount: UNLOCK_PRICE_PAISE,
      keyId: process.env.RAZORPAY_KEY_ID,
      scoreId,
    })
  } catch (err) {
    console.error("unlock-order error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
