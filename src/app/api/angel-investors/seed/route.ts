import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { angelInvestors } from "@/lib/db/schema"
import * as XLSX from "xlsx"
import path from "path"
import fs from "fs"

export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 })
  }

  try {
    const filePath = path.join(process.cwd(), "data", "angel-investors.xlsx")
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "File not found at data/angel-investors.xlsx" }, { status: 404 })
    }

    const workbook = XLSX.readFile(filePath)
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet)

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

    if (rows.length === 0) {
      return NextResponse.json({ error: "No rows parsed — check column headers in the Excel file" }, { status: 400 })
    }

    // Clear existing rows before re-seeding
    await db.delete(angelInvestors)

    const batchSize = 100
    let inserted = 0
    for (let i = 0; i < rows.length; i += batchSize) {
      await db.insert(angelInvestors).values(rows.slice(i, i + batchSize))
      inserted += Math.min(batchSize, rows.length - i)
    }

    return NextResponse.json({ inserted, total: rows.length })
  } catch (err) {
    console.error("angel-investors/seed error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
