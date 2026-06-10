import pg from "pg"
import XLSX from "xlsx"
import { readFileSync, existsSync } from "fs"
import { fileURLToPath } from "url"
import path from "path"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, "..")

// Parse .env.local
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

const filePath = path.join(root, "data", "angel-investor.xlsx")
if (!existsSync(filePath)) {
  console.error("File not found: data/angel-investors.xlsx")
  process.exit(1)
}

const workbook = XLSX.readFile(filePath)
const sheet = workbook.Sheets[workbook.SheetNames[0]]
const raw = XLSX.utils.sheet_to_json(sheet)

const rows = raw.map((r, i) => {
  const emailRaw = String(r["Emails"] ?? r["Email"] ?? "").trim()
  return {
    sno:      Number(r["SNo"] ?? r["S.No."] ?? r["Sno"] ?? i + 1),
    name:     String(r["Name"] ?? "").trim(),
    city:     String(r["City"] ?? "").trim(),
    state:    String(r["State"] ?? "").trim(),
    country:  String(r["Country"] ?? "").trim(),
    linkedin: String(r["Linkedin"] ?? r["LinkedIn"] ?? "").trim(),
    emails:   emailRaw ? emailRaw.split(",").map(e => e.trim()).filter(Boolean) : [],
  }
}).filter(r => r.name)

console.log(`Parsed ${rows.length} rows from Excel`)

const client = new pg.Client({ connectionString: env.DATABASE_URL })
await client.connect()

// Clear and re-insert
await client.query(`DELETE FROM angel_investors`)
console.log("Cleared existing rows")

const batchSize = 100
let inserted = 0
for (let i = 0; i < rows.length; i += batchSize) {
  const batch = rows.slice(i, i + batchSize)
  const values = batch.map((_, j) => {
    const base = j * 7
    return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, $${base + 7}::text[])`
  }).join(", ")
  const params = batch.flatMap(r => [r.sno, r.name, r.city, r.state, r.country, r.linkedin, `{${r.emails.map(e => `"${e.replace(/"/g, '\\"')}"`).join(",")}}`])
  await client.query(
    `INSERT INTO angel_investors (sno, name, city, state, country, linkedin, emails) VALUES ${values}`,
    params
  )
  inserted += batch.length
  process.stdout.write(`\rInserted ${inserted}/${rows.length}...`)
}

console.log(`\nDone — ${inserted} investors seeded.`)
await client.end()
