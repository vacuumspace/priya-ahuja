import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { bookings, availability, services as servicesTable } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { isAdmin } from "@/lib/auth"
import { sendBookingConfirmation, sendAdminBookingNotification } from "@/lib/mailer"
import { updateCalendarEvent, createCalendarEvent } from "@/lib/google-calendar"

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const { slotId } = await req.json()

  if (!slotId) {
    return NextResponse.json({ error: "New slot required" }, { status: 400 })
  }

  const [booking] = await db.select().from(bookings).where(eq(bookings.id, id)).limit(1)
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 })

  const admin = isAdmin(session.user.email)
  if (!admin && booking.userEmail !== session.user.email) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  if (booking.status === "cancelled" || booking.status === "completed") {
    return NextResponse.json({ error: "Cannot reschedule a completed or cancelled booking" }, { status: 400 })
  }

  const [service] = await db
    .select()
    .from(servicesTable)
    .where(eq(servicesTable.id, booking.serviceId))
    .limit(1)

  // Resolve new slot (supports synthetic ID or real UUID)
  let newSlotId: string
  let newSlot: { id: string; date: string; startTime: string; endTime: string } | null = null

  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(slotId)) {
    const [date, startTime] = slotId.split("T")
    const [h, m] = startTime.split(":").map(Number)
    const endTotal = h * 60 + m + (service?.durationMin ?? 30)
    const endTime = `${String(Math.floor(endTotal / 60)).padStart(2, "0")}:${String(endTotal % 60).padStart(2, "0")}`

    const existing = await db
      .select()
      .from(availability)
      .where(and(eq(availability.serviceId, booking.serviceId), eq(availability.date, date), eq(availability.startTime, startTime)))
      .limit(1)

    if (existing.length > 0 && existing[0].isBooked) {
      return NextResponse.json({ error: "Slot already booked" }, { status: 409 })
    }

    if (existing.length === 0) {
      const [created] = await db.insert(availability).values({ serviceId: booking.serviceId, date, startTime, endTime, isBooked: false }).returning()
      newSlot = created
    } else {
      newSlot = existing[0]
    }
    newSlotId = newSlot.id
  } else {
    const [s] = await db.select().from(availability).where(eq(availability.id, slotId)).limit(1)
    if (!s || s.isBooked) return NextResponse.json({ error: "Slot unavailable" }, { status: 409 })
    newSlot = s
    newSlotId = s.id
  }

  // Free old slot
  if (booking.slotId) {
    await db.update(availability).set({ isBooked: false }).where(eq(availability.id, booking.slotId))
  }

  // Mark new slot as booked
  await db.update(availability).set({ isBooked: true }).where(eq(availability.id, newSlotId))

  // Update calendar event
  let meetLink = booking.meetLink
  try {
    if (booking.googleCalendarEventId) {
      const cal = await updateCalendarEvent({
        eventId: booking.googleCalendarEventId,
        date: newSlot.date,
        startTime: newSlot.startTime,
        endTime: newSlot.endTime,
      })
      meetLink = cal.meetLink ?? meetLink
    } else {
      const cal = await createCalendarEvent({
        summary: `${service?.title ?? "Session"} – ${booking.userName}`,
        description: booking.message ?? undefined,
        date: newSlot.date,
        startTime: newSlot.startTime,
        endTime: newSlot.endTime,
        attendeeEmail: booking.userEmail,
        attendeeName: booking.userName,
      })
      meetLink = cal.meetLink ?? meetLink
      await db.update(bookings).set({ googleCalendarEventId: cal.eventId }).where(eq(bookings.id, id))
    }
  } catch (err) {
    console.error("Calendar update failed:", err)
  }

  await db.update(bookings).set({ slotId: newSlotId, meetLink }).where(eq(bookings.id, id))

  const dateLabel = new Date(`${newSlot.date}T${newSlot.startTime}:00+05:30`).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  })
  const timeLabel = `${newSlot.startTime} IST`
  const serviceName = service?.title ?? "Session"

  sendBookingConfirmation({
    to: booking.userEmail,
    name: booking.userName,
    serviceName,
    date: dateLabel,
    time: timeLabel,
    meetLink: meetLink ?? undefined,
  }).catch(console.error)

  sendAdminBookingNotification({
    serviceName,
    userName: booking.userName,
    userEmail: booking.userEmail,
    date: dateLabel,
    time: timeLabel,
  }).catch(console.error)

  return NextResponse.json({ success: true })
}
