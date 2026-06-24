import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { bookings, purchases, startupScores, startupIdeaScores, customRequests, bookingMessages, users, serviceInquiries } from "@/lib/db/schema"
import { eq, count, and, notInArray, inArray } from "drizzle-orm"

export async function GET() {
  const session = await auth()
  if (!session || !isAdmin(session.user?.email)) {
    return new Response("Forbidden", { status: 403 })
  }

  const [unseenBookings, unseenPurchases, unseenFundability, unseenIdea, newCustomRequests, unreadMessages, unseenUsers, newServiceInquiries] =
    await Promise.all([
      db.select({ count: count() }).from(bookings).where(
        and(notInArray(bookings.status, ["cancelled", "pending"]), eq(bookings.adminSeen, false))
      ),
      db.select({ count: count() }).from(purchases).where(eq(purchases.adminSeen, false)),
      db.select({ count: count() }).from(startupScores).where(eq(startupScores.adminSeen, false)),
      db.select({ count: count() }).from(startupIdeaScores).where(eq(startupIdeaScores.adminSeen, false)),
      db.select({ count: count() }).from(customRequests).where(eq(customRequests.status, "new")),
      db.select({ count: count() }).from(bookingMessages).where(
        and(eq(bookingMessages.isAdmin, false), eq(bookingMessages.adminRead, false))
      ),
      db.select({ count: count() }).from(users).where(eq(users.adminSeen, false)),
      db.select({ count: count() }).from(serviceInquiries).where(eq(serviceInquiries.adminSeen, false)),
    ])

  return Response.json({
    "/admin/bookings": unseenBookings[0].count + unreadMessages[0].count,
    "/admin/products?tab=transactions": unseenPurchases[0].count,
    "/admin/startup-scores": unseenFundability[0].count,
    "/admin/idea-scores": unseenIdea[0].count,
    "/admin/custom-requests": newCustomRequests[0].count,
    "/admin/service-inquiries": newServiceInquiries[0].count,
    "/admin/users": unseenUsers[0].count,
  })
}
