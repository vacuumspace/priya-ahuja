import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { workshops } from "../src/lib/db/schema"
import { eq } from "drizzle-orm"
import * as dotenv from "dotenv"
import { resolve } from "path"

dotenv.config({ path: resolve(process.cwd(), ".env.local") })

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql, { schema: { workshops } })

const items = [
  {
    // Renamed from "investable-pitch-deck" - matched by previousSlug below
    // so the existing row gets its slug updated rather than a duplicate created.
    previousSlug: "investable-pitch-deck",
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
    date: "2026-09-25",
    startTime: "15:00",
    endTime: "16:00",
    price: 99900, // ₹999 in paise
  },
]

async function seed() {
  for (const { previousSlug, ...item } of items) {
    const lookupSlug = previousSlug ?? item.slug
    const [existing] = await db.select().from(workshops).where(eq(workshops.slug, lookupSlug)).limit(1)

    if (existing) {
      await db.update(workshops).set({ ...item, isActive: true }).where(eq(workshops.id, existing.id))
      console.log(`✓ updated ${lookupSlug}${previousSlug ? ` -> ${item.slug}` : ""}`)
      continue
    }

    await db.insert(workshops).values({ ...item, isActive: true })
    console.log(`✓ created ${item.slug}`)
  }

  console.log(`\nDone - ${items.length} workshop(s) seeded.`)
}

seed().catch((err) => { console.error(err); process.exit(1) })
