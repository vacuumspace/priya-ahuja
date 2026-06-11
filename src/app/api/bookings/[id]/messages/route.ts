import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { bookings, bookingMessages } from "@/lib/db/schema"
import { eq, asc } from "drizzle-orm"
import { isAdmin } from "@/lib/auth"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  const [booking] = await db.select({ userEmail: bookings.userEmail }).from(bookings).where(eq(bookings.id, id)).limit(1)
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 })

  if (!isAdmin(session.user.email) && booking.userEmail !== session.user.email) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const messages = await db
    .select()
    .from(bookingMessages)
    .where(eq(bookingMessages.bookingId, id))
    .orderBy(asc(bookingMessages.createdAt))

  return NextResponse.json(messages)
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const { body } = await req.json()

  if (!body?.trim()) return NextResponse.json({ error: "Message required" }, { status: 400 })

  const [booking] = await db.select({ userEmail: bookings.userEmail }).from(bookings).where(eq(bookings.id, id)).limit(1)
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const admin = isAdmin(session.user.email)
  if (!admin && booking.userEmail !== session.user.email) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const [msg] = await db.insert(bookingMessages).values({
    bookingId: id,
    senderEmail: session.user.email,
    senderName: session.user.name ?? session.user.email,
    isAdmin: admin,
    body: body.trim(),
  }).returning()

  return NextResponse.json(msg)
}
