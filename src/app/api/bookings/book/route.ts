import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { bookings, services as servicesTable, availability } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { sendBookingConfirmation, sendAdminBookingNotification } from "@/lib/mailer"
import { createCalendarEvent } from "@/lib/google-calendar"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Sign in required" }, { status: 401 })
    }

    const { serviceSlug, slotId, name, message, deckLink } = await req.json()

    if (!serviceSlug || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const [service] = await db
      .select()
      .from(servicesTable)
      .where(eq(servicesTable.slug, serviceSlug))
      .limit(1)

    if (!service || !service.isActive) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    if (service.type === "call" && !slotId) {
      return NextResponse.json({ error: "Please select a time slot" }, { status: 400 })
    }

    let resolvedSlotId: string | null = slotId ?? null
    if (slotId && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(slotId)) {
      const [date, startTime] = slotId.split("T")
      const [h, m] = startTime.split(":").map(Number)
      const endTotal = h * 60 + m + (service.durationMin ?? 30)
      const endTime = `${String(Math.floor(endTotal / 60)).padStart(2, "0")}:${String(endTotal % 60).padStart(2, "0")}`

      const existing = await db
        .select({ id: availability.id, isBooked: availability.isBooked })
        .from(availability)
        .where(and(eq(availability.serviceId, service.id), eq(availability.date, date), eq(availability.startTime, startTime)))
        .limit(1)

      if (existing.length > 0 && existing[0].isBooked) {
        return NextResponse.json({ error: "This slot is no longer available" }, { status: 409 })
      }

      if (existing.length === 0) {
        const [newSlot] = await db.insert(availability).values({ serviceId: service.id, date, startTime, endTime, isBooked: false }).returning({ id: availability.id })
        resolvedSlotId = newSlot.id
      } else {
        resolvedSlotId = existing[0].id
      }
    } else if (slotId) {
      const [slot] = await db.select().from(availability).where(eq(availability.id, slotId)).limit(1)
      if (!slot || slot.isBooked) {
        return NextResponse.json({ error: "This slot is no longer available" }, { status: 409 })
      }
    }

    const fullMessage = [
      deckLink ? `Deck/Doc Link: ${deckLink}` : null,
      message || null,
    ].filter(Boolean).join("\n\n")

    const [booking] = await db.insert(bookings).values({
      serviceId: service.id,
      slotId: resolvedSlotId,
      userName: name,
      userEmail: session.user.email,
      message: fullMessage || null,
      status: "confirmed",
    }).returning()

    // Fetch the slot for calendar/email
    let slot = null
    if (resolvedSlotId) {
      const [s] = await db.select().from(availability).where(eq(availability.id, resolvedSlotId)).limit(1)
      slot = s
    }

    let meetLink: string | undefined
    if (slot) {
      try {
        const cal = await createCalendarEvent({
          summary: `${service.title} – ${name}`,
          description: fullMessage || undefined,
          date: slot.date,
          startTime: slot.startTime,
          endTime: slot.endTime,
          attendeeEmail: session.user.email,
          attendeeName: name,
        })
        meetLink = cal.meetLink ?? undefined
        await db
          .update(bookings)
          .set({ meetLink: meetLink ?? null, googleCalendarEventId: cal.eventId })
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
      to: session.user.email,
      name,
      serviceName: service.title,
      date: dateLabel,
      time: timeLabel,
      meetLink,
    }).catch(console.error)

    sendAdminBookingNotification({
      serviceName: service.title,
      userName: name,
      userEmail: session.user.email,
      date: dateLabel,
      time: timeLabel,
      message: fullMessage || undefined,
    }).catch(console.error)

    return NextResponse.json({ bookingId: booking.id })
  } catch (err) {
    console.error("book error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
