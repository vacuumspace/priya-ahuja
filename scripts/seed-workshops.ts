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
    title: "Fundable Pitch Deck Workshop: For Early Stage Founders",
    description: `The investor you're gonna pitch also has short attention span.

The average VC spends under 4 minutes on a deck, gives your first slide more than double the attention of every slide after it, and closes the tab on nearly half the decks before reaching the ask. Attention isn't a footnote here - it's the whole game.

This workshop is a slide-by-slide breakdown of what actually holds that attention: the unusual detail that makes an investor stop skimming, the pattern break that makes your deck feel different from the fifty they saw that week, and the story thread that carries them from problem to ask without losing them along the way.

We'll cover every slide that belongs in an investable deck: problem, solution, market sizing, business model, traction, team, and the ask, built around what keeps investor attention instead of what merely looks complete.

Built for early stage founders across all sectors - b2b, b2c, saas, d2c, fintech, or anything in between - and every stage from pre-seed to series A. What investors look for shifts with stage (a pre-seed deck sells conviction, a seed deck sells early signal, a series A deck sells a growth story), and we'll cover how to frame each slide differently depending on where you are.

This workshop is interactive, not a lecture. You can ask anything related to your own pitch deck, and we'll work through it together, live.

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

// Historical record only - these two sessions were actually run live, just
// not through this site (no real registrations/calendar event behind them),
// so seed() below skips calendar creation for any item dated in the past.
// Same title/description as the live workshop by design - it's the same
// workshop, just past instances of it.
const [upcoming] = items
const pastItems = [
  { ...upcoming, slug: "fundable-pitch-deck-aug-2026", date: "2026-08-02" },
  { ...upcoming, slug: "fundable-pitch-deck-sep-2026", date: "2026-09-06" },
]
items.push(...pastItems)

function isPastItem(item: (typeof items)[number]): boolean {
  return new Date(`${item.date}T${item.endTime}:00+05:30`) < new Date()
}

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

    if (isPastItem(item)) {
      await db.insert(workshops).values({ ...item, isActive: true, googleCalendarEventId: null, meetLink: null })
      console.log(`✓ created ${item.slug} (past, no calendar event)`)
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
