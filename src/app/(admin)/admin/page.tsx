import { db } from "@/lib/db"
import { bookings, services, digitalProducts } from "@/lib/db/schema"
import { eq, count } from "drizzle-orm"

async function getStats() {
  const [totalBookings, pendingBookings, paidBookings, activeServices, activeProducts] =
    await Promise.all([
      db.select({ count: count() }).from(bookings),
      db.select({ count: count() }).from(bookings).where(eq(bookings.status, "pending")),
      db.select({ count: count() }).from(bookings).where(eq(bookings.status, "paid")),
      db.select({ count: count() }).from(services).where(eq(services.isActive, true)),
      db.select({ count: count() }).from(digitalProducts).where(eq(digitalProducts.isActive, true)),
    ])

  return {
    totalBookings: totalBookings[0].count,
    pendingBookings: pendingBookings[0].count,
    paidBookings: paidBookings[0].count,
    activeServices: activeServices[0].count,
    activeProducts: activeProducts[0].count,
  }
}

const statCards = (stats: Awaited<ReturnType<typeof getStats>>) => [
  { label: "Total Bookings", value: stats.totalBookings, sub: "all time" },
  { label: "Pending Bookings", value: stats.pendingBookings, sub: "awaiting action", highlight: stats.pendingBookings > 0 },
  { label: "Paid Bookings", value: stats.paidBookings, sub: "confirmed" },
  { label: "Active Services", value: stats.activeServices, sub: "live on site" },
  { label: "Active Products", value: stats.activeProducts, sub: "available to buy" },
]

export default async function AdminDashboard() {
  const stats = await getStats()
  const cards = statCards(stats)

  return (
    <div className="px-10 py-10">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-800 text-ink">Dashboard</h1>
        <p className="font-sans text-sm text-ink/50 mt-1">Welcome back, Priya.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-2xl">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`bg-card border rounded-2xl p-6 ${
              card.highlight ? "border-peach-dark/60" : "border-border"
            }`}
          >
            <p className="font-sans text-[11px] text-ink/40 uppercase tracking-widest mb-2">
              {card.label}
            </p>
            <p className="font-heading text-4xl font-800 text-ink">{card.value}</p>
            <p className="font-sans text-xs text-ink/40 mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

    </div>
  )
}
