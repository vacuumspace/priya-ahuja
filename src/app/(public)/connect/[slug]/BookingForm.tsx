"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"

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
import { CheckCircle, Loader2, Link2, CalendarDays, Clock, LogIn, ArrowRight, User, Mail } from "lucide-react"
import Link from "next/link"

type Slot = {
  id: string
  date: string        // YYYY-MM-DD
  startTime: string   // HH:MM  (IST)
  endTime: string     // HH:MM  (IST)
}

function formatDate(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long",
  })
}

// Convert IST (UTC+5:30) time string to user's local timezone
function toLocalTime(date: string, time: string): string {
  const dt = new Date(`${date}T${time}:00+05:30`)
  return dt.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", hour12: true })
}

function userTZLabel(): string {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
  // Return short offset label like "IST", "PST", etc.
  const abbr = new Date().toLocaleTimeString(undefined, { timeZoneName: "short", timeZone: tz }).split(" ").pop()
  return abbr || tz
}

function isNonIST(): boolean {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
  return tz !== "Asia/Calcutta" && tz !== "Asia/Kolkata"
}

function formatSlotTime(date: string, startTime: string, endTime: string): { display: string; localNote: string | null } {
  const istDisplay = `${startTime} – ${endTime} IST`
  if (!isNonIST()) return { display: istDisplay, localNote: null }
  const localStart = toLocalTime(date, startTime)
  const localEnd = toLocalTime(date, endTime)
  const tzLabel = userTZLabel()
  return {
    display: istDisplay,
    localNote: `${localStart} – ${localEnd} ${tzLabel}`,
  }
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
        <div className="flex gap-2">
          {[1, 2, 3].map(i => <div key={i} className="h-8 w-16 bg-peach-dark/10 rounded-lg animate-pulse flex-shrink-0" />)}
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
    const { display, localNote } = formatSlotTime(selectedSlot.date, selectedSlot.startTime, selectedSlot.endTime)
    return (
      <div className="bg-peach/20 border border-peach-dark/30 rounded-xl p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarDays size={13} className="text-peach-dark flex-shrink-0" />
          <div>
            <p className="text-xs font-sans font-semibold text-ink">{formatDate(selectedSlot.date)}</p>
            <p className="text-[11px] font-sans text-ink/60">{display}</p>
            {localNote && (
              <p className="text-[10px] font-sans text-peach-dark/80 mt-0.5">{localNote} (your time)</p>
            )}
          </div>
        </div>
        <button
          onClick={() => { setSelectedSlot(null); setSelectedDate(selectedSlot.date); onSelect(null) }}
          className="text-[11px] font-sans text-ink/40 hover:text-ink underline flex-shrink-0"
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
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {dates.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setSelectedDate(d)}
              className={`flex-shrink-0 text-xs font-sans px-3 py-1.5 rounded-lg border transition-all ${
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
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-sans text-ink/40 uppercase tracking-wide">Pick a time</p>
            {isNonIST() && (
              <p className="text-[10px] font-sans text-peach-dark/70">shown in IST · your local time shown below</p>
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {slotsForDate.map((slot) => {
              const { display, localNote } = formatSlotTime(slot.date, slot.startTime, slot.endTime)
              return (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => select(slot)}
                  className="flex-shrink-0 flex flex-col items-start text-xs font-sans px-3 py-2 rounded-lg border border-border bg-cream text-ink/70 hover:border-peach-dark/50 hover:text-ink transition-all"
                >
                  <span className="flex items-center gap-1.5">
                    <Clock size={11} className="text-peach-dark" />
                    {display}
                  </span>
                  {localNote && (
                    <span className="text-[10px] text-peach-dark/70 mt-0.5 ml-[18px]">{localNote}</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function BookingFormInner({ service }: { service: Service }) {
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()
  const rescheduleId = searchParams.get("reschedule")

  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const [deckLink, setDeckLink] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [showSummary, setShowSummary] = useState(false)
  const [rescheduleCount, setRescheduleCount] = useState<number | null>(null)

  useEffect(() => {
    if (session?.user?.name && !name) {
      setName(session.user.name)
    }
  }, [session])

  const isRescheduleMode = !!rescheduleId

  useEffect(() => {
    if (!rescheduleId || !session) return
    fetch(`/api/bookings/${rescheduleId}`)
      .then((r) => r.json())
      .then((data) => setRescheduleCount(data.rescheduleCount ?? 0))
      .catch(() => setRescheduleCount(0))
  }, [rescheduleId, session])
  const needsSlot = service.type === "call"
  const canSubmit = needsSlot ? selectedSlot !== null : true

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

  async function handleReschedule(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedSlot) { setError("Please select a new time slot."); return }
    setError("")
    setLoading(true)
    try {
      const res = await fetch(`/api/bookings/${rescheduleId}/reschedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slotId: selectedSlot.id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Reschedule failed")
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  async function handlePayment() {
    setLoading(true)
    setError("")
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
            ondismiss: () => {
              fetch(`/api/bookings/${orderData.bookingId}/abort`, { method: "POST" }).catch(() => {})
              reject(new Error("Payment cancelled"))
            },
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (isRescheduleMode) return handleReschedule(e)
    if (needsSlot && !selectedSlot) {
      setError("Please select a time slot.")
      return
    }
    setError("")
    // Show booking summary before opening payment
    setShowSummary(true)
  }

  if (success) {
    return (
      <div className="text-center py-4">
        <CheckCircle size={40} className="text-peach-dark mx-auto mb-3" />
        <p className="font-heading text-lg font-700 text-ink mb-2">
          {isRescheduleMode ? "rescheduled!" : "you're all set!"}
        </p>
        <p className="font-sans text-sm text-ink/60 leading-relaxed mb-2">
          {isRescheduleMode
            ? "your session has been moved — check your email for the updated time."
            : service.type === "report"
            ? "payment received. since i review your documents personally without any ai, it takes me some time to review in detail. i'll surely respond within 5–7 days. thanks :) track progress and message me through my activity."
            : "we've sent you a confirmation email. the google meet link is in your email and in my activity."}
        </p>
        {!isRescheduleMode && (
          <p className="font-sans text-xs text-ink/40 mb-4">
            didn't get the email? check spam or visit my activity below.
          </p>
        )}
        <Link
          href="/my-activity"
          className="inline-flex items-center gap-2 text-xs font-sans font-600 text-cream bg-ink rounded-xl px-5 py-2.5 hover:bg-ink/80 transition-colors"
        >
          view my activity <ArrowRight size={13} />
        </Link>
      </div>
    )
  }

  // Booking summary screen shown before payment
  if (showSummary && (selectedSlot || !needsSlot)) {
    const priceInRupees = Math.round((service.price ?? 0) / 100)
    const slotDisplay = selectedSlot ? formatSlotTime(selectedSlot.date, selectedSlot.startTime, selectedSlot.endTime) : null
    return (
      <div className="space-y-4">
        <div>
          <p className="font-heading text-base font-700 text-ink mb-1">confirm your booking</p>
          <p className="text-[11px] font-sans text-ink/40">review your details before payment</p>
        </div>
        <div className="bg-peach/20 border border-peach-dark/20 rounded-xl divide-y divide-peach-dark/10">
          <div className="px-4 py-3 flex items-start gap-3">
            <CalendarDays size={14} className="text-peach-dark mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[10px] font-sans text-ink/40 uppercase tracking-wide">session</p>
              <p className="text-sm font-sans font-semibold text-ink mt-0.5">{service.title}</p>
            </div>
          </div>
          {selectedSlot && slotDisplay ? (
            <div className="px-4 py-3 flex items-start gap-3">
              <Clock size={14} className="text-peach-dark mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[10px] font-sans text-ink/40 uppercase tracking-wide">date & time</p>
                <p className="text-sm font-sans font-semibold text-ink mt-0.5">{formatDate(selectedSlot.date)}</p>
                <p className="text-xs font-sans text-ink/60">{slotDisplay.display}</p>
                {slotDisplay.localNote && <p className="text-[11px] font-sans text-peach-dark/70">{slotDisplay.localNote} (your time)</p>}
              </div>
            </div>
          ) : (
            <div className="px-4 py-3 flex items-start gap-3">
              <Clock size={14} className="text-peach-dark mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[10px] font-sans text-ink/40 uppercase tracking-wide">delivery</p>
                <p className="text-sm font-sans font-semibold text-ink mt-0.5">Personal review within 5–7 days</p>
                <p className="text-[11px] font-sans text-ink/50 mt-0.5">Reviewed personally, no AI — Priya will follow up via email</p>
              </div>
            </div>
          )}
          <div className="px-4 py-3 flex items-start gap-3">
            <User size={14} className="text-peach-dark mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[10px] font-sans text-ink/40 uppercase tracking-wide">name</p>
              <p className="text-sm font-sans font-semibold text-ink mt-0.5">{name || session?.user?.name}</p>
            </div>
          </div>
          <div className="px-4 py-3 flex items-start gap-3">
            <Mail size={14} className="text-peach-dark mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[10px] font-sans text-ink/40 uppercase tracking-wide">email</p>
              <p className="text-sm font-sans font-semibold text-ink mt-0.5">{session?.user?.email}</p>
            </div>
          </div>
          <div className="px-4 py-3 flex items-center justify-between">
            <p className="text-[10px] font-sans text-ink/40 uppercase tracking-wide">amount</p>
            <p className="font-heading text-xl font-700 text-ink">₹{priceInRupees.toLocaleString("en-IN")}</p>
          </div>
        </div>

        {error && <p className="text-xs font-sans text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

        <Button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-ink text-cream hover:bg-ink/80 font-sans font-semibold text-sm py-3 rounded-xl disabled:opacity-40"
        >
          {loading ? (
            <span className="flex items-center gap-2"><Loader2 size={14} className="animate-spin" />processing…</span>
          ) : (
            `pay ₹${priceInRupees.toLocaleString("en-IN")}`
          )}
        </Button>
        <button
          type="button"
          onClick={() => setShowSummary(false)}
          className="w-full text-xs font-sans text-ink/40 hover:text-ink transition-colors"
        >
          ← go back and edit
        </button>
        <p className="text-[10px] text-ink/30 text-center font-sans">secure payment via razorpay · no refunds</p>
      </div>
    )
  }

  const alreadyRescheduled = rescheduleCount !== null && rescheduleCount >= 1

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isRescheduleMode && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-xs font-sans text-amber-700">
          Pick a new time below. No payment needed — your original booking will be updated.
        </div>
      )}
      {isRescheduleMode && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-xs font-sans text-red-500">
          You can only reschedule once. Please contact us for further changes.
        </div>
      )}
      {(needsSlot || isRescheduleMode) && (
        <div>
          <Label className="text-xs font-sans text-ink/60 mb-2 block">select a time slot</Label>
          <SlotPicker slug={service.slug} onSelect={setSelectedSlot} />
        </div>
      )}

      {!isRescheduleMode && (
        <div>
          <Label htmlFor="name" className="text-xs font-sans text-ink/60 mb-1 block">your name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="ankit sharma" required className="bg-cream border-border text-sm" />
        </div>
      )}

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

      {!isRescheduleMode && service.acceptsDeckLink && (
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
            placeholder={service.deckLinkPlaceholder ?? "google drive / docsend / notion link"}
            required={(service as any).deckLinkRequired || service.type === "report"}
            className="bg-cream border-border text-sm"
          />
          <p className="text-[10px] text-ink/40 mt-1 font-sans">ensure view access is enabled before submitting</p>
        </div>
      )}

      {!isRescheduleMode && (
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
      )}

      {error && <p className="text-xs font-sans text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

      <Button
        type="submit"
        disabled={loading || !canSubmit || alreadyRescheduled}
        className="w-full bg-ink text-cream hover:bg-ink/80 font-sans font-semibold text-sm py-3 rounded-xl disabled:opacity-40"
      >
        {loading ? (
          <span className="flex items-center gap-2"><Loader2 size={14} className="animate-spin" />{isRescheduleMode ? "rescheduling…" : "booking…"}</span>
        ) : needsSlot && !selectedSlot ? (
          "select a slot to continue"
        ) : isRescheduleMode ? (
          "confirm reschedule"
        ) : (
          "review & pay"
        )}
      </Button>
      {!isRescheduleMode && (
        <p className="text-[10px] text-ink/30 text-center font-sans">secure payment via razorpay</p>
      )}
    </form>
  )
}

export function BookingForm({ service }: { service: Service }) {
  return (
    <Suspense fallback={<p className="text-xs font-sans text-ink/40 py-4 text-center">Loading…</p>}>
      <BookingFormInner service={service} />
    </Suspense>
  )
}
