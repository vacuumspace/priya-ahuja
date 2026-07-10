import { NextRequest, NextResponse } from "next/server"
import { createHmac } from "crypto"
import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { pitchDeckAnalyses, siteSettings } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { analyzePitchDeck } from "@/lib/pitch-deck-analysis"
import { MAX_DECK_SIZE_BYTES } from "@/lib/pitch-deck-report"
import { sendPurchaseWelcome } from "@/lib/mailer"
import { fetchRazorpayOrder } from "@/lib/razorpay"

// Gemini needs time to read a full deck and write the report
export const maxDuration = 120

const DEFAULT_PRICE_PAISE = 19900

export async function POST(req: NextRequest) {
  const [session, liveSetting, priceSetting] = await Promise.all([
    auth(),
    db.select({ value: siteSettings.value }).from(siteSettings).where(eq(siteSettings.key, "tool_pitch_deck_analyser_live")).limit(1),
    db.select({ value: siteSettings.value }).from(siteSettings).where(eq(siteSettings.key, "price_pitch_deck_analyser")).limit(1),
  ])
  const PRICE_PAISE = priceSetting[0] ? parseInt(priceSetting[0].value, 10) : DEFAULT_PRICE_PAISE

  const isLive = liveSetting.length === 0 || liveSetting[0].value !== "false"
  if (!isLive) {
    return NextResponse.json({ error: "Tool is currently unavailable" }, { status: 503 })
  }

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const adminUser = isAdmin(session.user.email)

  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: "Invalid upload. Please try again." }, { status: 400 })
  }

  const file = formData.get("file")
  const razorpayOrderId = formData.get("razorpayOrderId")?.toString() ?? ""
  const razorpayPaymentId = formData.get("razorpayPaymentId")?.toString() ?? ""
  const razorpaySignature = formData.get("razorpaySignature")?.toString() ?? ""

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No PDF file received" }, { status: 400 })
  }
  if (file.size > MAX_DECK_SIZE_BYTES) {
    return NextResponse.json({ error: "File is over 4 MB. Compress your PDF and try again." }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  // magic bytes check - don't trust the extension or mime type alone
  if (buffer.length < 5 || buffer.subarray(0, 5).toString("latin1") !== "%PDF-") {
    return NextResponse.json({ error: "That doesn't look like a valid PDF. Export your deck as PDF and try again." }, { status: 400 })
  }

  // Payment verification (admin can test without paying)
  let amountPaid: number | null = null
  if (!adminUser) {
    amountPaid = PRICE_PAISE
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json({ error: "Missing payment details" }, { status: 400 })
    }

    // Idempotency: one payment = one saved analysis
    const [existing] = await db
      .select({ id: pitchDeckAnalyses.id })
      .from(pitchDeckAnalyses)
      .where(eq(pitchDeckAnalyses.razorpayPaymentId, razorpayPaymentId))
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
        console.error(`Pitch deck analyser amount mismatch: expected ${PRICE_PAISE}, got ${rzOrder.amount}`)
        return NextResponse.json({ error: "Payment amount mismatch" }, { status: 400 })
      }
      amountPaid = Number(rzOrder.amount)
    } catch (err) {
      console.error("Razorpay order fetch failed (continuing):", err)
    }
  }

  let analysis
  try {
    analysis = await analyzePitchDeck(buffer)
  } catch (err) {
    console.error("pitch deck analysis error:", err)
    // Payment is NOT consumed (no row inserted) - the client keeps the payment info and can retry
    return NextResponse.json(
      { error: "Analysis failed. Your payment is safe - please try uploading again. If it keeps failing, email hi@priyaahuja.in with your payment ID.", retryable: true },
      { status: 502 }
    )
  }

  if (!analysis.isPitchDeck) {
    // Wrong document uploaded - payment stays valid, let them upload the right file
    return NextResponse.json(
      { error: `This doesn't look like a pitch deck - ${analysis.reason} Upload your pitch deck PDF to run the analysis.`, notAPitchDeck: true },
      { status: 422 }
    )
  }

  const { report } = analysis

  const [row] = await db
    .insert(pitchDeckAnalyses)
    .values({
      userId: session.user.id,
      fileName: file.name.slice(0, 200),
      fileSizeBytes: file.size,
      totalScore: report.overallScore,
      report,
      isPaid: !adminUser,
      amountPaid,
      razorpayOrderId: adminUser ? null : razorpayOrderId,
      razorpayPaymentId: adminUser ? null : razorpayPaymentId,
    })
    .returning({ id: pitchDeckAnalyses.id })

  if (!adminUser && session.user.email) {
    sendPurchaseWelcome({
      to: session.user.email,
      name: session.user.name ?? "there",
      productSlug: "pitch-deck-analyser",
      productName: "Pitch Deck Analyser",
    }).catch(err => console.error("sendPurchaseWelcome pitch-deck-analyser error:", err))
  }

  return NextResponse.json({ id: row.id, report })
}
