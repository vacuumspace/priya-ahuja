import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { bookings, availability } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  const [booking] = await db.select().from(bookings).where(eq(bookings.id, id)).limit(1)

  if (!booking || booking.userEmail !== session.user.email) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  // Only abort pending bookings - if payment already went through, ignore
  if (booking.status !== "pending") {
    return NextResponse.json({ ok: true })
  }

  if (booking.slotId) {
    await db.update(availability).set({ isBooked: false }).where(eq(availability.id, booking.slotId))
  }
  await db.update(bookings).set({ status: "cancelled" }).where(eq(bookings.id, id))

  return NextResponse.json({ ok: true })
}
