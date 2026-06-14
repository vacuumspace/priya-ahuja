"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useSession } from "next-auth/react"
import { ExternalLink, Copy, Check, ChevronLeft, ChevronRight, Search, X, Loader2, Lock } from "lucide-react"
import SignInOptions from "@/components/SignInOptions"
import { trackCta } from "@/lib/analytics"
import { loadRazorpay } from "@/lib/load-razorpay"

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any
  }
}

type Investor = {
  id: string; sno: number; name: string; city: string
  state: string; country: string; linkedin: string; emails: string[]
}

type Props = {
  isPaid: boolean
  isAuthenticated: boolean
  firstPage: Investor[]
  total: number
  userEmail: string | null
  userName: string | null
}

const PAGE_SIZE = 10
const PRICE = "₹999"

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  async function copy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className="relative inline-flex">
      <button onClick={copy} className="inline-flex items-center gap-1 text-[10px] text-ink/40 hover:text-ink/70 transition-colors px-1.5 py-0.5 rounded border border-border hover:border-ink/30">
        {copied ? <Check size={10} className="text-green-600" /> : <Copy size={10} />}
        {copied ? "copied" : "copy"}
      </button>
      {copied && (
        <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-ink text-cream text-[10px] font-sans px-2 py-1 rounded whitespace-nowrap pointer-events-none animate-in fade-in duration-150">
          copied to clipboard
        </span>
      )}
    </div>
  )
}

