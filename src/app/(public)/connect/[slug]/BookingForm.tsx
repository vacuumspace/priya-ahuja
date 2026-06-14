"use client"

import { useState, useEffect } from "react"

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any
  }
}
import { useSession, signIn } from "next-auth/react"
import { loadRazorpay } from "@/lib/load-razorpay"
import SignInOptions from "@/components/SignInOptions"
import { Service } from "@/lib/services-data"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { CheckCircle, Loader2, Link2, CalendarDays, Clock, LogIn, ArrowRight } from "lucide-react"
import Link from "next/link"

type Slot = {
  id: string
  date: string        // YYYY-MM-DD
  startTime: string   // HH:MM
  endTime: string     // HH:MM
}

function formatDate(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long",
  })
}

function SlotPicker({ slug, onSelect }: { slug: string; onSelect: (slot: Slot | null) => void }) {
  const [slots, setSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)

  useEffect(() => {
    fetch(`/api/connect/${slug}/slots`)
      .then((r) => r.json())
      .then((data) => { setSlots(data); setLoading(false) })
  }, [slug])

  const dates = [...new Set(slots.map((s) => s.date))].sort()
  const slotsForDate = selectedDate ? slots.filter((s) => s.date === selectedDate) : []

  const select = (slot: Slot) => {
    setSelectedSlot(slot)
    onSelect(slot)
  }

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="h-3 w-24 bg-peach-dark/10 rounded animate-pulse" />
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3].map(i => <div key={i} className="h-8 w-16 bg-peach-dark/10 rounded-lg animate-pulse" />)}
        </div>
      </div>
    )
  }

  if (slots.length === 0) {
    return (
      <div className="bg-peach/20 border border-peach-dark/20 rounded-xl p-4 text-center">
        <p className="text-sm font-sans text-ink/60">No slots available right now.</p>
        <p className="text-xs font-sans text-ink/40 mt-1">Check back soon or reach out directly.</p>
      </div>
    )
  }

  if (selectedSlot) {
    return (
      <div className="bg-peach/20 border border-peach-dark/30 rounded-xl p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarDays size={13} className="text-peach-dark" />
          <div>
            <p className="text-xs font-sans font-semibold text-ink">{formatDate(selectedSlot.date)}</p>
            <p className="text-[11px] font-sans text-ink/60">{selectedSlot.startTime} – {selectedSlot.endTime}</p>
          </div>
        </div>
        <button
          onClick={() => { setSelectedSlot(null); setSelectedDate(selectedSlot.date); onSelect(null) }}
          className="text-[11px] font-sans text-ink/40 hover:text-ink underline"
        >
          change
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div>
        <p className="text-[10px] font-sans text-ink/40 uppercase tracking-wide mb-2">Pick a date</p>
        <div className="flex flex-wrap gap-2">
          {dates.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setSelectedDate(d)}
              className={`text-xs font-sans px-3 py-1.5 rounded-lg border transition-all ${
                selectedDate === d
                  ? "bg-ink text-cream border-ink"
                  : "bg-transparent text-ink/60 border-border hover:border-ink/30 hover:text-ink"
              }`}
            >
              {new Date(d + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
            </button>
          ))}
        </div>
      </div>

      {selectedDate && (
        <div>
          <p className="text-[10px] font-sans text-ink/40 uppercase tracking-wide mb-2">Pick a time</p>
          <div className="flex flex-wrap gap-2">
            {slotsForDate.map((slot) => (
              <button
                key={slot.id}
                type="button"
                onClick={() => select(slot)}
                className="flex items-center gap-1.5 text-xs font-sans px-3 py-1.5 rounded-lg border border-border bg-cream text-ink/70 hover:border-peach-dark/50 hover:text-ink transition-all"
              >
                <Clock size={11} className="text-peach-dark" />
                {slot.startTime} – {slot.endTime}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function BookingForm({ service }: { service: Service }) {
  const { data: session, status } = useSession()
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const [deckLink, setDeckLink] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  // Pre-fill name from session
  useEffect(() => {
    if (session?.user?.name && !name) {
      setName(session.user.name)
    }
  }, [session])

  const needsSlot = service.type === "call"
  const canSubmit = !needsSlot || selectedSlot !== null

  // Not signed in — show sign-in gate
  if (status === "unauthenticated") {
    return (
      <div className="text-center py-6 space-y-4">
        <div className="bg-peach/20 border border-peach-dark/20 rounded-2xl p-6">
          <LogIn size={32} className="text-peach-dark mx-auto mb-3" />
          <p className="font-heading text-base font-700 text-ink mb-1">sign in to book</p>
          <p className="font-sans text-sm text-ink/60 leading-relaxed mb-4">
            a free account is required to complete your booking.
          </p>
          <SignInOptions callbackUrl={typeof window !== "undefined" ? window.location.href : "/"} />
        </div>
      </div>
    )
  }

  if (status === "loading") {
    return <p className="text-xs font-sans text-ink/40 py-4 text-center">Loading…</p>
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (needsSlot && !selectedSlot) {
      setError("Please select a time slot.")
      return
    }
    setError("")
    setLoading(true)

    try {
      const fullMessage = [
        deckLink ? `Deck/Doc Link: ${deckLink}` : null,
        message || null,
      ].filter(Boolean).join("\n\n")

      const orderRes = await fetch("/api/bookings/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceSlug: service.slug,
          slotId: selectedSlot?.id ?? null,
          name,
          email: session!.user!.email,
          message: fullMessage || null,
        }),
      })
      const orderData = await orderRes.json()
      if (!orderRes.ok) throw new Error(orderData.error || "Failed to create order")

      await loadRazorpay()
      await new Promise<void>((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: orderData.keyId,
          amount: orderData.amount,
          currency: "INR",
          name: "Priya Ahuja",
          description: service.title,
          order_id: orderData.orderId,
          prefill: {
            name,
            email: session!.user!.email ?? "",
          },
          theme: { color: "#1a1a1a" },
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
              const verifyData = await verifyRes.json()
              if (!verifyRes.ok) throw new Error(verifyData.error || "Payment verification failed")
              resolve()
            } catch (err) {
              reject(err)
            }
          },
          modal: {
            ondismiss: () => reject(new Error("Payment cancelled")),
          },
        })
        rzp.open()
      })

      setSuccess(true)
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong"
      if (msg !== "Payment cancelled") setError(msg)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-4">
        <CheckCircle size={40} className="text-peach-dark mx-auto mb-3" />
        <p className="font-heading text-lg font-700 text-ink mb-2">you&apos;re all set!</p>
        <p className="font-sans text-sm text-ink/60 leading-relaxed mb-4">
          {service.type === "report"
            ? "i'll send your written analysis within 3 business days."
            : "your slot is confirmed — check your email for details."}
        </p>
        <Link
          href="/my-sessions"
          className="inline-flex items-center gap-2 text-xs font-sans font-600 text-peach-dark border border-peach-dark/30 rounded-xl px-4 py-2 hover:bg-peach/20 transition-colors"
        >
          view my bookings <ArrowRight size={13} />
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Slot picker — only for call-type services */}
      {needsSlot && (
        <div>
          <Label className="text-xs font-sans text-ink/60 mb-2 block">select a time slot</Label>
          <SlotPicker slug={service.slug} onSelect={setSelectedSlot} />
        </div>
      )}

      <div>
        <Label htmlFor="name" className="text-xs font-sans text-ink/60 mb-1 block">your name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="ankit sharma" required className="bg-cream border-border text-sm" />
      </div>

      {/* Signed in as — info chip */}
      <div className="bg-peach/10 border border-peach-dark/20 rounded-xl px-3 py-2 flex items-center justify-between">
        <p className="text-[11px] font-sans text-ink/60">
          booking as <span className="font-semibold text-ink">{session?.user?.email}</span>
        </p>
        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: window.location.href })}
          className="text-[10px] font-sans text-ink/40 hover:text-ink underline"
        >
          switch
        </button>
      </div>

      {service.acceptsDeckLink && (
        <div>
          <Label htmlFor="deckLink" className="text-xs font-sans text-ink/60 mb-1 flex items-center gap-1.5">
            <Link2 size={11} />
            {service.deckLinkLabel ?? "deck / doc link"}
            {(service as any).deckLinkRequired || service.type === "report"
              ? <span className="text-red-400">*</span>
              : <span className="text-ink/30">(optional)</span>}
          </Label>
          <Input
            id="deckLink"
            type="url"
            value={deckLink}
            onChange={(e) => setDeckLink(e.target.value)}
            placeholder={service.deckLinkPlaceholder ?? "google drive / docsend link"}
            required={(service as any).deckLinkRequired || service.type === "report"}
            className="bg-cream border-border text-sm"
          />
          <p className="text-[10px] text-ink/40 mt-1 font-sans">ensure view access is enabled before submitting</p>
        </div>
      )}

      <div>
        <Label htmlFor="message" className="text-xs font-sans text-ink/60 mb-1 block">
          {service.type === "report" ? "anything specific you want analysed?" : "what would you like to discuss?"}
          <span className="text-ink/30 ml-1">(optional)</span>
        </Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={service.type === "report" ? "specific areas to focus on, key concerns…" : "brief context helps me prepare — stage, what you're stuck on…"}
          rows={3}
          className="bg-cream border-border text-sm resize-none"
        />
      </div>

      {error && <p className="text-xs font-sans text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

      <Button
        type="submit"
        disabled={loading || !canSubmit}
        className="w-full bg-ink text-cream hover:bg-ink/80 font-sans font-semibold text-sm py-3 rounded-xl disabled:opacity-40"
      >
        {loading ? (
          <span className="flex items-center gap-2"><Loader2 size={14} className="animate-spin" />booking…</span>
        ) : needsSlot && !selectedSlot ? (
          "select a slot to continue"
        ) : (
          "confirm booking"
        )}
      </Button>
      <p className="text-[10px] text-ink/30 text-center font-sans">secure payment via razorpay</p>
    </form>
  )
}
