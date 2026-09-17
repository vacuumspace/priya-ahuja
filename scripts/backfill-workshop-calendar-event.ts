// One-off: creates the shared calendar event for any workshop that doesn't
// already have one (workshops seeded/inserted directly, before the calendar
// event was wired into the admin creation route, never got one).
import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { workshops } from "../src/lib/db/schema"
import { isNull, eq } from "drizzle-orm"
import { createCalendarEvent, WORKSHOP_REMINDERS } from "../src/lib/google-calendar"
import * as dotenv from "dotenv"
import { resolve } from "path"

dotenv.config({ path: resolve(process.cwd(), ".env.local") })

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql, { schema: { workshops } })

async function run() {
  const missing = await db.select().from(workshops).where(isNull(workshops.googleCalendarEventId))

  if (missing.length === 0) {
    console.log("Every workshop already has a calendar event.")
    return
  }

  for (const w of missing) {
    const cal = await createCalendarEvent({
      summary: w.title,
      description: w.description,
      date: w.date,
      startTime: w.startTime,
      endTime: w.endTime,
      reminders: WORKSHOP_REMINDERS,
    })
    await db
      .update(workshops)
      .set({ googleCalendarEventId: cal.eventId, meetLink: cal.meetLink })
      .where(eq(workshops.id, w.id))
    console.log(`✓ ${w.slug} -> event ${cal.eventId}, meet ${cal.meetLink}`)
  }
}

run().catch((err) => { console.error(err); process.exit(1) })
