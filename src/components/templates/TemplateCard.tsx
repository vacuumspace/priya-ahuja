"use client"

import { useState, useEffect } from "react"
import { FileText, Download, Lock, X, ChevronDown, ChevronUp, CheckCircle } from "lucide-react"
import type { Template } from "@/lib/templates-data"
import { loadRazorpay } from "@/lib/load-razorpay"

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any
  }
}

type Props = {
  product: Template
}

type Section = { heading: string; body: string }

type ModalState =
  | { type: "idle" }
  | { type: "buy" }
  | { type: "check-access" }
  | { type: "paying"; name: string; email: string }
  | { type: "content"; sections: Section[] }

function renderBody(text: string) {
  // Convert **bold**, headings (lines starting with #), --- dividers, and newlines
  const html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .split("\n")
    .map((line) => {
      if (line.startsWith("---")) return `<hr class="border-border my-4" />`
      if (line.match(/^\*\*(.+)\*\*$/)) return `<p class="font-semibold text-ink mt-4 mb-1">${line.replace(/\*\*/g, "")}</p>`
      const bold = line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      if (line.startsWith("- ") || line.match(/^\d+\./)) {
        return `<li class="ml-4 list-disc text-ink/80 leading-relaxed text-sm">${bold.replace(/^- /, "").replace(/^\d+\.\s*/, "")}</li>`
      }
      if (line.trim() === "") return `<div class="h-2"></div>`
      return `<p class="text-ink/80 leading-relaxed text-sm">${bold}</p>`
    })
    .join("")
  return html
}

