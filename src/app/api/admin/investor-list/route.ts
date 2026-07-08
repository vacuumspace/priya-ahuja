import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { purchases, digitalProducts } from "@/lib/db/schema"
import { eq, and, isNotNull, inArray, gte, lt, desc } from "drizzle-orm"
import { auth, isAdmin } from "@/lib/auth"

const PAGE_SIZE = 10

export const INVESTOR_SLUGS = [
  "angel-investor-list",
  "early-stage-vc-list",
  "family-offices-list",
  "incubators-list",
] as const

export const SLUG_LABELS: Record<string, string> = {
  "angel-investor-list":  "Angel Investors",
  "early-stage-vc-list":  "Early Stage VC",
  "family-offices-list":  "Family Offices",
  "incubators-list":      "Incubator & Accelerator",
}

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!isAdmin(session?.user?.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const listType = searchParams.get("listType") ?? "all"
  const month    = searchParams.get("month") ?? ""   // "YYYY-MM"
  const page     = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10))

  // Mark unseen investor-list purchases as seen now that admin is viewing this page
  await db
    .update(purchases)
    .set({ adminSeen: true })
    .where(
      and(
        eq(purchases.adminSeen, false),
        inArray(
          purchases.productId,
          db.select({ id: digitalProducts.id }).from(digitalProducts).where(inArray(digitalProducts.slug, [...INVESTOR_SLUGS]))
        )
      )
    )

  // Which slugs to include
  const slugFilter = listType === "all"
    ? [...INVESTOR_SLUGS]
    : INVESTOR_SLUGS.includes(listType as typeof INVESTOR_SLUGS[number])
      ? [listType]
      : [...INVESTOR_SLUGS]

  // Date range for month filter
  let dateFrom: Date | null = null
  let dateTo:   Date | null = null
  if (month && /^\d{4}-\d{2}$/.test(month)) {
    const [y, m] = month.split("-").map(Number)
    dateFrom = new Date(y, m - 1, 1)
    dateTo   = new Date(y, m, 1)
  }

  // Build where conditions
  const conditions = [
    isNotNull(purchases.razorpayPaymentId),
    inArray(digitalProducts.slug, slugFilter),
    ...(dateFrom && dateTo ? [gte(purchases.createdAt, dateFrom), lt(purchases.createdAt, dateTo)] : []),
  ]

  // Fetch all matching for summary + paginated for table
  const allRows = await db
    .select({
      id:                 purchases.id,
      userName:           purchases.userName,
      userEmail:          purchases.userEmail,
      razorpayPaymentId:  purchases.razorpayPaymentId,
      downloadToken:      purchases.downloadToken,
      amountPaid:         purchases.amountPaid,
      createdAt:          purchases.createdAt,
      slug:               digitalProducts.slug,
      productTitle:       digitalProducts.title,
      price:              digitalProducts.price,
    })
    .from(purchases)
    .innerJoin(digitalProducts, eq(purchases.productId, digitalProducts.id))
    .where(and(...conditions))
    .orderBy(desc(purchases.createdAt))

  // Monthly summary (across all time, ignoring month filter - for the summary cards)
  const summaryRows = await db
    .select({
      id:        purchases.id,
      amountPaid: purchases.amountPaid,
      price:     digitalProducts.price,
      slug:      digitalProducts.slug,
      createdAt: purchases.createdAt,
    })
    .from(purchases)
    .innerJoin(digitalProducts, eq(purchases.productId, digitalProducts.id))
    .where(and(
      isNotNull(purchases.razorpayPaymentId),
      inArray(digitalProducts.slug, slugFilter),
    ))
    .orderBy(desc(purchases.createdAt))

  // Group by month
  const monthMap: Record<string, { count: number; revenue: number; bySlug: Record<string, { count: number; revenue: number }> }> = {}
  for (const r of summaryRows) {
    const d = r.createdAt instanceof Date ? r.createdAt : new Date(r.createdAt)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    if (!monthMap[key]) monthMap[key] = { count: 0, revenue: 0, bySlug: {} }
    const amt = r.amountPaid ?? r.price
    monthMap[key].count++
    monthMap[key].revenue += amt
    if (!monthMap[key].bySlug[r.slug]) monthMap[key].bySlug[r.slug] = { count: 0, revenue: 0 }
    monthMap[key].bySlug[r.slug].count++
    monthMap[key].bySlug[r.slug].revenue += amt
  }
  const monthlySummary = Object.entries(monthMap)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([month, data]) => ({ month, ...data }))

  // Pagination on filtered rows
  const total = allRows.length
  const pageCount = Math.ceil(total / PAGE_SIZE)
  const offset = (page - 1) * PAGE_SIZE
  const rows = allRows.slice(offset, offset + PAGE_SIZE).map(r => ({
    ...r,
    createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : r.createdAt,
  }))

  const totalRevenue = allRows.reduce((s, r) => s + (r.amountPaid ?? r.price), 0)

  return NextResponse.json({ rows, total, revenue: totalRevenue, pageCount, monthlySummary })
}

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!isAdmin(session?.user?.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  const { purchaseId } = await req.json()
  if (!purchaseId) return NextResponse.json({ error: "Missing purchaseId" }, { status: 400 })

  await db.update(purchases).set({ downloadToken: null }).where(eq(purchases.id, purchaseId))
  return NextResponse.json({ ok: true })
}
