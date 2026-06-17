import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { bookings, purchases, services as servicesTable, digitalProducts, startupScores, startupIdeaScores, availability } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import Link from "next/link"
import { CalendarDays, FileText, LogIn, Lightbulb, ExternalLink, BookOpen } from "lucide-react"
import ViewTemplateButton from "@/components/templates/ViewTemplateButton"
import SignInOptions from "@/components/SignInOptions"
import BookingCard from "./BookingCard"
import { courses } from "@/lib/courses-data"

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
    <span className={`text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full ${s.cls}`}>
      {s.label}
    </span>
  )
}

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  })
}

type SearchParams = Promise<{ tab?: string }>

export default async function MySessionsPage({ searchParams }: { searchParams: SearchParams }) {
  const session = await auth()
  const params = await searchParams
  // TEMP: always show courses tab; restore original tab logic when reverting
  const activeTab = "courses"
  void params
  // Original tab logic (restore when reverting):
  // const activeTab = params.tab === "products" ? "products" : params.tab === "tools" ? "tools" : "sessions"

  if (!session?.user?.email) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <LogIn size={40} className="text-peach-dark mx-auto mb-4" />
          <h1 className="font-heading text-2xl font-800 text-ink mb-2">sign in to view my activity</h1>
          <p className="font-sans text-sm text-ink/60 leading-relaxed mb-6">
            your sessions and purchases are saved to your account. sign in to access them.
          </p>
          <SignInOptions callbackUrl="/my-sessions" />
        </div>
      </div>
    )
  }

  const email = session.user.email

  const [userBookings, userPurchases, userScores, userIdeaScores] = await Promise.all([
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
      .where(eq(purchases.userEmail, email))
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
  ])

  // Courses enrolled by this user
  const enrolledSlugs = new Set(userPurchases.map((p) => p.productSlug).filter(Boolean) as string[])
  const enrolledCourses = courses.filter((c) => enrolledSlugs.has(c.slug))

  return (
    <div className="min-h-screen bg-cream">
      <div className="flex justify-between items-center px-4 md:px-10 py-4 text-[11px] text-ink/50 font-sans border-b border-border">
        <span>my activity</span>
        <span>{userBookings.length + userPurchases.length + userScores.length + userIdeaScores.length} total</span>
      </div>

      <div className="px-4 md:px-10 pt-10 pb-16 max-w-2xl">
        <h1 className="font-heading text-3xl font-800 text-ink mb-6">my activity</h1>

        {/* Overview cards — hidden temporarily with courses mode */}
        {false && (userScores.length > 0 || userIdeaScores.length > 0 || userBookings.length > 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {userScores.length > 0 && (
              <div className="bg-card border border-border rounded-2xl px-5 py-4">
                <p className="font-sans text-[10px] text-ink/40 uppercase tracking-wide mb-1">fundability score</p>
                <div className="flex items-end gap-1.5">
                  <span className="font-heading text-3xl font-800 text-ink">{userScores[0].totalScore}</span>
                  <span className="font-sans text-xs text-ink/30 mb-1">/100</span>
                </div>
                <p className="font-sans text-[11px] text-ink/50 mt-1">{userScores[0].scoreBand ?? "see full breakdown"}</p>
                <Link href={`/my-sessions/score/${userScores[0].id}`} className="text-[11px] font-sans font-semibold text-peach-dark hover:underline mt-2 inline-block">
                  view report →
                </Link>
              </div>
            )}
            {userIdeaScores.length > 0 && (
              <div className="bg-card border border-border rounded-2xl px-5 py-4">
                <p className="font-sans text-[10px] text-ink/40 uppercase tracking-wide mb-1">idea score</p>
                <div className="flex items-end gap-1.5">
                  <span className="font-heading text-3xl font-800 text-ink">{userIdeaScores[0].totalScore}</span>
                  <span className="font-sans text-xs text-ink/30 mb-1">/100</span>
                </div>
                <p className="font-sans text-[11px] text-ink/50 mt-1">{userIdeaScores[0].isPaid ? "full analysis unlocked" : "unlock full breakdown · ₹99"}</p>
                <Link href={`/my-sessions/idea-score/${userIdeaScores[0].id}`} className="text-[11px] font-sans font-semibold text-peach-dark hover:underline mt-2 inline-block">
                  view report →
                </Link>
              </div>
            )}
            {userBookings.filter(b => b.status === "confirmed" || b.status === "paid").length > 0 && (() => {
              const next = userBookings.find(b => b.status === "confirmed" || b.status === "paid")!
              return (
                <div className="bg-card border border-border rounded-2xl px-5 py-4">
                  <p className="font-sans text-[10px] text-ink/40 uppercase tracking-wide mb-1">upcoming session</p>
                  <p className="font-heading text-base font-700 text-ink mt-1">{next.serviceTitle ?? "Session"}</p>
                  <p className="font-sans text-[11px] text-ink/50 mt-1">
                    {next.slotDate ? formatDate(next.slotDate as string) : "date TBD"}
                  </p>
                  <Link href="/my-sessions?tab=sessions" className="text-[11px] font-sans font-semibold text-peach-dark hover:underline mt-2 inline-block">
                    view details →
                  </Link>
                </div>
              )
            })()}
            {/* Suggested next step */}
            {userScores.length > 0 && !userPurchases.some(p => p.productSlug === "angel-investor-list") && userScores[0].totalScore < 60 && (
              <div className="bg-peach/20 border border-peach-dark/15 rounded-2xl px-5 py-4">
                <p className="font-sans text-[10px] text-ink/40 uppercase tracking-wide mb-1">suggested next step</p>
                <p className="font-sans text-sm text-ink/70 mt-1 leading-snug">Your fundability score is under 60 — book a 1-on-1 session to work through the gaps before you pitch.</p>
                <Link href="/connect" className="text-[11px] font-sans font-semibold text-peach-dark hover:underline mt-2 inline-block">
                  book a session →
                </Link>
              </div>
            )}
            {userIdeaScores.length > 0 && !userIdeaScores[0].isPaid && (
              <div className="bg-peach/20 border border-peach-dark/15 rounded-2xl px-5 py-4">
                <p className="font-sans text-[10px] text-ink/40 uppercase tracking-wide mb-1">suggested next step</p>
                <p className="font-sans text-sm text-ink/70 mt-1 leading-snug">Unlock your full idea score breakdown — see which of the 9 segments need work before you build.</p>
                <Link href="/startup/tools/idea-score" className="text-[11px] font-sans font-semibold text-peach-dark hover:underline mt-2 inline-block">
                  unlock for ₹99 →
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Sub-tabs */}
        <div className="flex gap-1 mb-8 border-b border-border">
          {/* TEMP: courses tab shown; original tabs hidden below — restore when reverting */}
          <Link
            href="/my-sessions"
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-sans font-semibold border-b-2 transition-colors -mb-px ${
              activeTab === "courses"
                ? "border-ink text-ink"
                : "border-transparent text-ink/40 hover:text-ink/70"
            }`}
          >
            <BookOpen size={12} />
            courses
            <span className="text-[10px] font-mono ml-0.5 opacity-60">{enrolledCourses.length}</span>
          </Link>
          {/* Original tabs — hidden temporarily
          <Link
            href="/my-sessions?tab=sessions"
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-sans font-semibold border-b-2 transition-colors -mb-px ${
              activeTab === "sessions"
                ? "border-ink text-ink"
                : "border-transparent text-ink/40 hover:text-ink/70"
            }`}
          >
            <CalendarDays size={12} />
            sessions
            <span className="text-[10px] font-mono ml-0.5 opacity-60">{userBookings.length}</span>
          </Link>
          <Link
            href="/my-sessions?tab=products"
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-sans font-semibold border-b-2 transition-colors -mb-px ${
              activeTab === "products"
                ? "border-ink text-ink"
                : "border-transparent text-ink/40 hover:text-ink/70"
            }`}
          >
            <FileText size={12} />
            products
            <span className="text-[10px] font-mono ml-0.5 opacity-60">{userPurchases.length}</span>
          </Link>
          <Link
            href="/my-sessions?tab=tools"
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-sans font-semibold border-b-2 transition-colors -mb-px ${
              activeTab === "tools"
                ? "border-ink text-ink"
                : "border-transparent text-ink/40 hover:text-ink/70"
            }`}
          >
            <Lightbulb size={12} />
            tools
            <span className="text-[10px] font-mono ml-0.5 opacity-60">{userScores.length + userIdeaScores.length}</span>
          </Link>
          */}
        </div>

        {/* Courses tab */}
        {activeTab === "courses" && (
          <section>
            {enrolledCourses.length === 0 ? (
              <div className="border border-dashed border-border rounded-2xl p-8 text-center">
                <p className="font-sans text-sm text-ink/50 mb-3">no courses enrolled yet</p>
                <Link href="/courses" className="text-xs font-sans font-semibold text-peach-dark hover:underline">
                  browse courses
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {enrolledCourses.map((c) => (
                  <div key={c.slug} className="bg-card border border-border rounded-2xl p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                            enrolled
                          </span>
                          <span className="text-[10px] font-sans text-ink/40">{c.tag}</span>
                        </div>
                        <p className="font-heading text-base font-700 text-ink">{c.title}</p>
                        <p className="font-sans text-xs text-ink/50 mt-0.5">{c.duration} · {c.lessons} lessons</p>
                      </div>
                      <Link
                        href="/courses"
                        className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold text-peach-dark hover:underline flex-shrink-0 mt-1"
                      >
                        go to course →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Sessions tab — hidden temporarily */}
        {false && (
          <section>
            {userBookings.length === 0 ? (
              <div className="border border-dashed border-border rounded-2xl p-8 text-center">
                <p className="font-sans text-sm text-ink/50 mb-3">no sessions booked yet</p>
                <Link href="/connect" className="text-xs font-sans font-semibold text-peach-dark hover:underline">
                  browse sessions
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

        {/* Tools tab — hidden temporarily */}
        {false && (
          <section>
            {userScores.length === 0 && userIdeaScores.length === 0 ? (
              <div className="border border-dashed border-border rounded-2xl p-8 text-center">
                <p className="font-sans text-sm text-ink/50 mb-3">no tool results yet</p>
                <div className="flex items-center justify-center gap-4">
                  <Link href="/fundraise/tools/fundability-score" className="text-xs font-sans font-semibold text-peach-dark hover:underline">
                    startup fundability score
                  </Link>
                  <span className="text-ink/20">·</span>
                  <Link href="/startup/tools/idea-score" className="text-xs font-sans font-semibold text-peach-dark hover:underline">
                    startup idea score
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {userScores.map((s) => (
                  <div key={s.id} className="bg-card border border-border rounded-2xl p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {s.isPaid ? (
                            <span className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                              full analysis
                            </span>
                          ) : (
                            <span className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full bg-ink/10 text-ink/40">
                              free score
                            </span>
                          )}
                          <span className="text-[10px] font-sans text-ink/30">{formatDate(s.createdAt)}</span>
                        </div>
                        <p className="font-heading text-base font-700 text-ink normal-case">
                          startup fundability score
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-right flex flex-col items-end gap-2">
                        <div>
                          <span className="font-heading text-2xl font-bold text-ink">{s.totalScore}</span>
                          <span className="font-sans text-[10px] text-ink/30">/100</span>
                        </div>
                        <Link href={`/my-sessions/score/${s.id}`} className="text-[11px] font-sans font-semibold text-peach-dark hover:underline">
                          view report →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
                {userIdeaScores.map((s) => (
                  <div key={s.id} className="bg-card border border-border rounded-2xl p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {s.isPaid ? (
                            <span className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                              full analysis
                            </span>
                          ) : (
                            <span className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full bg-ink/10 text-ink/40">
                              free score
                            </span>
                          )}
                          <span className="text-[10px] font-sans text-ink/30">{formatDate(s.createdAt)}</span>
                        </div>
                        <p className="font-heading text-base font-700 text-ink normal-case">
                          startup idea score
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-right flex flex-col items-end gap-2">
                        <div>
                          <span className="font-heading text-2xl font-bold text-ink">{s.totalScore}</span>
                          <span className="font-sans text-[10px] text-ink/30">/100</span>
                        </div>
                        <Link href={`/my-sessions/idea-score/${s.id}`} className="text-[11px] font-sans font-semibold text-peach-dark hover:underline">
                          view report →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Products tab — hidden temporarily */}
        {false && (
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
                          <span className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full bg-mint/20 text-green-700">
                            {p.productTag ?? "template"}
                          </span>
                          <span className="text-[10px] font-sans text-ink/30">{formatDate(p.createdAt)}</span>
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
      </div>
    </div>
  )
}
