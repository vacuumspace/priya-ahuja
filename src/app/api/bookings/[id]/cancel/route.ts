import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { bookings, availability, services as servicesTable } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { isAdmin } from "@/lib/auth"
import { sendBookingCancellation } from "@/lib/mailer"
import { deleteCalendarEvent } from "@/lib/google-calendar"

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  const [booking] = await db
    .select()
    .from(bookings)
    .where(eq(bookings.id, id))
    .limit(1)

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 })
  }

  const admin = isAdmin(session.user.email)
  if (!admin && booking.userEmail !== session.user.email) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  if (booking.status === "cancelled") {
    return NextResponse.json({ error: "Already cancelled" }, { status: 400 })
  }

  await db.update(bookings).set({ status: "cancelled" }).where(eq(bookings.id, id))

  // Free up the slot
  if (booking.slotId) {
    await db.update(availability).set({ isBooked: false }).where(eq(availability.id, booking.slotId))
  }

  // Delete calendar event
  if (booking.googleCalendarEventId) {
    deleteCalendarEvent(booking.googleCalendarEventId).catch(console.error)
  }

  const [service] = await db
    .select({ title: servicesTable.title })
    .from(servicesTable)
    .where(eq(servicesTable.id, booking.serviceId))
    .limit(1)

  const serviceName = service?.title ?? "Session"
  const adminEmails = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim())

  sendBookingCancellation({ to: booking.userEmail, name: booking.userName, serviceName, isAdmin: false }).catch(console.error)
  sendBookingCancellation({ to: adminEmails, name: "Priya", serviceName, isAdmin: true }).catch(console.error)

  return NextResponse.json({ success: true })
}
