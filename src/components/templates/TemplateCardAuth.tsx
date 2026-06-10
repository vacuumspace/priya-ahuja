"use client"

import { useState } from "react"
import { FileText, Eye, Download, X, ChevronDown, ChevronUp, CheckCircle, Loader2 } from "lucide-react"
import type { Template } from "@/lib/templates-data"

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any
  }
}

type Section = { heading: string; body: string }

type ModalState =
  | { type: "idle" }
  | { type: "sign-in" }
  | { type: "buy" }
  | { type: "content"; sections: Section[] }

function renderBody(text: string) {
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

type Props = {
  product: Template
  isAuthenticated: boolean
  purchaseToken?: string
  userName?: string
  userEmail?: string
}

export default function TemplateCardAuth({ product, isAuthenticated, purchaseToken, userEmail }: Props) {
  const [modal, setModal] = useState<ModalState>({ type: "idle" })
  const [buyName, setBuyName] = useState("")
  const [buyEmail, setBuyEmail] = useState(userEmail ?? "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [openSection, setOpenSection] = useState<number | null>(0)

  function close() {
    setModal({ type: "idle" })
    setError("")
  }

  async function loadContent(token: string) {
    setLoading(true)
    try {
      const res = await fetch(`/api/products/access?token=${encodeURIComponent(token)}&slug=${product.slug}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Could not load content")
      setModal({ type: "content", sections: data.sections })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load content")
    } finally {
      setLoading(false)
    }
  }

  async function handleBuy(e: React.FormEvent) {
    e.preventDefault()
    if (!buyName.trim() || !buyEmail.trim()) return
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/products/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: product.slug, name: buyName, email: buyEmail }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to create order")

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
            setError("Payment verified but access setup failed. Email hello@priyaahuja.com with your payment ID.")
            return
          }
          await loadContent(verifyData.accessToken)
        },
        prefill: { name: buyName, email: buyEmail },
        theme: { color: "#1a1a1a" },
      })
      rzp.open()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const price = `₹${(product.price / 100).toLocaleString("en-IN")}`

  return (
    <>
      <div className={`bg-card border rounded-2xl p-5 transition-all ${product.comingSoon ? "border-border opacity-60" : "border-border hover:border-peach-dark/40 hover:shadow-sm"}`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={13} className="text-peach-dark flex-shrink-0" />
              <span className="text-[10px] bg-amber-tag text-ink/60 px-2 py-0.5 rounded font-sans">{product.tag}</span>
              {product.comingSoon && (
                <span className="text-[10px] bg-ink/10 text-ink/50 px-2 py-0.5 rounded font-sans">coming soon</span>
              )}
              {purchaseToken && (
                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-sans font-semibold">purchased</span>
              )}
            </div>
            <h3 className="font-heading text-base font-700 text-ink mb-1">{product.title}</h3>
            <p className="font-sans text-xs text-ink/55 leading-relaxed">{product.description}</p>
          </div>

          {!product.comingSoon && (
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              <p className="font-sans font-700 text-ink text-sm">{price}</p>

              {purchaseToken ? (
                // Already purchased — show View button directly
                <button
                  onClick={() => loadContent(purchaseToken)}
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 bg-ink text-cream text-xs font-sans font-semibold px-4 py-2 rounded-lg hover:bg-ink/80 transition-colors disabled:opacity-50"
                >
                  {loading ? <Loader2 size={11} className="animate-spin" /> : <Eye size={11} />}
                  view
                </button>
              ) : (
                // Buy — opens sign-in modal if not authenticated, buy modal if authenticated
                <button
                  onClick={() => isAuthenticated ? setModal({ type: "buy" }) : setModal({ type: "sign-in" })}
                  className="inline-flex items-center gap-1.5 bg-ink text-cream text-xs font-sans font-semibold px-4 py-2 rounded-lg hover:bg-ink/80 transition-colors"
                >
                  <Download size={11} />
                  buy now
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {modal.type !== "idle" && (
        <div
          className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) close() }}
        >
          <div className="bg-cream rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">

            {/* Sign-in modal */}
            {modal.type === "sign-in" && (
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="font-heading text-xl font-700 text-ink">sign in to continue</h3>
                    <p className="font-sans text-sm text-ink/50 mt-1">{product.title}</p>
                  </div>
                  <button onClick={close} className="text-ink/40 hover:text-ink transition-colors"><X size={18} /></button>
                </div>
                <p className="font-sans text-sm text-ink/60 mb-6 leading-relaxed">
                  sign in to purchase and access this template from any device, anytime.
                </p>
                <form method="POST" action="/api/auth/signin/google">
                  <input type="hidden" name="callbackUrl" value={typeof window !== "undefined" ? window.location.pathname : "/"} />
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 bg-ink text-cream font-sans font-semibold text-sm py-3 rounded-lg hover:bg-ink/80 transition-colors"
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
            )}

            {/* Buy modal */}
            {modal.type === "buy" && (
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="font-sans text-xs text-ink/40 uppercase tracking-wide mb-1">{product.tag}</p>
                    <h3 className="font-heading text-xl font-700 text-ink">{product.title}</h3>
                    <p className="font-sans font-700 text-ink mt-1">{price}</p>
                  </div>
                  <button onClick={close} className="text-ink/40 hover:text-ink transition-colors"><X size={18} /></button>
                </div>
                <p className="font-sans text-sm text-ink/60 mb-6 leading-relaxed">
                  After payment, you&apos;ll get instant on-site access. The full content opens right here, and is also saved to your account under History → Templates.
                </p>
                <form onSubmit={handleBuy} className="space-y-4">
                  <div>
                    <label className="block font-sans text-xs text-ink/50 mb-1.5 uppercase tracking-wide">Your name</label>
                    <input
                      type="text"
                      value={buyName}
                      onChange={(e) => setBuyName(e.target.value)}
                      required
                      placeholder="First name"
                      className="w-full border border-border rounded-lg px-3 py-2.5 font-sans text-sm text-ink bg-white focus:outline-none focus:border-ink/40 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-xs text-ink/50 mb-1.5 uppercase tracking-wide">Email address</label>
                    <input
                      type="email"
                      value={buyEmail}
                      onChange={(e) => setBuyEmail(e.target.value)}
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
                    {loading ? "Setting up payment…" : `Pay ${price}`}
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
                      <p className="font-sans text-xs text-ink/40 mt-0.5">access confirmed · {modal.sections.length} sections</p>
                    </div>
                  </div>
                  <button onClick={close} className="text-ink/40 hover:text-ink transition-colors"><X size={18} /></button>
                </div>
                <div className="border-t border-border mt-4 pt-4 space-y-2">
                  {modal.sections.map((section, i) => (
                    <div key={i} className="border border-border rounded-xl overflow-hidden">
                      <button
                        onClick={() => setOpenSection(openSection === i ? null : i)}
                        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-ink/5 transition-colors"
                      >
                        <span className="font-sans font-semibold text-sm text-ink">{section.heading}</span>
                        {openSection === i ? <ChevronUp size={14} className="text-ink/40 flex-shrink-0" /> : <ChevronDown size={14} className="text-ink/40 flex-shrink-0" />}
                      </button>
                      {openSection === i && (
                        <div className="px-4 pb-4 border-t border-border" dangerouslySetInnerHTML={{ __html: renderBody(section.body) }} />
                      )}
                    </div>
                  ))}
                </div>
                <p className="font-sans text-[11px] text-ink/30 mt-4 text-center">
                  Access this anytime from History → Templates in your account.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
