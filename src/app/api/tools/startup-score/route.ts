import { NextRequest, NextResponse } from "next/server"
import { createHmac } from "crypto"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { startupScores, siteSettings } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import {
  computeTotal,
  computePillarScores,
  type Answers,
} from "@/lib/startup-score-data"

export async function POST(req: NextRequest) {
  const [session, liveSetting] = await Promise.all([
    auth(),
    db.select({ value: siteSettings.value }).from(siteSettings).where(eq(siteSettings.key, "tool_startup_score_live")).limit(1),
  ])

  const isLive = liveSetting.length === 0 || liveSetting[0].value !== "false"
  if (!isLive) {
    return NextResponse.json({ error: "Tool is currently unavailable" }, { status: 503 })
  }

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { answers, razorpayOrderId, razorpayPaymentId, razorpaySignature } = body as {
    answers: Answers
    razorpayOrderId: string
    razorpayPaymentId: string
    razorpaySignature: string
  }

  if (!answers) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }
  const secret = process.env.RAZORPAY_KEY_SECRET!
  const expected = createHmac("sha256", secret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex")
  if (expected !== razorpaySignature) {
    return NextResponse.json({ error: "Payment verification failed" }, { status: 400 })
  }

  const totalScore = computeTotal(answers)
  const pillarScores = computePillarScores(answers)

  const [row] = await db
    .insert(startupScores)
    .values({
      userId: session.user.id,
      answers,
      totalScore,
      pillarScores,
      scoreBand: "",
      isPaid: true,
      razorpayOrderId,
      razorpayPaymentId,
    })
    .returning({ id: startupScores.id })

  return NextResponse.json({ id: row.id, totalScore, pillarScores })
}
