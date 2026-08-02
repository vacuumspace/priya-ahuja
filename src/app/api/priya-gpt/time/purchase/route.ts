import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { priyaGptTimeTransactions, priyaGptTimeUnlocks } from "@/lib/db/schema"
import { and, eq } from "drizzle-orm"
import { fetchRazorpayOrder, verifyPaymentSignature } from "@/lib/razorpay"
import { addMinutes } from "@/lib/priya-gpt-time"
import { getTimePackages } from "@/lib/priya-gpt-packages"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  let { razorpayOrderId, razorpayPaymentId } = body as { razorpayOrderId?: string; razorpayPaymentId?: string }
  const razorpaySignature = (body as { razorpaySignature?: string }).razorpaySignature

  let amountPaise: number
  let minutes: number

  if (razorpayOrderId && razorpayPaymentId && razorpaySignature) {
    if (!verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)) {
      return NextResponse.json({ error: "Payment verification failed", paymentRequired: true }, { status: 400 })
    }

    try {
      const rzOrder = await fetchRazorpayOrder(razorpayOrderId)
      amountPaise = rzOrder.amount
    } catch (err) {
      console.error("priya-gpt time purchase: Razorpay order fetch failed:", err)
      return NextResponse.json({ error: "Could not verify payment amount" }, { status: 400 })
    }

    const packages = await getTimePackages()
    const pkg = packages.find((p) => p.price === amountPaise)
    if (!pkg) {
      console.error("priya-gpt time purchase: paid amount doesn't match any configured package", amountPaise)
      return NextResponse.json({ error: "Could not match payment to a time package" }, { status: 400 })
    }
    minutes = pkg.minutes
  } else {
    // No payment details from the client (paid earlier, then the browser
    // lost the callback) - fall back to an unused paid unlock on the account.
    const [unlock] = await db
      .select()
      .from(priyaGptTimeUnlocks)
      .where(and(eq(priyaGptTimeUnlocks.userId, session.user.id), eq(priyaGptTimeUnlocks.status, "paid")))
      .limit(1)
    if (!unlock) {
      return NextResponse.json({ error: "Missing payment details", paymentRequired: true }, { status: 400 })
    }
    razorpayOrderId = unlock.razorpayOrderId
    razorpayPaymentId = unlock.razorpayPaymentId ?? ""
    amountPaise = unlock.amountPaise
    minutes = unlock.minutes
  }

  // Idempotency: reject if this paymentId was already used
  if (razorpayPaymentId) {
    const [existing] = await db
      .select({ id: priyaGptTimeTransactions.id })
      .from(priyaGptTimeTransactions)
      .where(eq(priyaGptTimeTransactions.razorpayPaymentId, razorpayPaymentId))
      .limit(1)

    if (existing) {
      if (razorpayOrderId) {
        await db.update(priyaGptTimeUnlocks).set({ status: "consumed" }).where(eq(priyaGptTimeUnlocks.razorpayOrderId, razorpayOrderId))
      }
      return NextResponse.json({ error: "Payment already used", paymentRequired: true }, { status: 409 })
    }
  }

  const newBalance = await addMinutes(session.user.id, minutes, {
    amountPaise,
    razorpayOrderId,
    razorpayPaymentId,
  })

  if (razorpayOrderId) {
    await db.update(priyaGptTimeUnlocks).set({ status: "consumed", razorpayPaymentId: razorpayPaymentId || null }).where(eq(priyaGptTimeUnlocks.razorpayOrderId, razorpayOrderId))
  }

  return NextResponse.json({ minutesRemaining: newBalance })
}
