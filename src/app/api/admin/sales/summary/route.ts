import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { bookings, purchases, startupScores, startupIdeaScores, pitchDeckAnalyses, pitchDeckUnlocks, toolUnlocks, digitalProducts, priyaGptTimeTransactions, priyaGptTimeUnlocks, workshopRegistrations, courseEnrollments, courseGifts } from "@/lib/db/schema"
import { and, eq, inArray, isNotNull, like } from "drizzle-orm"

export async function GET() {
  const session = await auth()
  if (!session || !isAdmin(session.user?.email)) {
    return new Response("Forbidden", { status: 403 })
  }

  const [allBookings, allPurchases, allScores, allIdeaScores, allPitchDecks, unusedPitchDeckUnlocks, priyaGptPurchases, unusedToolUnlocks, unusedPriyaGptUnlocks, allWorkshopRegistrations, allCourseEnrollments, allCourseGifts] = await Promise.all([
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
      .select({ createdAt: startupScores.createdAt, amountPaid: startupScores.amountPaid })
      .from(startupScores)
      .where(eq(startupScores.isPaid, true)),

    db
      .select({ createdAt: startupIdeaScores.createdAt, amountPaid: startupIdeaScores.amountPaid })
      .from(startupIdeaScores)
      .where(eq(startupIdeaScores.isPaid, true)),

    db
      .select({ createdAt: pitchDeckAnalyses.createdAt, amountPaid: pitchDeckAnalyses.amountPaid })
      .from(pitchDeckAnalyses)
      .where(eq(pitchDeckAnalyses.isPaid, true)),

    // Captured pitch deck payments not yet turned into an analysis
    db
      .select({ createdAt: pitchDeckUnlocks.createdAt, amountPaise: pitchDeckUnlocks.amountPaise })
      .from(pitchDeckUnlocks)
      .where(eq(pitchDeckUnlocks.status, "paid")),

    db
      .select({ createdAt: priyaGptTimeTransactions.createdAt, amountPaise: priyaGptTimeTransactions.amountPaise })
      .from(priyaGptTimeTransactions)
      .where(eq(priyaGptTimeTransactions.reason, "purchase")),

    // Captured startup-score / idea-score payments not yet turned into a result
    db
      .select({ createdAt: toolUnlocks.createdAt, amountPaise: toolUnlocks.amountPaise })
      .from(toolUnlocks)
      .where(eq(toolUnlocks.status, "paid")),

    // Captured PriyaGPT time payments not yet applied to a balance
    db
      .select({ createdAt: priyaGptTimeUnlocks.createdAt, amountPaise: priyaGptTimeUnlocks.amountPaise })
      .from(priyaGptTimeUnlocks)
      .where(eq(priyaGptTimeUnlocks.status, "paid")),

    db
      .select({ createdAt: workshopRegistrations.createdAt, amount: workshopRegistrations.amountPaid })
      .from(workshopRegistrations)
      .where(eq(workshopRegistrations.status, "confirmed")),

    // Real payments only - admin test rows carry no payment ids.
    db
      .select({
        preRegAt: courseEnrollments.preRegisteredAt,
        preRegPaymentId: courseEnrollments.preRegPaymentId,
        preRegAmount: courseEnrollments.preRegAmountPaid,
        paidAt: courseEnrollments.paidAt,
        balancePaymentId: courseEnrollments.balancePaymentId,
        balanceAmount: courseEnrollments.balanceAmountPaid,
        createdAt: courseEnrollments.createdAt,
      })
      .from(courseEnrollments)
      .where(inArray(courseEnrollments.status, ["preregistered", "paid"])),

    db
      .select({ createdAt: courseGifts.createdAt, amount: courseGifts.amountPaid })
      .from(courseGifts)
      .where(and(inArray(courseGifts.status, ["paid", "redeemed"]), isNotNull(courseGifts.razorpayPaymentId))),
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
  type MonthData = { revenue: number; count: number; sessions: Seg; templates: Seg; investorList: Seg; priyagpt: Seg; pitchDeck: Seg; score: Seg; workshops: Seg; courses: Seg }
  const monthly: Record<string, MonthData> = {}
  for (const k of months) {
    monthly[k] = {
      revenue: 0, count: 0,
      sessions: { revenue: 0, count: 0 },
      templates: { revenue: 0, count: 0 },
      investorList: { revenue: 0, count: 0 },
      priyagpt: { revenue: 0, count: 0 },
      pitchDeck: { revenue: 0, count: 0 },
      score: { revenue: 0, count: 0 },
      workshops: { revenue: 0, count: 0 },
      courses: { revenue: 0, count: 0 },
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

  let pitchDeckRevenue = 0, pitchDeckCount = 0
  for (const r of [...allPitchDecks.map(a => ({ createdAt: a.createdAt, amount: a.amountPaid })), ...unusedPitchDeckUnlocks.map(u => ({ createdAt: u.createdAt, amount: u.amountPaise }))]) {
    const amt = r.amount ?? 0
    pitchDeckRevenue += amt; pitchDeckCount++
    const k = monthKey(r.createdAt)
    if (monthly[k]) {
      monthly[k].revenue += amt; monthly[k].count++
      monthly[k].pitchDeck.revenue += amt; monthly[k].pitchDeck.count++
    }
  }

  let scoreRevenue = 0, scoreCount = 0
  for (const r of [
    ...allScores.map(a => ({ createdAt: a.createdAt, amount: a.amountPaid })),
    ...allIdeaScores.map(a => ({ createdAt: a.createdAt, amount: a.amountPaid })),
    ...unusedToolUnlocks.map(u => ({ createdAt: u.createdAt, amount: u.amountPaise })),
  ]) {
    const amt = r.amount ?? 0
    scoreRevenue += amt; scoreCount++
    const k = monthKey(r.createdAt)
    if (monthly[k]) {
      monthly[k].revenue += amt; monthly[k].count++
      monthly[k].score.revenue += amt; monthly[k].score.count++
    }
  }

  let priyaGptRevenue = 0, priyaGptCount = 0
  for (const r of [...priyaGptPurchases, ...unusedPriyaGptUnlocks]) {
    const amt = r.amountPaise ?? 0
    priyaGptRevenue += amt; priyaGptCount++
    const k = monthKey(r.createdAt)
    if (monthly[k]) {
      monthly[k].revenue += amt; monthly[k].count++
      monthly[k].priyagpt.revenue += amt; monthly[k].priyagpt.count++
    }
  }

  let workshopRevenue = 0, workshopCount = 0
  for (const r of allWorkshopRegistrations) {
    const amt = r.amount ?? 0
    workshopRevenue += amt; workshopCount++
    const k = monthKey(r.createdAt)
    if (monthly[k]) {
      monthly[k].revenue += amt; monthly[k].count++
      monthly[k].workshops.revenue += amt; monthly[k].workshops.count++
    }
  }

  // Each captured course payment (the pre-registration and, later, the
  // balance) is its own sale in the month it was paid.
  let courseRevenue = 0, courseCount = 0
  for (const r of allCourseEnrollments) {
    const payments = [
      r.preRegPaymentId ? { at: r.preRegAt ?? r.createdAt, amt: r.preRegAmount ?? 0 } : null,
      r.balancePaymentId ? { at: r.paidAt ?? r.createdAt, amt: r.balanceAmount ?? 0 } : null,
    ]
    for (const pay of payments) {
      if (!pay) continue
      courseRevenue += pay.amt; courseCount++
      const k = monthKey(pay.at)
      if (monthly[k]) {
        monthly[k].revenue += pay.amt; monthly[k].count++
        monthly[k].courses.revenue += pay.amt; monthly[k].courses.count++
      }
    }
  }

  // A gift purchase is a course sale in the month it was bought.
  for (const g of allCourseGifts) {
    const amt = g.amount ?? 0
    courseRevenue += amt; courseCount++
    const k = monthKey(g.createdAt)
    if (monthly[k]) {
      monthly[k].revenue += amt; monthly[k].count++
      monthly[k].courses.revenue += amt; monthly[k].courses.count++
    }
  }

  const monthlyChart = months.map(k => ({ key: k, label: monthLabel(k), ...monthly[k] }))

  return Response.json({
    totalRevenue: sessionRevenue + templateRevenue + investorListRevenue + priyaGptRevenue + pitchDeckRevenue + scoreRevenue + workshopRevenue + courseRevenue,
    totalTransactions: sessionCount + templateCount + investorListCount + scoreCount + priyaGptCount + pitchDeckCount + workshopCount + courseCount,
    byType: [
      { label: "Sessions",      revenue: sessionRevenue,     count: sessionCount },
      { label: "Templates",     revenue: templateRevenue,    count: templateCount },
      { label: "Investor List", revenue: investorListRevenue, count: investorListCount },
      { label: "Startup Score", revenue: scoreRevenue,       count: scoreCount },
      { label: "Pitch Deck",    revenue: pitchDeckRevenue,   count: pitchDeckCount },
      { label: "PriyaGPT",      revenue: priyaGptRevenue,    count: priyaGptCount },
      { label: "Workshops",     revenue: workshopRevenue,    count: workshopCount },
      { label: "Courses",       revenue: courseRevenue,      count: courseCount },
    ],
    monthly: monthlyChart,
  })
}
