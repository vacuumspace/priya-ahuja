import { NextRequest, NextResponse } from "next/server"
import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { bookings, services as servicesTable } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { sendSessionNotes } from "@/lib/mailer"

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.email || !isAdmin(session.user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { id } = await params
  const { notes, nextSteps } = await req.json()

  if (!notes?.trim() || !nextSteps?.trim()) {
    return NextResponse.json({ error: "notes and nextSteps are required" }, { status: 400 })
  }

  const [booking] = await db
    .select({
      userEmail: bookings.userEmail,
      userName: bookings.userName,
      serviceId: bookings.serviceId,
    })
    .from(bookings)
    .where(eq(bookings.id, id))
    .limit(1)

  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 })

  const [service] = await db
    .select({ title: servicesTable.title })
    .from(servicesTable)
    .where(eq(servicesTable.id, booking.serviceId))
    .limit(1)

  const serviceName = service?.title ?? "Session"

  await sendSessionNotes({
    to: booking.userEmail,
    name: booking.userName,
    serviceName,
    notes: notes.trim(),
    nextSteps: nextSteps.trim(),
    bookingId: id,
  })

  return NextResponse.json({ ok: true })
}
