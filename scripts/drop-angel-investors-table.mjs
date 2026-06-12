import pg from "pg"
import { readFileSync } from "fs"
import { fileURLToPath } from "url"
import path from "path"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, "..")

const envPath = path.join(root, ".env.local")
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
await client.query(`DROP TABLE IF EXISTS angel_investors`)
console.log("Dropped angel_investors table.")
await client.end()
