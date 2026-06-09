"use client"

import { useState } from "react"
import { Service } from "@/lib/services-data"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { CheckCircle, Loader2, Link2 } from "lucide-react"

interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  handler: (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => void
  prefill: { name: string; email: string }
  theme: { color: string }
}

export function BookingForm({ service }: { service: Service }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [deckLink, setDeckLink] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const fullMessage = [
      deckLink ? `Deck/Model Link: ${deckLink}` : null,
      message || null,
    ].filter(Boolean).join("\n\n")

    try {
      const orderRes = await fetch("/api/bookings/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceSlug: service.slug, name, email, message: fullMessage }),
      })
      const orderData = await orderRes.json()
      if (!orderRes.ok) throw new Error(orderData.error || "Failed to create order")

      if (!window.Razorpay) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script")
          script.src = "https://checkout.razorpay.com/v1/checkout.js"
          script.onload = () => resolve()
          script.onerror = () => reject(new Error("Failed to load Razorpay"))
          document.body.appendChild(script)
        })
      }

      await new Promise<void>((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: orderData.keyId,
          amount: orderData.amount,
          currency: "INR",
          name: "Priya Ahuja",
          description: service.title,
          order_id: orderData.orderId,
          handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
            try {
              const verifyRes = await fetch("/api/bookings/verify-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  bookingId: orderData.bookingId,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                }),
              })
              if (!verifyRes.ok) {
                const d = await verifyRes.json()
                throw new Error(d.error || "Payment verification failed")
              }
              resolve()
            } catch (err) {
              reject(err)
            }
          },
          prefill: { name, email },
          theme: { color: "#FFA07A" },
        })
        rzp.open()
      })

      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-4">
        <CheckCircle size={40} className="text-peach-dark mx-auto mb-3" />
        <p className="font-heading text-lg font-700 text-ink mb-2">you&apos;re all set!</p>
        <p className="font-sans text-sm text-ink/60 leading-relaxed">
          {service.type === "dm"
            ? "i'll respond to your message within 2 business days."
            : service.type === "report"
            ? "i'll send your written analysis within 3 business days."
            : service.urgencyNote
            ? "i'll reach out within a few hours to schedule."
            : "check your email for confirmation and calendar invite."}
        </p>
      </div>
    )
  }

  const isAsyncType = service.type === "dm" || service.type === "report"

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name" className="text-xs font-sans text-ink/60 mb-1 block">
          your name
        </Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="ankit sharma"
          required
          className="bg-cream border-border text-sm"
        />
      </div>
      <div>
        <Label htmlFor="email" className="text-xs font-sans text-ink/60 mb-1 block">
          email
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@startup.com"
          required
          className="bg-cream border-border text-sm"
        />
      </div>

      {service.acceptsDeckLink && (
        <div>
          <Label htmlFor="deckLink" className="text-xs font-sans text-ink/60 mb-1 flex items-center gap-1.5">
            <Link2 size={11} />
            {service.deckLinkLabel ?? "deck / model link"}
            {service.type === "report" && <span className="text-red-400">*</span>}
            {service.type !== "report" && <span className="text-ink/30">(optional)</span>}
          </Label>
          <Input
            id="deckLink"
            type="url"
            value={deckLink}
            onChange={(e) => setDeckLink(e.target.value)}
            placeholder={service.deckLinkPlaceholder ?? "google drive / docsend link"}
            required={service.type === "report"}
            className="bg-cream border-border text-sm"
          />
          <p className="text-[10px] text-ink/40 mt-1 font-sans">
            ensure view access is enabled before submitting
          </p>
        </div>
      )}

      {isAsyncType ? (
        <div>
          <Label htmlFor="message" className="text-xs font-sans text-ink/60 mb-1 block">
            {service.type === "report" ? "anything specific you want analysed?" : "your question"}
            {service.type === "report" && <span className="text-ink/30 ml-1">(optional)</span>}
            {service.type === "dm" && <span className="text-red-400 ml-1">*</span>}
          </Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              service.type === "report"
                ? "specific slides to focus on, investor stage, key concerns…"
                : "what would you like to ask?"
            }
            required={service.type === "dm"}
            rows={4}
            className="bg-cream border-border text-sm resize-none"
          />
        </div>
      ) : (
        <div>
          <Label htmlFor="message" className="text-xs font-sans text-ink/60 mb-1 block">
            what would you like to discuss? <span className="text-ink/30">(optional)</span>
          </Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="brief context helps me prepare — stage, last round, what you're stuck on…"
            rows={3}
            className="bg-cream border-border text-sm resize-none"
          />
        </div>
      )}

      {error && (
        <p className="text-xs font-sans text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
      )}
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-ink text-cream hover:bg-ink/80 font-sans font-semibold text-sm py-3 rounded-xl"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 size={14} className="animate-spin" />
            processing…
          </span>
        ) : service.type === "report" ? (
          "pay & submit deck →"
        ) : (
          "pay & book →"
        )}
      </Button>
      <p className="text-[10px] text-ink/30 text-center font-sans">
        secure payment via razorpay
      </p>
    </form>
  )
}
