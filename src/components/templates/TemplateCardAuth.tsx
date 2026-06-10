"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { FileText, Eye, Download, X, ChevronDown, ChevronUp, CheckCircle, Loader2 } from "lucide-react"
import type { Template } from "@/lib/templates-data"
import SignInOptions from "@/components/SignInOptions"

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
  const { data: session } = useSession()
  const [modal, setModal] = useState<ModalState>({ type: "idle" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [openSection, setOpenSection] = useState<number | null>(0)

  useEffect(() => {
    if (typeof window === "undefined") return
    const params = new URLSearchParams(window.location.search)
    const buyIntent = params.get("buyIntent")
    if (buyIntent === product.slug && isAuthenticated) {
      setModal({ type: "buy" })
      const url = new URL(window.location.href)
      url.searchParams.delete("buyIntent")
      window.history.replaceState({}, "", url.toString())
    }
  }, [product.slug, isAuthenticated])

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
    const buyName = session?.user?.name ?? ""
    const buyEmail = session?.user?.email ?? userEmail ?? ""
    if (!buyEmail.trim()) return
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

      if (data.orderId === "tester-order") {
        const verifyRes = await fetch("/api/products/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            purchaseId: data.purchaseId,
            razorpayOrderId: "tester-order",
            razorpayPaymentId: "tester-payment",
            razorpaySignature: "",
          }),
        })
        const verifyData = await verifyRes.json()
        if (!verifyRes.ok) {
          setError(verifyData.error || "Something went wrong")
          return
        }
        await loadContent(verifyData.accessToken)
        return
      }

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
                <SignInOptions
                  callbackUrl={typeof window !== "undefined" ? `${window.location.pathname}?buyIntent=${product.slug}` : "/"}
                  compact
                />
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
