"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, Star, X, CalendarClock, ExternalLink, FileEdit } from "lucide-react"
import Link from "next/link"

type Message = {
  id: string
  senderName: string
  isAdmin: boolean
  body: string
  createdAt: string
}

type Booking = {
  id: string
  userName: string
  userEmail: string
  userId: string | null
  message: string | null
  status: string
  meetLink: string | null
  adminNotes: string | null
  razorpayOrderId: string | null
  razorpayPaymentId: string | null
  createdAt: string
  serviceTitle: string | null
  slotDate: string | null
  slotStartTime: string | null
  feedbackRating: number | null
  feedbackText: string | null
}

const STATUS_OPTIONS = ["pending", "paid", "confirmed", "completed", "cancelled", "rescheduled"]

function MessagesPanel({ bookingId, onClose }: { bookingId: string; onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [draft, setDraft] = useState("")
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch(`/api/bookings/${bookingId}/messages`)
      .then((r) => r.json())
      .then(({ messages }) => setMessages(messages ?? []))
    // Mark all user messages in this booking as read
    fetch(`/api/bookings/${bookingId}/messages`, { method: "PUT" }).catch(() => {})
  }, [bookingId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

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
    <div className="fixed inset-y-0 right-0 w-80 bg-card border-l border-border flex flex-col shadow-xl z-50">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <span className="font-sans text-sm font-semibold text-ink">Messages</span>
        <button onClick={onClose} className="text-ink/40 hover:text-ink">
          <X size={16} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2">
        {messages.length === 0 && (
          <p className="text-xs text-ink/40 font-sans text-center mt-8">No messages yet</p>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`flex flex-col gap-0.5 ${m.isAdmin ? "items-end" : "items-start"}`}>
            <span className="text-[10px] font-sans text-ink/40">{m.isAdmin ? "You" : m.senderName}</span>
            <div className={`px-3 py-2 rounded-xl text-xs font-sans max-w-[90%] ${m.isAdmin ? "bg-peach text-ink" : "bg-border/40 text-ink"}`}>
              {m.body}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="px-4 py-3 border-t border-border flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
          placeholder="Type a message…"
          className="flex-1 text-xs font-sans bg-cream border border-border rounded-lg px-3 py-2 text-ink placeholder-ink/30 focus:outline-none focus:border-peach-dark/50"
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

function BookingRow({
  booking,
  onUpdate,
  onCancel,
  onMessage,
}: {
  booking: Booking
  onUpdate: (id: string, patch: Partial<Booking>) => void
  onCancel: (id: string) => void
  onMessage: (id: string) => void
}) {
  const [status, setStatus] = useState(booking.status)
  const [meetLink, setMeetLink] = useState(booking.meetLink ?? "")
  const [adminNotes, setAdminNotes] = useState(booking.adminNotes ?? "")
  const [cancelling, setCancelling] = useState(false)
  const [rescheduling, setRescheduling] = useState(false)
  const [rescheduleDate, setRescheduleDate] = useState("")
  const [rescheduleTime, setRescheduleTime] = useState("")
  const [rescheduleSaving, setRescheduleSaving] = useState(false)
  const [rescheduleError, setRescheduleError] = useState("")
  const [showNotesPanel, setShowNotesPanel] = useState(false)
  const [notesText, setNotesText] = useState("")
  const [nextStepsText, setNextStepsText] = useState("")
  const [notesSending, setNotesSending] = useState(false)
  const [notesSent, setNotesSent] = useState(false)

  const save = async (patch: Partial<Booking>) => {
    await fetch(`/api/admin/bookings/${booking.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    })
    onUpdate(booking.id, patch)
  }

  const cancel = async () => {
    if (!confirm(`Cancel booking for ${booking.userName}?`)) return
    setCancelling(true)
    await fetch(`/api/bookings/${booking.id}/cancel`, { method: "POST" })
    setStatus("cancelled")
    onCancel(booking.id)
    setCancelling(false)
  }

  const handleReschedule = async () => {
    if (!rescheduleDate || !rescheduleTime) return
    setRescheduleSaving(true)
    setRescheduleError("")
    const res = await fetch(`/api/bookings/${booking.id}/reschedule`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slotId: `${rescheduleDate}T${rescheduleTime}` }),
    })
    if (res.ok) {
      setStatus("rescheduled")
      onUpdate(booking.id, { slotDate: rescheduleDate, slotStartTime: rescheduleTime, status: "rescheduled" })
      setRescheduling(false)
      setRescheduleDate("")
      setRescheduleTime("")
    } else {
      const data = await res.json().catch(() => ({}))
      setRescheduleError(data.error ?? "Reschedule failed")
    }
    setRescheduleSaving(false)
  }

  const slotLabel = booking.slotDate
    ? `${new Date(`${booking.slotDate}T${booking.slotStartTime}:00+05:30`).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })} ${booking.slotStartTime}`
    : new Date(booking.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })

  return (
    <>
      <tr className="border-b border-border hover:bg-peach/20 transition-colors">
        <td className="py-3 px-4 text-xs font-sans text-ink/50">{slotLabel}</td>
        <td className="py-3 px-4">
          {booking.userId ? (
            <Link
              href={`/admin/users/${booking.userId}`}
              className="group flex items-center gap-1 text-sm font-sans font-medium text-ink hover:text-peach-dark transition-colors"
            >
              {booking.userName}
              <ExternalLink size={10} className="opacity-0 group-hover:opacity-40 transition-opacity flex-shrink-0" />
            </Link>
          ) : (
            <p className="text-sm font-sans font-medium text-ink">{booking.userName}</p>
          )}
          <p className="text-[11px] font-sans text-ink/40">{booking.userEmail}</p>
        </td>
        <td className="py-3 px-4 text-xs font-sans text-ink/70">{booking.serviceTitle ?? "—"}</td>
        <td className="py-3 px-4">
          <select
            value={status}
            onChange={async (e) => {
              setStatus(e.target.value)
              await save({ status: e.target.value })
            }}
            className="text-xs font-sans bg-card border border-border rounded-lg px-2 py-1 text-ink focus:outline-none"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </td>
        <td className="py-3 px-4">
          <input
            value={meetLink}
            onChange={(e) => setMeetLink(e.target.value)}
            onBlur={() => save({ meetLink })}
            placeholder="Meet link"
            className="w-full text-xs font-sans bg-card border border-border rounded-lg px-2 py-1 text-ink placeholder-ink/30 focus:outline-none focus:border-peach-dark/50"
          />
        </td>
        <td className="py-3 px-4">
          {booking.feedbackRating ? (
            <div className="space-y-1">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    size={12}
                    className={n <= booking.feedbackRating! ? "fill-peach-dark text-peach-dark" : "text-border"}
                  />
                ))}
                <span className="text-[11px] font-sans text-ink/60 ml-1">{booking.feedbackRating}/5</span>
              </div>
              {booking.feedbackText && (
                <p className="text-[11px] font-sans text-ink/60 max-w-[160px] leading-relaxed line-clamp-3">
                  {booking.feedbackText}
                </p>
              )}
            </div>
          ) : (
            <span className="text-[11px] font-sans text-ink/30">—</span>
          )}
        </td>
        <td className="py-3 px-4">
          <textarea
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            onBlur={() => save({ adminNotes })}
            placeholder="Notes..."
            rows={1}
            className="w-full text-xs font-sans bg-card border border-border rounded-lg px-2 py-1 text-ink placeholder-ink/30 focus:outline-none focus:border-peach-dark/50 resize-none"
          />
        </td>
        <td className="py-3 px-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onMessage(booking.id)}
              className="text-ink/40 hover:text-peach-dark transition-colors"
              title="Messages"
            >
              <MessageCircle size={15} />
            </button>
            {status !== "cancelled" && status !== "completed" && (
              <button
                onClick={() => { setRescheduling((v) => !v); setRescheduleError("") }}
                className={`transition-colors ${rescheduling ? "text-peach-dark" : "text-ink/40 hover:text-peach-dark"}`}
                title="Reschedule"
              >
                <CalendarClock size={15} />
              </button>
            )}
            <button
              onClick={() => setShowNotesPanel((v) => !v)}
              className={`transition-colors ${showNotesPanel ? "text-peach-dark" : "text-ink/40 hover:text-peach-dark"}`}
              title="Send session notes"
            >
              <FileEdit size={15} />
            </button>
            {status !== "cancelled" && (
              <button
                onClick={cancel}
                disabled={cancelling}
                className="text-xs font-sans text-red-500 hover:text-red-700 disabled:opacity-40"
              >
                Cancel
              </button>
            )}
          </div>
        </td>
      </tr>
      {rescheduling && (
        <tr className="border-b border-border bg-peach/10">
          <td colSpan={8} className="px-4 py-3">
            <div className="flex items-end gap-3 flex-wrap">
              <div>
                <label className="text-[10px] font-sans text-ink/40 uppercase tracking-wide block mb-1">New Date</label>
                <input
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="text-xs font-sans bg-card border border-border rounded-lg px-2 py-1.5 text-ink focus:outline-none focus:border-peach-dark/50"
                />
              </div>
              <div>
                <label className="text-[10px] font-sans text-ink/40 uppercase tracking-wide block mb-1">New Time (IST)</label>
                <input
                  type="time"
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                  className="text-xs font-sans bg-card border border-border rounded-lg px-2 py-1.5 text-ink focus:outline-none focus:border-peach-dark/50"
                />
              </div>
              <button
                onClick={handleReschedule}
                disabled={!rescheduleDate || !rescheduleTime || rescheduleSaving}
                className="text-xs font-sans font-semibold bg-peach-dark text-white px-3 py-1.5 rounded-lg disabled:opacity-40"
              >
                {rescheduleSaving ? "Saving…" : "Confirm Reschedule"}
              </button>
              <button
                onClick={() => { setRescheduling(false); setRescheduleError("") }}
                className="text-xs font-sans text-ink/40 hover:text-ink"
              >
                Dismiss
              </button>
              {rescheduleError && (
                <span className="text-xs font-sans text-red-500">{rescheduleError}</span>
              )}
            </div>
          </td>
        </tr>
      )}
      {showNotesPanel && (
        <tr className="border-b border-border bg-peach/5">
          <td colSpan={8} className="px-4 py-4">
            <p className="text-xs font-sans font-semibold text-ink mb-3">
              Send session notes to {booking.userName} ({booking.userEmail})
            </p>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-sans text-ink/40 uppercase tracking-wide block mb-1">What we covered</label>
                <textarea
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  placeholder="Summary of key topics discussed, insights shared…"
                  rows={4}
                  className="w-full text-xs font-sans bg-white border border-border rounded-lg px-3 py-2 text-ink placeholder-ink/30 focus:outline-none focus:border-peach-dark/50 resize-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-sans text-ink/40 uppercase tracking-wide block mb-1">Next steps</label>
                <textarea
                  value={nextStepsText}
                  onChange={(e) => setNextStepsText(e.target.value)}
                  placeholder="Action items for the founder…"
                  rows={3}
                  className="w-full text-xs font-sans bg-white border border-border rounded-lg px-3 py-2 text-ink placeholder-ink/30 focus:outline-none focus:border-peach-dark/50 resize-none"
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  disabled={!notesText.trim() || !nextStepsText.trim() || notesSending || notesSent}
                  onClick={async () => {
                    setNotesSending(true)
                    await fetch(`/api/admin/bookings/${booking.id}/send-notes`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ notes: notesText, nextSteps: nextStepsText }),
                    })
                    setNotesSending(false)
                    setNotesSent(true)
                  }}
                  className="text-xs font-sans font-semibold bg-ink text-cream px-4 py-2 rounded-lg disabled:opacity-40 hover:bg-ink/80"
                >
                  {notesSending ? "Sending…" : notesSent ? "✓ Sent!" : "Send notes email"}
                </button>
                <button
                  onClick={() => { setShowNotesPanel(false); setNotesSent(false) }}
                  className="text-xs font-sans text-ink/40 hover:text-ink"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

export default function BookingsClient({ initialBookings }: { initialBookings: Booking[] }) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings)
  const [messagingId, setMessagingId] = useState<string | null>(null)

  const handleUpdate = (id: string, patch: Partial<Booking>) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)))
  }

  const handleCancel = (id: string) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b)))
  }

  return (
    <div className="px-10 py-10">
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-800 text-ink">Bookings</h1>
        <p className="font-sans text-sm text-ink/50 mt-1">{bookings.length} total</p>
      </div>

      {bookings.length === 0 ? (
        <p className="font-sans text-sm text-ink/40">No bookings yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="border-b border-border bg-card">
                {["Date / Slot", "Client", "Service", "Status", "Meet Link", "Feedback", "Notes", "Actions"].map((h) => (
                  <th key={h} className="py-3 px-4 text-left text-[10px] font-sans font-semibold text-ink/40 uppercase tracking-widest">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <BookingRow
                  key={b.id}
                  booking={b}
                  onUpdate={handleUpdate}
                  onCancel={handleCancel}
                  onMessage={setMessagingId}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {messagingId && (
        <MessagesPanel bookingId={messagingId} onClose={() => setMessagingId(null)} />
      )}
    </div>
  )
}
