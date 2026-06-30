"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { ExternalLink, Copy, Check, ChevronLeft, ChevronRight, Search, X, Loader2, Lock } from "lucide-react"
import SignInOptions from "@/components/SignInOptions"
import { trackCta } from "@/lib/analytics"
import { loadRazorpay } from "@/lib/load-razorpay"
import type { FirmRow, TeamRow } from "@/lib/read-investor-xlsx"

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any
  }
}

export type ListConfig = {
  listType: "early-stage-vc" | "family-offices" | "incubators"
  slug: string
  title: string
  subtitle: string
  price: string
  breadcrumb: string
  firmsLabel: string
  teamLabel: string
  freePages: number
  description?: string[]
  whyPaid?: string
  indianCount?: number
  globalCount?: number
}

type Props = {
  config: ListConfig
  isPaid: boolean
  isAuthenticated: boolean
  firmsFirstPage: FirmRow[]
  teamFirstPage: TeamRow[]
  firmsTotal: number
  teamTotal: number
  userEmail: string | null
  userName: string | null
}

const PAGE_SIZE = 10

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  async function copy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className="relative inline-flex">
      <button onClick={copy} className="inline-flex items-center gap-1 text-[12px] text-ink/40 hover:text-ink/70 transition-colors px-1.5 py-0.5 rounded border border-border hover:border-ink/30">
        {copied ? <Check size={10} className="text-green-600" /> : <Copy size={10} />}
        {copied ? "copied" : "copy"}
      </button>
      {copied && (
        <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-ink text-cream text-[12px] font-sans px-2 py-1 rounded whitespace-nowrap pointer-events-none">
          copied!
        </span>
      )}
    </div>
  )
}