export default function TemplateCard({ product }: Props) {
  const [modal, setModal] = useState<ModalState>({ type: "idle" })
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [accessEmail, setAccessEmail] = useState("")
  const [accessToken, setAccessToken] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [openSection, setOpenSection] = useState<number | null>(0)
  const [hasAccess, setHasAccess] = useState(false)

  useEffect(() => {
    setHasAccess(!!localStorage.getItem(`access_${product.slug}`))
  }, [product.slug])

  function close() {
    setModal({ type: "idle" })
    setError("")
    setName("")
    setEmail("")
    setAccessEmail("")
  }

  async function handleBuy(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/products/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: product.slug, name, email }),
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
          const verifyData = await verifyRes.json()
          if (!verifyRes.ok) {
            setError("Payment verified but access setup failed. Email hi@priyaahuja.in with your payment ID.")
            return
          }
          // Store token in localStorage for convenience
          localStorage.setItem(`access_${product.slug}`, verifyData.accessToken)
          setHasAccess(true)
          await loadContent(verifyData.accessToken)
        },
        prefill: { name, email },
        theme: { color: "#1a1a1a" },
      })
      rzp.open()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  async function loadContent(token: string) {
    setLoading(true)
    try {
      const res = await fetch(`/api/products/access?token=${encodeURIComponent(token)}&slug=${product.slug}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Could not load content")
      setAccessToken(token)
      setModal({ type: "content", sections: data.sections })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load content")
    } finally {
      setLoading(false)
    }
  }

  async function handleCheckAccess(e: React.FormEvent) {
    e.preventDefault()
    if (!accessEmail.trim()) return
    setLoading(true)
    setError("")
    try {
      // Check localStorage first
      const cached = localStorage.getItem(`access_${product.slug}`)
      if (cached) {
        await loadContent(cached)
        return
      }
      const res = await fetch("/api/products/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: accessEmail, slug: product.slug }),
      })
      const data = await res.json()
      if (!res.ok || !data.hasAccess) {
        setError("No purchase found for this email. Buy the template to get access.")
        return
      }
      localStorage.setItem(`access_${product.slug}`, data.accessToken)
      setHasAccess(true)
      await loadContent(data.accessToken)
    } catch {
      setError("Something went wrong. Try again.")
    } finally {
      setLoading(false)
    }
  }

  function handleCardClick() {
    // Check localStorage for cached token
    const cached = localStorage.getItem(`access_${product.slug}`)
    if (cached) {
      loadContent(cached)
    }
  }

  const price = `₹${(product.price / 100).toLocaleString("en-IN")}`

  return (
    <>
      <div
        className={`bg-card border rounded-2xl p-4 sm:p-6 transition-all ${
          product.comingSoon
            ? "border-border opacity-60"
            : "border-border hover:border-peach-dark/40 hover:shadow-sm"
        }`}
      >
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <FileText size={14} className="text-peach-dark" />
              <span className="text-[12px] bg-amber-tag text-ink/60 px-2 py-0.5 rounded font-sans">
                {product.tag}
              </span>
              {product.comingSoon && (
                <span className="text-[12px] bg-ink/10 text-ink/50 px-2 py-0.5 rounded font-sans">
                  coming soon
                </span>
              )}
            </div>
            <h2 className="font-heading text-xl font-700 text-ink mb-2">{product.title}</h2>
            <p className="font-sans text-sm text-ink/60 leading-relaxed max-w-lg">{product.description}</p>
            {!product.comingSoon && (
              <p className="font-sans text-xs text-ink/40 mt-3 italic">{product.preview}</p>
            )}
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-sans font-700 text-ink text-lg mb-3">{price}</p>
            {!product.comingSoon && (
              <div className="flex flex-col gap-2 items-end">
                {hasAccess ? (
                  <button
                    onClick={() => { const t = localStorage.getItem(`access_${product.slug}`); if (t) loadContent(t) }}
                    className="inline-flex items-center gap-1.5 bg-ink text-cream text-xs font-sans font-semibold px-4 py-2 rounded-lg hover:bg-ink/80 transition-colors"
                  >
                    <FileText size={11} />
                    view
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setModal({ type: "buy" })}
                      className="inline-flex items-center gap-1.5 bg-ink text-cream text-xs font-sans font-semibold px-4 py-2 rounded-lg hover:bg-ink/80 transition-colors"
                    >
                      <Download size={11} />
                      buy now
                    </button>
                    <button
                      onClick={() => setModal({ type: "check-access" })}
                      className="inline-flex items-center gap-1.5 text-xs font-sans text-ink/40 hover:text-ink/70 transition-colors"
                    >
                      <Lock size={10} />
                      already bought?
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal backdrop */}
      {modal.type !== "idle" && (
        <div
          className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) close() }}
        >
          <div className="bg-cream rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">

            {/* Buy modal */}
            {modal.type === "buy" && (
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="font-sans text-xs text-ink/40 uppercase tracking-wide mb-1">{product.tag}</p>
                    <h3 className="font-heading text-xl font-700 text-ink">{product.title}</h3>
                    <p className="font-sans font-700 text-ink mt-1">{price}</p>
                  </div>
                  <button onClick={close} className="text-ink/40 hover:text-ink transition-colors">
                    <X size={18} />
                  </button>
                </div>
                <p className="font-sans text-sm text-ink/60 mb-6 leading-relaxed">
                  After payment, you&apos;ll get instant on-site access. No download - the full content opens right here.
                </p>
                <form onSubmit={handleBuy} className="space-y-4">
                  <div>
                    <label className="block font-sans text-xs text-ink/50 mb-1.5 uppercase tracking-wide">Your name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="First name"
                      className="w-full border border-border rounded-lg px-3 py-2.5 font-sans text-sm text-ink bg-white focus:outline-none focus:border-ink/40 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-xs text-ink/50 mb-1.5 uppercase tracking-wide">Email address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="you@example.com"
                      className="w-full border border-border rounded-lg px-3 py-2.5 font-sans text-sm text-ink bg-white focus:outline-none focus:border-ink/40 transition-colors"
                    />
                    <p className="font-sans text-[13px] text-ink/40 mt-1.5">Save this email - you&apos;ll use it to access the content later.</p>
                  </div>
                  {error && <p className="font-sans text-xs text-red-500">{error}</p>}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-ink text-cream font-sans font-semibold text-sm py-3 rounded-lg hover:bg-ink/80 transition-colors disabled:opacity-50"
                  >
                    {loading ? "processing…" : `Pay ${price}`}
                  </button>
                </form>
              </div>
            )}

            {/* Already bought / check access modal */}
            {modal.type === "check-access" && (
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="font-heading text-xl font-700 text-ink">Access your purchase</h3>
                    <p className="font-sans text-sm text-ink/50 mt-1">{product.title}</p>
                  </div>
                  <button onClick={close} className="text-ink/40 hover:text-ink transition-colors">
                    <X size={18} />
                  </button>
                </div>
                <form onSubmit={handleCheckAccess} className="space-y-4">
                  <div>
                    <label className="block font-sans text-xs text-ink/50 mb-1.5 uppercase tracking-wide">Email you used when buying</label>
                    <input
                      type="email"
                      value={accessEmail}
                      onChange={(e) => setAccessEmail(e.target.value)}
                      required
                      placeholder="you@example.com"
                      className="w-full border border-border rounded-lg px-3 py-2.5 font-sans text-sm text-ink bg-white focus:outline-none focus:border-ink/40 transition-colors"
                    />
                  </div>
                  {error && <p className="font-sans text-xs text-red-500">{error}</p>}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-ink text-cream font-sans font-semibold text-sm py-3 rounded-lg hover:bg-ink/80 transition-colors disabled:opacity-50"
                  >
                    {loading ? "Checking…" : "Open my content"}
                  </button>
                </form>
              </div>
            )}

            {/* Content viewer */}
            {modal.type === "content" && (
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    <div>
                      <h3 className="font-heading text-xl font-700 text-ink">{product.title}</h3>
                      <p className="font-sans text-xs text-ink/40 mt-0.5">access confirmed · {(modal.sections.length)} sections</p>
                    </div>
                  </div>
                  <button onClick={close} className="text-ink/40 hover:text-ink transition-colors">
                    <X size={18} />
                  </button>
                </div>

                <div className="border-t border-border mt-4 pt-4 space-y-2">
                  {modal.sections.map((section, i) => (
                    <div key={i} className="border border-border rounded-xl overflow-hidden">
                      <button
                        onClick={() => setOpenSection(openSection === i ? null : i)}
                        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-ink/5 transition-colors"
                      >
                        <span className="font-sans font-semibold text-sm text-ink">{section.heading}</span>
                        {openSection === i ? (
                          <ChevronUp size={14} className="text-ink/40 flex-shrink-0" />
                        ) : (
                          <ChevronDown size={14} className="text-ink/40 flex-shrink-0" />
                        )}
                      </button>
                      {openSection === i && (
                        <div
                          className="px-4 pb-4 border-t border-border"
                          dangerouslySetInnerHTML={{ __html: renderBody(section.body) }}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <p className="font-sans text-[13px] text-ink/30 mt-4 text-center">
                  Your access is saved in this browser. To access on another device, use &quot;already bought?&quot; with your email.
                </p>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  )
}
