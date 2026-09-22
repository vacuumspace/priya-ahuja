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
import { CHALLENGE_START_DATE, CHALLENGE_DAYS, addDays } from "../src/lib/daily-win-journal"

dotenv.config({ path: resolve(process.cwd(), ".env.local") })

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql)

// Each persona posts on a random subset of days, at its own activity rate -
// some are near-daily, some post every couple of days, like a real cohort.
const PERSONAS: { name: string; activity: number }[] = [
  { name: "Rahul Ahuja", activity: 0.9 },
  { name: "Ananya Iyer", activity: 0.7 },
  { name: "Karan Mehta", activity: 0.6 },
  { name: "Priya Shah", activity: 0.75 },
  { name: "Dev Kapoor", activity: 0.55 },
  { name: "Meera Nair", activity: 0.65 },
  { name: "Arjun Reddy", activity: 0.6 },
  { name: "Sanya Kapoor", activity: 0.7 },
  { name: "Vikram Rao", activity: 0.5 },
  { name: "Tanvi Desai", activity: 0.68 },
  { name: "Rohan Bhatt", activity: 0.58 },
  { name: "Isha Malhotra", activity: 0.62 },
  { name: "Aditya Menon", activity: 0.55 },
  { name: "Neha Joshi", activity: 0.72 },
  { name: "Kabir Singh", activity: 0.8 },
  { name: "Ritika Verma", activity: 0.6 },
  { name: "Yash Trivedi", activity: 0.5 },
  { name: "Simran Kaur", activity: 0.65 },
  { name: "Aman Gupta", activity: 0.7 },
  { name: "Divya Pillai", activity: 0.6 },
  { name: "Nikhil Bose", activity: 0.55 },
  { name: "Aarushi Chawla", activity: 0.68 },
  { name: "Siddharth Oberoi", activity: 0.6 },
  { name: "Pooja Rathi", activity: 0.72 },
  { name: "Varun Sethi", activity: 0.52 },
  { name: "Ishaan Kohli", activity: 0.58 },
  { name: "Kritika Bhalla", activity: 0.65 },
  { name: "Manav Chandra", activity: 0.5 },
  { name: "Riya Sarin", activity: 0.7 },
  { name: "Zoya Ahmed", activity: 0.62 },
  { name: "Harsh Vardhan", activity: 0.55 },
  { name: "Tara Krishnan", activity: 0.66 },
]

// A large, mixed pool so two founders rarely post the same line on the same
// day, sampled without replacement per persona per day (1-2 lines).
const WIN_TEMPLATES: string[] = [
  "closed our first paying customer",
  "got a 5-star review from a customer",
  "fixed the bug that was killing conversions",
  "shipped the new landing page",
  "hit a new high for daily signups",
  "got featured in a newsletter",
  "had a great call with an angel investor",
  "launched on Product Hunt",
  "hired our first team member",
  "crossed a new monthly revenue milestone",
  "got our first enterprise lead",
  "recorded a demo video for the product",
  "reduced churn with a better onboarding flow",
  "signed our first partner",
  "posted consistently all week",
  "closed three sales calls back to back",
  "built the referral program",
  "got quoted in a founder's thread online",
  "crossed a big user milestone",
  "started outreach to new investors",
  "booked several intro calls this week",
  "fixed a critical pricing page bug",
  "got our first testimonial on record",
  "ran our first paid ad test",
  "wrote our first cold outreach sequence",
  "improved our activation rate",
  "shipped a much-requested feature",
  "closed the loop on customer feedback",
  "onboarded our first enterprise pilot",
  "got a warm intro to a potential investor",
  "cleaned up our onboarding emails",
  "ran a small user research session",
  "renegotiated a vendor contract and saved money",
  "published our first case study",
  "got a shoutout from a customer on social",
  "finished the pricing page redesign",
  "set up analytics we'd been putting off",
  "closed a deal that had been stuck for weeks",
  "improved page load time significantly",
  "wrote the investor update for the month",
  "had our best week for signups yet",
  "got positive feedback on the new UI",
  "automated a manual process that ate up hours",
  "finalized our hiring plan for next quarter",
  "had a productive board/advisor call",
  "shipped the mobile-friendly version",
  "closed a small but meaningful upsell",
  "got our first organic backlink",
  "ran a workshop and got great engagement",
  "fixed our checkout flow's biggest drop-off point",
  "got a warm referral from an existing customer",
  "wrote and shipped our first email campaign",
  "improved our support response time",
  "closed a partnership conversation",
  "got our product mentioned in a community",
  "finished a difficult but necessary refactor",
  "ran our first customer interview round",
  "hit our weekly revenue target",
  "got positive early traction on a new channel",
  "cleaned up tech debt that was slowing us down",
  "closed the books for the month, no surprises",
  "shipped a fix that customers had been asking for",
]

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
      const points = pick(WIN_TEMPLATES, Math.random() < 0.35 ? 2 : 1)
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
