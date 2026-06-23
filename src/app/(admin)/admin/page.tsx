import { db } from "@/lib/db"
import { bookings, services, availability, purchases, digitalProducts } from "@/lib/db/schema"
import { eq, and, gte, not, desc, isNotNull } from "drizzle-orm"
import Link from "next/link"

const STATUS_COLORS: Record<string, string> = {
  paid: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  confirmed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  rescheduled: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  pending: "bg-ink/10 text-ink/50",
  completed: "bg-ink/10 text-ink/40",
}

export default async function AdminDashboard() {
  const today = new Date().toISOString().slice(0, 10)

  const recentBookingTxns = await db
    .select({
      id: bookings.id,
      userName: bookings.userName,
      amount: services.price,
      label: services.title,
      createdAt: bookings.createdAt,
      type: bookings.razorpayPaymentId,
    })
    .from(bookings)
    .leftJoin(services, eq(bookings.serviceId, services.id))
    .where(isNotNull(bookings.razorpayPaymentId))
    .orderBy(desc(bookings.createdAt))
    .limit(10)

  const recentPurchaseTxns = await db
    .select({
      id: purchases.id,
      userName: purchases.userName,
      amount: digitalProducts.price,
      label: digitalProducts.title,
      createdAt: purchases.createdAt,
    })
    .from(purchases)
    .leftJoin(digitalProducts, eq(purchases.productId, digitalProducts.id))
    .where(isNotNull(purchases.razorpayPaymentId))
    .orderBy(desc(purchases.createdAt))
    .limit(10)

  const recentTransactions = [
    ...recentBookingTxns.map((t) => ({ ...t, kind: "booking" as const })),
    ...recentPurchaseTxns.map((t) => ({ ...t, kind: "purchase" as const, type: null })),
  ]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10)

  const upcomingBookings = await db
    .select({
      id: bookings.id,
      userName: bookings.userName,
      userEmail: bookings.userEmail,
      status: bookings.status,
      meetLink: bookings.meetLink,
      serviceTitle: services.title,
      slotDate: availability.date,
      slotStartTime: availability.startTime,
    })
    .from(bookings)
    .innerJoin(availability, eq(bookings.slotId, availability.id))
    .leftJoin(services, eq(bookings.serviceId, services.id))
    .where(and(gte(availability.date, today), not(eq(bookings.status, "cancelled"))))
    .orderBy(availability.date, availability.startTime)

  return (
    <div className="px-10 py-10">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-800 text-ink">Dashboard</h1>
        <p className="font-sans text-sm text-ink/50 mt-1">Welcome back, Priya.</p>
      </div>

      <div className="max-w-2xl flex flex-col gap-10">

        <div>
          <h2 className="font-sans text-xs font-semibold text-ink/40 uppercase tracking-widest mb-3">
            Recent Transactions
          </h2>
          {recentTransactions.length === 0 ? (
            <p className="font-sans text-sm text-ink/30">No transactions yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {recentTransactions.map((t) => {
                const dateLabel = new Date(t.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric", month: "short", year: "numeric",
                })
                const amountRs = t.amount != null ? `₹${(t.amount / 100).toLocaleString("en-IN")}` : "—"
                return (
                  <div key={`${t.kind}-${t.id}`} className="bg-card border border-border rounded-xl px-4 py-3 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-sans font-medium text-ink truncate">{t.userName}</p>
                      <p className="text-[11px] font-sans text-ink/40 truncate">{t.label ?? "—"}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-sans font-semibold text-ink">{amountRs}</p>
                      <p className="text-[10px] font-sans text-ink/30">{dateLabel}</p>
                    </div>
                    <span className={`text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full capitalize flex-shrink-0 ${t.kind === "purchase" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"}`}>
                      {t.kind === "purchase" ? "template" : "session"}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-sans text-xs font-semibold text-ink/40 uppercase tracking-widest">
            Upcoming Bookings
          </h2>
          <Link href="/admin/bookings" className="text-[11px] font-sans text-ink/40 hover:text-ink transition-colors">
            view all →
          </Link>
        </div>

        {upcomingBookings.length === 0 ? (
          <p className="font-sans text-sm text-ink/30">No upcoming bookings.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {upcomingBookings.map((b) => {
              const dateLabel = new Date(`${b.slotDate}T00:00:00`).toLocaleDateString("en-IN", {
                weekday: "short", day: "numeric", month: "short",
              })
              return (
                <div key={b.id} className="bg-card border border-border rounded-xl px-4 py-3 flex items-center gap-4">
                  <div className="text-center min-w-[48px]">
                    <p className="text-xs font-sans font-semibold text-ink">{b.slotStartTime}</p>
                    <p className="text-[10px] font-sans text-ink/40">{dateLabel}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-sans font-medium text-ink truncate">{b.userName}</p>
                    <p className="text-[11px] font-sans text-ink/40 truncate">{b.serviceTitle ?? "—"}</p>
                  </div>
                  <span className={`text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full capitalize flex-shrink-0 ${STATUS_COLORS[b.status] ?? "bg-ink/10 text-ink/40"}`}>
                    {b.status}
                  </span>
                  {b.meetLink ? (
                    <a
                      href={b.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-sans text-peach-dark underline underline-offset-2 hover:opacity-70 flex-shrink-0"
                    >
                      meet
                    </a>
                  ) : (
                    <span className="text-[10px] font-sans text-ink/20 flex-shrink-0">no link</span>
                  )}
                </div>
              )
            })}
          </div>
        )}
        </div>

      </div>
    </div>
  )
}
