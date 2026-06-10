import { db } from "../src/lib/db/index"
import { sql } from "drizzle-orm"

async function run() {
  await db.execute(sql`CREATE TABLE IF NOT EXISTS site_settings (key varchar(100) PRIMARY KEY, value text NOT NULL)`)
  await db.execute(sql`INSERT INTO site_settings (key, value) VALUES ('live', 'true') ON CONFLICT DO NOTHING`)
  console.log("done")
  process.exit(0)
}

run()
