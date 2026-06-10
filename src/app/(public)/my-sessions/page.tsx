import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { bookings, purchases, services as servicesTable, digitalProducts, startupScores } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import Link from "next/link"
import { CalendarDays, FileText, ExternalLink, LogIn, Lightbulb } from "lucide-react"
import ViewTemplateButton from "@/components/templates/ViewTemplateButton"

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
  const activeTab = params.tab === "templates" ? "templates" : params.tab === "tools" ? "tools" : "sessions"

  if (!session?.user?.email) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <LogIn size={40} className="text-peach-dark mx-auto mb-4" />
          <h1 className="font-heading text-2xl font-800 text-ink mb-2">sign in to view history</h1>
          <p className="font-sans text-sm text-ink/60 leading-relaxed mb-6">
            your sessions and purchases are saved to your account. sign in to access them.
          </p>
          <form method="POST" action="/api/auth/signin/google">
            <input type="hidden" name="callbackUrl" value="/my-sessions" />
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-ink text-cream font-sans font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-ink/80 transition-colors"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              continue with google
            </button>
          </form>
        </div>
      </div>
    )
  }

  const email = session.user.email

  const [userBookings, userPurchases, userScores] = await Promise.all([
    db
      .select({
        id: bookings.id,
        status: bookings.status,
        createdAt: bookings.createdAt,
        meetLink: bookings.meetLink,
        serviceTitle: servicesTable.title,
        serviceSlug: servicesTable.slug,
        serviceType: servicesTable.type,
      })
      .from(bookings)
      .leftJoin(servicesTable, eq(bookings.serviceId, servicesTable.id))
      .where(eq(bookings.userEmail, email))
      .orderBy(desc(bookings.createdAt)),

    db
      .select({
        id: purchases.id,
        createdAt: purchases.createdAt,
        productTitle: digitalProducts.title,
        productSlug: digitalProducts.slug,
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
  ])

  return (
    <div className="min-h-screen bg-cream">
      <div className="flex justify-between items-center px-4 md:px-10 py-4 text-[11px] text-ink/50 font-sans border-b border-border">
        <span>my activity</span>
        <span>{userBookings.length + userPurchases.length + userScores.length} total</span>
      </div>

      <div className="px-4 md:px-10 pt-10 pb-16 max-w-2xl">
        <h1 className="font-heading text-3xl font-800 text-ink mb-6">history</h1>

        {/* Sub-tabs */}
        <div className="flex gap-1 mb-8 border-b border-border">
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
            href="/my-sessions?tab=templates"
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-sans font-semibold border-b-2 transition-colors -mb-px ${
              activeTab === "templates"
                ? "border-ink text-ink"
                : "border-transparent text-ink/40 hover:text-ink/70"
            }`}
          >
            <FileText size={12} />
            templates
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
            <span className="text-[10px] font-mono ml-0.5 opacity-60">{userScores.length}</span>
          </Link>
        </div>

        {/* Sessions tab */}
        {activeTab === "sessions" && (
          <section>
            {userBookings.length === 0 ? (
              <div className="border border-dashed border-border rounded-2xl p-8 text-center">
                <p className="font-sans text-sm text-ink/50 mb-3">no sessions booked yet</p>
                <Link href="/connect" className="text-xs font-sans font-semibold text-peach-dark hover:underline">
                  browse sessions →
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {userBookings.map((b) => (
                  <div key={b.id} className="bg-card border border-border rounded-2xl p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {statusBadge(b.status)}
                          <span className="text-[10px] font-sans text-ink/30">{formatDate(b.createdAt)}</span>
                        </div>
                        <p className="font-heading text-base font-700 text-ink normal-case">
                          {b.serviceTitle ?? "Session"}
                        </p>
                      </div>
                      {b.meetLink && (
                        <a
                          href={b.meetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs font-sans font-semibold text-peach-dark hover:underline flex-shrink-0 mt-1"
                        >
                          join call <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Tools tab */}
        {activeTab === "tools" && (
          <section>
            {userScores.length === 0 ? (
              <div className="border border-dashed border-border rounded-2xl p-8 text-center">
                <p className="font-sans text-sm text-ink/50 mb-3">no tool results yet</p>
                <Link href="/tools/startup-score" className="text-xs font-sans font-semibold text-peach-dark hover:underline">
                  score your startup idea →
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
                        <p className="font-sans text-sm text-ink/50 mt-0.5">
                          startup idea score
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <span className="font-heading text-2xl font-bold text-ink">{s.totalScore}</span>
                        <span className="font-sans text-[10px] text-ink/30">/100</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Templates tab */}
        {activeTab === "templates" && (
          <section>
            {userPurchases.length === 0 ? (
              <div className="border border-dashed border-border rounded-2xl p-8 text-center">
                <p className="font-sans text-sm text-ink/50 mb-3">no templates purchased yet</p>
                <Link href="/templates" className="text-xs font-sans font-semibold text-peach-dark hover:underline">
                  browse templates →
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {userPurchases.map((p) => (
                  <div key={p.id} className="bg-card border border-border rounded-2xl p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                            purchased
                          </span>
                          <span className="text-[10px] font-sans text-ink/30">{formatDate(p.createdAt)}</span>
                        </div>
                        <p className="font-heading text-base font-700 text-ink normal-case">
                          {p.productTitle ?? "Template"}
                        </p>
                      </div>
                      {p.downloadToken && p.productSlug && (
                        <ViewTemplateButton
                          slug={p.productSlug}
                          title={p.productTitle ?? "Template"}
                          token={p.downloadToken}
                        />
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
