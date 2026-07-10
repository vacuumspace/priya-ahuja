"use client"

import { useState, useEffect } from "react"

type Booking = { id: string; status: string; createdAt: Date; serviceTitle: string | null }
type Purchase = { id: string; createdAt: Date; productTitle: string | null }
type PriyaGptTxn = { id: string; deltaMinutes: number; reason: string; amountPaise: number | null; createdAt: Date }
type PitchDeck = { id: string; fileName: string; totalScore: number; isPaid: boolean; amountPaid: number | null; createdAt: Date }
type ToolScore = { id: string; totalScore: number; isPaid: boolean; createdAt: Date }

type Profile = {
  phone: string | null
  location: string | null
  website: string | null
  bio: string | null
  businessName: string | null
  businessType: string | null
  industry: string | null
  stage: string | null
  businessDescription: string | null
  businessWebsite: string | null
  instagramHandle: string | null
  linkedinUrl: string | null
  twitterHandle: string | null
}

type User = {
  id: string
  email: string
  name: string | null
  createdAt: Date | null
}

function Row({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div className="flex gap-4 py-2.5 border-b border-border last:border-0">
      <span className="font-sans text-xs text-ink/40 w-40 shrink-0 pt-0.5">{label}</span>
      <span className="font-sans text-sm text-ink break-all">{value}</span>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-border rounded-2xl overflow-hidden">
      <div className="px-5 py-3 border-b border-border bg-card">
        <h2 className="font-heading text-base font-700 text-ink">{title}</h2>
      </div>
      <div className="px-5 py-1">{children}</div>
    </div>
  )
}

const STATUS_CLS: Record<string, string> = {
  confirmed: "bg-green-100 text-green-700",
  paid:      "bg-green-100 text-green-700",
  completed: "bg-ink/10 text-ink/60",
  pending:   "bg-amber-100 text-amber-700",
  cancelled: "bg-red-100 text-red-500",
}

