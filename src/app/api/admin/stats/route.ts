import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import {
  bookings, purchases, startupScores, serviceInquiries,
  users, services, analyticsEvents,
} from "@/lib/db/schema"
import { eq, not, count } from "drizzle-orm"

export async function GET() {
  const session = await auth()
  if (!session || !isAdmin(session.user?.email)) {
    return new Response("Forbidden", { status: 403 })
  }

  const [
    allBookings,
    allPurchases,
    allScores,
    allInquiries,
    allUsers,
    bookingsByService,
    inquiriesByType,
    pageViewTotal,
    ctaClicks,
    angelPurchases,
  ] = await Promise.all([
    db.select({ createdAt: bookings.createdAt, status: bookings.status })
      .from(bookings)
      .where(not(eq(bookings.status, "pending"))),

    db.select({ createdAt: purchases.createdAt }).from(purchases),

    db.select({ createdAt: startupScores.createdAt, isPaid: startupScores.isPaid })
      .from(startupScores),

    db.select({ createdAt: serviceInquiries.createdAt, type: serviceInquiries.type })
      .from(serviceInquiries),

    db.select({ createdAt: users.createdAt }).from(users),

    db.select({ serviceTitle: services.title, cnt: count(bookings.id) })
      .from(bookings)
      .leftJoin(services, eq(bookings.serviceId, services.id))
      .where(not(eq(bookings.status, "pending")))
      .groupBy(services.title),

    db.select({ type: serviceInquiries.type, cnt: count(serviceInquiries.id) })
      .from(serviceInquiries)
      .groupBy(serviceInquiries.type),

    // Total page views (single count, no grouping)
    db.select({ cnt: count(analyticsEvents.id) })
      .from(analyticsEvents)
      .where(eq(analyticsEvents.type, "pageview")),

    // CTA clicks grouped by ctaId
    db.select({ ctaId: analyticsEvents.ctaId, cnt: count(analyticsEvents.id) })
      .from(analyticsEvents)
      .where(eq(analyticsEvents.type, "cta_click"))
      .groupBy(analyticsEvents.ctaId),

    // Angel investor purchases count (for conversion rate)
    db.select({ cnt: count() }).from(purchases),
  ])

  function monthKey(d: Date | null) {
    if (!d) return null
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
  }

  const now = new Date()
  const months: { label: string; key: string }[] = []
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    const label = d.toLocaleString("en-IN", { month: "short", year: "2-digit" })
    months.push({ key, label })
  }

  const monthly: Record<string, { transactions: number; newUsers: number; inquiries: number; scores: number }> = {}
  for (const m of months) monthly[m.key] = { transactions: 0, newUsers: 0, inquiries: 0, scores: 0 }

  for (const r of allBookings) {
    const k = monthKey(r.createdAt)
    if (k && monthly[k]) monthly[k].transactions++
  }
  for (const r of allPurchases) {
    const k = monthKey(r.createdAt)
    if (k && monthly[k]) monthly[k].transactions++
  }
  for (const r of allUsers) {
    const k = monthKey(r.createdAt)
    if (k && monthly[k]) monthly[k].newUsers++
  }
  for (const r of allInquiries) {
    const k = monthKey(r.createdAt)
    if (k && monthly[k]) monthly[k].inquiries++
  }
  for (const r of allScores) {
    const k = monthKey(r.createdAt)
    if (k && monthly[k]) monthly[k].scores++
  }

  const monthlyChart = months.map((m) => ({ ...m, ...monthly[m.key] }))

  // Build CTA click map
  const ctaMap: Record<string, number> = {}
  for (const r of ctaClicks) {
    if (r.ctaId) ctaMap[r.ctaId] = Number(r.cnt)
  }

  // Conversion rates: completions / CTA clicks (× 100)
  function convRate(completions: number, clicks: number) {
    if (clicks === 0) return null
    return Math.round((completions / clicks) * 100)
  }

  const paidScores = allScores.filter((s) => s.isPaid).length
  const totalPurchases = Number(angelPurchases[0]?.cnt ?? 0)
  const totalInquiries = allInquiries.length

  const conversions = [
    {
      label: "Angel Investor List",
      ctaId: "angel-investors-buy",
      clicks: ctaMap["angel-investors-buy"] ?? 0,
      completions: totalPurchases,
      rate: convRate(totalPurchases, ctaMap["angel-investors-buy"] ?? 0),
    },
    {
      label: "Startup Score Unlock",
      ctaId: "startup-score-unlock",
      clicks: ctaMap["startup-score-unlock"] ?? 0,
      completions: paidScores,
      rate: convRate(paidScores, ctaMap["startup-score-unlock"] ?? 0),
    },
    {
      label: "Accounting Inquiry",
      ctaId: "inquiry-accounting",
      clicks: ctaMap["inquiry-accounting"] ?? 0,
      completions: allInquiries.filter((i) => i.type === "accounting").length,
      rate: convRate(allInquiries.filter((i) => i.type === "accounting").length, ctaMap["inquiry-accounting"] ?? 0),
    },
    {
      label: "Incorporation Inquiry",
      ctaId: "inquiry-incorporation",
      clicks: ctaMap["inquiry-incorporation"] ?? 0,
      completions: allInquiries.filter((i) => i.type === "incorporation").length,
      rate: convRate(allInquiries.filter((i) => i.type === "incorporation").length, ctaMap["inquiry-incorporation"] ?? 0),
    },
    {
      label: "Tech Inquiry",
      ctaId: "inquiry-tech",
      clicks: ctaMap["inquiry-tech"] ?? 0,
      completions: allInquiries.filter((i) => i.type === "tech").length,
      rate: convRate(allInquiries.filter((i) => i.type === "tech").length, ctaMap["inquiry-tech"] ?? 0),
    },
  ]

  const totalPageViews = Number(pageViewTotal[0]?.cnt ?? 0)

  return Response.json({
    totals: {
      users: allUsers.length,
      transactions: allBookings.length + allPurchases.length,
      scores: allScores.length,
      paidScores,
      inquiries: totalInquiries,
      pageViews: totalPageViews,
    },
    bookingsByService: bookingsByService.map((r) => ({
      service: r.serviceTitle ?? "Unknown",
      count: Number(r.cnt),
    })),
    inquiriesByType: inquiriesByType.map((r) => ({
      type: r.type,
      count: Number(r.cnt),
    })),
    monthly: monthlyChart,
    conversions,
  })
}
