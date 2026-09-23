/**
 * Seeds the full 100-day run of synthetic "founder" posts for the public
 * wall, so it never looks empty while the real community builds up. Content
 * is pre-generated and stored now; each row's scheduledAt is a random instant
 * within its calendar day, and lib/journal-wall.ts only shows a row once
 * scheduledAt has passed - so entries trickle out through each real day
 * instead of all 100 days' worth appearing at once. Real user posts are
 * unaffected (their scheduledAt stays null, always immediately visible) and
 * mix in with these in the same feed.
 *
 * Personas use @dailywins.seed emails so they're identifiable if this ever
 * needs to be found, adjusted or removed later.
 *
 * Run with: npx tsx scripts/seed-synthetic-wall.ts
 */

import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { randomUUID } from "crypto"
import { users, userProfiles, dailyWinEntries } from "../src/lib/db/schema"
import * as dotenv from "dotenv"
import { resolve } from "path"
import { PERSONAS, WIN_TEMPLATES, applyVoice } from "./synthetic-wall-lines"
import { CHALLENGE_START_DATE, CHALLENGE_DAYS, addDays } from "../src/lib/daily-win-journal"

dotenv.config({ path: resolve(process.cwd(), ".env.local") })

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql)

function pick<T>(arr: T[], n: number): T[] {
  const copy = [...arr]
  const out: T[] = []
  for (let i = 0; i < n && copy.length > 0; i++) {
    out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0])
  }
  return out
}

function randomScheduledAt(entryDate: string): Date {
  const dayStart = new Date(`${entryDate}T00:00:00+05:30`).getTime()
  return new Date(dayStart + Math.floor(Math.random() * 24 * 60) * 60_000)
}

async function seed() {
  const dates = Array.from({ length: CHALLENGE_DAYS }, (_, i) => addDays(CHALLENGE_START_DATE, i))
  console.log(`Seeding ${PERSONAS.length} synthetic founders across ${dates.length} days...\n`)

  for (const persona of PERSONAS) {
    const userId = randomUUID()
    const email = `${persona.name.toLowerCase().replace(/\s+/g, ".")}@dailywins.seed`

    await db.insert(users).values({ id: userId, name: persona.name, email })
    await db.insert(userProfiles).values({
      userId,
      journalDisplayName: persona.name,
      journalVisibility: "public",
      updatedAt: new Date(),
    })

    let posted = 0
    const rows = []
    for (const entryDate of dates) {
      if (Math.random() > persona.activity) continue
      const points = pick(WIN_TEMPLATES, Math.random() < 0.35 ? 2 : 1).map((l) => applyVoice(l, persona.voice))
      rows.push({
        userId,
        entryDate,
        points,
        moderationFlagged: false,
        scheduledAt: randomScheduledAt(entryDate),
        updatedAt: new Date(),
      })
      posted++
    }

    // Batch insert per persona to keep request count reasonable.
    for (let i = 0; i < rows.length; i += 50) {
      await db.insert(dailyWinEntries).values(rows.slice(i, i + 50))
    }

    console.log(`✓ ${persona.name} - ${posted}/${dates.length} days`)
  }

  console.log("\nDone. Entries will surface on /journal/wall as their scheduledAt time passes each day.")
}

seed().catch((err) => { console.error(err); process.exit(1) })
