import { NextRequest, NextResponse } from "next/server"
import { createHmac } from "crypto"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { startupIdeaScores, siteSettings } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import {
  computeIdeaTotal,
  computeIdeaPillarScores,
  type Answers,
} from "@/lib/startup-idea-score-data"

export async function POST(req: NextRequest) {
  const [session, liveSetting] = await Promise.all([
    auth(),
    db.select({ value: siteSettings.value }).from(siteSettings).where(eq(siteSettings.key, "tool_startup_idea_score_live")).limit(1),
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

  if (!answers || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const secret = process.env.RAZORPAY_KEY_SECRET!
  const expected = createHmac("sha256", secret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex")
  if (expected !== razorpaySignature) {
    return NextResponse.json({ error: "Payment verification failed" }, { status: 400 })
  }

  const totalScore = computeIdeaTotal(answers)
  const pillarScores = computeIdeaPillarScores(answers)

  const [row] = await db
    .insert(startupIdeaScores)
    .values({
      userId: session.user.id,
      answers,
      totalScore,
      pillarScores,
      isPaid: true,
      razorpayOrderId,
      razorpayPaymentId,
    })
    .returning({ id: startupIdeaScores.id })

  return NextResponse.json({ id: row.id, totalScore, pillarScores })
}
