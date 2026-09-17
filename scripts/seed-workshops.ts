import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { workshops } from "../src/lib/db/schema"
import { eq } from "drizzle-orm"
import * as dotenv from "dotenv"
import { resolve } from "path"
import { createCalendarEvent, updateCalendarEvent, WORKSHOP_REMINDERS } from "../src/lib/google-calendar"
import { formatWorkshopCalendarDescription } from "../src/lib/workshop-time"

dotenv.config({ path: resolve(process.cwd(), ".env.local") })

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql, { schema: { workshops } })

const items = [
  {
    slug: "fundable-pitch-deck",
    title: "Fundable Pitch Deck Workshop",
    description: `I've evaluated 1000+ pitch decks across fundraising rounds, and the pattern is always the same: investors don't reject a deck because the design is weak. They reject it because the story doesn't add up.

This workshop is a slide-by-slide breakdown of what makes a deck investable: how investors actually read a deck, the slides that quietly kill deals, and how to frame your traction, market, and ask so they land.

We'll cover every slide that belongs in an investable deck: problem, solution, market sizing, business model, traction, team, and the ask, plus the mistakes that lose investor interest in the first two minutes.

It's hands-on, not a lecture. We'll work through real examples live, and you're welcome to bring questions from your own deck.

Gifts for Founders
1. Investable Pitch Deck Playbook ([Download](#playbook))
2. Pitch Deck Analysis Tool powered by AI, onetime access ([Tool Link](/fundraise/tools/pitch-deck-analyser))`,
    thumbnailUrl: "/workshops/fundable-pitch-deck.svg",
    date: "2026-09-27",
    startTime: "12:00",
    endTime: "13:00",
    price: 99900, // ₹999 in paise
  },
]

// The workshop row is the one source of truth for date/time/title/description;
// this keeps the shared calendar event in lockstep with it every time the
// seed runs, the same way the admin edit route does - so re-running this
// script can never leave the calendar showing a stale date like the DB once did.
async function seed() {
  for (const item of items) {
    const [existing] = await db.select().from(workshops).where(eq(workshops.slug, item.slug)).limit(1)

    if (existing) {
      if (existing.googleCalendarEventId) {
        await updateCalendarEvent({
          eventId: existing.googleCalendarEventId,
          date: item.date,
          startTime: item.startTime,
          endTime: item.endTime,
          summary: item.title,
          description: formatWorkshopCalendarDescription(item.slug),
        })
      }
      await db.update(workshops).set({ ...item, isActive: true }).where(eq(workshops.id, existing.id))
      console.log(`✓ updated ${item.slug}`)
      continue
    }

    const cal = await createCalendarEvent({
      summary: item.title,
      description: formatWorkshopCalendarDescription(item.slug),
      date: item.date,
      startTime: item.startTime,
      endTime: item.endTime,
      reminders: WORKSHOP_REMINDERS,
    })
    await db.insert(workshops).values({
      ...item,
      isActive: true,
      googleCalendarEventId: cal.eventId,
      meetLink: cal.meetLink,
    })
    console.log(`✓ created ${item.slug}`)
  }

  console.log(`\nDone - ${items.length} workshop(s) seeded.`)
}

seed().catch((err) => { console.error(err); process.exit(1) })
