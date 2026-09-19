import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { bookings, purchases, services as servicesTable, digitalProducts, startupScores, startupIdeaScores, pitchDeckAnalyses, availability, priyaGptTimeTransactions, workshopRegistrations, workshops, courseEnrollments, courseGifts } from "@/lib/db/schema"
import { eq, and, desc, isNotNull, inArray } from "drizzle-orm"
import Link from "next/link"
import { CalendarDays, FileText, LogIn, Lightbulb, ExternalLink, Bot, GraduationCap } from "lucide-react"
import { formatWorkshopTimeRange } from "@/lib/workshop-time"
import { getCourse } from "@/lib/courses-data"
import { balanceDuePaise } from "@/lib/course-enrollment"
import { cardVersion } from "@/lib/gift-card"
import { giftUrl } from "@/lib/course-gift"
import { GiftManager, type GiftItem } from "./GiftManager"
import ViewTemplateButton from "@/components/templates/ViewTemplateButton"
import SignInOptions from "@/components/SignInOptions"
import BookingCard from "./BookingCard"

function statusBadge(status: string) {
  const map: Record<string, { label: string; cls: string }> = {
    confirmed: { label: "confirmed", cls: "bg-green-100 text-green-700" },
    paid:      { label: "paid",      cls: "bg-green-100 text-green-700" },
    completed: { label: "completed", cls: "bg-ink/10 text-ink/60" },
    pending:   { label: "pending",   cls: "bg-amber-100 text-amber-700" },
    cancelled: { label: "cancelled", cls: "bg-red-100 text-red-500" },
  }
  const s = map[status] ?? { label: status, cls: "bg-ink/10 text-ink/50" }
  return (
    <span className={`text-[12px] font-sans font-semibold px-2 py-0.5 rounded-full ${s.cls}`}>
      {s.label}
    </span>
  )
}

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  })
}

type SearchParams = Promise<{ tab?: string; sub?: string }>

