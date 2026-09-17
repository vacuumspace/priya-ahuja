import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { workshops, workshopFeedback } from "../src/lib/db/schema"
import { eq } from "drizzle-orm"
import * as dotenv from "dotenv"
import { resolve } from "path"

dotenv.config({ path: resolve(process.cwd(), ".env.local") })

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql, { schema: { workshops, workshopFeedback } })

// Placeholder feedback for the two past workshop instances - real names/text
// to be swapped in later, seeded now so the pages aren't empty.
const feedbackBySlug: Record<string, { name: string; message: string }[]> = {
  "fundable-pitch-deck-aug-2026": [
    { name: "aditi rao", message: "genuinely reworked how i think about my deck. the slide-by-slide breakdown alone was worth it." },
    { name: "varun kapoor", message: "i've sat through a lot of generic fundraising content - this wasn't that. specific, practical, and priya answered every question live." },
    { name: "meera iyer", message: "walked in with a deck i thought was done. walked out realizing half my slides were working against me." },
    { name: "arjun malhotra", message: "the traction and market slides finally make sense. wish i'd taken this before my last raise, not after." },
    { name: "sanya kapoor", message: "interactive, no fluff, and priya clearly knows what investors actually look at. highly recommend for early stage founders." },
  ],
  "fundable-pitch-deck-sep-2026": [
    { name: "rohan verma", message: "best hour i've spent on my pitch deck. the framing around what investors skim vs. read closely changed my whole structure." },
    { name: "ishita bansal", message: "loved that it was live and interactive - got direct feedback on my own deck instead of generic advice." },
    { name: "kabir singh", message: "clear, no-nonsense, and immediately actionable. rebuilt my ask slide the same day." },
    { name: "priya nair", message: "as a first-time founder this demystified so much of what investors are actually evaluating." },
    { name: "yash agarwal", message: "the team slide insight alone was worth the ticket price. small changes, real impact on how the deck reads." },
  ],
}

async function seed() {
  for (const [slug, entries] of Object.entries(feedbackBySlug)) {
    const [workshop] = await db.select().from(workshops).where(eq(workshops.slug, slug)).limit(1)
    if (!workshop) {
      console.log(`✗ skipped ${slug} - workshop not found, seed it first`)
      continue
    }

    const existing = await db.select().from(workshopFeedback).where(eq(workshopFeedback.workshopId, workshop.id))
    if (existing.length > 0) {
      console.log(`✓ ${slug} already has ${existing.length} feedback row(s), skipping`)
      continue
    }

    await db.insert(workshopFeedback).values(entries.map((e) => ({ workshopId: workshop.id, ...e })))
    console.log(`✓ seeded ${entries.length} feedback rows for ${slug}`)
  }

  console.log("\nDone.")
}

seed().catch((err) => { console.error(err); process.exit(1) })
