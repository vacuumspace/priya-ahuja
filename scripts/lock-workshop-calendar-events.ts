// One-off: stops guests of existing workshop calendar events from inviting others.
import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { workshops } from "../src/lib/db/schema"
import { isNotNull } from "drizzle-orm"
import { google } from "googleapis"
import * as dotenv from "dotenv"
import { resolve } from "path"

dotenv.config({ path: resolve(process.cwd(), ".env.local") })

const db = drizzle(neon(process.env.DATABASE_URL!), { schema: { workshops } })

async function run() {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/calendar"],
    subject: process.env.GOOGLE_CALENDAR_ID,
  })
  const calendar = google.calendar({ version: "v3", auth })
  const rows = await db.select().from(workshops).where(isNotNull(workshops.googleCalendarEventId))
  for (const w of rows) {
    await calendar.events.patch({
      calendarId: process.env.GOOGLE_CALENDAR_ID!,
      eventId: w.googleCalendarEventId!,
      sendUpdates: "none",
      requestBody: { guestsCanInviteOthers: false },
    })
    console.log("locked:", w.title)
  }
}
run().catch((e) => { console.error(e); process.exit(1) })
