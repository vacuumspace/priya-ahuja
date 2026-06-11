import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { bookings, purchases, startupScores, services, digitalProducts, users } from "@/lib/db/schema"
import { eq, not, inArray } from "drizzle-orm"

export async function GET() {
  const session = await auth()
  if (!session || !isAdmin(session.user?.email)) {
    return new Response("Forbidden", { status: 403 })
  }

  const [allBookings, allPurchases, allScores] = await Promise.all([
    db
      .select({
        status: bookings.status,
        createdAt: bookings.createdAt,
        amount: services.price,
      })
      .from(bookings)
      .leftJoin(services, eq(bookings.serviceId, services.id))
      .where(not(inArray(bookings.status, ["pending", "cancelled"]))),

    db
      .select({
        createdAt: purchases.createdAt,
        amount: digitalProducts.price,
        productTitle: digitalProducts.title,
      })
      .from(purchases)
      .leftJoin(digitalProducts, eq(purchases.productId, digitalProducts.id)),

    db
      .select({ createdAt: startupScores.createdAt })
      .from(startupScores)
      .where(eq(startupScores.isPaid, true)),
  ])

  // Monthly bucketing (last 12 months)
  const now = new Date()
  const months: { label: string; key: string }[] = []
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    const label = d.toLocaleString("en-IN", { month: "short", year: "2-digit" })
    months.push({ key, label })
  }

  function monthKey(d: Date) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
  }

  const monthly: Record<string, { revenue: number; count: number }> = {}
  for (const m of months) monthly[m.key] = { revenue: 0, count: 0 }

  let bookingRevenue = 0, purchaseRevenue = 0
  let bookingCount = 0, purchaseCount = 0, scoreCount = allScores.length

  for (const r of allBookings) {
    const amt = r.amount ?? 0
    bookingRevenue += amt
    bookingCount++
    const k = monthKey(r.createdAt)
    if (monthly[k]) { monthly[k].revenue += amt; monthly[k].count++ }
  }
  for (const r of allPurchases) {
    const amt = r.amount ?? 0
    purchaseRevenue += amt
    purchaseCount++
    const k = monthKey(r.createdAt)
    if (monthly[k]) { monthly[k].revenue += amt; monthly[k].count++ }
  }
  for (const r of allScores) {
    const k = monthKey(r.createdAt)
    if (monthly[k]) { monthly[k].count++ }
  }

  const monthlyChart = months.map((m) => ({ ...m, ...monthly[m.key] }))

  return Response.json({
    totalRevenue: bookingRevenue + purchaseRevenue,
    totalTransactions: bookingCount + purchaseCount + scoreCount,
    byType: [
      { label: "Sessions", revenue: bookingRevenue, count: bookingCount },
      { label: "Templates", revenue: purchaseRevenue, count: purchaseCount },
      { label: "Startup Score", revenue: 0, count: scoreCount },
    ],
    monthly: monthlyChart,
  })
}
