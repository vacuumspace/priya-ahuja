import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { startupScores } from "@/lib/db/schema"
import { verifyPaymentSignature } from "@/lib/razorpay"
import { eq } from "drizzle-orm"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { scoreId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = await req.json()

    if (!scoreId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const isValid = verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)
    if (!isValid) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 })
    }

    const [updated] = await db
      .update(startupScores)
      .set({ isPaid: true, razorpayPaymentId })
      .where(eq(startupScores.id, scoreId))
      .returning({ id: startupScores.id })

    if (!updated) {
      return NextResponse.json({ error: "Score not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("unlock-verify error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
