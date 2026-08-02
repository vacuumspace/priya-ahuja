import { NextRequest, NextResponse } from "next/server"
import { createHmac } from "crypto"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { startupScores, siteSettings, toolUnlocks } from "@/lib/db/schema"
import { and, eq } from "drizzle-orm"
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
  const { answers } = body as { answers: Answers }
  let { razorpayOrderId, razorpayPaymentId } = body as { razorpayOrderId?: string; razorpayPaymentId?: string }
  const razorpaySignature = (body as { razorpaySignature?: string }).razorpaySignature

  if (!answers) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  if (razorpayOrderId && razorpayPaymentId && razorpaySignature) {
    const secret = process.env.RAZORPAY_KEY_SECRET!
    const expected = createHmac("sha256", secret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex")
    if (expected !== razorpaySignature) {
      return NextResponse.json({ error: "Payment verification failed", paymentRequired: true }, { status: 400 })
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
  } else {
    // No payment details from the client (paid earlier, then refreshed or
    // came back later) - fall back to an unused paid unlock on the account.
    const [unlock] = await db
      .select()
      .from(toolUnlocks)
      .where(and(
        eq(toolUnlocks.userId, session.user.id),
        eq(toolUnlocks.tool, "startup-score"),
        eq(toolUnlocks.status, "paid"),
      ))
      .limit(1)
    if (!unlock) {
      return NextResponse.json({ error: "Missing payment details", paymentRequired: true }, { status: 400 })
    }
    razorpayOrderId = unlock.razorpayOrderId
    razorpayPaymentId = unlock.razorpayPaymentId ?? ""
  }

  // Idempotency: reject if this paymentId was already used
  if (razorpayPaymentId) {
    const [existing] = await db
      .select({ id: startupScores.id })
      .from(startupScores)
      .where(eq(startupScores.razorpayPaymentId, razorpayPaymentId))
      .limit(1)

    if (existing) {
      // A spent payment can't back an unlock either - retire it
      if (razorpayOrderId) {
        await db.update(toolUnlocks).set({ status: "consumed" }).where(eq(toolUnlocks.razorpayOrderId, razorpayOrderId))
      }
      return NextResponse.json({ error: "Payment already used", paymentRequired: true }, { status: 409 })
    }
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

  if (razorpayOrderId) {
    await db.update(toolUnlocks).set({ status: "consumed", razorpayPaymentId: razorpayPaymentId || null }).where(eq(toolUnlocks.razorpayOrderId, razorpayOrderId))
  }

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
