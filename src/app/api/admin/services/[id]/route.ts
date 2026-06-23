import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { services, availability, bookings } from "@/lib/db/schema"
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
  const {
    isActive, order, price, title, description, shortDescription,
    tag, highlights, whoIsItFor, acceptsDeckLink,
    deckLinkLabel, deckLinkPlaceholder, urgencyNote,
  } = body

  const update: Record<string, unknown> = {}
  if (isActive !== undefined) update.isActive = isActive
  if (order !== undefined) update.order = order
  if (price !== undefined) update.price = price
  if (title !== undefined) update.title = title
  if (description !== undefined) update.description = description
  if (shortDescription !== undefined) update.shortDescription = shortDescription
  if (tag !== undefined) update.tag = tag
  if (highlights !== undefined) update.highlights = highlights
  if (whoIsItFor !== undefined) update.whoIsItFor = whoIsItFor
  if (acceptsDeckLink !== undefined) update.acceptsDeckLink = acceptsDeckLink
  if (deckLinkLabel !== undefined) update.deckLinkLabel = deckLinkLabel
  if (deckLinkPlaceholder !== undefined) update.deckLinkPlaceholder = deckLinkPlaceholder
  if (urgencyNote !== undefined) update.urgencyNote = urgencyNote

  await db.update(services).set(update).where(eq(services.id, id))

  return Response.json({ ok: true })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || !isAdmin(session.user?.email)) {
    return new Response("Forbidden", { status: 403 })
  }

  const { id } = await params
  // Delete child rows first to avoid foreign key violations
  await db.delete(bookings).where(eq(bookings.serviceId, id))
  await db.delete(availability).where(eq(availability.serviceId, id))
  await db.delete(services).where(eq(services.id, id))

  return Response.json({ ok: true })
}
