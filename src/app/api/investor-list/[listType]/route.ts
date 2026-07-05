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

const CONFIG: Record<string, { slug: string; freePages: number; firms: () => FirmRow[]; team: () => TeamRow[] }> = {
  "early-stage-vc": {
    slug: "early-stage-vc-list",
    freePages: 4,
    firms: getEarlyStageVCFirms,
    team: getEarlyStageVCTeam,
  },
  "family-offices": {
    slug: "family-offices-list",
    freePages: 2,
    firms: getFamilyOfficeFirms,
    team: getFamilyOfficeTeam,
  },
  "incubators": {
    slug: "incubators-list",
    freePages: 2,
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

    // Unpaid users may only ever see the fixed teaser slice — search and paging
    // are both confined to it, so scripted pagination/search enumeration can't
    // reconstruct the full paid dataset.
    const teaserLimit = config.freePages * PAGE_SIZE

    if (tab === "team") {
      const allData = config.team()
      const total = allData.length
      const scoped = isPaid ? allData : allData.slice(0, teaserLimit)

      const redacted = scoped.map(r => ({
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

      const effectivePage = isPaid ? page : Math.min(page, config.freePages)
      const offset = (effectivePage - 1) * PAGE_SIZE
      return NextResponse.json({
        rows: filtered.slice(offset, offset + PAGE_SIZE),
        total, page: effectivePage,
        pageCount: isPaid ? Math.ceil(total / PAGE_SIZE) : Math.min(config.freePages, Math.ceil(filtered.length / PAGE_SIZE) || 1),
        isPaid,
      })
    }

    // firms tab
    const allData = config.firms()
    const total = allData.length
    const scoped = isPaid ? allData : allData.slice(0, teaserLimit)

    const redacted = scoped.map(r => ({
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

    const effectivePage = isPaid ? page : Math.min(page, config.freePages)
    const offset = (effectivePage - 1) * PAGE_SIZE
    return NextResponse.json({
      rows: filtered.slice(offset, offset + PAGE_SIZE),
      total, page: effectivePage,
      pageCount: isPaid ? Math.ceil(total / PAGE_SIZE) : Math.min(config.freePages, Math.ceil(filtered.length / PAGE_SIZE) || 1),
      isPaid,
    })
  } catch (err) {
    console.error("investor-list API error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
