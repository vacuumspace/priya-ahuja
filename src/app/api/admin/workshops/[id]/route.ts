import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { workshops } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { updateCalendarEvent } from "@/lib/google-calendar"

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
  const { isActive, title, description, price, date, startTime, endTime, thumbnailUrl } = body

  const update: Record<string, unknown> = {}
  if (isActive !== undefined) update.isActive = isActive
  if (title !== undefined) update.title = title
  if (description !== undefined) update.description = description
  if (price !== undefined) update.price = Math.round(price * 100) // rupees in, paise stored - matches POST
  if (date !== undefined) update.date = date
  if (startTime !== undefined) update.startTime = startTime
  if (endTime !== undefined) update.endTime = endTime
  if (thumbnailUrl !== undefined) update.thumbnailUrl = thumbnailUrl

  // Keep the shared calendar event in sync so already-invited attendees see
  // the updated time/title - only touch the Calendar API if something it
  // cares about actually changed. The event's description is just a fixed
  // "detail link" line (see formatWorkshopCalendarDescription), not the
  // workshop's own content description, so editing that field here never
  // needs to touch the calendar event.
  const touchesCalendar = date !== undefined || startTime !== undefined || endTime !== undefined || title !== undefined
  if (touchesCalendar) {
    const [current] = await db.select().from(workshops).where(eq(workshops.id, id)).limit(1)
    if (current?.googleCalendarEventId) {
      try {
        await updateCalendarEvent({
          eventId: current.googleCalendarEventId,
          date: date ?? current.date,
          startTime: startTime ?? current.startTime,
          endTime: endTime ?? current.endTime,
          ...(title !== undefined ? { summary: title } : {}),
        })
      } catch (err) {
        console.error("Workshop calendar event update failed:", err)
      }
    }
  }

  await db.update(workshops).set(update).where(eq(workshops.id, id))

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
  try {
    await db.delete(workshops).where(eq(workshops.id, id))
  } catch (err: unknown) {
    // No onDelete cascade on workshop_registrations.workshop_id on purpose -
    // deleting a workshop that has registrations would silently wipe its
    // sales/attendance history too.
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "23503") {
      return Response.json(
        { error: "This workshop has registrations and can't be deleted. Deactivate it instead." },
        { status: 409 }
      )
    }
    throw err
  }

  return Response.json({ ok: true })
}