export default function AngelInvestorClient({ isPaid: initialPaid, isAuthenticated, firstPage, total, userEmail, userName }: Props) {
  const { data: session } = useSession()
  const [paid, setPaid]   = useState(initialPaid)
  const [state, setState] = useState<"preview" | "buying" | "list">(initialPaid ? "list" : "preview")
  const [investors, setInvestors] = useState<Investor[]>(firstPage)
  const [page, setPage]   = useState(1)
  const [pageCount, setPageCount] = useState(Math.ceil(total / PAGE_SIZE))
  const [totalCount, setTotalCount] = useState(total)
  const [search, setSearch]   = useState("")
  const [stateFilter, setStateFilter] = useState("")
  const [countryFilter, setCountryFilter] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError]  = useState("")
  const [showSignIn, setShowSignIn] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchPage = useCallback(async (p: number, q: string, st: string, co: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(p) })
      if (q)  params.set("search", q)
      if (st) params.set("state", st)
      if (co) params.set("country", co)
      const res = await fetch(`/api/angel-investors/list?${params}`)
      const data = await res.json()
      setInvestors(data.investors)
      setTotalCount(data.total)
      setPageCount(data.pageCount)
      setPage(p)
      if (data.isPaid) setPaid(true)
    } finally {
      setLoading(false)
    }
  }, [])

  // Auto-load full list when paid
  useEffect(() => {
    if (paid && state !== "list") {
      setState("list")
      fetchPage(1, "", "", "")
    }
  }, [paid, state, fetchPage])

  // Auto-trigger payment when returning from Google sign-in with ?pay=1
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

  function handleSearchChange(val: string) {
    setSearch(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchPage(1, val, stateFilter, countryFilter), 300)
  }

  function handleStateFilter(val: string) {
    setStateFilter(val)
    fetchPage(1, search, val, countryFilter)
  }

  function handleCountryFilter(val: string) {
    setCountryFilter(val)
    fetchPage(1, search, stateFilter, val)
  }

  async function handleBuy() {
    const buyEmail = session?.user?.email ?? userEmail ?? ""
    const buyName  = session?.user?.name  ?? userName  ?? ""
    if (!buyEmail) return
    trackCta("angel-investors-buy")
    setState("buying")
    setError("")
    try {
      const res = await fetch("/api/products/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: "angel-investor-list", name: buyName, email: buyEmail }),
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
            setError("Payment received but access setup failed. Email hello@priyaahuja.com with your payment ID.")
            setState("preview")
            return
          }
          setPaid(true)
        },
        prefill: { name: buyName, email: buyEmail },
        theme: { color: "#1a1a1a" },
        modal: { ondismiss: () => setState("preview") },
      })
      rzp.open()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setState("preview")
    }
  }

  // Unique filter options from current data (only useful when paid)
  const uniqueStates   = Array.from(new Set(firstPage.map(r => r.state).filter(Boolean))).sort()
  const uniqueCountries = Array.from(new Set(firstPage.map(r => r.country).filter(Boolean))).sort()

  const start = (page - 1) * PAGE_SIZE + 1
  const end   = Math.min(page * PAGE_SIZE, totalCount)

  return (
    <div className="min-h-screen bg-cream">
      {/* Header bar */}
      <div className="flex justify-between items-center px-4 md:px-10 py-4 text-[11px] text-ink/50 font-sans border-b border-border">
        <span>fundraise · angel investor list</span>
        <span>{totalCount > 0 ? `${totalCount.toLocaleString()} investors` : "loading…"}</span>
      </div>

      <div className="px-4 md:px-10 pt-12 pb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6">
        <div>
          <p className="font-sans text-xs text-ink/40 uppercase tracking-wide mb-2">Fundraise</p>
          <h1 className="font-heading text-3xl md:text-5xl font-800 text-ink mb-4">
            angel investor
            <br />
            list
          </h1>
          <p className="font-sans text-sm text-ink/60 max-w-md leading-relaxed">
            900+ angel investors across India — name, city, LinkedIn, and direct email(s).
          </p>
        </div>

        {/* Top-right CTA — only when not paid */}
        {!paid && (
          <div className="flex-shrink-0 flex flex-col items-start sm:items-end gap-1.5 sm:pt-1">
            <button
              onClick={() => isAuthenticated ? handleBuy() : setShowSignIn(true)}
              disabled={state === "buying"}
              className="inline-flex items-center gap-2 bg-ink text-cream font-sans font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-ink/80 transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              {state === "buying" ? <><Loader2 size={13} className="animate-spin" /> processing…</> : "get full access"}
            </button>
            <span className="text-[10px] font-sans text-ink/40">{PRICE} · lifetime access</span>
          </div>
        )}
      </div>

      {/* Why this list? — shown only on preview */}
      {!paid && (
        <div className="px-4 md:px-10 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            {[
              { stat: "900+", label: "verified angel investors" },
              { stat: "28+", label: "states & cities covered" },
              { stat: "direct", label: "emails, not contact forms" },
            ].map((s) => (
              <div key={s.stat} className="bg-peach/20 border border-peach-dark/15 rounded-xl px-4 py-3 text-center">
                <p className="font-heading text-2xl font-800 text-ink">{s.stat}</p>
                <p className="font-sans text-[11px] text-ink/50 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="bg-card border border-border rounded-xl px-5 py-4 space-y-2">
            <p className="font-sans text-xs font-semibold text-ink/70">why this list is different</p>
            {[
              "These are verified active investors — not stale directories or cold LinkedIn scrapes.",
              "Direct emails included, so you're not guessing or going through assistants.",
              "Covers angels writing cheques in 2025–26 across fintech, SaaS, D2C, edtech, and healthtech.",
              "One-time payment — no subscriptions, no expiry. Yours forever.",
            ].map((point) => (
              <p key={point} className="font-sans text-[12px] text-ink/55 leading-relaxed flex gap-2">
                <span className="text-peach-dark flex-shrink-0">·</span>
                {point}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mx-4 md:mx-10 mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl font-sans text-xs text-red-600">
          {error}
        </div>
      )}

      {/* Paid: search + filters */}
      {paid && state === "list" && (
        <div className="px-4 md:px-10 mb-4 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={e => handleSearchChange(e.target.value)}
              placeholder="search by name…"
              className="w-full pl-8 pr-8 py-2 text-xs font-sans bg-card border border-border rounded-lg focus:outline-none focus:border-ink/40"
            />
            {search && (
              <button onClick={() => handleSearchChange("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-ink/30 hover:text-ink/60">
                <X size={12} />
              </button>
            )}
          </div>
          <select
            value={stateFilter}
            onChange={e => handleStateFilter(e.target.value)}
            className="text-xs font-sans bg-card border border-border rounded-lg px-3 py-2 focus:outline-none focus:border-ink/40"
          >
            <option value="">all states</option>
            {uniqueStates.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            value={countryFilter}
            onChange={e => handleCountryFilter(e.target.value)}
            className="text-xs font-sans bg-card border border-border rounded-lg px-3 py-2 focus:outline-none focus:border-ink/40"
          >
            <option value="">all countries</option>
            {uniqueCountries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {loading && <Loader2 size={14} className="animate-spin text-ink/30" />}
        </div>
      )}

      {/* Table */}
      <div className="px-4 md:px-10 pb-4 overflow-x-auto">
        <table className="w-full text-xs font-sans border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2.5 pr-4 text-ink/40 font-semibold w-8">#</th>
              <th className="text-left py-2.5 pr-4 text-ink/40 font-semibold">Name</th>
              <th className="text-left py-2.5 pr-4 text-ink/40 font-semibold hidden sm:table-cell">City</th>
              <th className="text-left py-2.5 pr-4 text-ink/40 font-semibold hidden md:table-cell">State</th>
              <th className="text-left py-2.5 pr-4 text-ink/40 font-semibold hidden lg:table-cell">Country</th>
              <th className="text-left py-2.5 pr-4 text-ink/40 font-semibold hidden sm:table-cell">LinkedIn</th>
              <th className="text-left py-2.5 text-ink/40 font-semibold hidden sm:table-cell">Emails</th>
            </tr>
          </thead>
          <tbody>
            {loading && Array.from({ length: 10 }).map((_, i) => (
              <tr key={`skel-${i}`} className="border-b border-border/50">
                <td className="py-3 pr-4"><div className="h-3 w-5 bg-peach-dark/10 rounded animate-pulse" /></td>
                <td className="py-3 pr-4"><div className="h-3 w-28 bg-peach-dark/10 rounded animate-pulse" /></td>
                <td className="py-3 pr-4 hidden sm:table-cell"><div className="h-3 w-16 bg-peach-dark/10 rounded animate-pulse" /></td>
                <td className="py-3 pr-4 hidden md:table-cell"><div className="h-3 w-20 bg-peach-dark/10 rounded animate-pulse" /></td>
                <td className="py-3 pr-4 hidden lg:table-cell"><div className="h-3 w-14 bg-peach-dark/10 rounded animate-pulse" /></td>
                <td className="py-3 pr-4 hidden sm:table-cell"><div className="h-3 w-16 bg-peach-dark/10 rounded animate-pulse" /></td>
                <td className="py-3 hidden sm:table-cell"><div className="h-3 w-32 bg-peach-dark/10 rounded animate-pulse" /></td>
              </tr>
            ))}
            {!loading && investors.map((inv) => (
              <tr key={inv.id} className="border-b border-border/50 hover:bg-ink/[0.02] transition-colors">
                <td className="py-3 pr-4 text-ink/30">{inv.sno}</td>
                <td className="py-3 pr-4 text-ink font-medium">{inv.name}</td>
                <td className="py-3 pr-4 text-ink/60 hidden sm:table-cell">{inv.city || "—"}</td>
                <td className="py-3 pr-4 text-ink/60 hidden md:table-cell">{inv.state || "—"}</td>
                <td className="py-3 pr-4 text-ink/60 hidden lg:table-cell">{inv.country || "—"}</td>

                {/* LinkedIn — blurred for non-paid */}
                <td className="py-3 pr-4 hidden sm:table-cell">
                  {paid ? (
                    inv.linkedin ? (
                      <a href={inv.linkedin} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-peach-dark hover:underline">
                        view <ExternalLink size={10} />
                      </a>
                    ) : <span className="text-ink/20">—</span>
                  ) : (
                    <span className="select-none blur-sm text-ink/60 pointer-events-none">linkedin.com/in/xxxxx</span>
                  )}
                </td>

                {/* Emails — blurred for non-paid */}
                <td className="py-3 hidden sm:table-cell">
                  {paid ? (
                    inv.emails.length > 0 ? (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-ink/70">{inv.emails.join(", ")}</span>
                        <CopyButton text={inv.emails.join(", ")} />
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
      </div>

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
                <p className="font-sans text-xs text-ink/40 mt-0.5">angel investor list · {PRICE} lifetime access</p>
              </div>
              <button onClick={() => setShowSignIn(false)} className="text-ink/40 hover:text-ink transition-colors">
                <X size={18} />
              </button>
            </div>
            <p className="font-sans text-sm text-ink/60 mb-5 leading-relaxed">
              sign in with google, then complete payment for permanent access to the full list.
            </p>
            <SignInOptions
              callbackUrl={typeof window !== "undefined" ? `${window.location.href}?pay=1` : "/fundraise/angel-investors?pay=1"}
              compact
            />
          </div>
        </div>
      )}

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="px-4 md:px-10 pb-12 flex items-center justify-between">
          <p className="font-sans text-xs text-ink/40">
            {paid
              ? `showing ${start}–${end} of ${totalCount.toLocaleString()} investors`
              : `showing 1–${Math.min(PAGE_SIZE, totalCount)} of ${totalCount.toLocaleString()} investors`}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => paid ? fetchPage(page - 1, search, stateFilter, countryFilter) : undefined}
              disabled={!paid || page <= 1 || loading}
              className="inline-flex items-center gap-1 text-xs font-sans font-semibold text-ink/60 hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-3 py-1.5 border border-border rounded-lg"
            >
              <ChevronLeft size={13} /> prev
            </button>

            {/* Page numbers — show a few around current page */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, pageCount) }, (_, i) => {
                const p = paid ? Math.max(1, Math.min(page - 2, pageCount - 4)) + i : i + 1
                const isLocked = !paid && p > 1
                const isCurrent = paid && p === page
                return (
                  <button
                    key={p}
                    onClick={() => paid ? fetchPage(p, search, stateFilter, countryFilter) : setShowSignIn(true)}
                    className={`inline-flex items-center justify-center w-7 h-7 rounded text-xs font-sans font-semibold transition-colors
                      ${isCurrent ? "bg-ink text-cream" : "border border-border text-ink/50 hover:text-ink hover:border-ink/40"}
                      ${isLocked ? "cursor-pointer" : ""}`}
                  >
                    {isLocked ? <Lock size={9} className="text-ink/30" /> : p}
                  </button>
                )
              })}
              {pageCount > 5 && (
                <span className="font-sans text-xs text-ink/30 px-1">… {pageCount}</span>
              )}
            </div>

            <button
              onClick={() => paid ? fetchPage(page + 1, search, stateFilter, countryFilter) : undefined}
              disabled={!paid || page >= pageCount || loading}
              className="inline-flex items-center gap-1 text-xs font-sans font-semibold text-ink/60 hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-3 py-1.5 border border-border rounded-lg"
            >
              next <ChevronRight size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
