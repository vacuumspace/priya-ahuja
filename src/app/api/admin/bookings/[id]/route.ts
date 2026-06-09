import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { bookings } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

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

  await db.update(bookings).set(update).where(eq(bookings.id, id))

  return Response.json({ ok: true })
}
