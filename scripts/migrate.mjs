import { neon } from "@neondatabase/serverless"
import { readFileSync } from "fs"
import { config } from "dotenv"

config({ path: ".env.local" })

const sql = neon(process.env.DATABASE_URL)
const migration = readFileSync("./drizzle/0005_booking_calendar_messages.sql", "utf-8")

const statements = migration.split(";").map(s => s.trim()).filter(Boolean)
for (const stmt of statements) {
  console.log("Running:", stmt.slice(0, 60) + "...")
  await sql.query(stmt)
}
console.log("Migration complete")
