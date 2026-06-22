import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth, isAdmin } from "@/lib/auth"
import { AdminShell } from "@/components/admin/AdminShell"
import { db } from "@/lib/db"
import { bookings, purchases, startupScores, startupIdeaScores, customRequests } from "@/lib/db/schema"
import { eq, count, gte, and, notInArray } from "drizzle-orm"

async function getNotificationCounts() {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const headersList = await headers()
  const pathname = headersList.get("x-pathname") ?? headersList.get("x-invoke-path") ?? ""

  // Mark bookings as seen before counting if admin is on the bookings page
  if (pathname.includes("/admin/bookings")) {
    await db
      .update(bookings)
      .set({ adminSeen: true })
      .where(and(eq(bookings.adminSeen, false), notInArray(bookings.status, ["cancelled", "pending"])))
  }

  const [pendingBookings, recentPurchases, recentFundability, recentIdea, newCustomRequests] =
    await Promise.all([
      db.select({ count: count() }).from(bookings).where(
        and(
          notInArray(bookings.status, ["cancelled", "pending"]),
          eq(bookings.adminSeen, false),
        )
      ),
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
