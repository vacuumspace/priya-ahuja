export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { purchases, digitalProducts } from "@/lib/db/schema"
import { auth, isAdmin } from "@/lib/auth"
import { eq, and, isNotNull } from "drizzle-orm"
import {
  getEarlyStageVCFirms, getEarlyStageVCTeam,
  getFamilyOfficeFirms, getFamilyOfficeTeam,
  getIncubatorFirms, getIncubatorTeam,
  type FirmRow, type TeamRow,
} from "@/lib/read-investor-xlsx"

const PAGE_SIZE = 10

const CONFIG: Record<string, { slug: string; firms: () => FirmRow[]; team: () => TeamRow[] }> = {
  "early-stage-vc": {
    slug: "early-stage-vc-list",
    firms: getEarlyStageVCFirms,
    team: getEarlyStageVCTeam,
  },
  "family-offices": {
    slug: "family-offices-list",
    firms: getFamilyOfficeFirms,
    team: getFamilyOfficeTeam,
  },
  "incubators": {
    slug: "incubators-list",
    firms: getIncubatorFirms,
    team: getIncubatorTeam,
  },
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ listType: string }> }) {
  try {
    const { listType } = await params
    const config = CONFIG[listType]
    if (!config) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const { searchParams } = new URL(req.url)
    const tab    = searchParams.get("tab") === "team" ? "team" : "firms"
    const page   = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10))
    const search = searchParams.get("search")?.trim() ?? ""

    const session = await auth()
    const userEmail = session?.user?.email ?? null

    let isPaid = isAdmin(userEmail)
    if (!isPaid && userEmail) {
      const [purchase] = await db
        .select({ id: purchases.id })
        .from(purchases)
        .innerJoin(digitalProducts, eq(purchases.productId, digitalProducts.id))
        .where(and(
          eq(purchases.userEmail, userEmail),
          eq(digitalProducts.slug, config.slug),
          isNotNull(purchases.downloadToken),
        ))
        .limit(1)
      isPaid = !!purchase
    }

    if (tab === "team") {
      const allData = config.team()
      const redacted = allData.map(r => ({
        ...r,
        emails: isPaid ? r.emails : [],
        linkedin: isPaid ? r.linkedin : "",
      }))

      let filtered = redacted
      if (search) {
        const q = search.toLowerCase()
        filtered = redacted.filter(r =>
          r.teamMember.toLowerCase().includes(q) ||
          r.investorName.toLowerCase().includes(q)
        )
      }

      const total = filtered.length
      const offset = (page - 1) * PAGE_SIZE
      return NextResponse.json({
        rows: filtered.slice(offset, offset + PAGE_SIZE),
        total, page, pageCount: Math.ceil(total / PAGE_SIZE), isPaid,
      })
    }

    // firms tab
    const allData = config.firms()
    const redacted = allData.map(r => ({
      ...r,
      emails: isPaid ? r.emails : [],
      linkedin: isPaid ? r.linkedin : "",
      phone: isPaid ? r.phone : "",
    }))

    let filtered = redacted
    if (search) {
      const q = search.toLowerCase()
      filtered = redacted.filter(r => r.name.toLowerCase().includes(q))
    }

    const total = filtered.length
    const offset = (page - 1) * PAGE_SIZE
    return NextResponse.json({
      rows: filtered.slice(offset, offset + PAGE_SIZE),
      total, page, pageCount: Math.ceil(total / PAGE_SIZE), isPaid,
    })
  } catch (err) {
    console.error("investor-list API error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
