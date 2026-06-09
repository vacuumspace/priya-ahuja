import { db } from "@/lib/db"
import { bookings, services, digitalProducts, users } from "@/lib/db/schema"
import { eq, count, desc } from "drizzle-orm"

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
  const [stats, allUsers] = await Promise.all([
    getStats(),
    db.select().from(users).orderBy(desc(users.id)),
  ])
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

      <div className="mt-12 max-w-2xl">
        <div className="flex items-baseline gap-2 mb-4">
          <h2 className="font-heading text-xl font-700 text-ink">Users</h2>
          <span className="font-sans text-xs text-ink/40">{allUsers.length} signed in</span>
        </div>
        <div className="border border-border rounded-2xl overflow-hidden">
          {allUsers.length === 0 ? (
            <p className="font-sans text-sm text-ink/40 px-6 py-8 text-center">No users yet.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-card">
                  <th className="text-left font-sans text-[11px] text-ink/40 uppercase tracking-widest px-5 py-3">Name</th>
                  <th className="text-left font-sans text-[11px] text-ink/40 uppercase tracking-widest px-5 py-3">Email</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map((user, i) => (
                  <tr key={user.id} className={i !== allUsers.length - 1 ? "border-b border-border" : ""}>
                    <td className="px-5 py-3 font-sans text-sm text-ink">{user.name ?? "—"}</td>
                    <td className="px-5 py-3 font-sans text-sm text-ink/60">{user.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