export default async function MySessionsPage({ searchParams }: { searchParams: SearchParams }) {
  const session = await auth()
  const params = await searchParams
  const activeTab =
    params.tab === "products" ? "products" :
    params.tab === "tools" ? "tools" :
    params.tab === "priyagpt" ? "priyagpt" :
    params.tab === "workshops" ? "workshops" :
    params.tab === "courses" ? "courses" :
    "sessions"
  const activeToolSub =
    params.sub === "idea" ? "idea" :
    params.sub === "pitchdeck" ? "pitchdeck" :
    "fundability"

  if (!session?.user?.email) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <LogIn size={40} className="text-peach-dark mx-auto mb-4" />
          <h1 className="font-heading text-2xl font-800 text-ink mb-2">sign in to view my activity</h1>
          <p className="font-sans text-sm text-ink/60 leading-relaxed mb-6">
            your sessions and purchases are saved to your account. sign in to access them.
          </p>
          <SignInOptions callbackUrl="/my-activity" />
        </div>
      </div>
    )
  }

  const email = session.user.email

  const [userBookingsRaw, userPurchases, userScores, userIdeaScores, userPitchDecks, userPriyaGptTxns, userWorkshopRegistrations, userCourses, userGiftsBought, userGiftsReceived] = await Promise.all([
    db
      .select({
        id: bookings.id,
        status: bookings.status,
        createdAt: bookings.createdAt,
        meetLink: bookings.meetLink,
        serviceTitle: servicesTable.title,
        serviceSlug: servicesTable.slug,
        serviceType: servicesTable.type,
        slotDate: availability.date,
        slotStartTime: availability.startTime,
        slotEndTime: availability.endTime,
        feedbackRating: bookings.feedbackRating,
      })
      .from(bookings)
      .leftJoin(servicesTable, eq(bookings.serviceId, servicesTable.id))
      .leftJoin(availability, eq(bookings.slotId, availability.id))
      .where(eq(bookings.userEmail, email))
      .orderBy(desc(bookings.createdAt)),

    db
      .select({
        id: purchases.id,
        createdAt: purchases.createdAt,
        productTitle: digitalProducts.title,
        productSlug: digitalProducts.slug,
        productTag: digitalProducts.tag,
        downloadToken: purchases.downloadToken,
      })
      .from(purchases)
      .leftJoin(digitalProducts, eq(purchases.productId, digitalProducts.id))
      .where(and(eq(purchases.userEmail, email), isNotNull(purchases.razorpayPaymentId)))
      .orderBy(desc(purchases.createdAt)),

    db
      .select({
        id: startupScores.id,
        totalScore: startupScores.totalScore,
        scoreBand: startupScores.scoreBand,
        isPaid: startupScores.isPaid,
        createdAt: startupScores.createdAt,
      })
      .from(startupScores)
      .where(eq(startupScores.userId, session.user.id!))
      .orderBy(desc(startupScores.createdAt)),

    db
      .select({
        id: startupIdeaScores.id,
        totalScore: startupIdeaScores.totalScore,
        isPaid: startupIdeaScores.isPaid,
        createdAt: startupIdeaScores.createdAt,
      })
      .from(startupIdeaScores)
      .where(eq(startupIdeaScores.userId, session.user.id!))
      .orderBy(desc(startupIdeaScores.createdAt)),

    db
      .select({
        id: pitchDeckAnalyses.id,
        fileName: pitchDeckAnalyses.fileName,
        totalScore: pitchDeckAnalyses.totalScore,
        isPaid: pitchDeckAnalyses.isPaid,
        createdAt: pitchDeckAnalyses.createdAt,
      })
      .from(pitchDeckAnalyses)
      .where(eq(pitchDeckAnalyses.userId, session.user.id!))
      .orderBy(desc(pitchDeckAnalyses.createdAt)),

    db
      .select({
        id: priyaGptTimeTransactions.id,
        deltaMinutes: priyaGptTimeTransactions.deltaMinutes,
        amountPaise: priyaGptTimeTransactions.amountPaise,
        razorpayPaymentId: priyaGptTimeTransactions.razorpayPaymentId,
        createdAt: priyaGptTimeTransactions.createdAt,
      })
      .from(priyaGptTimeTransactions)
      .where(and(eq(priyaGptTimeTransactions.userId, session.user.id!), eq(priyaGptTimeTransactions.reason, "purchase")))
      .orderBy(desc(priyaGptTimeTransactions.createdAt)),

    db
      .select({
        id: workshopRegistrations.id,
        status: workshopRegistrations.status,
        amountPaid: workshopRegistrations.amountPaid,
        calendarInviteSent: workshopRegistrations.calendarInviteSent,
        createdAt: workshopRegistrations.createdAt,
        workshopTitle: workshops.title,
        workshopDate: workshops.date,
        workshopStartTime: workshops.startTime,
        workshopEndTime: workshops.endTime,
        workshopMeetLink: workshops.meetLink,
      })
      .from(workshopRegistrations)
      .leftJoin(workshops, eq(workshopRegistrations.workshopId, workshops.id))
      .where(and(eq(workshopRegistrations.userId, session.user.id!), eq(workshopRegistrations.status, "confirmed")))
      .orderBy(desc(workshopRegistrations.createdAt)),

    db
      .select()
      .from(courseEnrollments)
      .where(and(eq(courseEnrollments.userId, session.user.id!), inArray(courseEnrollments.status, ["preregistered", "paid"])))
      .orderBy(desc(courseEnrollments.createdAt)),

    db
      .select()
      .from(courseGifts)
      .where(and(eq(courseGifts.purchaserId, session.user.id!), inArray(courseGifts.status, ["paid", "redeemed"])))
      .orderBy(desc(courseGifts.createdAt)),

    db
      .select({ enrollmentId: courseGifts.enrollmentId, purchaserName: courseGifts.purchaserName })
      .from(courseGifts)
      .where(and(eq(courseGifts.redeemedById, session.user.id!), eq(courseGifts.status, "redeemed"))),
  ])

  // enrolment id -> who gifted it, for the "gifted by" label on courses I received
  const giftedBy = new Map(userGiftsReceived.filter((g) => g.enrollmentId).map((g) => [g.enrollmentId as string, g.purchaserName]))
  const giftItems: GiftItem[] = userGiftsBought.map((g) => ({
    id: g.id,
    courseTitle: getCourse(g.courseSlug)?.title ?? "Course",
    status: g.status === "redeemed" ? "redeemed" : "paid",
    recipientName: g.recipientName ?? "",
    message: g.message ?? "",
    fromName: g.purchaserName,
    link: giftUrl(g.token),
    cardBase: `/api/courses/gift/card/${g.token}`,
    version: cardVersion(g),
    createdAt: formatDate(g.createdAt),
    redeemedByEmail: g.redeemedByEmail,
    redeemedAt: g.redeemedAt ? formatDate(g.redeemedAt) : null,
  }))

  // Sort bookings: upcoming (active + future slot) first ASC by slot, then past DESC by slot
  const now = new Date()
  const userBookings = [...userBookingsRaw].sort((a, b) => {
    const aActive = a.status === "confirmed" || a.status === "paid"
    const bActive = b.status === "confirmed" || b.status === "paid"
    const aSlot = a.slotDate ? new Date(`${a.slotDate}T${a.slotStartTime ?? "00:00"}:00+05:30`) : null
    const bSlot = b.slotDate ? new Date(`${b.slotDate}T${b.slotStartTime ?? "00:00"}:00+05:30`) : null
    const aUpcoming = aActive && aSlot && aSlot > now
    const bUpcoming = bActive && bSlot && bSlot > now
    if (aUpcoming && !bUpcoming) return -1
    if (!aUpcoming && bUpcoming) return 1
    if (aUpcoming && bUpcoming) return (aSlot!.getTime() - bSlot!.getTime()) // ASC for upcoming
    // both past - sort DESC
    if (aSlot && bSlot) return bSlot.getTime() - aSlot.getTime()
    return 0
  })

  return (
    <div className="min-h-screen bg-cream">
      <div className="flex justify-between items-center px-4 md:px-10 py-4 text-[13px] text-ink/50 font-sans border-b border-border">
        <span>my activity</span>
        <span>{userBookings.length + userPurchases.length + userScores.length + userIdeaScores.length + userPitchDecks.length + userPriyaGptTxns.length + userWorkshopRegistrations.length + userCourses.length + giftItems.length} total</span>
      </div>

      <div className="px-4 md:px-10 pt-10 pb-16 max-w-2xl">
        <h1 className="font-heading text-3xl font-800 text-ink mb-6">my activity</h1>

        {/* Sub-tabs */}
        <div className="flex flex-wrap gap-1 mb-8 border-b border-border">
          <Link
            href="/my-activity?tab=sessions"
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-sans font-semibold border-b-2 transition-colors -mb-px ${
              activeTab === "sessions"
                ? "border-ink text-ink"
                : "border-transparent text-ink/40 hover:text-ink/70"
            }`}
          >
            <CalendarDays size={12} />
            sessions
            <span className="text-[12px] font-mono ml-0.5 opacity-60">{userBookings.length}</span>
          </Link>
          <Link
            href="/my-activity?tab=products"
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-sans font-semibold border-b-2 transition-colors -mb-px ${
              activeTab === "products"
                ? "border-ink text-ink"
                : "border-transparent text-ink/40 hover:text-ink/70"
            }`}
          >
            <FileText size={12} />
            products
            <span className="text-[12px] font-mono ml-0.5 opacity-60">{userPurchases.length}</span>
          </Link>
          <Link
            href="/my-activity?tab=tools"
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-sans font-semibold border-b-2 transition-colors -mb-px ${
              activeTab === "tools"
                ? "border-ink text-ink"
                : "border-transparent text-ink/40 hover:text-ink/70"
            }`}
          >
            <Lightbulb size={12} />
            tools
            <span className="text-[12px] font-mono ml-0.5 opacity-60">{userScores.length + userIdeaScores.length + userPitchDecks.length}</span>
          </Link>
          <Link
            href="/my-activity?tab=priyagpt"
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-sans font-semibold border-b-2 transition-colors -mb-px ${
              activeTab === "priyagpt"
                ? "border-ink text-ink"
                : "border-transparent text-ink/40 hover:text-ink/70"
            }`}
          >
            <Bot size={12} />
            priyagpt
            <span className="text-[12px] font-mono ml-0.5 opacity-60">{userPriyaGptTxns.length}</span>
          </Link>
          <Link
            href="/my-activity?tab=workshops"
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-sans font-semibold border-b-2 transition-colors -mb-px ${
              activeTab === "workshops"
                ? "border-ink text-ink"
                : "border-transparent text-ink/40 hover:text-ink/70"
            }`}
          >
            <GraduationCap size={12} />
            workshops
            <span className="text-[12px] font-mono ml-0.5 opacity-60">{userWorkshopRegistrations.length}</span>
          </Link>
          <Link
            href="/my-activity?tab=courses"
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-sans font-semibold border-b-2 transition-colors -mb-px ${
              activeTab === "courses"
                ? "border-ink text-ink"
                : "border-transparent text-ink/40 hover:text-ink/70"
            }`}
          >
            <GraduationCap size={12} />
            courses
            <span className="text-[12px] font-mono ml-0.5 opacity-60">{userCourses.length + giftItems.length}</span>
          </Link>
        </div>

        {/* Sessions tab */}
        {activeTab === "sessions" && (
          <section>
            {userBookings.length === 0 ? (
              <div className="border border-dashed border-border rounded-2xl p-10 text-center">
                <CalendarDays size={32} className="text-peach-dark/40 mx-auto mb-3" />
                <p className="font-heading text-base font-700 text-ink mb-1">no sessions yet</p>
                <p className="font-sans text-sm text-ink/50 mb-5 leading-relaxed">
                  book a 1:1 session with Priya - strategy, pitch review, or fundraise readiness.
                </p>
                <Link
                  href="/connect"
                  className="inline-flex items-center gap-2 text-xs font-sans font-semibold text-cream bg-ink px-5 py-2.5 rounded-xl hover:bg-ink/80 transition-colors"
                >
                  browse sessions →
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {userBookings.map((b) => (
                  <BookingCard
                    key={b.id}
                    bookingId={b.id}
                    status={b.status}
                    serviceTitle={b.serviceTitle ?? "Session"}
                    serviceSlug={b.serviceSlug ?? null}
                    serviceType={b.serviceType ?? "call"}
                    meetLink={b.meetLink}
                    slotDate={b.slotDate}
                    slotStartTime={b.slotStartTime}
                    slotEndTime={b.slotEndTime}
                    feedbackRating={b.feedbackRating}
                    createdAt={b.createdAt.toISOString()}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Tools tab */}
        {activeTab === "tools" && (
          <section>
            {/* Tools sub-tabs */}
            <div className="flex flex-wrap gap-1 mb-6">
              <Link
                href="/my-activity?tab=tools&sub=fundability"
                className={`px-3 py-1.5 rounded-full text-[12px] font-sans font-semibold transition-colors ${
                  activeToolSub === "fundability" ? "bg-ink text-cream" : "bg-ink/5 text-ink/50 hover:bg-ink/10"
                }`}
              >
                fundability <span className="opacity-60">{userScores.length}</span>
              </Link>
              <Link
                href="/my-activity?tab=tools&sub=idea"
                className={`px-3 py-1.5 rounded-full text-[12px] font-sans font-semibold transition-colors ${
                  activeToolSub === "idea" ? "bg-ink text-cream" : "bg-ink/5 text-ink/50 hover:bg-ink/10"
                }`}
              >
                idea score <span className="opacity-60">{userIdeaScores.length}</span>
              </Link>
              <Link
                href="/my-activity?tab=tools&sub=pitchdeck"
                className={`px-3 py-1.5 rounded-full text-[12px] font-sans font-semibold transition-colors ${
                  activeToolSub === "pitchdeck" ? "bg-ink text-cream" : "bg-ink/5 text-ink/50 hover:bg-ink/10"
                }`}
              >
                pitch deck <span className="opacity-60">{userPitchDecks.length}</span>
              </Link>
            </div>

            {activeToolSub === "fundability" && (
              userScores.length === 0 ? (
                <div className="border border-dashed border-border rounded-2xl p-8 text-center">
                  <p className="font-sans text-sm text-ink/50 mb-3">no fundability score results yet</p>
                  <Link href="/fundraise/tools/fundability-score" className="text-xs font-sans font-semibold text-peach-dark hover:underline">
                    take the startup fundability score
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {userScores.map((s) => (
                    <div key={s.id} className="bg-card border border-border rounded-2xl p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {s.isPaid ? (
                              <span className="text-[12px] font-sans font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                                full analysis
                              </span>
                            ) : (
                              <span className="text-[12px] font-sans font-semibold px-2 py-0.5 rounded-full bg-ink/10 text-ink/40">
                                free score
                              </span>
                            )}
                            <span className="text-[12px] font-sans text-ink/30">{formatDate(s.createdAt)}</span>
                          </div>
                          <p className="font-heading text-base font-700 text-ink normal-case">
                            startup fundability score
                          </p>
                        </div>
                        <div className="flex-shrink-0 text-right flex flex-col items-end gap-2">
                          <div>
                            <span className="font-heading text-2xl font-bold text-ink">{s.totalScore}</span>
                            <span className="font-sans text-[12px] text-ink/30">/100</span>
                          </div>
                          <Link href={`/my-activity/score/${s.id}`} className="text-[13px] font-sans font-semibold text-peach-dark hover:underline">
                            view report →
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {activeToolSub === "idea" && (
              userIdeaScores.length === 0 ? (
                <div className="border border-dashed border-border rounded-2xl p-8 text-center">
                  <p className="font-sans text-sm text-ink/50 mb-3">no idea score results yet</p>
                  <Link href="/startup/tools/idea-score" className="text-xs font-sans font-semibold text-peach-dark hover:underline">
                    take the startup idea score
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {userIdeaScores.map((s) => (
                    <div key={s.id} className="bg-card border border-border rounded-2xl p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {s.isPaid ? (
                              <span className="text-[12px] font-sans font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                                full analysis
                              </span>
                            ) : (
                              <span className="text-[12px] font-sans font-semibold px-2 py-0.5 rounded-full bg-ink/10 text-ink/40">
                                free score
                              </span>
                            )}
                            <span className="text-[12px] font-sans text-ink/30">{formatDate(s.createdAt)}</span>
                          </div>
                          <p className="font-heading text-base font-700 text-ink normal-case">
                            startup idea score
                          </p>
                        </div>
                        <div className="flex-shrink-0 text-right flex flex-col items-end gap-2">
                          <div>
                            <span className="font-heading text-2xl font-bold text-ink">{s.totalScore}</span>
                            <span className="font-sans text-[12px] text-ink/30">/100</span>
                          </div>
                          <Link href={`/my-activity/idea-score/${s.id}`} className="text-[13px] font-sans font-semibold text-peach-dark hover:underline">
                            view report →
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {activeToolSub === "pitchdeck" && (
              userPitchDecks.length === 0 ? (
                <div className="border border-dashed border-border rounded-2xl p-8 text-center">
                  <p className="font-sans text-sm text-ink/50 mb-3">no pitch deck analyses yet</p>
                  <Link href="/fundraise/tools/pitch-deck-analyser" className="text-xs font-sans font-semibold text-peach-dark hover:underline">
                    analyse your pitch deck
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {userPitchDecks.map((s) => (
                    <div key={s.id} className="bg-card border border-border rounded-2xl p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[12px] font-sans font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                              full report
                            </span>
                            <span className="text-[12px] font-sans text-ink/30">{formatDate(s.createdAt)}</span>
                          </div>
                          <p className="font-heading text-base font-700 text-ink normal-case">
                            pitch deck analysis
                          </p>
                          <p className="font-sans text-[12px] text-ink/40 truncate">{s.fileName}</p>
                        </div>
                        <div className="flex-shrink-0 text-right flex flex-col items-end gap-2">
                          <div>
                            <span className="font-heading text-2xl font-bold text-ink">{s.totalScore}</span>
                            <span className="font-sans text-[12px] text-ink/30">/100</span>
                          </div>
                          <Link href={`/my-activity/pitch-deck/${s.id}`} className="text-[13px] font-sans font-semibold text-peach-dark hover:underline">
                            view report →
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </section>
        )}

        {/* Products tab */}
        {activeTab === "products" && (
          <section>
            {userPurchases.length === 0 ? (
              <div className="border border-dashed border-border rounded-2xl p-8 text-center">
                <p className="font-sans text-sm text-ink/50 mb-3">no products purchased yet</p>
                <div className="flex gap-4 justify-center">
                  <Link href="/startup/templates" className="text-xs font-sans font-semibold text-peach-dark hover:underline">
                    startup templates
                  </Link>
                  <Link href="/fundraise/templates" className="text-xs font-sans font-semibold text-peach-dark hover:underline">
                    fundraise templates
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {userPurchases.map((p) => (
                  <div key={p.id} className="bg-card border border-border rounded-2xl p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[12px] font-sans font-semibold px-2 py-0.5 rounded-full bg-mint/20 text-green-700">
                            {p.productTag ?? "template"}
                          </span>
                          <span className="text-[12px] font-sans text-ink/30">{formatDate(p.createdAt)}</span>
                        </div>
                        <p className="font-heading text-base font-700 text-ink normal-case">
                          {p.productTitle ?? "Template"}
                        </p>
                      </div>
                      {p.downloadToken && p.productSlug && (
                        p.productSlug === "angel-investor-list" ? (
                          <Link
                            href="/fundraise/angel-investors"
                            className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold text-peach-dark hover:underline flex-shrink-0 mt-1"
                          >
                            <ExternalLink size={11} />
                            view
                          </Link>
                        ) : p.productSlug === "startup-ideas-2026" ? (
                          <Link
                            href="/startup/ideas"
                            className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold text-peach-dark hover:underline flex-shrink-0 mt-1"
                          >
                            <ExternalLink size={11} />
                            view
                          </Link>
                        ) : (
                          <ViewTemplateButton
                            slug={p.productSlug}
                            title={p.productTitle ?? "Template"}
                            token={p.downloadToken}
                          />
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* PriyaGPT tab */}
        {activeTab === "priyagpt" && (
          <section>
            {userPriyaGptTxns.length === 0 ? (
              <div className="border border-dashed border-border rounded-2xl p-8 text-center">
                <p className="font-sans text-sm text-ink/50 mb-3">no PriyaGPT time purchased yet</p>
                <Link href="/priya-gpt" className="text-xs font-sans font-semibold text-peach-dark hover:underline">
                  try PriyaGPT →
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {userPriyaGptTxns.map((t) => (
                  <div key={t.id} className="bg-card border border-border rounded-2xl p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[12px] font-sans font-semibold px-2 py-0.5 rounded-full bg-[#A85D3A]/20 text-[#A85D3A]">
                            PriyaGPT
                          </span>
                          <span className="text-[12px] font-sans text-ink/30">{formatDate(t.createdAt)}</span>
                        </div>
                        <p className="font-heading text-base font-700 text-ink normal-case">
                          {t.deltaMinutes} minutes of chat time
                        </p>
                        {t.razorpayPaymentId && (
                          <p className="font-sans text-[11px] text-ink/30 mt-0.5">{t.razorpayPaymentId}</p>
                        )}
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <span className="font-heading text-xl font-bold text-ink">
                          {t.amountPaise != null ? `₹${(t.amountPaise / 100).toLocaleString("en-IN")}` : " - "}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Courses tab */}
        {activeTab === "courses" && (
          <section>
            {userCourses.length === 0 && giftItems.length === 0 ? (
              <div className="border border-dashed border-border rounded-2xl p-8 text-center">
                <p className="font-sans text-sm text-ink/50 mb-3">no courses yet</p>
                <Link href="/school/courses" className="text-xs font-sans font-semibold text-peach-dark hover:underline">
                  browse courses →
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {userCourses.map((c) => {
                  const course = getCourse(c.courseSlug)
                  const paidPaise = (c.preRegAmountPaid ?? 0) + (c.balanceAmountPaid ?? 0)
                  const isPaid = c.status === "paid"
                  return (
                    <div key={c.id} className="bg-card border border-border rounded-2xl p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[12px] font-sans font-semibold px-2 py-0.5 rounded-full ${isPaid ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                              {isPaid ? "enrolled" : "pre-registered"}
                            </span>
                            <span className="text-[12px] font-sans text-ink/30">{formatDate(c.createdAt)}</span>
                          </div>
                          <p className="font-heading text-base font-700 text-ink normal-case">{course?.title ?? "Course"}</p>
                          {giftedBy.has(c.id) && (
                            <p className="font-sans text-[13px] text-ink/50 mt-1">gifted by {giftedBy.get(c.id)}</p>
                          )}
                          {!isPaid && course && (
                            <p className="font-sans text-[13px] text-ink/50 mt-1">
                              balance ₹{(balanceDuePaise(c) / 100).toLocaleString("en-IN")} due when the course launches on {course.launchLabel}
                            </p>
                          )}
                          <div className="flex flex-col gap-1 mt-2">
                            {isPaid && (
                              <Link href="/fundraise/tools/fundability-score" className="text-[12px] font-sans font-semibold text-peach-dark hover:underline">
                                free startup score unlocked →
                              </Link>
                            )}
                            {isPaid && c.giftCode && (
                              <Link href="/connect/startup-idea-brainstorming" className="text-[12px] font-sans font-semibold text-peach-dark hover:underline">
                                book your free 1:1 brainstorm →
                              </Link>
                            )}
                            {course && (
                              <Link href={`/school/courses/${course.slug}`} className="text-[12px] font-sans text-ink/40 hover:text-ink hover:underline">
                                course page
                              </Link>
                            )}
                          </div>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <span className="font-heading text-lg font-bold text-ink">
                            {paidPaise > 0 ? `₹${(paidPaise / 100).toLocaleString("en-IN")}` : " - "}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {giftItems.length > 0 && (
                  <>
                    <p className="text-[12px] font-sans text-ink/30 uppercase tracking-[0.18em] mt-4 mb-1">gifts you&apos;ve bought</p>
                    {giftItems.map((g) => (
                      <GiftManager key={g.id} gift={g} />
                    ))}
                  </>
                )}
              </div>
            )}
          </section>
        )}

        {/* Workshops tab */}
        {activeTab === "workshops" && (
          <section>
            {userWorkshopRegistrations.length === 0 ? (
              <div className="border border-dashed border-border rounded-2xl p-8 text-center">
                <p className="font-sans text-sm text-ink/50 mb-3">no workshop registrations yet</p>
                <Link href="/school/workshops" className="text-xs font-sans font-semibold text-peach-dark hover:underline">
                  browse workshops →
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {userWorkshopRegistrations.map((w) => (
                  <div key={w.id} className="bg-card border border-border rounded-2xl p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[12px] font-sans font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                            confirmed
                          </span>
                          <span className="text-[12px] font-sans text-ink/30">{formatDate(w.createdAt)}</span>
                        </div>
                        <p className="font-heading text-base font-700 text-ink normal-case">
                          {w.workshopTitle ?? "Workshop"}
                        </p>
                        {w.workshopDate && (
                          <p className="font-sans text-[13px] text-ink/50 mt-1">
                            {new Date(`${w.workshopDate}T00:00:00+05:30`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" })}
                            {" · "}{w.workshopStartTime && w.workshopEndTime ? formatWorkshopTimeRange(w.workshopStartTime, w.workshopEndTime) : ""} IST
                          </p>
                        )}
                        <p className="font-sans text-[12px] text-ink/40 mt-1">
                          {w.calendarInviteSent ? "calendar invite sent to your email" : "calendar invite on its way"}
                        </p>
                        {w.calendarInviteSent && w.workshopMeetLink && (
                          <a
                            href={w.workshopMeetLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[12px] font-sans font-semibold text-peach-dark hover:underline mt-1 inline-block"
                          >
                            join on google meet →
                          </a>
                        )}
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <span className="font-heading text-lg font-bold text-ink">
                          {w.amountPaid != null ? `₹${(w.amountPaid / 100).toLocaleString("en-IN")}` : " - "}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  )
}
