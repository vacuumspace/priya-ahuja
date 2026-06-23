import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { bookings, availability, services as servicesTable } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { sendBookingConfirmation, sendAdminBookingNotification } from "@/lib/mailer"
import { createCalendarEvent } from "@/lib/google-calendar"

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || !isAdmin(session.user?.email)) {
    return new Response("Forbidden", { status: 403 })
  }

  const { id } = await params

  const [booking] = await db.select().from(bookings).where(eq(bookings.id, id)).limit(1)
  if (!booking) return Response.json({ error: "Booking not found" }, { status: 404 })

  let slot = null
  if (booking.slotId) {
    const [s] = await db.select().from(availability).where(eq(availability.id, booking.slotId)).limit(1)
    slot = s
  }

  const [svc] = await db
    .select({ title: servicesTable.title, type: servicesTable.type })
    .from(servicesTable)
    .where(eq(servicesTable.id, booking.serviceId))
    .limit(1)

  const serviceName = svc?.title ?? "Session"
  const serviceType = (svc?.type ?? "call") as "call" | "dm" | "report"

  let meetLink = booking.meetLink ?? undefined
  const calendarResult: { created: boolean; eventId?: string; error?: string } = { created: false }

  if (slot && !booking.googleCalendarEventId) {
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
      calendarResult.created = true
      calendarResult.eventId = cal.eventId
      await db
        .update(bookings)
        .set({ meetLink: meetLink ?? null, googleCalendarEventId: cal.eventId })
        .where(eq(bookings.id, booking.id))
    } catch (err) {
      calendarResult.error = String(err)
    }
  }

  const dateLabel = slot
    ? new Date(`${slot.date}T${slot.startTime}:00+05:30`).toLocaleDateString("en-IN", {
        day: "numeric", month: "long", year: "numeric",
      })
    : "TBD"
  const timeLabel = slot ? `${slot.startTime} IST` : "TBD"

  await sendBookingConfirmation({
    to: booking.userEmail,
    name: booking.userName,
    serviceName,
    serviceType,
    date: slot ? dateLabel : undefined,
    time: slot ? timeLabel : undefined,
    meetLink,
  })

  await sendAdminBookingNotification({
    serviceName,
    serviceType,
    userName: booking.userName,
    userEmail: booking.userEmail,
    date: slot ? dateLabel : undefined,
    time: slot ? timeLabel : undefined,
    message: booking.message ?? undefined,
  })

  return Response.json({ ok: true, calendar: calendarResult })
}
