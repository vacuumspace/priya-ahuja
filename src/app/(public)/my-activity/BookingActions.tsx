"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, RefreshCw } from "lucide-react"

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
    <div className="mt-4 border border-border rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-cream border-b border-border">
        <span className="font-sans text-xs font-semibold text-ink">Messages</span>
        <button onClick={onClose} className="text-ink/40 hover:text-ink">
          <X size={14} />
        </button>
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

export default function BookingActions({
  bookingId,
  status,
  serviceSlug,
}: {
  bookingId: string
  status: string
  serviceSlug: string | null
}) {
  const [currentStatus, setCurrentStatus] = useState(status)
  const [showMessages, setShowMessages] = useState(false)
  const [cancelling, setCancelling] = useState(false)

  const cancel = async () => {
    if (!confirm("Are you sure you want to cancel this booking?")) return
    setCancelling(true)
    const res = await fetch(`/api/bookings/${bookingId}/cancel`, { method: "POST" })
    if (res.ok) setCurrentStatus("cancelled")
    setCancelling(false)
  }

  if (currentStatus === "cancelled" || currentStatus === "completed") {
    return (
      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={() => setShowMessages(!showMessages)}
          className="flex items-center gap-1.5 text-xs font-sans text-ink/50 hover:text-peach-dark transition-colors"
        >
          <MessageCircle size={13} /> messages
        </button>
        {showMessages && <MessagesDrawer bookingId={bookingId} onClose={() => setShowMessages(false)} />}
      </div>
    )
  }

  return (
    <div className="mt-3 space-y-2">
      <div className="flex items-center gap-3">
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
      {showMessages && <MessagesDrawer bookingId={bookingId} onClose={() => setShowMessages(false)} />}
    </div>
  )
}
