import XLSX from "xlsx"
import { writeFileSync, existsSync } from "fs"
import { fileURLToPath } from "url"
import path from "path"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, "..")

const filePath = path.join(root, "data", "angel-investor.xlsx")
if (!existsSync(filePath)) {
  console.error("File not found: data/angel-investor.xlsx")
  process.exit(1)
}

const workbook = XLSX.readFile(filePath)
const sheet = workbook.Sheets[workbook.SheetNames[0]]
const raw = XLSX.utils.sheet_to_json(sheet)

const rows = raw.map((r, i) => {
  const emailRaw = String(r["Emails"] ?? r["Email"] ?? "").trim()
  return {
    id:       String(Number(r["SNo"] ?? r["S.No."] ?? r["Sno"] ?? i + 1)),
    sno:      Number(r["SNo"] ?? r["S.No."] ?? r["Sno"] ?? i + 1),
    name:     String(r["Name"] ?? "").trim(),
    city:     String(r["City"] ?? "").trim(),
    state:    String(r["State"] ?? "").trim(),
    country:  String(r["Country"] ?? "").trim(),
    linkedin: String(r["Linkedin"] ?? r["LinkedIn"] ?? "").trim(),
    emails:   emailRaw ? emailRaw.split(",").map(e => e.trim()).filter(Boolean) : [],
  }
}).filter(r => r.name)

console.log(`Parsed ${rows.length} investors from Excel`)

const lines = [
  `export type AngelInvestor = {`,
  `  id: string`,
  `  sno: number`,
  `  name: string`,
  `  city: string`,
  `  state: string`,
  `  country: string`,
  `  linkedin: string`,
  `  emails: string[]`,
  `}`,
  ``,
  `export const angelInvestorsData: AngelInvestor[] = ${JSON.stringify(rows, null, 2)}`,
  ``,
]

const outPath = path.join(root, "src", "lib", "angel-investors-data.ts")
writeFileSync(outPath, lines.join("\n"), "utf8")
console.log(`Written to src/lib/angel-investors-data.ts`)
