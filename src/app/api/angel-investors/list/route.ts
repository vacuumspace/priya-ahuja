import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { angelInvestors, purchases, digitalProducts } from "@/lib/db/schema"
import { auth } from "@/lib/auth"
import { eq, and, ilike, isNotNull, count, sql } from "drizzle-orm"

const SLUG = "angel-investor-list"
const PAGE_SIZE = 10

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page    = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10))
    const search  = searchParams.get("search")?.trim() ?? ""
    const state   = searchParams.get("state")?.trim()   ?? ""
    const country = searchParams.get("country")?.trim() ?? ""

    const session = await auth()
    const userEmail = session?.user?.email ?? null

    // Check if user has a completed purchase
    let isPaid = false
    if (userEmail) {
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

    const offset = (page - 1) * PAGE_SIZE

    if (!isPaid) {
      // Non-paying users: page 1 only, real data but no linkedin/emails
      const rows = await db
        .select({
          id:      angelInvestors.id,
          sno:     angelInvestors.sno,
          name:    angelInvestors.name,
          city:    angelInvestors.city,
          state:   angelInvestors.state,
          country: angelInvestors.country,
          linkedin: sql<string>`''`,
          emails:   sql<string[]>`ARRAY[]::text[]`,
        })
        .from(angelInvestors)
        .limit(PAGE_SIZE)
        .offset(0)

      const [{ value: total }] = await db
        .select({ value: count() })
        .from(angelInvestors)

      return NextResponse.json({ investors: rows, total, page: 1, pageCount: Math.ceil(total / PAGE_SIZE), isPaid: false })
    }

    // Paid users: full data with search + filters
    const conditions = and(
      search  ? ilike(angelInvestors.name, `%${search}%`) : undefined,
      state   ? eq(angelInvestors.state, state)           : undefined,
      country ? eq(angelInvestors.country, country)       : undefined,
    )

    const [rows, [{ value: total }]] = await Promise.all([
      db.select().from(angelInvestors).where(conditions).limit(PAGE_SIZE).offset(offset),
      db.select({ value: count() }).from(angelInvestors).where(conditions),
    ])

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
