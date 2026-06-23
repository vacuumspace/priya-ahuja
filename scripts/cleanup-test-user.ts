import { neon } from "@neondatabase/serverless"
import * as dotenv from "dotenv"
import { resolve } from "path"
import { google } from "googleapis"

dotenv.config({ path: resolve(process.cwd(), ".env.local") })

const sql = neon(process.env.DATABASE_URL!)
const EMAIL = "rahul@kittyparty.club"

function getCalendarClient() {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/calendar"],
    subject: process.env.GOOGLE_CALENDAR_ID,
  })
  return google.calendar({ version: "v3", auth })
}

async function run() {
  console.log(`\nCleaning up test data for ${EMAIL}...\n`)

  // 1. Fetch all bookings for this user
  const bookingRows = await sql`
    SELECT id, slot_id, google_calendar_event_id, status
    FROM bookings
    WHERE user_email = ${EMAIL}
  `
  console.log(`Found ${bookingRows.length} booking(s)`)

  const calendar = getCalendarClient()
  const calendarId = process.env.GOOGLE_CALENDAR_ID!

  for (const b of bookingRows) {
    // Delete Google Calendar event if present
    if (b.google_calendar_event_id) {
      try {
        await calendar.events.delete({
          calendarId,
          eventId: b.google_calendar_event_id,
          sendUpdates: "all",
        })
        console.log(`  ✓ Deleted calendar event ${b.google_calendar_event_id} for booking ${b.id}`)
      } catch (err: any) {
        if (err?.code === 410 || err?.code === 404) {
          console.log(`  ~ Calendar event ${b.google_calendar_event_id} already gone`)
        } else {
          console.error(`  ✗ Failed to delete calendar event ${b.google_calendar_event_id}:`, err?.message)
        }
      }
    }

    // Free up the slot
    if (b.slot_id) {
      await sql`UPDATE availability SET is_booked = false WHERE id = ${b.slot_id}`
      console.log(`  ✓ Freed slot ${b.slot_id}`)
    }
  }

  // 2. Delete booking messages (cascade should handle it, but be explicit)
  const { rowCount: msgCount } = await sql`
    DELETE FROM booking_messages
    WHERE booking_id IN (SELECT id FROM bookings WHERE user_email = ${EMAIL})
  ` as any
  console.log(`Deleted ${msgCount ?? "?"} message(s)`)

  // 3. Delete bookings
  const { rowCount: bookingCount } = await sql`
    DELETE FROM bookings WHERE user_email = ${EMAIL}
  ` as any
  console.log(`Deleted ${bookingCount ?? "?"} booking(s)`)

  // 4. Delete purchases
  const { rowCount: purchaseCount } = await sql`
    DELETE FROM purchases WHERE user_email = ${EMAIL}
  ` as any
  console.log(`Deleted ${purchaseCount ?? "?"} purchase(s)`)

  // 5. Delete tool scores
  const userRow = await sql`SELECT id FROM users WHERE email = ${EMAIL} LIMIT 1`
  if (userRow.length > 0) {
    const userId = userRow[0].id
    const { rowCount: ssCount } = await sql`DELETE FROM startup_scores WHERE user_id = ${userId}` as any
    const { rowCount: siCount } = await sql`DELETE FROM startup_idea_scores WHERE user_id = ${userId}` as any
    console.log(`Deleted ${ssCount ?? "?"} fundability score(s) and ${siCount ?? "?"} idea score(s)`)
  }

  console.log("\nDone. DB is clean for", EMAIL)
}

run().catch((err) => {
  console.error("Script failed:", err)
  process.exit(1)
})
