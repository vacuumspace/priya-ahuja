"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Lock, Loader2, X, ChevronLeft, ChevronRight } from "lucide-react"
import SignInOptions from "@/components/SignInOptions"
import { FREE_IDEAS_COUNT, type StartupIdea } from "@/lib/startup-ideas-data"
import { loadRazorpay } from "@/lib/load-razorpay"

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any
  }
}

type Props = {
  isPaid: boolean
  isAuthenticated: boolean
  ideas: StartupIdea[]
  userEmail: string | null
  userName: string | null
}

const PRICE = "₹999"
const PAGE_SIZE = 10
const TOTAL_IDEAS = 100

export default function StartupIdeasClient({ isPaid: initialPaid, isAuthenticated, ideas, userEmail, userName }: Props) {
  const router = useRouter()
  const [paid, setPaid] = useState(initialPaid)
  const [buying, setBuying] = useState(false)
  const [error, setError] = useState("")
  const [showSignIn, setShowSignIn] = useState(false)
  const [page, setPage] = useState(1)

  const total = TOTAL_IDEAS
  const pageCount = Math.ceil(total / PAGE_SIZE)
  const visibleIdeas = paid
    ? ideas.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    : ideas.slice(0, PAGE_SIZE) // always first 10 for non-paid

  const start = (page - 1) * PAGE_SIZE + 1
  const end = Math.min(page * PAGE_SIZE, total)

  async function handleBuy() {
    if (!isAuthenticated) { setShowSignIn(true); return }
    setBuying(true)
    setError("")
    try {
      const res = await fetch("/api/products/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: "startup-ideas-2026", name: userName ?? "", email: userEmail ?? "" }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to create order")

      await loadRazorpay()
      const rzp = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: "INR",
        name: "Priya Ahuja",
        description: "100 Startup Ideas 2026",
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
            return
          }
          setPaid(true)
        },
        prefill: { name: userName ?? "", email: userEmail ?? "" },
        theme: { color: "#1a1a1a" },
        modal: { ondismiss: () => setBuying(false) },
      })
      rzp.open()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setBuying(false)
    }
  }

  function handleRowClick(slug: string, isClickable: boolean) {
    if (isClickable) router.push(`/startup/ideas/${slug}`)
    else handleBuy()
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header bar */}
      <div className="flex justify-between items-center px-4 md:px-10 py-4 text-[11px] text-ink/50 font-sans border-b border-border">
        <span>startup · ideas 2026</span>
        <span>100 ideas for Indian founders</span>
      </div>

      {/* Title + CTA */}
      <div className="px-4 md:px-10 pt-12 pb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <p className="font-sans text-xs text-ink/40 uppercase tracking-wide mb-2">Startup</p>
          <h1 className="font-heading text-3xl md:text-5xl font-800 text-ink mb-4">
            100 startup ideas
            <br />
            for 2026
          </h1>
          <p className="font-sans text-sm text-ink/60 max-w-md leading-relaxed">
            Curated unique and out of the box ideas for Indian founders — each with the real problem, market opportunity, and why now.
            Ideas are evergreen, not only tech or trend-specific, and covers across the industry categories.
            Under tapped, non-obvious, and high potential ideas that you won't find elsewhere.
          </p>
        </div>

        {!paid && (
          <div className="flex-shrink-0 flex flex-col items-start sm:items-end gap-1.5 sm:pt-1">
            <button
              onClick={handleBuy}
              disabled={buying}
              className="inline-flex items-center gap-2 bg-ink text-cream font-sans font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-ink/80 transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              {buying ? <><Loader2 size={13} className="animate-spin" /> processing…</> : "get full access"}
            </button>
            <span className="text-[10px] font-sans text-ink/40">{PRICE} · all 100 ideas unlocked</span>
          </div>
        )}
      </div>

      {error && (
        <div className="mx-4 md:mx-10 mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl font-sans text-xs text-red-600">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="px-4 md:px-10 pb-4 overflow-x-auto">
        <table className="w-full text-xs font-sans border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2.5 pr-4 text-ink/40 font-semibold w-8">#</th>
              <th className="text-left py-2.5 pr-4 text-ink/40 font-semibold">Idea</th>
              <th className="text-left py-2.5 pr-4 text-ink/40 font-semibold hidden sm:table-cell">Category</th>
              <th className="text-left py-2.5 text-ink/40 font-semibold hidden md:table-cell">Tagline</th>
            </tr>
          </thead>
          <tbody>
            {visibleIdeas.map((idea) => {
              const isClickable = idea.sno <= FREE_IDEAS_COUNT || paid
              return (
                <tr
                  key={idea.slug}
                  onClick={() => handleRowClick(idea.slug, isClickable)}
                  className={`border-b border-border/50 transition-colors ${isClickable ? "hover:bg-ink/[0.02] cursor-pointer" : "cursor-pointer"}`}
                >
                  <td className="py-3 pr-4 text-ink/30">{idea.sno}</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      {!isClickable && <Lock size={11} className="text-ink/25 flex-shrink-0" />}
                      <span className={`font-medium ${isClickable ? "text-ink" : "text-ink/40"}`}>
                        {idea.title}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 hidden sm:table-cell">
                    <span className={isClickable ? "text-ink/50" : "text-ink/30"}>{idea.category}</span>
                  </td>
                  <td className="py-3 hidden md:table-cell max-w-xs">
                    {isClickable ? (
                      <span className="text-ink/40 line-clamp-1">{idea.tagline}</span>
                    ) : (
                      <span className="blur-sm select-none pointer-events-none text-ink/30 line-clamp-1">{idea.tagline}</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 md:px-10 pb-10 flex items-center justify-between">
        <p className="font-sans text-xs text-ink/40">
          {paid
            ? `showing ${start}–${end} of ${total} ideas`
            : `showing 1–10 of ${total} ideas`}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => paid ? setPage(p => p - 1) : undefined}
            disabled={!paid || page <= 1}
            className="inline-flex items-center gap-1 text-xs font-sans font-semibold text-ink/60 hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-3 py-1.5 border border-border rounded-lg"
          >
            <ChevronLeft size={13} /> prev
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, pageCount) }, (_, i) => {
              const p = paid ? Math.max(1, Math.min(page - 2, pageCount - 4)) + i : i + 1
              const isLocked = !paid && p > 1
              const isCurrent = paid && p === page
              return (
                <button
                  key={p}
                  onClick={() => paid ? setPage(p) : handleBuy()}
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
            onClick={() => paid ? setPage(p => p + 1) : undefined}
            disabled={!paid || page >= pageCount}
            className="inline-flex items-center gap-1 text-xs font-sans font-semibold text-ink/60 hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-3 py-1.5 border border-border rounded-lg"
          >
            next <ChevronRight size={13} />
          </button>
        </div>
      </div>

      {/* Subtle connect CTA */}
      <div className="mx-4 md:mx-10 mb-16 px-5 py-4 border border-border rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="font-sans text-xs text-ink/40">
          want to brainstorm a specific idea with me?
        </p>
        <Link href="/connect/startup-idea-brainstorming" className="font-sans text-xs font-semibold text-peach-dark hover:underline whitespace-nowrap">
          book a startup brainstorming session →
        </Link>
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
                <p className="font-sans text-xs text-ink/40 mt-0.5">100 startup ideas · {PRICE} one-time</p>
              </div>
              <button onClick={() => setShowSignIn(false)} className="text-ink/40 hover:text-ink transition-colors">
                <X size={18} />
              </button>
            </div>
            <p className="font-sans text-sm text-ink/60 mb-5 leading-relaxed">
              sign in, then complete payment for lifetime access to all 100 ideas.
            </p>
            <SignInOptions
              callbackUrl={typeof window !== "undefined" ? `${window.location.href}?pay=1` : "/startup/ideas?pay=1"}
              compact
            />
          </div>
        </div>
      )}
    </div>
  )
}
