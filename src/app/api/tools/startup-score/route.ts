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
import { sendPurchaseWelcome } from "@/lib/mailer"
import { fetchRazorpayOrder } from "@/lib/razorpay"

const DEFAULT_PRICE_PAISE = 49900

export async function POST(req: NextRequest) {
  const [session, liveSetting, priceSetting] = await Promise.all([
    auth(),
    db.select({ value: siteSettings.value }).from(siteSettings).where(eq(siteSettings.key, "tool_startup_score_live")).limit(1),
    db.select({ value: siteSettings.value }).from(siteSettings).where(eq(siteSettings.key, "price_startup_score")).limit(1),
  ])
  const PRICE_PAISE = priceSetting[0] ? parseInt(priceSetting[0].value, 10) : DEFAULT_PRICE_PAISE

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

  // Idempotency: reject if this paymentId was already used
  const [existing] = await db
    .select({ id: startupScores.id })
    .from(startupScores)
    .where(eq(startupScores.razorpayPaymentId, razorpayPaymentId))
    .limit(1)

  if (existing) {
    return NextResponse.json({ error: "Payment already used" }, { status: 409 })
  }

  const secret = process.env.RAZORPAY_KEY_SECRET!
  const expected = createHmac("sha256", secret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex")
  if (expected !== razorpaySignature) {
    return NextResponse.json({ error: "Payment verification failed" }, { status: 400 })
  }

  try {
    const rzOrder = await fetchRazorpayOrder(razorpayOrderId)
    if (rzOrder.amount !== PRICE_PAISE) {
      console.error(`Startup score amount mismatch: expected ${PRICE_PAISE}, got ${rzOrder.amount}`)
      return NextResponse.json({ error: "Payment amount mismatch" }, { status: 400 })
    }
  } catch (err) {
    console.error("Razorpay order fetch failed (continuing):", err)
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

  if (session.user.email) {
    sendPurchaseWelcome({
      to: session.user.email,
      name: session.user.name ?? "there",
      productSlug: "startup-score",
      productName: "Startup Fundability Score",
    }).catch(err => console.error("sendPurchaseWelcome startup-score error:", err))
  }

  return NextResponse.json({ id: row.id, totalScore, pillarScores })
}
