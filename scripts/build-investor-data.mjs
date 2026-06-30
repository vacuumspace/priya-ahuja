import * as XLSX from "xlsx"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir  = path.join(__dirname, "..", "data")
const jsonDir  = path.join(dataDir, "json")

if (!fs.existsSync(jsonDir)) fs.mkdirSync(jsonDir, { recursive: true })

function str(val) {
  if (val === null || val === undefined) return ""
  const s = String(val).trim()
  return s === "-" ? "" : s
}

function dedupeStr(val) {
  const s = str(val)
  if (!s) return ""
  const parts = s.split(/[\r\n,]+/).map(v => v.trim()).filter(Boolean)
  return [...new Set(parts)].join(", ")
}

function parseEmails(val) {
  const s = str(val)
  if (!s || s === "-") return []
  return [...new Set(s.split(/[\r\n,;]+/).map(e => e.trim()).filter(Boolean))]
}

function readSheet(filename, sheetName, mapper) {
  const filePath = path.join(dataDir, filename)
  if (!fs.existsSync(filePath)) { console.warn(`Missing: ${filePath}`); return [] }
  const wb = XLSX.read(fs.readFileSync(filePath), { type: "buffer" })
  const ws = wb.Sheets[sheetName]
  if (!ws) { console.warn(`Missing sheet "${sheetName}" in ${filename}`); return [] }
  return XLSX.utils.sheet_to_json(ws).map(mapper)
}

// ── Early Stage VC ────────────────────────────────────────────────
const vcFirms = readSheet("early-stage-vc.xlsx", "vc", (row, i) => ({
  id: String(i + 1), sno: Number(row["SNo."]) || i + 1,
  name: str(row["Investor Name"]),
  country: dedupeStr(row["Country"]),
  city: "", state: "",
  domain:   str(row["Domain Name"]),
  website:  str(row["Website"]),
  linkedin: str(row["LinkedIn"]),
  twitter:  str(row["Twitter"]),
  phone:    str(row["Phone Numbers"]),
  emails:   parseEmails(row["Emails"]),
  overview: "",
}))

const vcTeam = readSheet("early-stage-vc.xlsx", "team", (row, i) => ({
  id: String(i + 1), sno: Number(row["SNo."]) || i + 1,
  investorName: str(row["Investor Name"]),
  teamMember:   str(row["Team Member(s)"]),
  designation:  str(row["Designation"]),
  location:     str(row["Location"]),
  emails:       parseEmails(row["Emails"]),
  linkedin:     str(row["LinkedIn"]),
  summary:      str(row["Summary"]),
}))

// ── Family Offices ────────────────────────────────────────────────
const foTeam = readSheet("famil-office.xlsx", "team", (row, i) => ({
  id: String(i + 1), sno: Number(row["SNo."]) || i + 1,
  investorName: str(row["Investor Name"]),
  teamMember:   str(row["Team Member(s)"]),
  designation:  str(row["Designation"]),
  location:     str(row["Location"]),
  emails:       parseEmails(row["Emails"]),
  linkedin:     str(row["Link to profiles"]),
  summary:      str(row["Summary"]),
}))

// Build a map: firm name -> first team LinkedIn (fallback for firms with no LinkedIn)
const foTeamLinkedInByFirm = {}
for (const t of foTeam) {
  if (t.linkedin && !foTeamLinkedInByFirm[t.investorName]) {
    foTeamLinkedInByFirm[t.investorName] = t.linkedin
  }
}

const foFirms = readSheet("famil-office.xlsx", "office", (row, i) => {
  const name = str(row["Investor Name"])
  const firmLinkedIn = str(row["LinkedIn"])
  return {
    id: String(i + 1), sno: Number(row["SNo."]) || i + 1,
    name,
    country:  dedupeStr(row["Country"]),
    city:     str(row["City"]),
    state: "", domain: "",
    website:  str(row["Website"]),
    linkedin: firmLinkedIn || foTeamLinkedInByFirm[name] || "",
    twitter:  str(row["Twitter"]),
    phone:    str(row["Phone Numbers"]),
    emails:   parseEmails(row["Emails"]),
    overview: str(row["Description"]),
  }
})

// ── Incubators ────────────────────────────────────────────────────
const incFirms = readSheet("incubator-accelrator.xlsx", "offices", (row, i) => ({
  id: String(i + 1), sno: Number(row["SNo."]) || i + 1,
  name:     str(row["Name"]),
  country:  dedupeStr(row["Country"]),
  city:     str(row["City"]),
  state:    str(row["State"]),
  domain: "",
  website:  str(row["Website"]),
  linkedin: str(row["LinkedIn"]),
  twitter:  str(row["Twitter"]),
  phone:    str(row["Phone Numbers"]),
  emails:   parseEmails(row["Emails"]),
  overview: str(row["Overview"]),
}))

const incTeam = readSheet("incubator-accelrator.xlsx", "team", (row, i) => ({
  id: String(i + 1), sno: Number(row["SNo."]) || i + 1,
  investorName: str(row["Investor Name"]),
  teamMember:   str(row["Team Member(s)"]),
  designation:  str(row["Designation"]),
  location:     str(row["Location"]),
  emails:       parseEmails(row["Emails"]),
  linkedin: str(row["LinkedIn"]), summary: "",
}))

// ── Write JSON ────────────────────────────────────────────────────
const files = {
  "vc-firms.json":       vcFirms,
  "vc-team.json":        vcTeam,
  "fo-firms.json":       foFirms,
  "fo-team.json":        foTeam,
  "inc-firms.json":      incFirms,
  "inc-team.json":       incTeam,
}

for (const [name, data] of Object.entries(files)) {
  const outPath = path.join(jsonDir, name)
  fs.writeFileSync(outPath, JSON.stringify(data))
  console.log(`✓ ${name} — ${data.length} rows`)
}
