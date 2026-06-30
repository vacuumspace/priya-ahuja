"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
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
  linkedinCount: number
  emailCount: number
  userEmail: string | null
  userName: string | null
  displayPrice?: string
}

const PAGE_SIZE = 10
const FREE_PAGES = 3
const PRICE = "₹999" // fallback; actual price passed as prop

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
        <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-ink text-cream text-[12px] font-sans px-2 py-1 rounded whitespace-nowrap pointer-events-none animate-in fade-in duration-150">
          copied to clipboard
        </span>
      )}
    </div>
  )
}

export default function AngelInvestorClient({ isPaid: initialPaid, isAuthenticated, firstPage, total, linkedinCount, emailCount, userEmail, userName, displayPrice }: Props) {
  const price = displayPrice ?? PRICE
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
            setError("Payment received but access setup failed. Email hi@priyaahuja.in with your payment ID.")
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
      <div className="flex justify-between items-center px-4 md:px-10 py-4 text-[13px] text-ink/50 font-sans border-b border-border">
        <span>fundraise · angel investor list</span>
        <span>{totalCount > 0 ? `${totalCount.toLocaleString()} investors` : "loading…"}</span>
      </div>

      <div className="px-4 md:px-10 pt-12 pb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6">
        <div>
          <p className="font-sans text-xs text-ink/40 uppercase tracking-wide mb-2">Fundraise</p>
          <h1 className="font-heading text-3xl md:text-5xl font-800 text-ink mb-4">
            angel investor
            <br />
            contact details
          </h1>
          <p className="font-sans text-sm font-semibold text-ink max-w-md leading-relaxed">
            900 angel investors across India. Name, city, LinkedIn, and direct email(s).
          </p>
          <p className="font-sans text-xs text-ink/40 mt-2">
            updated {new Date().toLocaleString("en-IN", { month: "long", year: "numeric" })}
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
            <span className="text-xs font-sans font-semibold text-ink bg-peach/30 border border-peach-dark/20 px-2.5 py-1 rounded-md">{price} · lifetime access</span>
          </div>
        )}
      </div>

      {/* Description block — shown only when not paid */}
      {!paid && (
        <div className="px-4 md:px-10 pb-8">
          <div className="bg-card border border-border rounded-xl px-5 py-4 space-y-2">
            <p className="font-sans text-xs font-semibold text-ink/70">all about this list</p>
            {[
              "900 angel investors actively writing cheques across India, curated and kept updated.",
              "Each entry includes direct email and LinkedIn so you can reach them without going through assistants or guessing addresses.",
              "Covers angels investing in 2024-26 across fintech, SaaS, D2C, edtech, healthtech, deeptech, consumer brands, climate tech, and more.",
              "One-time payment. No subscriptions, no expiry. Yours forever including future refreshes.",
              "Most contacts have both LinkedIn and email. Some have only one linkedin or email id.",
              "We verify details to the best of our ability and keep improving this list over time. That is why access is given here directly and not as a download, so we can keep updating what you see. Our intention is to genuinely help founders.",
            ].map((point) => (
              <p key={point} className="font-sans text-[12px] text-ink/55 leading-relaxed flex gap-2">
                <span className="text-peach-dark flex-shrink-0">·</span>
                {point}
              </p>
            ))}
            <p className="font-sans text-[12px] text-ink/50 leading-relaxed pt-1 border-t border-border mt-2">
              <span className="font-semibold text-ink/70">Why paid?</span> Curating and maintaining this list takes real effort. Keeping it paid ensures it stays high quality and goes to founders who genuinely need it.
            </p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mx-4 md:mx-10 mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl font-sans text-xs text-red-600">
          {error}
        </div>
      )}

      {/* Search + filters + count */}
      {paid && state === "list" && (
        <div className="px-4 md:px-10 mb-4 flex flex-wrap gap-3 items-center justify-between">
          <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[180px] max-w-xs">
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
          <p className="font-sans text-xs text-ink/40">
            {totalCount.toLocaleString()} investors total
          </p>
        </div>
      )}

      {/* Mobile cards — shown only on small screens */}
      <div className="sm:hidden pb-4 px-4 space-y-3">
        {loading && Array.from({ length: 10 }).map((_, i) => (
          <div key={`skel-${i}`} className="bg-card border border-border rounded-xl p-4 space-y-2 animate-pulse">
            <div className="h-4 w-36 bg-peach-dark/10 rounded" />
            <div className="h-3 w-24 bg-peach-dark/10 rounded" />
            <div className="h-3 w-48 bg-peach-dark/10 rounded" />
          </div>
        ))}
        {!loading && investors.map((inv) => (
          <div key={inv.id} className="bg-card border border-border rounded-xl p-4 space-y-2.5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="font-sans text-[13px] text-ink/30 mr-1.5">{inv.sno}.</span>
                <span className="font-sans text-sm font-semibold text-ink">{inv.name}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-4">
              <div>
                <p className="font-sans text-[12px] text-ink/30 uppercase tracking-wide mb-0.5">City</p>
                <p className="font-sans text-xs text-ink/60">{[inv.city, inv.state].filter(Boolean).join(", ") || "—"}</p>
              </div>
              <div>
                <p className="font-sans text-[12px] text-ink/30 uppercase tracking-wide mb-0.5">LinkedIn</p>
                {paid ? (
                  inv.linkedin ? (
                    <a href={inv.linkedin} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-sans text-peach-dark hover:underline">
                      view <ExternalLink size={10} />
                    </a>
                  ) : <span className="text-ink/20">—</span>
                ) : (
                  <span className="select-none blur-sm text-xs font-sans text-ink/60 pointer-events-none">view</span>
                )}
              </div>
            </div>

            <div>
              <p className="font-sans text-[12px] text-ink/30 uppercase tracking-wide mb-0.5">Email</p>
              <div className="font-sans text-xs text-ink/70">
                {paid ? (
                  inv.emails.length > 0 ? (
                    <div className="flex items-start gap-2 flex-wrap">
                      <span className="break-all">{inv.emails.join(", ")}</span>
                      <CopyButton text={inv.emails.join(", ")} />
                    </div>
                  ) : <span className="text-ink/20">—</span>
                ) : (
                  <span className="select-none blur-sm text-ink/60 pointer-events-none">email@example.com</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table — hidden on small screens */}
      <div className="hidden sm:block pb-4">
        <div className="overflow-x-auto px-4 md:px-10">
          <table className="min-w-[600px] w-full text-xs font-sans border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2.5 pr-4 text-ink/40 font-semibold w-8">#</th>
                <th className="text-left py-2.5 pr-4 text-ink/40 font-semibold">Name <span className="font-normal text-ink/30">({totalCount.toLocaleString()})</span></th>
                <th className="text-left py-2.5 pr-4 text-ink/40 font-semibold">City</th>
                <th className="text-left py-2.5 pr-4 text-ink/40 font-semibold hidden md:table-cell">State</th>
                <th className="text-left py-2.5 pr-4 text-ink/40 font-semibold hidden lg:table-cell">Country</th>
                <th className="text-left py-2.5 pr-4 text-ink/40 font-semibold">LinkedIn <span className="font-normal text-ink/30">({linkedinCount.toLocaleString()})</span></th>
                <th className="text-left py-2.5 text-ink/40 font-semibold">Emails <span className="font-normal text-ink/30">({emailCount.toLocaleString()})</span></th>
              </tr>
            </thead>
            <tbody>
              {loading && Array.from({ length: 10 }).map((_, i) => (
                <tr key={`skel-${i}`} className="border-b border-border/50">
                  <td className="py-3 pr-4"><div className="h-3 w-5 bg-peach-dark/10 rounded animate-pulse" /></td>
                  <td className="py-3 pr-4"><div className="h-3 w-28 bg-peach-dark/10 rounded animate-pulse" /></td>
                  <td className="py-3 pr-4"><div className="h-3 w-16 bg-peach-dark/10 rounded animate-pulse" /></td>
                  <td className="py-3 pr-4 hidden md:table-cell"><div className="h-3 w-20 bg-peach-dark/10 rounded animate-pulse" /></td>
                  <td className="py-3 pr-4 hidden lg:table-cell"><div className="h-3 w-14 bg-peach-dark/10 rounded animate-pulse" /></td>
                  <td className="py-3 pr-4"><div className="h-3 w-16 bg-peach-dark/10 rounded animate-pulse" /></td>
                  <td className="py-3"><div className="h-3 w-32 bg-peach-dark/10 rounded animate-pulse" /></td>
                </tr>
              ))}
              {!loading && investors.map((inv) => (
                <tr key={inv.id} className="border-b border-border/50 hover:bg-ink/[0.02] transition-colors">
                  <td className="py-3 pr-4 text-ink/30">{inv.sno}</td>
                  <td className="py-3 pr-4 text-ink font-medium whitespace-nowrap">{inv.name}</td>
                  <td className="py-3 pr-4 text-ink/60 whitespace-nowrap">{inv.city || "—"}</td>
                  <td className="py-3 pr-4 text-ink/60 hidden md:table-cell whitespace-nowrap">{inv.state || "—"}</td>
                  <td className="py-3 pr-4 text-ink/60 hidden lg:table-cell whitespace-nowrap">{inv.country || "—"}</td>

                  {/* LinkedIn — blurred for non-paid */}
                  <td className="py-3 pr-4">
                    {paid ? (
                      inv.linkedin ? (
                        <a href={inv.linkedin} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-peach-dark hover:underline whitespace-nowrap">
                          view <ExternalLink size={10} />
                        </a>
                      ) : <span className="text-ink/20">—</span>
                    ) : (
                      <span className="select-none blur-sm text-ink/60 pointer-events-none">linkedin.com/in/xxxxx</span>
                    )}
                  </td>

                  {/* Emails — blurred for non-paid */}
                  <td className="py-3">
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
                <p className="font-sans text-xs text-ink/40 mt-0.5">angel investor list · {price} lifetime access</p>
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
              : `showing 1–${Math.min(FREE_PAGES * PAGE_SIZE, totalCount)} of ${totalCount.toLocaleString()} investors`}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => page > 1 ? fetchPage(page - 1, search, stateFilter, countryFilter) : undefined}
              disabled={page <= 1 || loading}
              className="inline-flex items-center gap-1 text-xs font-sans font-semibold text-ink/60 hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-3 py-1.5 border border-border rounded-lg"
            >
              <ChevronLeft size={13} /> prev
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, pageCount) }, (_, i) => {
                const p = (paid || page > FREE_PAGES - 2)
                  ? Math.max(1, Math.min(page - 2, pageCount - 4)) + i
                  : i + 1
                const isLocked = !paid && p > FREE_PAGES
                const isCurrent = p === page
                return (
                  <button
                    key={p}
                    onClick={() => isLocked ? setShowSignIn(true) : fetchPage(p, search, stateFilter, countryFilter)}
                    className={`inline-flex items-center justify-center w-7 h-7 rounded text-xs font-sans font-semibold transition-colors
                      ${isCurrent ? "bg-ink text-cream" : "border border-border text-ink/50 hover:text-ink hover:border-ink/40"}`}
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
              onClick={() => !paid && page >= FREE_PAGES ? setShowSignIn(true) : fetchPage(page + 1, search, stateFilter, countryFilter)}
              disabled={page >= pageCount || loading}
              className="inline-flex items-center gap-1 text-xs font-sans font-semibold text-ink/60 hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-3 py-1.5 border border-border rounded-lg"
            >
              next <ChevronRight size={13} />
            </button>
          </div>
        </div>
      )}

      {/* Other investor lists */}
      <div className="px-4 md:px-10 pb-10 pt-4 border-t border-border/40 mt-2 flex flex-wrap sm:flex-nowrap items-center gap-3">
        <p className="font-sans text-[11px] text-ink/30 uppercase tracking-wide whitespace-nowrap">other investor lists might be useful for you</p>
        <div className="flex flex-wrap sm:flex-nowrap gap-2">
          {[
            { title: "early stage vc", href: "/fundraise/investor-list/early-stage-vc" },
            { title: "family offices", href: "/fundraise/investor-list/family-offices" },
            { title: "incubator & accelerator", href: "/fundraise/investor-list/incubators" },
          ].map(list => (
            <Link key={list.href} href={list.href} className="font-sans text-xs text-ink/70 bg-peach/40 hover:bg-peach/60 border border-peach-dark/20 hover:border-peach-dark/40 px-3 py-1 rounded-full transition-colors">
              {list.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