export default function UserDetailClient({
  user,
  profile,
  bookings,
  purchases,
  priyaGptMinutes = 0,
  priyaGptTransactions = [],
  pitchDecks = [],
  fundScores = [],
  ideaScores = [],
}: {
  user: User
  profile: Profile | null
  bookings: Booking[]
  purchases: Purchase[]
  priyaGptMinutes?: number
  priyaGptTransactions?: PriyaGptTxn[]
  pitchDecks?: PitchDeck[]
  fundScores?: ToolScore[]
  ideaScores?: ToolScore[]
}) {
  const toolsCount = pitchDecks.length + fundScores.length + ideaScores.length
  const tabs = ["profile", "sessions", "purchases", "tools", "priyagpt"] as const
  type Tab = typeof tabs[number]
  const [tab, setTab] = useState<Tab>("profile")

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("tab") as Tab | null
    if (requested && tabs.includes(requested)) setTab(requested)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fmt = (d: Date) => new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(d))

  return (
    <>
      {/* Sub-tabs */}
      <div className="flex gap-1 mb-6 border-b border-border">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-xs font-sans font-semibold border-b-2 transition-colors -mb-px capitalize ${
              tab === t
                ? "border-ink text-ink"
                : "border-transparent text-ink/40 hover:text-ink/70"
            }`}
          >
            {t}
            {t === "sessions" && bookings.length > 0 && (
              <span className="ml-1.5 font-mono text-[10px] opacity-60">{bookings.length}</span>
            )}
            {t === "purchases" && purchases.length > 0 && (
              <span className="ml-1.5 font-mono text-[10px] opacity-60">{purchases.length}</span>
            )}
            {t === "tools" && toolsCount > 0 && (
              <span className="ml-1.5 font-mono text-[10px] opacity-60">{toolsCount}</span>
            )}
            {t === "priyagpt" && priyaGptTransactions.length > 0 && (
              <span className="ml-1.5 font-mono text-[10px] opacity-60">{priyaGptTransactions.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Profile tab */}
      {tab === "profile" && (
        <div className="flex flex-col gap-5">
          <Section title="account">
            <Row label="user id" value={user.id} />
            <Row label="email" value={user.email} />
            <Row label="name" value={user.name} />
            <Row
              label="joined"
              value={user.createdAt
                ? new Intl.DateTimeFormat("en-IN", { dateStyle: "long", timeStyle: "short" }).format(new Date(user.createdAt))
                : undefined}
            />
          </Section>

          {profile ? (
            <>
              <Section title="basic info">
                <Row label="phone" value={profile.phone} />
                <Row label="location" value={profile.location} />
                <Row label="website" value={profile.website} />
                <Row label="bio" value={profile.bio} />
              </Section>

              <Section title="business details">
                <Row label="business name" value={profile.businessName} />
                <Row label="type" value={profile.businessType} />
                <Row label="industry" value={profile.industry} />
                <Row label="stage" value={profile.stage} />
                <Row label="description" value={profile.businessDescription} />
                <Row label="business website" value={profile.businessWebsite} />
                <Row label="instagram" value={profile.instagramHandle} />
                <Row label="linkedin" value={profile.linkedinUrl} />
                <Row label="twitter / x" value={profile.twitterHandle} />
              </Section>
            </>
          ) : (
            <p className="text-sm font-sans text-ink/40 border border-dashed border-border rounded-2xl p-6 text-center">
              no profile set up yet
            </p>
          )}
        </div>
      )}

      {/* Sessions tab */}
      {tab === "sessions" && (
        <div>
          {bookings.length === 0 ? (
            <p className="text-sm font-sans text-ink/40 border border-dashed border-border rounded-2xl p-6 text-center">
              no sessions yet
            </p>
          ) : (
            <div className="border border-border rounded-2xl overflow-hidden">
              {bookings.map((b) => (
                <div key={b.id} className="flex items-center justify-between px-5 py-3 border-b border-border last:border-0 hover:bg-card transition-colors">
                  <span className="font-sans text-sm text-ink">{b.serviceTitle ?? "Session"}</span>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full ${STATUS_CLS[b.status] ?? "bg-ink/10 text-ink/60"}`}>
                      {b.status}
                    </span>
                    <span className="font-sans text-xs text-ink/40">{fmt(b.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Purchases tab */}
      {tab === "purchases" && (
        <div>
          {purchases.length === 0 ? (
            <p className="text-sm font-sans text-ink/40 border border-dashed border-border rounded-2xl p-6 text-center">
              no purchases yet
            </p>
          ) : (
            <div className="border border-border rounded-2xl overflow-hidden">
              {purchases.map((p) => (
                <div key={p.id} className="flex items-center justify-between px-5 py-3 border-b border-border last:border-0 hover:bg-card transition-colors">
                  <span className="font-sans text-sm text-ink">{p.productTitle ?? "Product"}</span>
                  <span className="font-sans text-xs text-ink/40">{fmt(p.createdAt)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tools tab */}
      {tab === "tools" && (
        <div className="flex flex-col gap-5">
          {toolsCount === 0 ? (
            <p className="text-sm font-sans text-ink/40 border border-dashed border-border rounded-2xl p-6 text-center">
              no tool activity yet
            </p>
          ) : (
            <>
              {pitchDecks.length > 0 && (
                <Section title="pitch deck analyses">
                  {pitchDecks.map((p) => (
                    <div key={p.id} className="flex items-center justify-between gap-3 py-2.5 border-b border-border last:border-0">
                      <div className="min-w-0">
                        <p className="font-sans text-sm text-ink truncate">{p.fileName}</p>
                        <p className="font-sans text-xs text-ink/40">
                          {p.isPaid
                            ? `paid${p.amountPaid != null ? ` · ₹${(p.amountPaid / 100).toLocaleString("en-IN")}` : ""}`
                            : "admin test"}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="font-heading text-base font-bold text-ink">{p.totalScore}<span className="font-sans text-[10px] text-ink/30">/100</span></span>
                        <span className="font-sans text-xs text-ink/40">{fmt(p.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                </Section>
              )}
              {fundScores.length > 0 && (
                <Section title="fundability scores">
                  {fundScores.map((s) => (
                    <div key={s.id} className="flex items-center justify-between gap-3 py-2.5 border-b border-border last:border-0">
                      <span className="font-sans text-xs text-ink/40">{s.isPaid ? "paid" : "free"}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-heading text-base font-bold text-ink">{s.totalScore}<span className="font-sans text-[10px] text-ink/30">/100</span></span>
                        <span className="font-sans text-xs text-ink/40">{fmt(s.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                </Section>
              )}
              {ideaScores.length > 0 && (
                <Section title="idea scores">
                  {ideaScores.map((s) => (
                    <div key={s.id} className="flex items-center justify-between gap-3 py-2.5 border-b border-border last:border-0">
                      <span className="font-sans text-xs text-ink/40">{s.isPaid ? "paid" : "free"}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-heading text-base font-bold text-ink">{s.totalScore}<span className="font-sans text-[10px] text-ink/30">/100</span></span>
                        <span className="font-sans text-xs text-ink/40">{fmt(s.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                </Section>
              )}
            </>
          )}
        </div>
      )}

      {/* PriyaGPT time tab */}
      {tab === "priyagpt" && (
        <div className="flex flex-col gap-4">
          <div className="border border-border rounded-2xl p-5">
            <p className="font-sans text-xs text-ink/40 uppercase tracking-wide mb-1">time remaining</p>
            <p className="font-heading text-2xl font-800 text-ink">{priyaGptMinutes} min</p>
          </div>
          {priyaGptTransactions.length === 0 ? (
            <p className="text-sm font-sans text-ink/40 border border-dashed border-border rounded-2xl p-6 text-center">
              no PriyaGPT activity yet
            </p>
          ) : (
            <div className="border border-border rounded-2xl overflow-hidden overflow-x-auto">
              {priyaGptTransactions.map((t) => (
                <div key={t.id} className="flex items-center justify-between px-5 py-3 border-b border-border last:border-0 hover:bg-card transition-colors">
                  <span className="font-sans text-sm text-ink capitalize">
                    {t.reason.replace(/_/g, " ")}
                    {t.amountPaise != null && (
                      <span className="ml-1.5 text-xs text-ink/40">(₹{(t.amountPaise / 100).toLocaleString("en-IN")})</span>
                    )}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className={`font-sans text-sm font-semibold ${t.deltaMinutes > 0 ? "text-green-600" : "text-ink/60"}`}>
                      {t.deltaMinutes > 0 ? "+" : "-"}{Math.abs(t.deltaMinutes)} min
                    </span>
                    <span className="font-sans text-xs text-ink/40">{fmt(t.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
