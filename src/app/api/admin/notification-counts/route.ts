import { auth, isAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { bookings, purchases, digitalProducts, startupScores, startupIdeaScores, pitchDeckAnalyses, customRequests, bookingMessages, users, serviceInquiries, startupMistakes, priyaGptTimeTransactions } from "@/lib/db/schema"
import { eq, count, and, notInArray, inArray } from "drizzle-orm"
import { INVESTOR_SLUGS } from "@/app/api/admin/investor-list/route"

export async function GET() {
  const session = await auth()
  if (!session || !isAdmin(session.user?.email)) {
    return new Response("Forbidden", { status: 403 })
  }

  const [unseenBookings, unseenTemplatePurchases, unseenInvestorListPurchases, unseenFundability, unseenIdea, unseenPitchDecks, newCustomRequests, unreadMessages, unseenUsers, newServiceInquiries, pendingMistakes, unseenPriyaGptPayments] =
    await Promise.all([
      db.select({ count: count() }).from(bookings).where(
        and(notInArray(bookings.status, ["cancelled", "pending"]), eq(bookings.adminSeen, false))
      ),
      db.select({ count: count() }).from(purchases)
        .innerJoin(digitalProducts, eq(purchases.productId, digitalProducts.id))
        .where(and(eq(purchases.adminSeen, false), notInArray(digitalProducts.slug, [...INVESTOR_SLUGS]))),
      db.select({ count: count() }).from(purchases)
        .innerJoin(digitalProducts, eq(purchases.productId, digitalProducts.id))
        .where(and(eq(purchases.adminSeen, false), inArray(digitalProducts.slug, [...INVESTOR_SLUGS]))),
      db.select({ count: count() }).from(startupScores).where(eq(startupScores.adminSeen, false)),
      db.select({ count: count() }).from(startupIdeaScores).where(eq(startupIdeaScores.adminSeen, false)),
      db.select({ count: count() }).from(pitchDeckAnalyses).where(eq(pitchDeckAnalyses.adminSeen, false)),
      db.select({ count: count() }).from(customRequests).where(eq(customRequests.status, "new")),
      db.select({ count: count() }).from(bookingMessages).where(
        and(eq(bookingMessages.isAdmin, false), eq(bookingMessages.adminRead, false))
      ),
      db.select({ count: count() }).from(users).where(eq(users.adminSeen, false)),
      db.select({ count: count() }).from(serviceInquiries).where(eq(serviceInquiries.adminSeen, false)),
      db.select({ count: count() }).from(startupMistakes).where(eq(startupMistakes.status, "pending")),
      db.select({ count: count() }).from(priyaGptTimeTransactions).where(
        and(eq(priyaGptTimeTransactions.reason, "purchase"), eq(priyaGptTimeTransactions.adminSeen, false))
      ),
    ])

  return Response.json({
    "/admin/bookings": unseenBookings[0].count + unreadMessages[0].count,
    "/admin/products?tab=transactions": unseenTemplatePurchases[0].count,
    "/admin/investor-list": unseenInvestorListPurchases[0].count,
    "/admin/startup-scores": unseenFundability[0].count,
    "/admin/idea-scores": unseenIdea[0].count,
    "/admin/pitch-decks": unseenPitchDecks[0].count,
    "/admin/custom-requests": newCustomRequests[0].count,
    "/admin/service-inquiries": newServiceInquiries[0].count,
    "/admin/users": unseenUsers[0].count,
    "/admin/startup-mistakes": pendingMistakes[0].count,
    "/admin/priya-gpt-payments": unseenPriyaGptPayments[0].count,
  })
}
