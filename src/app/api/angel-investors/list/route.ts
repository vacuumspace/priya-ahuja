import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { purchases, digitalProducts } from "@/lib/db/schema"
import { auth, isAdmin } from "@/lib/auth"
import { eq, and, isNotNull } from "drizzle-orm"
import { angelInvestorsData } from "@/lib/angel-investors-data"

const SLUG = "angel-investor-list"
const PAGE_SIZE = 10
const FREE_PAGES = 3

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page    = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10))
    const search  = searchParams.get("search")?.trim() ?? ""
    const state   = searchParams.get("state")?.trim()   ?? ""
    const country = searchParams.get("country")?.trim() ?? ""

    const session = await auth()
    const userEmail = session?.user?.email ?? null

    // Check if user has a completed purchase (admin always bypasses)
    let isPaid = isAdmin(userEmail)
    if (!isPaid && userEmail) {
      const [purchase] = await db
        .select({ id: purchases.id })
        .from(purchases)
        .innerJoin(digitalProducts, eq(purchases.productId, digitalProducts.id))
        .where(and(
          eq(purchases.userEmail, userEmail),
          eq(digitalProducts.slug, SLUG),
          isNotNull(purchases.downloadToken),
        ))
        .limit(1)
      isPaid = !!purchase
    }

    if (!isPaid) {
      // Non-paying users are confined to a fixed teaser slice - filters/search
      // and paging both operate within it only, so pagination or search
      // enumeration can't be scripted to reconstruct the full paid dataset.
      const teaserLimit = FREE_PAGES * PAGE_SIZE
      const total = angelInvestorsData.length
      let scoped = angelInvestorsData.slice(0, teaserLimit)
      if (search)  scoped = scoped.filter(r => r.name.toLowerCase().includes(search.toLowerCase()))
      if (state)   scoped = scoped.filter(r => r.state === state)
      if (country) scoped = scoped.filter(r => r.country === country)

      const preview = scoped.map(r => ({
        id: r.id, sno: r.sno, name: r.name, city: r.city,
        state: r.state, country: r.country, linkedin: "", emails: [],
      }))
      const effectivePage = Math.min(page, FREE_PAGES)
      const offset = (effectivePage - 1) * PAGE_SIZE
      return NextResponse.json({
        investors: preview.slice(offset, offset + PAGE_SIZE),
        total,
        page: effectivePage,
        pageCount: Math.min(FREE_PAGES, Math.ceil(preview.length / PAGE_SIZE) || 1),
        isPaid: false,
      })
    }

    // Paid users: filter + paginate in memory
    let filtered = angelInvestorsData
    if (search)  filtered = filtered.filter(r => r.name.toLowerCase().includes(search.toLowerCase()))
    if (state)   filtered = filtered.filter(r => r.state === state)
    if (country) filtered = filtered.filter(r => r.country === country)

    const total = filtered.length
    const offset = (page - 1) * PAGE_SIZE
    const rows = filtered.slice(offset, offset + PAGE_SIZE)

    return NextResponse.json({
      investors: rows,
      total,
      page,
      pageCount: Math.ceil(total / PAGE_SIZE),
      isPaid: true,
    })
  } catch (err) {
    console.error("angel-investors/list error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
