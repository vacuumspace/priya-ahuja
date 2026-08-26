import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { bookings, availability, purchases, pitchDeckUnlocks, toolUnlocks, priyaGptTimeUnlocks, services as servicesTable } from "@/lib/db/schema"
import { eq, and, ne, isNull } from "drizzle-orm"
import { verifyWebhookSignature } from "@/lib/razorpay"
import { createCalendarEvent } from "@/lib/google-calendar"
import { sendBookingConfirmation, sendAdminBookingNotification } from "@/lib/mailer"
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
    // Server-side confirmation: mark booking confirmed if not already done.
    // A booking can be "cancelled" here if an earlier payment attempt on the
    // same order failed (see payment.failed below) and the customer then
    // retried checkout successfully - money has landed, so it must win over
    // a prior cancellation rather than be silently dropped.
    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.razorpayOrderId, orderId))
      .limit(1)

    if (booking && booking.status !== "confirmed" && booking.status !== "completed") {
      if (booking.slotId) {
        await db.update(availability).set({ isBooked: true }).where(eq(availability.id, booking.slotId))
      }
      await db
        .update(bookings)
        .set({ status: "confirmed", razorpayPaymentId: paymentId ?? booking.razorpayPaymentId, amountPaid: amountCaptured ?? booking.amountPaid })
        .where(eq(bookings.id, booking.id))
    }

    // Fallback: the calendar invite + Meet link and the confirmation emails
    // are normally created/sent by the client-side verify-payment call right
    // after checkout. If the customer's browser never made it back (tab
    // closed, UPI app hand-off that didn't return, etc.), that call never
    // fires and the booking would otherwise stay confirmed with neither.
    // Each side is guarded by its own re-check/atomic claim so a concurrent
    // verify-payment call can't cause a duplicate invite or email.
    if (booking && booking.slotId) {
      const [slot] = await db.select().from(availability).where(eq(availability.id, booking.slotId)).limit(1)
      const [service] = await db
        .select({ title: servicesTable.title, type: servicesTable.type })
        .from(servicesTable)
        .where(eq(servicesTable.id, booking.serviceId))
        .limit(1)

      if (slot) {
        const serviceName = service?.title ?? "Session"
        const serviceType = (service?.type ?? "call") as "call" | "dm" | "report"
        let meetLink = booking.meetLink ?? undefined

        if (!booking.googleCalendarEventId) {
          const [current] = await db
            .select({ googleCalendarEventId: bookings.googleCalendarEventId })
            .from(bookings)
            .where(eq(bookings.id, booking.id))
            .limit(1)

          if (current && !current.googleCalendarEventId) {
            try {
              const cal = await createCalendarEvent({
                summary: `${serviceName} – ${booking.userName}`,
                description: booking.message ?? undefined,
                date: slot.date,
                startTime: slot.startTime,
                endTime: slot.endTime,
                attendeeEmail: booking.userEmail,
                attendeeName: booking.userName,
              })
              meetLink = cal.meetLink ?? meetLink
              await db
                .update(bookings)
                .set({ meetLink: cal.meetLink, googleCalendarEventId: cal.eventId })
                .where(and(eq(bookings.id, booking.id), isNull(bookings.googleCalendarEventId)))
            } catch (err) {
              console.error("Webhook fallback calendar creation failed:", err)
              await db
                .update(bookings)
                .set({ adminNotes: `[calendar error] ${String(err)}` })
                .where(eq(bookings.id, booking.id))
            }
          }
        }

        if (!booking.confirmationEmailSent) {
          const claimed = await db
            .update(bookings)
            .set({ confirmationEmailSent: true })
            .where(and(eq(bookings.id, booking.id), eq(bookings.confirmationEmailSent, false)))
            .returning({ id: bookings.id })

          if (claimed.length > 0) {
            const dateLabel = new Date(`${slot.date}T${slot.startTime}:00+05:30`).toLocaleDateString("en-IN", {
              day: "numeric", month: "long", year: "numeric",
            })
            const timeLabel = `${slot.startTime} IST`

            sendBookingConfirmation({
              to: booking.userEmail,
              name: booking.userName,
              serviceName,
              serviceType,
              date: dateLabel,
              time: timeLabel,
              meetLink,
            }).catch((e) => console.error("[webhook] sendBookingConfirmation failed:", e))

            sendAdminBookingNotification({
              serviceName,
              serviceType,
              userName: booking.userName,
              userEmail: booking.userEmail,
              date: dateLabel,
              time: timeLabel,
              message: booking.message ?? undefined,
            }).catch((e) => console.error("[webhook] sendAdminBookingNotification failed:", e))
          }
        }
      }
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

    // Mark a pitch deck analyser unlock as paid - safety net for buyers whose
    // browser never returns after checkout (common with UPI app hand-offs).
    await db
      .update(pitchDeckUnlocks)
      .set({
        status: "paid",
        razorpayPaymentId: paymentId,
        ...(amountCaptured ? { amountPaise: amountCaptured } : {}),
      })
      .where(and(eq(pitchDeckUnlocks.razorpayOrderId, orderId), ne(pitchDeckUnlocks.status, "consumed")))

    // Same for the quiz tools (fundability score, idea score)
    await db
      .update(toolUnlocks)
      .set({
        status: "paid",
        razorpayPaymentId: paymentId,
        ...(amountCaptured ? { amountPaise: amountCaptured } : {}),
      })
      .where(and(eq(toolUnlocks.razorpayOrderId, orderId), ne(toolUnlocks.status, "consumed")))

    // Same for PriyaGPT time purchases
    await db
      .update(priyaGptTimeUnlocks)
      .set({
        status: "paid",
        razorpayPaymentId: paymentId,
        ...(amountCaptured ? { amountPaise: amountCaptured } : {}),
      })
      .where(and(eq(priyaGptTimeUnlocks.razorpayOrderId, orderId), ne(priyaGptTimeUnlocks.status, "consumed")))
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
