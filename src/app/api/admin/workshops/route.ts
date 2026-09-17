import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { workshops } from "@/lib/db/schema"
import { desc } from "drizzle-orm"
import { createCalendarEvent, WORKSHOP_REMINDERS } from "@/lib/google-calendar"
import { formatWorkshopCalendarDescription } from "@/lib/workshop-time"

export async function GET() {
  const session = await auth()
  if (!session || !isAdmin(session.user?.email)) {
    return new Response("Forbidden", { status: 403 })
  }

  const rows = await db.select().from(workshops).orderBy(desc(workshops.createdAt))
  return Response.json(rows)
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session || !isAdmin(session.user?.email)) {
    return new Response("Forbidden", { status: 403 })
  }

  const body = await request.json()
  const { slug, title, description, price, date, startTime, endTime, thumbnailUrl } = body

  if (!slug || !title || !description || !price || !date || !startTime || !endTime) {
    return new Response("Missing required fields", { status: 400 })
  }

  // One shared calendar event for the whole workshop, created now with no
  // attendees - each registrant gets added to this same event later.
  let googleCalendarEventId: string | null = null
  let meetLink: string | null = null
  try {
    const cal = await createCalendarEvent({
      summary: title,
      description: formatWorkshopCalendarDescription(slug),
      date,
      startTime,
      endTime,
      reminders: WORKSHOP_REMINDERS,
    })
    googleCalendarEventId = cal.eventId
    meetLink = cal.meetLink
  } catch (err) {
    // Not fatal - finalizeWorkshopRegistration lazily creates the event on
    // first registration if it's still missing here.
    console.error("Workshop calendar event creation failed:", err)
  }

  const [row] = await db
    .insert(workshops)
    .values({
      slug,
      title,
      description,
      price: Math.round(price * 100),
      date,
      startTime,
      endTime,
      thumbnailUrl: thumbnailUrl || null,
      isActive: false,
      googleCalendarEventId,
      meetLink,
    })
    .returning()

  return Response.json(row, { status: 201 })
}
