import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { priyaGptTimeTransactions } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { fetchRazorpayOrder, verifyPaymentSignature } from "@/lib/razorpay"
import { addMinutes } from "@/lib/priya-gpt-time"
import { getTimePackages } from "@/lib/priya-gpt-packages"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = body as {
    razorpayOrderId: string
    razorpayPaymentId: string
    razorpaySignature: string
  }

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  // Idempotency: reject if this paymentId was already used
  const [existing] = await db
    .select({ id: priyaGptTimeTransactions.id })
    .from(priyaGptTimeTransactions)
    .where(eq(priyaGptTimeTransactions.razorpayPaymentId, razorpayPaymentId))
    .limit(1)

  if (existing) {
    return NextResponse.json({ error: "Payment already used" }, { status: 409 })
  }

  if (!verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)) {
    return NextResponse.json({ error: "Payment verification failed" }, { status: 400 })
  }

  let amountPaise: number
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

  const newBalance = await addMinutes(session.user.id, pkg.minutes, {
    amountPaise,
    razorpayOrderId,
    razorpayPaymentId,
  })

  return NextResponse.json({ minutesRemaining: newBalance })
}
