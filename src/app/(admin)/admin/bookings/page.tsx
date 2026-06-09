"use client"

import { useEffect, useState } from "react"

type Booking = {
  id: string
  userName: string
  userEmail: string
  message: string | null
  status: string
  meetLink: string | null
  adminNotes: string | null
  razorpayOrderId: string | null
  razorpayPaymentId: string | null
  createdAt: string
  serviceTitle: string | null
}

const STATUS_OPTIONS = ["pending", "paid", "completed", "cancelled"]

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-amber-tag text-ink/70",
    paid: "bg-green-100 text-green-800",
    completed: "bg-blue-100 text-blue-800",
    cancelled: "bg-red-100 text-red-700",
  }
  return (
    <span className={`text-[10px] font-sans px-2 py-0.5 rounded font-medium ${colors[status] ?? "bg-border text-ink/60"}`}>
      {status}
    </span>
  )
}

function BookingRow({ booking, onUpdate }: { booking: Booking; onUpdate: (id: string, patch: Partial<Booking>) => void }) {
  const [status, setStatus] = useState(booking.status)
  const [meetLink, setMeetLink] = useState(booking.meetLink ?? "")
  const [adminNotes, setAdminNotes] = useState(booking.adminNotes ?? "")

  const save = async (patch: Partial<Booking>) => {
    await fetch(`/api/admin/bookings/${booking.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    })
    onUpdate(booking.id, patch)
  }

  return (
    <tr className="border-b border-border hover:bg-peach/20 transition-colors">
      <td className="py-3 px-4 text-xs font-sans text-ink/50">
        {new Date(booking.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
      </td>
      <td className="py-3 px-4">
        <p className="text-sm font-sans font-medium text-ink">{booking.userName}</p>
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
        <textarea
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          onBlur={() => save({ adminNotes })}
          placeholder="Notes..."
          rows={1}
          className="w-full text-xs font-sans bg-card border border-border rounded-lg px-2 py-1 text-ink placeholder-ink/30 focus:outline-none focus:border-peach-dark/50 resize-none"
        />
      </td>
    </tr>
  )
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/bookings")
      .then((r) => r.json())
      .then((data) => { setBookings(data); setLoading(false) })
  }, [])

  const handleUpdate = (id: string, patch: Partial<Booking>) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)))
  }

  return (
    <div className="px-10 py-10">
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-800 text-ink">Bookings</h1>
        <p className="font-sans text-sm text-ink/50 mt-1">{bookings.length} total</p>
      </div>

      {loading ? (
        <p className="font-sans text-sm text-ink/40">Loading...</p>
      ) : bookings.length === 0 ? (
        <p className="font-sans text-sm text-ink/40">No bookings yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-border bg-card">
                {["Date", "Client", "Service", "Status", "Meet Link", "Notes"].map((h) => (
                  <th key={h} className="py-3 px-4 text-left text-[10px] font-sans font-semibold text-ink/40 uppercase tracking-widest">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <BookingRow key={b.id} booking={b} onUpdate={handleUpdate} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
