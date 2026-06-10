import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { bookings, purchases, services as servicesTable, digitalProducts, startupScores } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import Link from "next/link"
import { CalendarDays, FileText, ExternalLink, LogIn, Lightbulb } from "lucide-react"
import ViewTemplateButton from "@/components/templates/ViewTemplateButton"
import SignInOptions from "@/components/SignInOptions"

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
          <SignInOptions callbackUrl="/my-sessions" />
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
