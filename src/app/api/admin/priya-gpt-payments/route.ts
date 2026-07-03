import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { priyaGptTimeTransactions, users } from "@/lib/db/schema"
import { eq, and, gte, lt, desc } from "drizzle-orm"
import { auth, isAdmin } from "@/lib/auth"

const PAGE_SIZE = 10

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!isAdmin(session?.user?.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const month = searchParams.get("month") ?? "" // "YYYY-MM"
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10))

  let dateFrom: Date | null = null
  let dateTo: Date | null = null
  if (month && /^\d{4}-\d{2}$/.test(month)) {
    const [y, m] = month.split("-").map(Number)
    dateFrom = new Date(y, m - 1, 1)
    dateTo = new Date(y, m, 1)
  }

  const conditions = [
    eq(priyaGptTimeTransactions.reason, "purchase"),
    ...(dateFrom && dateTo
      ? [gte(priyaGptTimeTransactions.createdAt, dateFrom), lt(priyaGptTimeTransactions.createdAt, dateTo)]
      : []),
  ]

  const allRows = await db
    .select({
      id: priyaGptTimeTransactions.id,
      userName: users.name,
      userEmail: users.email,
      razorpayPaymentId: priyaGptTimeTransactions.razorpayPaymentId,
      amountPaise: priyaGptTimeTransactions.amountPaise,
      deltaMinutes: priyaGptTimeTransactions.deltaMinutes,
      createdAt: priyaGptTimeTransactions.createdAt,
    })
    .from(priyaGptTimeTransactions)
    .leftJoin(users, eq(priyaGptTimeTransactions.userId, users.id))
    .where(and(...conditions))
    .orderBy(desc(priyaGptTimeTransactions.createdAt))

  const summaryRows = await db
    .select({
      amountPaise: priyaGptTimeTransactions.amountPaise,
      createdAt: priyaGptTimeTransactions.createdAt,
    })
    .from(priyaGptTimeTransactions)
    .where(eq(priyaGptTimeTransactions.reason, "purchase"))
    .orderBy(desc(priyaGptTimeTransactions.createdAt))

  const monthMap: Record<string, { count: number; revenue: number }> = {}
  for (const r of summaryRows) {
    const d = r.createdAt instanceof Date ? r.createdAt : new Date(r.createdAt)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    if (!monthMap[key]) monthMap[key] = { count: 0, revenue: 0 }
    monthMap[key].count++
    monthMap[key].revenue += r.amountPaise ?? 0
  }
  const monthlySummary = Object.entries(monthMap)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([month, data]) => ({ month, ...data }))

  const total = allRows.length
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const offset = (page - 1) * PAGE_SIZE
  const rows = allRows.slice(offset, offset + PAGE_SIZE).map((r) => ({
    ...r,
    userName: r.userName ?? "Unknown",
    userEmail: r.userEmail ?? "",
    createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : r.createdAt,
  }))

  const totalRevenue = allRows.reduce((s, r) => s + (r.amountPaise ?? 0), 0)

  return NextResponse.json({ rows, total, revenue: totalRevenue, pageCount, monthlySummary })
}
