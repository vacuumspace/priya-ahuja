import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { bookings, purchases, startupScores, digitalProducts, priyaGptTimeTransactions } from "@/lib/db/schema"
import { and, eq, inArray, isNotNull, like } from "drizzle-orm"

export async function GET() {
  const session = await auth()
  if (!session || !isAdmin(session.user?.email)) {
    return new Response("Forbidden", { status: 403 })
  }

  const [allBookings, allPurchases, allScores, priyaGptPurchases] = await Promise.all([
    db
      .select({ createdAt: bookings.createdAt, amount: bookings.amountPaid })
      .from(bookings)
      .where(inArray(bookings.status, ["confirmed", "completed", "paid"])),

    db
      .select({
        createdAt: purchases.createdAt,
        amount: purchases.amountPaid,
        price: digitalProducts.price,
        slug: digitalProducts.slug,
      })
      .from(purchases)
      .leftJoin(digitalProducts, eq(purchases.productId, digitalProducts.id))
      .where(and(like(purchases.razorpayPaymentId, "pay_%"), isNotNull(purchases.amountPaid))),

    db
      .select({ createdAt: startupScores.createdAt })
      .from(startupScores)
      .where(eq(startupScores.isPaid, true)),

    db
      .select({ createdAt: priyaGptTimeTransactions.createdAt, amountPaise: priyaGptTimeTransactions.amountPaise })
      .from(priyaGptTimeTransactions)
      .where(eq(priyaGptTimeTransactions.reason, "purchase")),
  ])

  function monthKey(d: Date) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
  }
  function monthLabel(key: string) {
    const [y, m] = key.split("-")
    return new Date(Number(y), Number(m) - 1, 1).toLocaleString("en-IN", { month: "short", year: "2-digit" })
  }

  // Fixed 12-month window starting from June 2026
  const START_YEAR = 2026, START_MONTH = 6
  const months: string[] = []
  for (let i = 0; i < 12; i++) {
    const totalMonth = START_MONTH - 1 + i
    const y = START_YEAR + Math.floor(totalMonth / 12)
    const m = (totalMonth % 12) + 1
    months.push(`${y}-${String(m).padStart(2, "0")}`)
  }

  type Seg = { revenue: number; count: number }
  type MonthData = { revenue: number; count: number; sessions: Seg; templates: Seg; investorList: Seg; priyagpt: Seg }
  const monthly: Record<string, MonthData> = {}
  for (const k of months) {
    monthly[k] = {
      revenue: 0, count: 0,
      sessions: { revenue: 0, count: 0 },
      templates: { revenue: 0, count: 0 },
      investorList: { revenue: 0, count: 0 },
      priyagpt: { revenue: 0, count: 0 },
    }
  }

  let sessionRevenue = 0, sessionCount = 0
  let templateRevenue = 0, templateCount = 0
  let investorListRevenue = 0, investorListCount = 0

  for (const r of allBookings) {
    const amt = r.amount ?? 0
    sessionRevenue += amt; sessionCount++
    const k = monthKey(r.createdAt)
    if (monthly[k]) {
      monthly[k].revenue += amt; monthly[k].count++
      monthly[k].sessions.revenue += amt; monthly[k].sessions.count++
    }
  }

  for (const r of allPurchases) {
    const amt = r.amount ?? r.price ?? 0
    const isInvestorList = r.slug?.endsWith("-list") ?? false
    const k = monthKey(r.createdAt)
    if (isInvestorList) {
      investorListRevenue += amt; investorListCount++
      if (monthly[k]) {
        monthly[k].revenue += amt; monthly[k].count++
        monthly[k].investorList.revenue += amt; monthly[k].investorList.count++
      }
    } else {
      templateRevenue += amt; templateCount++
      if (monthly[k]) {
        monthly[k].revenue += amt; monthly[k].count++
        monthly[k].templates.revenue += amt; monthly[k].templates.count++
      }
    }
  }

  let priyaGptRevenue = 0, priyaGptCount = 0
  for (const r of priyaGptPurchases) {
    const amt = r.amountPaise ?? 0
    priyaGptRevenue += amt; priyaGptCount++
    const k = monthKey(r.createdAt)
    if (monthly[k]) {
      monthly[k].revenue += amt; monthly[k].count++
      monthly[k].priyagpt.revenue += amt; monthly[k].priyagpt.count++
    }
  }

  const monthlyChart = months.map(k => ({ key: k, label: monthLabel(k), ...monthly[k] }))

  return Response.json({
    totalRevenue: sessionRevenue + templateRevenue + investorListRevenue + priyaGptRevenue,
    totalTransactions: sessionCount + templateCount + investorListCount + allScores.length + priyaGptCount,
    byType: [
      { label: "Sessions",      revenue: sessionRevenue,     count: sessionCount },
      { label: "Templates",     revenue: templateRevenue,    count: templateCount },
      { label: "Investor List", revenue: investorListRevenue, count: investorListCount },
      { label: "Startup Score", revenue: 0,                  count: allScores.length },
      { label: "PriyaGPT",      revenue: priyaGptRevenue,    count: priyaGptCount },
    ],
    monthly: monthlyChart,
  })
}
