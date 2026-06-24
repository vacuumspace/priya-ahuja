import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { bookings, availability, purchases } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { verifyWebhookSignature } from "@/lib/razorpay"
import crypto from "crypto"

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const signature = req.headers.get("x-razorpay-signature") ?? ""

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  const event = JSON.parse(rawBody)
  const orderId = event.payload?.payment?.entity?.order_id as string | undefined
  const paymentId = event.payload?.payment?.entity?.id as string | undefined
  const amountCaptured = event.payload?.payment?.entity?.amount as number | undefined

  if (!orderId) return NextResponse.json({ ok: true })

  if (event.event === "payment.captured") {
    // Server-side confirmation: mark booking confirmed if still pending
    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.razorpayOrderId, orderId))
      .limit(1)

    if (booking && booking.status === "pending") {
      await db
        .update(bookings)
        .set({ status: "confirmed", razorpayPaymentId: paymentId ?? booking.razorpayPaymentId, amountPaid: amountCaptured ?? booking.amountPaid })
        .where(and(eq(bookings.id, booking.id), eq(bookings.status, "pending")))
      // Note: calendar event and confirmation email are handled by client-side verify-payment.
      // This webhook acts as a safety net if the client call never completes.
    }

    // Also confirm a pending product purchase if one matches this order
    const [purchase] = await db
      .select()
      .from(purchases)
      .where(eq(purchases.razorpayOrderId, orderId))
      .limit(1)

    if (purchase && !purchase.downloadToken && paymentId) {
      const accessToken = crypto.randomBytes(32).toString("hex")
      const tokenExpiresAt = new Date()
      tokenExpiresAt.setFullYear(tokenExpiresAt.getFullYear() + 1)

      await db
        .update(purchases)
        .set({
          razorpayPaymentId: paymentId,
          amountPaid: amountCaptured,
          downloadToken: accessToken,
          tokenExpiresAt,
        })
        .where(and(eq(purchases.id, purchase.id), eq(purchases.downloadToken, null as unknown as string)))
        // Welcome email is handled by client-side verify-payment; skipped here to avoid duplication.
    }
  }

  if (event.event === "payment.failed") {
    // Unlock slot and cancel the booking
    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.razorpayOrderId, orderId))
      .limit(1)

    if (booking && booking.status === "pending") {
      if (booking.slotId) {
        await db.update(availability).set({ isBooked: false }).where(eq(availability.id, booking.slotId))
      }
      await db.update(bookings).set({ status: "cancelled" }).where(eq(bookings.id, booking.id))
    }
  }

  return NextResponse.json({ ok: true })
}
