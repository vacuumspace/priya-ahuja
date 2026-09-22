/**
 * Removes the fake users/entries created by scripts/seed-wall-preview.ts
 * (identified by their @wallpreview.test emails).
 * Run with: npx tsx scripts/cleanup-wall-preview.ts
 */

import { neon } from "@neondatabase/serverless"
import * as dotenv from "dotenv"
import { resolve } from "path"

dotenv.config({ path: resolve(process.cwd(), ".env.local") })

const sql = neon(process.env.DATABASE_URL!)

async function cleanup() {
  const userRows = await sql`SELECT id FROM users WHERE email LIKE '%@wallpreview.test'`
  console.log(`Found ${userRows.length} wall-preview test user(s)`)

  if (userRows.length === 0) {
    console.log("Nothing to clean up.")
    return
  }

  // users has ON DELETE CASCADE to user_profiles and daily_win_entries, so
  // deleting the user rows takes their profile and entries with them.
  const { rowCount } = await sql`DELETE FROM users WHERE email LIKE '%@wallpreview.test'` as any
  console.log(`✓ Deleted ${rowCount ?? userRows.length} test user(s) and their profiles/entries.`)
}

cleanup().catch((err) => { console.error(err); process.exit(1) })
