import pg from "pg"
import { readFileSync } from "fs"
import { fileURLToPath } from "url"
import path from "path"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const envPath = path.join(__dirname, "..", ".env.local")

// Parse .env.local manually
const env = Object.fromEntries(
  readFileSync(envPath, "utf8")
    .split("\n")
    .filter(l => l.includes("="))
    .map(l => {
      const idx = l.indexOf("=")
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim().replace(/^["']|["']$/g, "")]
    })
)

const client = new pg.Client({ connectionString: env.DATABASE_URL })
await client.connect()

await client.query(`
  CREATE TABLE IF NOT EXISTS "angel_investors" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "sno" integer NOT NULL,
    "name" text NOT NULL,
    "city" varchar(100) NOT NULL DEFAULT '',
    "state" varchar(100) NOT NULL DEFAULT '',
    "country" varchar(100) NOT NULL DEFAULT '',
    "linkedin" text NOT NULL DEFAULT '',
    "emails" text[] NOT NULL DEFAULT '{}',
    "created_at" timestamp NOT NULL DEFAULT now()
  );
`)

console.log("angel_investors table created (or already exists)")
await client.end()