export default function InvestorListClient({
  config, isPaid: initialPaid, isAuthenticated,
  firmsFirstPage, teamFirstPage, firmsTotal, teamTotal,
  userEmail, userName,
}: Props) {
  const { data: session } = useSession()
  const [paid, setPaid]       = useState(initialPaid)
  const [buying, setBuying]   = useState(false)
  const [activeTab, setActiveTab] = useState<"firms" | "team">("firms")
  const [showSignIn, setShowSignIn] = useState(false)
  const [error, setError]     = useState("")

  // Firms tab state
  const [firms, setFirms]           = useState<FirmRow[]>(firmsFirstPage)
  const [firmsPage, setFirmsPage]   = useState(1)
  const [firmsPageCount, setFirmsPageCount] = useState(Math.ceil(firmsTotal / PAGE_SIZE))
  const [firmsTotalCount, setFirmsTotalCount] = useState(firmsTotal)
  const [firmsSearch, setFirmsSearch] = useState("")
  const [firmsLoading, setFirmsLoading] = useState(false)

  // Team tab state
  const [team, setTeam]             = useState<TeamRow[]>(teamFirstPage)
  const [teamPage, setTeamPage]     = useState(1)
  const [teamPageCount, setTeamPageCount] = useState(Math.ceil(teamTotal / PAGE_SIZE))
  const [teamTotalCount, setTeamTotalCount] = useState(teamTotal)
  const [teamSearch, setTeamSearch] = useState("")
  const [teamLoading, setTeamLoading] = useState(false)

  const firmsDebounce = useRef<ReturnType<typeof setTimeout> | null>(null)
  const teamDebounce  = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchFirms = useCallback(async (p: number, q: string) => {
    setFirmsLoading(true)
    try {
      const params = new URLSearchParams({ tab: "firms", page: String(p) })
      if (q) params.set("search", q)
      const res = await fetch(`/api/investor-list/${config.listType}?${params}`)
      const data = await res.json()
      setFirms(data.rows)
      setFirmsTotalCount(data.total)
      setFirmsPageCount(data.pageCount)
      setFirmsPage(p)
      if (data.isPaid) setPaid(true)
    } finally {
      setFirmsLoading(false)
    }
  }, [config.listType])

  const fetchTeam = useCallback(async (p: number, q: string) => {
    setTeamLoading(true)
    try {
      const params = new URLSearchParams({ tab: "team", page: String(p) })
      if (q) params.set("search", q)
      const res = await fetch(`/api/investor-list/${config.listType}?${params}`)
      const data = await res.json()
      setTeam(data.rows)
      setTeamTotalCount(data.total)
      setTeamPageCount(data.pageCount)
      setTeamPage(p)
      if (data.isPaid) setPaid(true)
    } finally {
      setTeamLoading(false)
    }
  }, [config.listType])

  // After payment, refresh both tabs
  useEffect(() => {
    if (paid && initialPaid === false) {
      fetchFirms(1, "")
      fetchTeam(1, "")
    }
  }, [paid, initialPaid, fetchFirms, fetchTeam])

  // Auto-trigger payment after Google sign-in redirect
  useEffect(() => {
    if (typeof window === "undefined") return
    const params = new URLSearchParams(window.location.search)
    if (params.get("pay") === "1" && isAuthenticated && !paid) {
      const url = new URL(window.location.href)
      url.searchParams.delete("pay")
      window.history.replaceState({}, "", url.toString())
      handleBuy()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  async function handleBuy() {
    const buyEmail = session?.user?.email ?? userEmail ?? ""
    const buyName  = session?.user?.name  ?? userName  ?? ""
    if (!buyEmail) return
    trackCta(`${config.listType}-buy`)
    setBuying(true)
    setError("")
    try {
      const res = await fetch("/api/products/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: config.slug, name: buyName, email: buyEmail }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to create order")

      await loadRazorpay()
      const rzp = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: "INR",
        name: "Priya Ahuja",
        description: data.productTitle,
        order_id: data.orderId,
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          const verifyRes = await fetch("/api/products/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              purchaseId: data.purchaseId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          })
          if (!verifyRes.ok) {
            setError("Payment received but access setup failed. Email hi@priyaahuja.in with your payment ID.")
            return
          }
          setPaid(true)
        },
        prefill: { name: buyName, email: buyEmail },
        theme: { color: "#1a1a1a" },
        modal: { ondismiss: () => setBuying(false) },
      })
      rzp.open()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setBuying(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream overflow-x-hidden">
      {/* Header bar */}
      <div className="flex justify-between items-center px-4 md:px-10 py-4 text-[13px] text-ink/50 font-sans border-b border-border">
        <span>{config.breadcrumb}</span>
        <span>{firmsTotalCount > 0 ? `${firmsTotalCount.toLocaleString()} ${config.firmsLabel}` : ""}</span>
      </div>

      {/* Title + CTA */}
      <div className="px-4 md:px-10 pt-12 pb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6">
        <div>
          <p className="font-sans text-xs text-ink/40 uppercase tracking-wide mb-2">Fundraise · Investor List</p>
          <h1 className="font-heading text-3xl md:text-5xl font-800 text-ink mb-4" dangerouslySetInnerHTML={{ __html: config.title }} />
          <p className="font-sans text-sm font-semibold text-ink max-w-md leading-relaxed">{config.subtitle}</p>
          {(config.indianCount !== undefined || config.globalCount !== undefined) && (
            <div className="flex items-center gap-3 mt-3">
              {config.indianCount !== undefined && (
                <span className="inline-flex items-center gap-1.5 text-[12px] font-sans bg-peach/50 text-ink/70 px-2.5 py-1 rounded-full">
                  <img src="https://flagcdn.com/w20/in.png" alt="India" width={16} height={12} className="rounded-sm" />
                  {config.indianCount.toLocaleString()} Indian VCs
                </span>
              )}
              {config.globalCount !== undefined && (
                <span className="inline-flex items-center gap-1.5 text-[12px] font-sans bg-ink/5 text-ink/60 px-2.5 py-1 rounded-full">
                  🌍 {config.globalCount.toLocaleString()} global VCs
                </span>
              )}
            </div>
          )}
          <p className="font-sans text-xs text-ink/40 mt-2">
            updated {new Date().toLocaleString("en-IN", { month: "long", year: "numeric" })}
          </p>
        </div>

        {!paid && (
          <div className="flex-shrink-0 flex flex-col items-start sm:items-end gap-1.5 sm:pt-1">
            <button
              onClick={() => isAuthenticated ? handleBuy() : setShowSignIn(true)}
              disabled={buying}
              className="inline-flex items-center gap-2 bg-ink text-cream font-sans font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-ink/80 transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              {buying ? <><Loader2 size={13} className="animate-spin" /> processing…</> : "get full access"}
            </button>
            <span className="text-xs font-sans font-semibold text-ink bg-peach/30 border border-peach-dark/20 px-2.5 py-1 rounded-md">
              {config.price} · lifetime access · both tabs included
            </span>
          </div>
        )}
      </div>

      {/* Description block — shown only when not paid */}
      {!paid && config.description && config.description.length > 0 && (
        <div className="px-4 md:px-10 pb-8">
          <div className="bg-card border border-border rounded-xl px-5 py-4 space-y-2">
            <p className="font-sans text-xs font-semibold text-ink/70">all about this list</p>
            {config.description.map((point) => (
              <p key={point} className="font-sans text-[12px] text-ink/55 leading-relaxed flex gap-2">
                <span className="text-peach-dark flex-shrink-0">·</span>
                {point}
              </p>
            ))}
            {config.whyPaid && (
              <p className="font-sans text-[12px] text-ink/50 leading-relaxed pt-1 border-t border-border mt-2">
                <span className="font-semibold text-ink/70">Why paid?</span> {config.whyPaid}
              </p>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="mx-4 md:mx-10 mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl font-sans text-xs text-red-600">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="px-4 md:px-10 mb-4">
        <div className="flex gap-1 border-b border-border">
          {(["firms", "team"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-sans font-semibold transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? "border-ink text-ink"
                  : "border-transparent text-ink/40 hover:text-ink/70"
              }`}
            >
              {tab === "firms" ? config.firmsLabel : config.teamLabel}
            </button>
          ))}
        </div>
      </div>

      {/* ── FIRMS TAB ── */}
      {activeTab === "firms" && (
        <>
          {/* Search + count */}
          <div className="px-4 md:px-10 mb-4 flex flex-wrap gap-3 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative min-w-[180px] max-w-xs">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30 pointer-events-none" />
                <input
                  type="text"
                  value={firmsSearch}
                  onChange={e => {
                    setFirmsSearch(e.target.value)
                    if (firmsDebounce.current) clearTimeout(firmsDebounce.current)
                    firmsDebounce.current = setTimeout(() => fetchFirms(1, e.target.value), 300)
                  }}
                  placeholder="search by name…"
                  className="w-full pl-8 pr-8 py-2 text-xs font-sans bg-card border border-border rounded-lg focus:outline-none focus:border-ink/40"
                />
                {firmsSearch && (
                  <button onClick={() => { setFirmsSearch(""); fetchFirms(1, "") }} className="absolute right-2 top-1/2 -translate-y-1/2 text-ink/30 hover:text-ink/60">
                    <X size={12} />
                  </button>
                )}
              </div>
              {firmsLoading && <Loader2 size={14} className="animate-spin text-ink/30" />}
            </div>
            <p className="font-sans text-xs text-ink/40">
              {firmsTotalCount.toLocaleString()} {config.firmsLabel} total
            </p>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden pb-4 px-4 space-y-3">
            {firmsLoading && Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-4 space-y-2 animate-pulse">
                <div className="h-4 w-36 bg-peach-dark/10 rounded" />
                <div className="h-3 w-24 bg-peach-dark/10 rounded" />
              </div>
            ))}
            {!firmsLoading && firms.map(firm => (
              <div key={firm.id} className="bg-card border border-border rounded-xl p-4 space-y-2.5">
                <div>
                  <span className="font-sans text-[13px] text-ink/30 mr-1.5">{firm.sno}.</span>
                  <span className="font-sans text-sm font-semibold text-ink">{firm.name}</span>
                </div>
                {firm.overview && <p className="font-sans text-[12px] text-ink/50 leading-relaxed">{firm.overview}</p>}
                <div className="grid grid-cols-2 gap-3">
                  {firm.country && (
                    <div>
                      <p className="font-sans text-[11px] text-ink/30 uppercase tracking-wide mb-0.5">Country</p>
                      <p className="font-sans text-xs text-ink/60">{firm.country}</p>
                    </div>
                  )}
                  {(firm.city || firm.state) && (
                    <div>
                      <p className="font-sans text-[11px] text-ink/30 uppercase tracking-wide mb-0.5">City</p>
                      <p className="font-sans text-xs text-ink/60">{[firm.city, firm.state].filter(Boolean).join(", ")}</p>
                    </div>
                  )}
                  {firm.website && (
                    <div>
                      <p className="font-sans text-[11px] text-ink/30 uppercase tracking-wide mb-0.5">Website</p>
                      <a href={firm.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-sans text-peach-dark hover:underline">
                        visit <ExternalLink size={10} />
                      </a>
                    </div>
                  )}
                  {(firm.linkedin || !paid) && (
                    <div>
                      <p className="font-sans text-[11px] text-ink/30 uppercase tracking-wide mb-0.5">LinkedIn</p>
                      {paid && firm.linkedin ? (
                        <a href={firm.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-sans text-peach-dark hover:underline">
                          view <ExternalLink size={10} />
                        </a>
                      ) : paid ? <span className="text-ink/20 text-xs">—</span> : (
                        <span className="select-none blur-sm text-xs font-sans text-ink/60 pointer-events-none">view</span>
                      )}
                    </div>
                  )}
                </div>
                {(firm.emails.length > 0 || !paid) && (
                  <div>
                    <p className="font-sans text-[11px] text-ink/30 uppercase tracking-wide mb-0.5">Email</p>
                    {paid ? (
                      firm.emails.length > 0 ? (
                        <div className="flex items-start gap-2 flex-wrap">
                          <span className="font-sans text-xs text-ink/70 break-all">{firm.emails.join(", ")}</span>
                          <CopyButton text={firm.emails.join(", ")} />
                        </div>
                      ) : <span className="text-ink/20 text-xs">—</span>
                    ) : (
                      <span className="select-none blur-sm text-xs font-sans text-ink/60 pointer-events-none">email@example.com</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block pb-4">
            <div className="overflow-x-auto px-4 md:px-10">
              <FirmsTable firms={firms} paid={paid} loading={firmsLoading} config={config} />
            </div>
          </div>

          <Pagination
            page={firmsPage} pageCount={firmsPageCount} total={firmsTotalCount}
            paid={paid} freePages={config.freePages} loading={firmsLoading}
            label={config.firmsLabel}
            onPage={p => fetchFirms(p, firmsSearch)}
            onUnpaidClick={() => setShowSignIn(true)}
          />
        </>
      )}

      {/* ── TEAM TAB ── */}
      {activeTab === "team" && (
        <>
          <div className="px-4 md:px-10 mb-4 flex flex-wrap gap-3 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative min-w-[180px] max-w-xs">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30 pointer-events-none" />
                <input
                  type="text"
                  value={teamSearch}
                  onChange={e => {
                    setTeamSearch(e.target.value)
                    if (teamDebounce.current) clearTimeout(teamDebounce.current)
                    teamDebounce.current = setTimeout(() => fetchTeam(1, e.target.value), 300)
                  }}
                  placeholder="search by name or firm…"
                  className="w-full pl-8 pr-8 py-2 text-xs font-sans bg-card border border-border rounded-lg focus:outline-none focus:border-ink/40"
                />
                {teamSearch && (
                  <button onClick={() => { setTeamSearch(""); fetchTeam(1, "") }} className="absolute right-2 top-1/2 -translate-y-1/2 text-ink/30 hover:text-ink/60">
                    <X size={12} />
                  </button>
                )}
              </div>
              {teamLoading && <Loader2 size={14} className="animate-spin text-ink/30" />}
            </div>
            <p className="font-sans text-xs text-ink/40">
              {teamTotalCount.toLocaleString()} {config.teamLabel} total
            </p>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden pb-4 px-4 space-y-3">
            {teamLoading && Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-4 space-y-2 animate-pulse">
                <div className="h-4 w-36 bg-peach-dark/10 rounded" />
                <div className="h-3 w-48 bg-peach-dark/10 rounded" />
              </div>
            ))}
            {!teamLoading && team.map(member => (
              <div key={member.id} className="bg-card border border-border rounded-xl p-4 space-y-2">
                <div>
                  <span className="font-sans text-[13px] text-ink/30 mr-1.5">{member.sno}.</span>
                  <span className="font-sans text-sm font-semibold text-ink">{member.teamMember}</span>
                </div>
                <p className="font-sans text-xs text-ink/50">{member.designation}{member.investorName ? ` · ${member.investorName}` : ""}</p>
                {member.location && <p className="font-sans text-[12px] text-ink/40">{member.location}</p>}
                <div className="flex items-center gap-3 flex-wrap">
                  {paid ? (
                    member.linkedin ? (
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-sans text-peach-dark hover:underline">
                        LinkedIn <ExternalLink size={10} />
                      </a>
                    ) : null
                  ) : (
                    <span className="select-none blur-sm text-xs font-sans text-ink/60 pointer-events-none">linkedin.com/in/xx</span>
                  )}
                  {paid ? (
                    member.emails.length > 0 ? (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-sans text-xs text-ink/70 break-all">{member.emails.join(", ")}</span>
                        <CopyButton text={member.emails.join(", ")} />
                      </div>
                    ) : null
                  ) : (
                    <span className="select-none blur-sm text-xs font-sans text-ink/60 pointer-events-none">email@example.com</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block pb-4">
            <div className="overflow-x-auto px-4 md:px-10">
              <TeamTable team={team} paid={paid} loading={teamLoading} />
            </div>
          </div>

          <Pagination
            page={teamPage} pageCount={teamPageCount} total={teamTotalCount}
            paid={paid} freePages={config.freePages} loading={teamLoading}
            label="contacts"
            onPage={p => fetchTeam(p, teamSearch)}
            onUnpaidClick={() => setShowSignIn(true)}
          />
        </>
      )}

      {/* Other investor lists */}
      {(() => {
        const ALL_LISTS = [
          { key: "angel-investors", title: "angel investors", href: "/fundraise/investor-list/angel-investors" },
          { key: "early-stage-vc", title: "early stage vc", href: "/fundraise/investor-list/early-stage-vc" },
          { key: "family-offices", title: "family offices", href: "/fundraise/investor-list/family-offices" },
          { key: "incubators", title: "incubator & accelerator", href: "/fundraise/investor-list/incubators" },
        ]
        const others = ALL_LISTS.filter(l => l.key !== config.listType)
        return (
          <div className="px-4 md:px-10 pb-10 pt-4 border-t border-border/40 mt-2 flex flex-wrap sm:flex-nowrap items-center gap-3">
            <p className="font-sans text-[11px] text-ink/30 uppercase tracking-wide whitespace-nowrap">other investor lists might be useful for you</p>
            <div className="flex flex-wrap sm:flex-nowrap gap-2">
              {others.map(list => (
                <Link key={list.href} href={list.href} className="font-sans text-xs text-ink/70 bg-peach/40 hover:bg-peach/60 border border-peach-dark/20 hover:border-peach-dark/40 px-3 py-1 rounded-full transition-colors">
                  {list.title}
                </Link>
              ))}
            </div>
          </div>
        )
      })()}

      {/* Sign-in modal */}
      {showSignIn && (
        <div
          className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
          onClick={e => { if (e.target === e.currentTarget) setShowSignIn(false) }}
        >
          <div className="bg-cream rounded-2xl w-full max-w-sm shadow-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-heading text-xl font-700 text-ink">sign in to continue</h3>
                <p className="font-sans text-xs text-ink/40 mt-0.5">{config.firmsLabel} · {config.price} lifetime access</p>
              </div>
              <button onClick={() => setShowSignIn(false)} className="text-ink/40 hover:text-ink transition-colors">
                <X size={18} />
              </button>
            </div>
            <p className="font-sans text-sm text-ink/60 mb-5 leading-relaxed">
              sign in with google, then complete payment for permanent access to both tabs.
            </p>
            <SignInOptions
              callbackUrl={typeof window !== "undefined" ? `${window.location.href}?pay=1` : "#"}
              compact
            />
          </div>
        </div>
      )}
    </div>
  )
}

function FirmsTable({ firms, paid, loading, config }: { firms: FirmRow[]; paid: boolean; loading: boolean; config: ListConfig }) {
  const showWebsite = firms.some(f => f.website)
  return (
    <table className="w-full text-xs font-sans border-collapse table-fixed">
      <colgroup>
        <col className="w-8" />
        <col className="w-48" />
        <col className="w-32 hidden md:table-column" />
        {showWebsite && <col className="w-20 hidden lg:table-column" />}
        <col className="w-20" />
        <col className="w-52" />
      </colgroup>
      <thead>
        <tr className="border-b border-border">
          <th className="text-left py-2.5 pr-3 text-ink/40 font-semibold">#</th>
          <th className="text-left py-2.5 pr-3 text-ink/40 font-semibold">Name</th>
          <th className="text-left py-2.5 pr-3 text-ink/40 font-semibold hidden md:table-cell">Country</th>
          {showWebsite && <th className="text-left py-2.5 pr-3 text-ink/40 font-semibold hidden lg:table-cell">Website</th>}
          <th className="text-left py-2.5 pr-3 text-ink/40 font-semibold">LinkedIn</th>
          <th className="text-left py-2.5 text-ink/40 font-semibold">Email</th>
        </tr>
      </thead>
      <tbody>
        {loading && Array.from({ length: 10 }).map((_, i) => (
          <tr key={i} className="border-b border-border/50">
            <td className="py-3 pr-3"><div className="h-3 w-4 bg-peach-dark/10 rounded animate-pulse" /></td>
            <td className="py-3 pr-3"><div className="h-3 w-32 bg-peach-dark/10 rounded animate-pulse" /></td>
            <td className="py-3 pr-3 hidden md:table-cell"><div className="h-3 w-20 bg-peach-dark/10 rounded animate-pulse" /></td>
            {showWebsite && <td className="py-3 pr-3 hidden lg:table-cell"><div className="h-3 w-12 bg-peach-dark/10 rounded animate-pulse" /></td>}
            <td className="py-3 pr-3"><div className="h-3 w-12 bg-peach-dark/10 rounded animate-pulse" /></td>
            <td className="py-3"><div className="h-3 w-36 bg-peach-dark/10 rounded animate-pulse" /></td>
          </tr>
        ))}
        {!loading && firms.map(firm => (
          <tr key={firm.id} className="border-b border-border/50 hover:bg-ink/[0.02] transition-colors">
            <td className="py-3 pr-3 text-ink/30">{firm.sno}</td>
            <td className="py-3 pr-3">
              <p className="text-ink font-medium truncate" title={firm.name}>{firm.name}</p>
              {firm.overview && <p className="text-[11px] text-ink/40 truncate mt-0.5" title={firm.overview}>{firm.overview}</p>}
            </td>
            <td className="py-3 pr-3 text-ink/60 hidden md:table-cell">
              <span className="truncate block" title={firm.country}>{firm.country || "—"}</span>
            </td>
            {showWebsite && (
              <td className="py-3 pr-3 hidden lg:table-cell">
                {firm.website ? (
                  <a href={firm.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-peach-dark hover:underline">
                    visit <ExternalLink size={10} />
                  </a>
                ) : <span className="text-ink/20">—</span>}
              </td>
            )}
            <td className="py-3 pr-3">
              {paid ? (
                firm.linkedin ? (
                  <a href={firm.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-peach-dark hover:underline">
                    view <ExternalLink size={10} />
                  </a>
                ) : <span className="text-ink/20">—</span>
              ) : (
                <span className="select-none blur-sm text-ink/60 pointer-events-none">view</span>
              )}
            </td>
            <td className="py-3">
              {paid ? (
                firm.emails.length > 0 ? (
                  <div className="flex items-center gap-2">
                    <span className="text-ink/70 truncate" title={firm.emails.join(", ")}>{firm.emails[0]}{firm.emails.length > 1 ? ` +${firm.emails.length - 1}` : ""}</span>
                    <CopyButton text={firm.emails.join(", ")} />
                  </div>
                ) : <span className="text-ink/20">—</span>
              ) : (
                <span className="select-none blur-sm text-ink/60 pointer-events-none">email@example.com</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function TeamTable({ team, paid, loading }: { team: TeamRow[]; paid: boolean; loading: boolean }) {
  return (
    <table className="w-full text-xs font-sans border-collapse table-fixed">
      <colgroup>
        <col className="w-8" />
        <col className="w-36" />
        <col className="w-36" />
        <col className="w-40 hidden md:table-column" />
        <col className="w-32 hidden lg:table-column" />
        <col className="w-20" />
        <col className="w-48" />
      </colgroup>
      <thead>
        <tr className="border-b border-border">
          <th className="text-left py-2.5 pr-3 text-ink/40 font-semibold">#</th>
          <th className="text-left py-2.5 pr-3 text-ink/40 font-semibold">Name</th>
          <th className="text-left py-2.5 pr-3 text-ink/40 font-semibold">Firm</th>
          <th className="text-left py-2.5 pr-3 text-ink/40 font-semibold hidden md:table-cell">Designation</th>
          <th className="text-left py-2.5 pr-3 text-ink/40 font-semibold hidden lg:table-cell">Location</th>
          <th className="text-left py-2.5 pr-3 text-ink/40 font-semibold">LinkedIn</th>
          <th className="text-left py-2.5 text-ink/40 font-semibold">Email</th>
        </tr>
      </thead>
      <tbody>
        {loading && Array.from({ length: 10 }).map((_, i) => (
          <tr key={i} className="border-b border-border/50">
            <td className="py-3 pr-3"><div className="h-3 w-4 bg-peach-dark/10 rounded animate-pulse" /></td>
            <td className="py-3 pr-3"><div className="h-3 w-24 bg-peach-dark/10 rounded animate-pulse" /></td>
            <td className="py-3 pr-3"><div className="h-3 w-24 bg-peach-dark/10 rounded animate-pulse" /></td>
            <td className="py-3 pr-3 hidden md:table-cell"><div className="h-3 w-28 bg-peach-dark/10 rounded animate-pulse" /></td>
            <td className="py-3 pr-3 hidden lg:table-cell"><div className="h-3 w-20 bg-peach-dark/10 rounded animate-pulse" /></td>
            <td className="py-3 pr-3"><div className="h-3 w-12 bg-peach-dark/10 rounded animate-pulse" /></td>
            <td className="py-3"><div className="h-3 w-32 bg-peach-dark/10 rounded animate-pulse" /></td>
          </tr>
        ))}
        {!loading && team.map(member => (
          <tr key={member.id} className="border-b border-border/50 hover:bg-ink/[0.02] transition-colors">
            <td className="py-3 pr-3 text-ink/30">{member.sno}</td>
            <td className="py-3 pr-3"><span className="text-ink font-medium truncate block" title={member.teamMember}>{member.teamMember}</span></td>
            <td className="py-3 pr-3"><span className="text-ink/60 truncate block" title={member.investorName}>{member.investorName || "—"}</span></td>
            <td className="py-3 pr-3 hidden md:table-cell"><span className="text-ink/60 truncate block" title={member.designation}>{member.designation || "—"}</span></td>
            <td className="py-3 pr-3 hidden lg:table-cell"><span className="text-ink/50 truncate block" title={member.location}>{member.location || "—"}</span></td>
            <td className="py-3 pr-3">
              {paid ? (
                member.linkedin ? (
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-peach-dark hover:underline">
                    view <ExternalLink size={10} />
                  </a>
                ) : <span className="text-ink/20">—</span>
              ) : (
                <span className="select-none blur-sm text-ink/60 pointer-events-none">view</span>
              )}
            </td>
            <td className="py-3">
              {paid ? (
                member.emails.length > 0 ? (
                  <div className="flex items-center gap-2">
                    <span className="text-ink/70 truncate" title={member.emails.join(", ")}>{member.emails[0]}{member.emails.length > 1 ? ` +${member.emails.length - 1}` : ""}</span>
                    <CopyButton text={member.emails.join(", ")} />
                  </div>
                ) : <span className="text-ink/20">—</span>
              ) : (
                <span className="select-none blur-sm text-ink/60 pointer-events-none">email@example.com</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function Pagination({ page, pageCount, total, paid, freePages, loading, label, onPage, onUnpaidClick }: {
  page: number; pageCount: number; total: number; paid: boolean; freePages: number
  loading: boolean; label: string
  onPage: (p: number) => void; onUnpaidClick: () => void
}) {
  if (pageCount <= 1) return null
  const canNav = paid || page <= freePages
  const start = (page - 1) * PAGE_SIZE + 1
  const end   = Math.min(page * PAGE_SIZE, total)
  const freeEnd = Math.min(freePages * PAGE_SIZE, total)
  return (
    <div className="px-4 md:px-10 pb-12 flex items-center justify-between">
      <p className="font-sans text-xs text-ink/40">
        {paid
          ? `showing ${start}–${end} of ${total.toLocaleString()} ${label}`
          : `showing 1–${freeEnd} of ${total.toLocaleString()} ${label}`}
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => canNav ? onPage(page - 1) : undefined}
          disabled={page <= 1 || loading}
          className="inline-flex items-center gap-1 text-xs font-sans font-semibold text-ink/60 hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-3 py-1.5 border border-border rounded-lg"
        >
          <ChevronLeft size={13} /> prev
        </button>
        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, pageCount) }, (_, i) => {
            const p = (paid || page > freePages - 2)
              ? Math.max(1, Math.min(page - 2, pageCount - 4)) + i
              : i + 1
            const isLocked = !paid && p > freePages
            const isCurrent = p === page
            return (
              <button
                key={p}
                onClick={() => isLocked ? onUnpaidClick() : onPage(p)}
                className={`inline-flex items-center justify-center w-7 h-7 rounded text-xs font-sans font-semibold transition-colors
                  ${isCurrent ? "bg-ink text-cream" : "border border-border text-ink/50 hover:text-ink hover:border-ink/40"}`}
              >
                {isLocked ? <Lock size={9} className="text-ink/30" /> : p}
              </button>
            )
          })}
          {pageCount > 5 && <span className="font-sans text-xs text-ink/30 px-1">… {pageCount}</span>}
        </div>
        <button
          onClick={() => !paid && page >= freePages ? onUnpaidClick() : onPage(page + 1)}
          disabled={page >= pageCount || loading}
          className="inline-flex items-center gap-1 text-xs font-sans font-semibold text-ink/60 hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-3 py-1.5 border border-border rounded-lg"
        >
          next <ChevronRight size={13} />
        </button>
      </div>
    </div>
  )
}
