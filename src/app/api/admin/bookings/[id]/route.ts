import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { bookings, services as servicesTable } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { sendFeedbackRequest } from "@/lib/resend"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || !isAdmin(session.user?.email)) {
    return new Response("Forbidden", { status: 403 })
  }

  const { id } = await params
  const body = await request.json()
  const { status, meetLink, adminNotes } = body

  const update: Record<string, unknown> = {}
  if (status !== undefined) update.status = status
  if (meetLink !== undefined) update.meetLink = meetLink
  if (adminNotes !== undefined) update.adminNotes = adminNotes

  const [updated] = await db.update(bookings).set(update).where(eq(bookings.id, id)).returning()

  // Send feedback request email when admin marks session as completed
  if (status === "completed" && updated) {
    const [service] = await db
      .select({ title: servicesTable.title })
      .from(servicesTable)
      .where(eq(servicesTable.id, updated.serviceId))
      .limit(1)

    sendFeedbackRequest({
      to: updated.userEmail,
      name: updated.userName,
      serviceName: service?.title ?? "your session",
      bookingId: updated.id,
    }).catch(console.error)
  }

  return Response.json({ ok: true })
}
