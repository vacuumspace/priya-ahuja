"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { FileText, Eye, Download, X } from "lucide-react"
import type { Template } from "@/lib/templates-data"
import SignInOptions from "@/components/SignInOptions"

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any
  }
}

type ModalState =
  | { type: "idle" }
  | { type: "sign-in" }
  | { type: "buy" }

type Props = {
  product: Template
  isAuthenticated: boolean
  purchaseToken?: string
  userName?: string
  userEmail?: string
}

export default function TemplateCardAuth({ product, isAuthenticated, purchaseToken, userEmail }: Props) {
  const { data: session } = useSession()
  const router = useRouter()
  const [modal, setModal] = useState<ModalState>({ type: "idle" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

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

  function openTemplate() {
    router.push(`/templates/${product.slug}`)
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
          void verifyData
          router.push(`/templates/${product.slug}`)
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
                // Already purchased — navigate to full page
                <button
                  onClick={openTemplate}
                  className="inline-flex items-center gap-1.5 bg-ink text-cream text-xs font-sans font-semibold px-4 py-2 rounded-lg hover:bg-ink/80 transition-colors"
                >
                  <Eye size={11} />
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
                  After payment, you&apos;ll get instant access — the full content opens on its own page, and is also saved to your account under History → Templates.
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

          </div>
        </div>
      )}
    </>
  )
}
