/**
 * One-off: seeds 20 fake public journal entries for TODAY so the /journal/wall
 * page can be previewed with a realistic amount of content. Fake users use
 * @wallpreview.test emails so they're easy to find and remove.
 * Run with: npx tsx scripts/seed-wall-preview.ts
 * Undo with: npx tsx scripts/cleanup-wall-preview.ts
 */

import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { randomUUID } from "crypto"
import { users, userProfiles, dailyWinEntries } from "../src/lib/db/schema"
import * as dotenv from "dotenv"
import { resolve } from "path"

dotenv.config({ path: resolve(process.cwd(), ".env.local") })

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql)

function todayIST(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" })
}

const founders: { name: string; points: string[] }[] = [
  { name: "Rahul Ahuja", points: ["started the 100 days win posting challenge", "posted our first cold DM to 20 investors"] },
  { name: "Ananya Iyer", points: ["closed our first paying customer"] },
  { name: "Karan Mehta", points: ["shipped the waitlist landing page"] },
  { name: "Priya Shah", points: ["hit 100 signups on the waitlist", "got featured in a local newsletter"] },
  { name: "Dev Kapoor", points: ["fixed the checkout bug that was killing conversions"] },
  { name: "Meera Nair", points: ["got our first 5-star review from a customer"] },
  { name: "Arjun Reddy", points: ["had a great first call with an angel investor"] },
  { name: "Sanya Kapoor", points: ["launched on Product Hunt", "hit #4 product of the day"] },
  { name: "Vikram Rao", points: ["hired our first designer"] },
  { name: "Tanvi Desai", points: ["crossed ₹1L in monthly revenue"] },
  { name: "Rohan Bhatt", points: ["got our first enterprise lead in the inbox"] },
  { name: "Isha Malhotra", points: ["recorded our first demo video"] },
  { name: "Aditya Menon", points: ["fixed churn - added an onboarding email"] },
  { name: "Neha Joshi", points: ["signed our first D2C brand partner", "sent the pilot agreement"] },
  { name: "Kabir Singh", points: ["posted every day this week without missing one"] },
  { name: "Ritika Verma", points: ["closed 3 sales calls back to back"] },
  { name: "Yash Trivedi", points: ["built the referral program end to end"] },
  { name: "Simran Kaur", points: ["got quoted in a founder Twitter thread"] },
  { name: "Aman Gupta", points: ["hit 1000 users on the app"] },
  { name: "Divya Pillai", points: ["started outreach to 50 investors", "booked 4 intro calls this week"] },
]

async function seed() {
  const today = todayIST()
  console.log(`Seeding ${founders.length} public wall entries for ${today}...\n`)

  for (let i = 0; i < founders.length; i++) {
    const { name, points } = founders[i]
    const userId = randomUUID()
    const email = `wallpreview+${i + 1}@wallpreview.test`

    await db.insert(users).values({ id: userId, name, email })
    await db.insert(userProfiles).values({
      userId,
      journalDisplayName: name,
      journalVisibility: "public",
      updatedAt: new Date(),
    })
    await db.insert(dailyWinEntries).values({
      userId,
      entryDate: today,
      points,
      moderationFlagged: false,
      updatedAt: new Date(),
    })
    console.log(`✓ ${name}`)
  }

  console.log("\nDone. Visit /journal/wall (or the 'wall of wins' section on /journal) to see it.")
  console.log("Run `npx tsx scripts/cleanup-wall-preview.ts` to remove this test data.")
}

seed().catch((err) => { console.error(err); process.exit(1) })
