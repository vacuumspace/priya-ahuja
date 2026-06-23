import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { bookings, availability, services as servicesTable } from "@/lib/db/schema"
import { verifyPaymentSignature, fetchRazorpayOrder } from "@/lib/razorpay"
import { eq } from "drizzle-orm"
import { sendBookingConfirmation, sendAdminBookingNotification } from "@/lib/mailer"
import { createCalendarEvent } from "@/lib/google-calendar"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Sign in required" }, { status: 401 })
    }

    const { bookingId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = await req.json()

    if (!bookingId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    // Fetch booking first so we can verify ownership before doing anything else
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, bookingId)).limit(1)

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    // Ownership: booking must belong to the signed-in user and match the submitted orderId
    if (booking.userEmail !== session.user.email) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    if (booking.razorpayOrderId !== razorpayOrderId) {
      return NextResponse.json({ error: "Order mismatch" }, { status: 400 })
    }

    // Idempotency: if already confirmed AND post-payment side-effects completed, short-circuit
    if (booking.status === "confirmed" && booking.razorpayPaymentId && booking.googleCalendarEventId) {
      return NextResponse.json({ success: true })
    }

    if (booking.status === "cancelled") {
      return NextResponse.json({ error: "Booking was cancelled" }, { status: 400 })
    }

    // Verify HMAC signature
    const isValid = verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)
    if (!isValid) {
      if (booking.slotId) {
        await db.update(availability).set({ isBooked: false }).where(eq(availability.id, booking.slotId))
      }
      await db.update(bookings).set({ status: "cancelled" }).where(eq(bookings.id, bookingId))
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 })
    }

    const [service] = await db
      .select({ price: servicesTable.price })
      .from(servicesTable)
      .where(eq(servicesTable.id, booking.serviceId))
      .limit(1)
    if (service) {
      try {
        const rzOrder = await fetchRazorpayOrder(razorpayOrderId)
        if (rzOrder.amount !== service.price) {
          console.error(`Amount mismatch: expected ${service.price}, got ${rzOrder.amount} for order ${razorpayOrderId}`)
          return NextResponse.json({ error: "Payment amount mismatch" }, { status: 400 })
        }
      } catch (err) {
        console.error("Razorpay order fetch failed (continuing):", err)
      }
    }

    const [confirmedBooking] = await db
      .update(bookings)
      .set({ status: "confirmed", razorpayPaymentId })
      .where(eq(bookings.id, bookingId))
      .returning()

    if (!confirmedBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    let slot = null
    if (confirmedBooking.slotId) {
      const [s] = await db
        .select()
        .from(availability)
        .where(eq(availability.id, confirmedBooking.slotId))
        .limit(1)
      slot = s
    }

    const [svc] = await db
      .select({ title: servicesTable.title, type: servicesTable.type })
      .from(servicesTable)
      .where(eq(servicesTable.id, confirmedBooking.serviceId))
      .limit(1)

    const serviceName = svc?.title ?? "Session"
    const serviceType = (svc?.type ?? "call") as "call" | "dm" | "report"

    let meetLink = confirmedBooking.meetLink ?? undefined
    let googleCalendarEventId: string | undefined

    if (slot) {
      try {
        const cal = await createCalendarEvent({
          summary: `${serviceName} – ${confirmedBooking.userName}`,
          description: confirmedBooking.message ?? undefined,
          date: slot.date,
          startTime: slot.startTime,
          endTime: slot.endTime,
          attendeeEmail: confirmedBooking.userEmail,
          attendeeName: confirmedBooking.userName,
        })
        meetLink = cal.meetLink ?? meetLink
        googleCalendarEventId = cal.eventId
        await db
          .update(bookings)
          .set({ meetLink: meetLink ?? null, googleCalendarEventId })
          .where(eq(bookings.id, confirmedBooking.id))
      } catch (err) {
        console.error("Calendar event creation failed:", err)
        const errMsg = `[calendar error] ${String(err)}`
        await db.update(bookings).set({ adminNotes: errMsg }).where(eq(bookings.id, confirmedBooking.id))
      }
    }

    const dateLabel = slot
      ? new Date(`${slot.date}T${slot.startTime}:00+05:30`).toLocaleDateString("en-IN", {
          day: "numeric", month: "long", year: "numeric",
        })
      : "TBD"
    const timeLabel = slot ? `${slot.startTime} IST` : "TBD"

    sendBookingConfirmation({
      to: confirmedBooking.userEmail,
      name: confirmedBooking.userName,
      serviceName,
      serviceType,
      date: slot ? dateLabel : undefined,
      time: slot ? timeLabel : undefined,
      meetLink,
    }).catch((e) => console.error("[mailer] sendBookingConfirmation failed:", e))

    sendAdminBookingNotification({
      serviceName,
      serviceType,
      userName: confirmedBooking.userName,
      userEmail: confirmedBooking.userEmail,
      date: slot ? dateLabel : undefined,
      time: slot ? timeLabel : undefined,
      message: confirmedBooking.message ?? undefined,
    }).catch((e) => console.error("[mailer] sendAdminBookingNotification failed:", e))

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("verify-payment error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
