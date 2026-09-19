import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { bookings, services as servicesTable, availability } from "@/lib/db/schema"
import { and, asc, eq, ne } from "drizzle-orm"
import { sendBookingConfirmation, sendAdminBookingNotification } from "@/lib/mailer"
import { createCalendarEvent } from "@/lib/google-calendar"
import { checkReferralCode } from "@/lib/workshop-referral"
import { COURSE_GIFT_SERVICE_SLUG } from "@/lib/courses-data"

// Books the free 1:1 brainstorm that comes with a fully paid course. There's
// nothing to charge, so this skips Razorpay: it locks the slot, records a
// confirmed booking against the gift code, then does the same calendar invite
// and emails a paid booking gets.
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Sign in required" }, { status: 401 })
    }

    const { serviceSlug, slotId, name, message, referralCode } = await req.json()
    if (!serviceSlug || !name || !slotId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    if (serviceSlug !== COURSE_GIFT_SERVICE_SLUG) {
      return NextResponse.json({ error: "This code works only for the Startup Idea Brainstorming session" }, { status: 400 })
    }

    const [service] = await db.select().from(servicesTable).where(eq(servicesTable.slug, serviceSlug)).limit(1)
    if (!service || !service.isActive) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    const check = await checkReferralCode(referralCode, { slug: service.slug, price: service.price })
    if (!check.ok) return NextResponse.json({ error: check.error }, { status: 400 })
    if (check.kind !== "course-gift") {
      return NextResponse.json({ error: "This code isn't a free session code" }, { status: 400 })
    }

    // Lock the slot atomically - only succeeds if it's still unbooked.
    let resolvedSlotId: string
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(slotId)) {
      const [date, startTime] = slotId.split("T")
      const [h, m] = startTime.split(":").map(Number)
      const endTotal = h * 60 + m + (service.durationMin ?? 30)
      const endTime = `${String(Math.floor(endTotal / 60)).padStart(2, "0")}:${String(endTotal % 60).padStart(2, "0")}`

      const [existing] = await db
        .select()
        .from(availability)
        .where(and(eq(availability.serviceId, service.id), eq(availability.date, date), eq(availability.startTime, startTime)))
        .limit(1)

      if (existing) {
        const locked = await db
          .update(availability)
          .set({ isBooked: true })
          .where(and(eq(availability.id, existing.id), eq(availability.isBooked, false)))
          .returning({ id: availability.id })
        if (locked.length === 0) {
          return NextResponse.json({ error: "This slot is no longer available" }, { status: 409 })
        }
        resolvedSlotId = locked[0].id
      } else {
        const [newSlot] = await db
          .insert(availability)
          .values({ serviceId: service.id, date, startTime, endTime, isBooked: true })
          .returning({ id: availability.id })
        resolvedSlotId = newSlot.id
      }
    } else {
      const locked = await db
        .update(availability)
        .set({ isBooked: true })
        .where(and(eq(availability.id, slotId), eq(availability.isBooked, false)))
        .returning({ id: availability.id })
      if (locked.length === 0) {
        return NextResponse.json({ error: "This slot is no longer available" }, { status: 409 })
      }
      resolvedSlotId = locked[0].id
    }

    const [booking] = await db.insert(bookings).values({
      serviceId: service.id,
      slotId: resolvedSlotId,
      userName: name,
      userEmail: session.user.email,
      message: message || null,
      referralCode: check.code,
      discountAmount: service.price,
      amountPaid: 0,
      status: "confirmed",
    }).returning()

    // Two simultaneous redemptions can both pass the "unused" check above;
    // the earlier booking keeps the code, the later one gives its slot back.
    const [first] = await db
      .select({ id: bookings.id })
      .from(bookings)
      .where(and(eq(bookings.referralCode, check.code), ne(bookings.status, "cancelled")))
      .orderBy(asc(bookings.createdAt), asc(bookings.id))
      .limit(1)
    if (first && first.id !== booking.id) {
      await db.update(bookings).set({ status: "cancelled" }).where(eq(bookings.id, booking.id))
      await db.update(availability).set({ isBooked: false }).where(eq(availability.id, resolvedSlotId))
      return NextResponse.json({ error: "This referral code has already been used" }, { status: 409 })
    }

    const [slot] = await db.select().from(availability).where(eq(availability.id, resolvedSlotId)).limit(1)

    let meetLink: string | undefined
    if (slot) {
      try {
        const cal = await createCalendarEvent({
          summary: `${service.title} – ${name}`,
          description: message || undefined,
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
        await db.update(bookings).set({ adminNotes: `[calendar error] ${String(err)}` }).where(eq(bookings.id, booking.id))
      }
    }

    const dateLabel = slot
      ? new Date(`${slot.date}T${slot.startTime}:00+05:30`).toLocaleDateString("en-IN", {
          day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata",
        })
      : "TBD"
    const timeLabel = slot ? `${slot.startTime} IST` : "TBD"

    await db.update(bookings).set({ confirmationEmailSent: true }).where(eq(bookings.id, booking.id))

    sendBookingConfirmation({
      to: session.user.email,
      name,
      serviceName: service.title,
      serviceType: (service.type ?? "call") as "call" | "dm" | "report",
      date: dateLabel,
      time: timeLabel,
      meetLink,
    }).catch((e) => console.error("[mailer] sendBookingConfirmation failed:", e))

    sendAdminBookingNotification({
      serviceName: service.title,
      serviceType: (service.type ?? "call") as "call" | "dm" | "report",
      userName: name,
      userEmail: session.user.email,
      date: dateLabel,
      time: timeLabel,
      message: message || undefined,
    }).catch((e) => console.error("[mailer] sendAdminBookingNotification failed:", e))

    return NextResponse.json({ bookingId: booking.id })
  } catch (err) {
    console.error("redeem-gift error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
