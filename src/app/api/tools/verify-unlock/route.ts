import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { toolUnlocks } from "@/lib/db/schema"
import { and, eq, ne } from "drizzle-orm"
import { verifyPaymentSignature } from "@/lib/razorpay"

// Marks a quiz-tool unlock as paid the moment Razorpay checkout succeeds,
// before the quiz is even taken. The webhook does the same server-side;
// whichever lands first wins. Without this, closing the tab between paying
// and finishing the quiz loses the payment.
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: { razorpayOrderId?: string; razorpayPaymentId?: string; razorpaySignature?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = body
  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return NextResponse.json({ error: "Missing payment details" }, { status: 400 })
  }

  if (!verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)) {
    return NextResponse.json({ error: "Payment verification failed" }, { status: 400 })
  }

  await db
    .update(toolUnlocks)
    .set({ status: "paid", razorpayPaymentId })
    .where(and(
      eq(toolUnlocks.razorpayOrderId, razorpayOrderId),
      eq(toolUnlocks.userId, session.user.id),
      ne(toolUnlocks.status, "consumed"),
    ))

  return NextResponse.json({ ok: true })
}
