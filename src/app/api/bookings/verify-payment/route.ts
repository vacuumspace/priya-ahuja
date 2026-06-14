import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { bookings, availability, services as servicesTable } from "@/lib/db/schema"
import { verifyPaymentSignature } from "@/lib/razorpay"
import { eq } from "drizzle-orm"
import { sendBookingConfirmation, sendAdminBookingNotification } from "@/lib/mailer"
import { createCalendarEvent } from "@/lib/google-calendar"

export async function POST(req: NextRequest) {
  try {
    const { bookingId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = await req.json()

    if (!bookingId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const isValid = verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)
    if (!isValid) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 })
    }

    const [booking] = await db
      .update(bookings)
      .set({ status: "paid", razorpayPaymentId })
      .where(eq(bookings.id, bookingId))
      .returning()

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    let slot = null
    if (booking.slotId) {
      const [s] = await db
        .update(availability)
        .set({ isBooked: true })
        .where(eq(availability.id, booking.slotId))
        .returning()
      slot = s
    }

    const [service] = await db
      .select({ title: servicesTable.title })
      .from(servicesTable)
      .where(eq(servicesTable.id, booking.serviceId))
      .limit(1)

    const serviceName = service?.title ?? "Session"

    let meetLink = booking.meetLink ?? undefined
    let googleCalendarEventId: string | undefined

    if (slot) {
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
        googleCalendarEventId = cal.eventId
        await db
          .update(bookings)
          .set({ meetLink: meetLink ?? null, googleCalendarEventId })
          .where(eq(bookings.id, booking.id))
      } catch (err) {
        console.error("Calendar event creation failed:", err)
      }
    }

    const dateLabel = slot
      ? new Date(`${slot.date}T${slot.startTime}:00+05:30`).toLocaleDateString("en-IN", {
          day: "numeric", month: "long", year: "numeric",
        })
      : "TBD"
    const timeLabel = slot ? `${slot.startTime} IST` : "TBD"

    sendBookingConfirmation({
      to: booking.userEmail,
      name: booking.userName,
      serviceName,
      date: dateLabel,
      time: timeLabel,
      meetLink,
    }).catch((e) => console.error("[mailer] sendBookingConfirmation failed:", e))

    sendAdminBookingNotification({
      serviceName,
      userName: booking.userName,
      userEmail: booking.userEmail,
      date: dateLabel,
      time: timeLabel,
      message: booking.message ?? undefined,
    }).catch((e) => console.error("[mailer] sendAdminBookingNotification failed:", e))

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("verify-payment error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
