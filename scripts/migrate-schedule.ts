import { neon } from "@neondatabase/serverless"
import * as dotenv from "dotenv"
import { resolve } from "path"

dotenv.config({ path: resolve(process.cwd(), ".env.local") })

const sql = neon(process.env.DATABASE_URL!)

async function run() {
  await sql`
    CREATE TABLE IF NOT EXISTS availability_schedule (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      day_of_week INTEGER NOT NULL,
      start_time VARCHAR(5) NOT NULL,
      end_time VARCHAR(5) NOT NULL,
      is_active BOOLEAN NOT NULL DEFAULT false
    )
  `
  await sql`
    CREATE TABLE IF NOT EXISTS availability_config (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      days_ahead INTEGER NOT NULL DEFAULT 14
    )
  `
  // Seed one config row if none exists
  const rows = await sql`SELECT id FROM availability_config LIMIT 1`
  if (rows.length === 0) {
    await sql`INSERT INTO availability_config (days_ahead) VALUES (14)`
  }
  // Seed one row per day of week (all inactive by default)
  for (let d = 0; d <= 6; d++) {
    const existing = await sql`SELECT id FROM availability_schedule WHERE day_of_week = ${d} LIMIT 1`
    if (existing.length === 0) {
      await sql`INSERT INTO availability_schedule (day_of_week, start_time, end_time, is_active)
                VALUES (${d}, '09:00', '18:00', false)`
    }
  }
  console.log("Done - availability_schedule and availability_config tables ready.")
}

run().catch((err) => { console.error(err); process.exit(1) })
