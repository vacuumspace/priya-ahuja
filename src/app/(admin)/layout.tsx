import { redirect } from "next/navigation"
import { auth, isAdmin } from "@/lib/auth"
import { AdminShell } from "@/components/admin/AdminShell"
import { db } from "@/lib/db"
import { bookings, purchases, startupScores, startupIdeaScores, customRequests } from "@/lib/db/schema"
import { eq, count, gte } from "drizzle-orm"

async function getNotificationCounts() {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  const [pendingBookings, recentPurchases, recentFundability, recentIdea, newCustomRequests] =
    await Promise.all([
      db.select({ count: count() }).from(bookings).where(eq(bookings.status, "pending")),
      db.select({ count: count() }).from(purchases).where(gte(purchases.createdAt, sevenDaysAgo)),
      db.select({ count: count() }).from(startupScores).where(gte(startupScores.createdAt, sevenDaysAgo)),
      db.select({ count: count() }).from(startupIdeaScores).where(gte(startupIdeaScores.createdAt, sevenDaysAgo)),
      db.select({ count: count() }).from(customRequests).where(eq(customRequests.status, "new")),
    ])

  return {
    "/admin/bookings": pendingBookings[0].count,
    "/admin/products?tab=transactions": recentPurchases[0].count,
    "/admin/startup-scores": recentFundability[0].count,
    "/admin/idea-scores": recentIdea[0].count,
    "/admin/custom-requests": newCustomRequests[0].count,
  }
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session || !isAdmin(session.user?.email)) {
    redirect("/")
  }

  const notificationCounts = await getNotificationCounts()

  return (
    <AdminShell userEmail={session.user?.email ?? ""} notificationCounts={notificationCounts}>
      {children}
    </AdminShell>
  )
}
