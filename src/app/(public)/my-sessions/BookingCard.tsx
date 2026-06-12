"use client"

import { useState, useEffect, useRef } from "react"
import { Video, MessageCircle, RefreshCw, Star, X } from "lucide-react"
import Link from "next/link"

type Message = {
  id: string
  senderName: string
  isAdmin: boolean
  body: string
  createdAt: string
}

function MessagesDrawer({ bookingId, onClose }: { bookingId: string; onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [draft, setDraft] = useState("")
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch(`/api/bookings/${bookingId}/messages`)
      .then((r) => r.json())
      .then(setMessages)
  }, [bookingId])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages])

  const send = async () => {
    if (!draft.trim()) return
    setSending(true)
    const res = await fetch(`/api/bookings/${bookingId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: draft }),
    })
    const msg = await res.json()
    setMessages((prev) => [...prev, msg])
    setDraft("")
    setSending(false)
  }

  return (
    <div className="mt-4 border border-border rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-cream border-b border-border">
        <span className="font-sans text-xs font-semibold text-ink">Messages</span>
        <button onClick={onClose} className="text-ink/40 hover:text-ink"><X size={14} /></button>
      </div>
      <div className="px-4 py-3 flex flex-col gap-2 max-h-52 overflow-y-auto bg-white">
        {messages.length === 0 && (
          <p className="text-xs text-ink/40 font-sans text-center py-4">No messages yet. Start the conversation.</p>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`flex flex-col gap-0.5 ${!m.isAdmin ? "items-end" : "items-start"}`}>
            <span className="text-[10px] font-sans text-ink/40">{m.isAdmin ? "Priya" : "You"}</span>
            <div className={`px-3 py-2 rounded-xl text-xs font-sans max-w-[85%] ${!m.isAdmin ? "bg-peach text-ink" : "bg-border/40 text-ink"}`}>
              {m.body}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="px-3 py-2 border-t border-border flex gap-2 bg-cream">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
          placeholder="Type a message…"
          className="flex-1 text-xs font-sans bg-white border border-border rounded-lg px-3 py-2 text-ink placeholder-ink/30 focus:outline-none focus:border-peach-dark/50"
        />
        <button
          onClick={send}
          disabled={sending || !draft.trim()}
          className="text-xs font-sans font-semibold bg-peach-dark text-white px-3 py-2 rounded-lg disabled:opacity-40"
        >
          Send
        </button>
      </div>
    </div>
  )
}

function useCountdown(slotDate: string | null, slotStartTime: string | null) {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null)

  useEffect(() => {
    if (!slotDate || !slotStartTime) return
    const target = new Date(`${slotDate}T${slotStartTime}:00+05:30`).getTime()

    const tick = () => {
      const diff = Math.floor((target - Date.now()) / 1000)
      setSecondsLeft(diff)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [slotDate, slotStartTime])

  return secondsLeft
}

function formatCountdown(seconds: number): string {
  if (seconds <= 0) return "now"
  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (d > 0) return `${d}d ${h}h`
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

function statusBadge(status: string) {
  const map: Record<string, { label: string; cls: string }> = {
    confirmed: { label: "confirmed", cls: "bg-green-100 text-green-700" },
    paid:      { label: "paid",      cls: "bg-green-100 text-green-700" },
    completed: { label: "completed", cls: "bg-ink/10 text-ink/60" },
    pending:   { label: "pending",   cls: "bg-amber-100 text-amber-700" },
    cancelled: { label: "cancelled", cls: "bg-red-100 text-red-500" },
  }
  const s = map[status] ?? { label: status, cls: "bg-ink/10 text-ink/50" }
  return (
    <span className={`text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full ${s.cls}`}>
      {s.label}
    </span>
  )
}

export default function BookingCard({
  bookingId,
  status,
  serviceTitle,
  serviceSlug,
  meetLink,
  slotDate,
  slotStartTime,
  slotEndTime,
  feedbackRating,
  createdAt,
}: {
  bookingId: string
  status: string
  serviceTitle: string
  serviceSlug: string | null
  meetLink: string | null | undefined
  slotDate: string | null | undefined
  slotStartTime: string | null | undefined
  slotEndTime: string | null | undefined
  feedbackRating: number | null | undefined
  createdAt: string
}) {
  const [currentStatus, setCurrentStatus] = useState(status)
  const [showMessages, setShowMessages] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const secondsLeft = useCountdown(slotDate ?? null, slotStartTime ?? null)

  const isActive = currentStatus === "paid" || currentStatus === "confirmed"
  const isCompleted = currentStatus === "completed"
  const isCancelled = currentStatus === "cancelled"

  // Join is enabled 10 min before (600s) until session end
  const sessionEndMs = slotDate && slotEndTime
    ? new Date(`${slotDate}T${slotEndTime}:00+05:30`).getTime()
    : null
  const joinActive = meetLink && secondsLeft !== null && secondsLeft <= 600 && (sessionEndMs ? Date.now() <= sessionEndMs : true)

  const cancel = async () => {
    if (!confirm("Are you sure you want to cancel this booking?")) return
    setCancelling(true)
    const res = await fetch(`/api/bookings/${bookingId}/cancel`, { method: "POST" })
    if (res.ok) setCurrentStatus("cancelled")
    setCancelling(false)
  }

  const dateLabel = slotDate && slotStartTime
    ? new Date(`${slotDate}T${slotStartTime}:00+05:30`).toLocaleDateString("en-IN", {
        weekday: "short", day: "numeric", month: "short", year: "numeric",
      })
    : new Date(createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })

  const timeLabel = slotStartTime && slotEndTime
    ? `${slotStartTime} – ${slotEndTime} IST`
    : slotStartTime ? `${slotStartTime} IST` : null

  return (
    <div className={`bg-card border rounded-2xl p-5 transition-all ${joinActive ? "border-peach-dark/50 shadow-sm" : "border-border"}`}>
      {/* Header: status + service name */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {statusBadge(currentStatus)}
          </div>
          <p className="font-heading text-lg font-700 text-ink normal-case leading-tight">
            {serviceTitle}
          </p>
        </div>
      </div>

      {/* Date & time — prominent */}
      {(slotDate || slotStartTime) && (
        <div className="flex items-center gap-3 mb-4 bg-peach/20 border border-peach-dark/20 rounded-xl px-4 py-3">
          <div className="flex-1">
            <p className="font-sans text-sm font-semibold text-ink">{dateLabel}</p>
            {timeLabel && (
              <p className="font-sans text-xs text-ink/60 mt-0.5">{timeLabel}</p>
            )}
          </div>
          {/* Countdown — only for upcoming */}
          {isActive && secondsLeft !== null && secondsLeft > 0 && (
            <div className="text-right flex-shrink-0">
              <p className="text-[10px] font-sans text-ink/40 uppercase tracking-wide">starts in</p>
              <p className={`font-mono text-sm font-semibold ${secondsLeft <= 600 ? "text-peach-dark" : "text-ink"}`}>
                {formatCountdown(secondsLeft)}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Join CTA */}
      {meetLink && isActive && (
        <a
          href={joinActive ? meetLink : undefined}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!joinActive}
          className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-sans font-semibold text-sm mb-3 transition-all ${
            joinActive
              ? "bg-peach-dark text-white hover:bg-peach-dark/90 cursor-pointer"
              : "bg-border/40 text-ink/30 cursor-not-allowed pointer-events-none"
          }`}
        >
          <Video size={15} />
          {joinActive ? "join call now" : "join call"}
          {!joinActive && secondsLeft !== null && secondsLeft > 0 && (
            <span className="text-[11px] font-normal opacity-60 ml-1">(opens 10 min before)</span>
          )}
        </a>
      )}

      {/* Completed: feedback CTA */}
      {isCompleted && (
        <Link
          href={`/my-sessions/feedback/${bookingId}`}
          className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-sans font-semibold text-sm mb-3 transition-all ${
            feedbackRating
              ? "bg-border/30 text-ink/40 pointer-events-none"
              : "bg-peach/30 text-ink hover:bg-peach/50 border border-peach-dark/20"
          }`}
        >
          <Star size={13} className={feedbackRating ? "fill-peach-dark text-peach-dark" : ""} />
          {feedbackRating ? `feedback given (${feedbackRating}/5)` : "leave feedback"}
        </Link>
      )}

      {/* Secondary actions */}
      {!isCancelled && !isCompleted && (
        <div className="flex items-center gap-3 mt-1">
          <button
            onClick={() => setShowMessages(!showMessages)}
            className="flex items-center gap-1.5 text-xs font-sans text-ink/50 hover:text-peach-dark transition-colors"
          >
            <MessageCircle size={13} /> messages
          </button>
          {serviceSlug && (
            <a
              href={`/connect/${serviceSlug}?reschedule=${bookingId}`}
              className="flex items-center gap-1.5 text-xs font-sans text-ink/50 hover:text-peach-dark transition-colors"
            >
              <RefreshCw size={13} /> reschedule
            </a>
          )}
          <button
            onClick={cancel}
            disabled={cancelling}
            className="text-xs font-sans text-red-400 hover:text-red-600 disabled:opacity-40 transition-colors"
          >
            {cancelling ? "cancelling…" : "cancel"}
          </button>
        </div>
      )}
      {(isCancelled || isCompleted) && (
        <div className="flex items-center gap-3 mt-1">
          <button
            onClick={() => setShowMessages(!showMessages)}
            className="flex items-center gap-1.5 text-xs font-sans text-ink/50 hover:text-peach-dark transition-colors"
          >
            <MessageCircle size={13} /> messages
          </button>
        </div>
      )}

      {showMessages && <MessagesDrawer bookingId={bookingId} onClose={() => setShowMessages(false)} />}
    </div>
  )
}
