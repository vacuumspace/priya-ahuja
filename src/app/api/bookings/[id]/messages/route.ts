import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { bookings, bookingMessages, services as servicesTable } from "@/lib/db/schema"
import { eq, asc } from "drizzle-orm"
import { isAdmin } from "@/lib/auth"
import { sendMessageNotification } from "@/lib/mailer"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  const [booking] = await db
    .select({ userEmail: bookings.userEmail, msgEmailEnabled: bookings.msgEmailEnabled })
    .from(bookings)
    .where(eq(bookings.id, id))
    .limit(1)

  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 })

  if (!isAdmin(session.user.email) && booking.userEmail !== session.user.email) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const messages = await db
    .select()
    .from(bookingMessages)
    .where(eq(bookingMessages.bookingId, id))
    .orderBy(asc(bookingMessages.createdAt))

  return NextResponse.json({ messages, msgEmailEnabled: booking.msgEmailEnabled })
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const { body } = await req.json()

  if (!body?.trim()) return NextResponse.json({ error: "Message required" }, { status: 400 })

  const [booking] = await db
    .select({
      userEmail: bookings.userEmail,
      userName: bookings.userName,
      msgEmailEnabled: bookings.msgEmailEnabled,
      serviceId: bookings.serviceId,
    })
    .from(bookings)
    .where(eq(bookings.id, id))
    .limit(1)

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

  if (booking.msgEmailEnabled) {
    const [service] = await db
      .select({ title: servicesTable.title })
      .from(servicesTable)
      .where(eq(servicesTable.id, booking.serviceId))
      .limit(1)

    const serviceName = service?.title ?? "Session"

    if (admin) {
      // Admin sent message → notify the user
      sendMessageNotification({
        to: booking.userEmail,
        senderName: session.user.name ?? "Priya",
        serviceName,
        messageBody: body.trim(),
        bookingId: id,
        recipientIsAdmin: false,
      }).catch(console.error)
    } else {
      // User sent message → notify admin
      const adminEmails = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim())
      sendMessageNotification({
        to: adminEmails.join(","),
        senderName: booking.userName,
        serviceName,
        messageBody: body.trim(),
        bookingId: id,
        recipientIsAdmin: true,
      }).catch(console.error)
    }
  }

  return NextResponse.json(msg)
}

// Admin only: toggle email notifications for this booking's messages
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.email || !isAdmin(session.user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { id } = await params
  const { msgEmailEnabled } = await req.json()

  if (typeof msgEmailEnabled !== "boolean") {
    return NextResponse.json({ error: "msgEmailEnabled must be boolean" }, { status: 400 })
  }

  await db.update(bookings).set({ msgEmailEnabled }).where(eq(bookings.id, id))

  return NextResponse.json({ ok: true })
}
