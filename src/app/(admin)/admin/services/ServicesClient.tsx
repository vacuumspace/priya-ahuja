"use client"

import { useEffect, useState } from "react"
import { ChevronUp, ChevronDown, Trash2, Plus, X, CalendarDays, Clock, ListChecks } from "lucide-react"

type Service = {
  id: string
  slug: string
  title: string
  description: string
  shortDescription: string | null
  price: number
  originalPrice: number | null
  durationMin: number | null
  type: string
  tag: string
  highlights: string[]
  whoIsItFor: string | null
  acceptsDeckLink: boolean
  deckLinkLabel: string | null
  deckLinkPlaceholder: string | null
  urgencyNote: string | null
  isActive: boolean
  order: number
}

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

type ScheduleDay = {
  id: string
  isNew?: boolean
  dayOfWeek: number
  startTime: string
  endTime: string
  isActive: boolean
}

// ─── Availability Tab ─────────────────────────────────────────────────────────

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

let _tempId = 0
function tempId() { return `new-${++_tempId}` }

type BlockedPeriod = { id: string; startDate: string; endDate: string; reason: string | null }

function BlockedPeriodsSection() {
  const [periods, setPeriods] = useState<BlockedPeriod[]>([])
  const [loading, setLoading] = useState(true)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [reason, setReason] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch("/api/admin/blocked-periods")
      .then((r) => r.json())
      .then((data) => { setPeriods(data); setLoading(false) })
  }, [])

  const add = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const res = await fetch("/api/admin/blocked-periods", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ startDate, endDate: endDate || startDate, reason }),
    })
    const row = await res.json()
    setPeriods((prev) => [...prev, row].sort((a, b) => a.startDate.localeCompare(b.startDate)))
    setStartDate(""); setEndDate(""); setReason("")
    setSaving(false)
  }

  const remove = async (id: string) => {
    await fetch(`/api/admin/blocked-periods/${id}`, { method: "DELETE" })
    setPeriods((prev) => prev.filter((p) => p.id !== id))
  }

  const fmt = (d: string) => new Date(d + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })

  return (
    <div>
      <p className="text-[10px] font-sans text-ink/40 uppercase tracking-widest mb-1">Blocked Periods</p>
      <p className="text-[11px] font-sans text-ink/30 mb-3">Block specific dates or date ranges — no slots will show for these days.</p>

      {loading ? (
        <p className="text-xs font-sans text-ink/30">Loading…</p>
      ) : (
        <>
          {periods.length > 0 && (
            <div className="flex flex-col gap-1.5 mb-4">
              {periods.map((p) => (
                <div key={p.id} className="flex items-center gap-3 bg-amber-tag/30 border border-amber-tag/40 rounded-xl px-3 py-2">
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-sans text-ink/80 font-medium">
                      {fmt(p.startDate)}{p.endDate !== p.startDate ? ` → ${fmt(p.endDate)}` : ""}
                    </span>
                    {p.reason && <span className="ml-2 text-[11px] font-sans text-ink/40">{p.reason}</span>}
                  </div>
                  <button onClick={() => remove(p.id)} className="text-ink/20 hover:text-red-400 transition-colors flex-shrink-0">
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={add} className="flex items-end gap-2 flex-wrap">
            <div>
              <label className="text-[10px] font-sans text-ink/40 block mb-1">From</label>
              <input type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)} className="text-xs font-sans bg-cream border border-border rounded-lg px-2 py-1.5 text-ink focus:outline-none focus:border-peach-dark/50" />
            </div>
            <div>
              <label className="text-[10px] font-sans text-ink/40 block mb-1">To (optional, same day if blank)</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="text-xs font-sans bg-cream border border-border rounded-lg px-2 py-1.5 text-ink focus:outline-none focus:border-peach-dark/50" />
            </div>
            <div>
              <label className="text-[10px] font-sans text-ink/40 block mb-1">Reason (optional)</label>
              <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Travel" className="text-xs font-sans bg-cream border border-border rounded-lg px-2 py-1.5 text-ink focus:outline-none focus:border-peach-dark/50 w-32" />
            </div>
            <button type="submit" disabled={saving} className="flex items-center gap-1.5 text-xs font-sans font-semibold bg-ink text-cream px-3 py-1.5 rounded-lg hover:bg-ink/80 disabled:opacity-50 transition-colors">
              <Plus size={12} />
              {saving ? "Blocking…" : "Block Dates"}
            </button>
          </form>
        </>
      )}
    </div>
  )
}

function AvailabilityTab() {
  const [daysAhead, setDaysAhead] = useState(14)
  const [schedule, setSchedule] = useState<ScheduleDay[]>([])
  const [deletedIds, setDeletedIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch("/api/admin/availability-config")
      .then((r) => r.json())
      .then((data) => {
        setDaysAhead(data.daysAhead)
        setSchedule(data.schedule)
        setLoading(false)
      })
  }, [])

  const setRowField = (id: string, field: "startTime" | "endTime" | "isActive", value: string | boolean) =>
    setSchedule((prev) => prev.map((d) => (d.id === id ? { ...d, [field]: value } : d)))

  const addRange = (dayOfWeek: number) => {
    setSchedule((prev) => [...prev, {
      id: tempId(), isNew: true, dayOfWeek,
      startTime: "08:00", endTime: "09:30", isActive: true,
    }])
  }

  const removeRow = (id: string) => {
    if (!id.startsWith("new-")) setDeletedIds((prev) => [...prev, id])
    setSchedule((prev) => prev.filter((d) => d.id !== id))
  }

  const save = async () => {
    setSaving(true)
    await fetch("/api/admin/availability-config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ daysAhead, schedule, deletedIds }),
    })
    const data = await fetch("/api/admin/availability-config").then((r) => r.json())
    setSchedule(data.schedule)
    setDeletedIds([])
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (loading) return <p className="font-sans text-sm text-ink/40">Loading…</p>

  const days = [0, 1, 2, 3, 4, 5, 6]

  return (
    <div className="max-w-lg space-y-8">
      <div>
        <p className="text-[10px] font-sans text-ink/40 uppercase tracking-widest mb-3">Booking Window</p>
        <div className="flex items-center gap-3">
          <label className="text-sm font-sans text-ink/60">Show slots for the next</label>
          <input
            type="number"
            min={1}
            max={90}
            value={daysAhead}
            onChange={(e) => setDaysAhead(Number(e.target.value))}
            className="w-16 text-sm font-sans bg-cream border border-border rounded-lg px-2 py-1 text-ink text-center focus:outline-none focus:border-peach-dark/50"
          />
          <span className="text-sm font-sans text-ink/60">days</span>
        </div>
      </div>

      <div>
        <p className="text-[10px] font-sans text-ink/40 uppercase tracking-widest mb-3">Weekly Schedule</p>
        <div className="space-y-3">
          {days.map((dow) => {
            const rows = schedule.filter((d) => d.dayOfWeek === dow)
            return (
              <div key={dow} className="border border-border rounded-xl px-4 py-3 bg-card space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-sans font-semibold text-ink/70">{DAY_LABELS[dow]}</span>
                  <button
                    type="button"
                    onClick={() => addRange(dow)}
                    className="text-[11px] font-sans text-ink/40 hover:text-peach-dark flex items-center gap-1 transition-colors"
                  >
                    <Plus size={11} /> add window
                  </button>
                </div>
                {rows.length === 0 && (
                  <p className="text-xs font-sans text-ink/30">no time windows — unavailable</p>
                )}
                {rows.map((row) => (
                  <div key={row.id} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setRowField(row.id, "isActive", !row.isActive)}
                      className={`flex-shrink-0 w-8 h-4 rounded-full transition-colors relative ${row.isActive ? "bg-ink" : "bg-border"}`}
                    >
                      <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all ${row.isActive ? "left-4" : "left-0.5"}`} />
                    </button>
                    <input
                      type="time"
                      value={row.startTime}
                      onChange={(e) => setRowField(row.id, "startTime", e.target.value)}
                      className="text-xs font-sans bg-cream border border-border rounded-lg px-2 py-1 text-ink focus:outline-none focus:border-peach-dark/50"
                    />
                    <span className="text-ink/30 text-xs">to</span>
                    <input
                      type="time"
                      value={row.endTime}
                      onChange={(e) => setRowField(row.id, "endTime", e.target.value)}
                      className="text-xs font-sans bg-cream border border-border rounded-lg px-2 py-1 text-ink focus:outline-none focus:border-peach-dark/50"
                    />
                    <button
                      type="button"
                      onClick={() => removeRow(row.id)}
                      className="text-ink/20 hover:text-red-400 transition-colors ml-1"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 text-sm font-sans font-semibold bg-ink text-cream px-5 py-2.5 rounded-xl hover:bg-ink/80 disabled:opacity-50 transition-colors"
        >
          <Clock size={13} />
          {saving ? "Saving…" : "Save Schedule"}
        </button>
        {saved && <span className="text-xs font-sans text-ink/50">Saved ✓</span>}
      </div>

      <p className="text-[11px] font-sans text-ink/30 leading-relaxed">
        Slot duration per booking is set by each service&apos;s duration. Slots are generated live — no pre-population needed.
      </p>

      <div className="border-t border-border pt-6">
        <BlockedPeriodsSection />
      </div>
    </div>
  )
}

// ─── Slots Panel ──────────────────────────────────────────────────────────────

function SlotsPanel({ service }: { service: Service }) {
  const [slots, setSlots] = useState<{ id: string; serviceId: string; date: string; startTime: string; endTime: string; isBooked: boolean }[]>([])
  const [loading, setLoading] = useState(true)
  const [date, setDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/availability?serviceId=${service.id}`)
      .then((r) => r.json())
      .then((data) => { setSlots(data); setLoading(false) })
  }, [service.id])

  const addSlot = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const res = await fetch("/api/admin/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serviceId: service.id, date, startTime, endTime }),
    })
    const slot = await res.json()
    setSlots((prev) => [...prev, slot].sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime)))
    setDate(""); setStartTime(""); setEndTime("")
    setSaving(false)
  }

  const deleteSlot = async (id: string) => {
    await fetch(`/api/admin/availability/${id}`, { method: "DELETE" })
    setSlots((prev) => prev.filter((s) => s.id !== id))
  }

  const grouped = slots.reduce<Record<string, typeof slots>>((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = []
    acc[slot.date].push(slot)
    return acc
  }, {})

  const formatDate = (d: string) =>
    new Date(d + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })

  return (
    <div className="mt-3 border-t border-border pt-4">
      <p className="text-[10px] font-sans text-ink/40 uppercase tracking-widest mb-1">Manual Slot Overrides</p>
      <p className="text-[11px] font-sans text-ink/30 mb-3">Add one-off slots outside the weekly schedule, or block specific times.</p>

      {loading ? (
        <p className="text-xs font-sans text-ink/30">Loading…</p>
      ) : (
        <>
          {Object.keys(grouped).length === 0 ? (
            <p className="text-xs font-sans text-ink/30 mb-3">No manual slots.</p>
          ) : (
            <div className="space-y-2 mb-4">
              {Object.entries(grouped).map(([d, daySlots]) => (
                <div key={d}>
                  <p className="text-[10px] font-sans text-ink/50 mb-1">{formatDate(d)}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {daySlots.map((slot) => (
                      <div
                        key={slot.id}
                        className={`flex items-center gap-1.5 text-[11px] font-sans px-2.5 py-1 rounded-lg border ${
                          slot.isBooked
                            ? "bg-ink/5 border-border text-ink/30 line-through"
                            : "bg-cream border-border text-ink/70"
                        }`}
                      >
                        {slot.startTime}–{slot.endTime}
                        {!slot.isBooked && (
                          <button onClick={() => deleteSlot(slot.id)} className="text-ink/20 hover:text-red-400 transition-colors ml-0.5">
                            <X size={11} />
                          </button>
                        )}
                        {slot.isBooked && <span className="text-[9px] text-ink/30 ml-0.5">booked</span>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={addSlot} className="flex items-end gap-2 flex-wrap">
            <div>
              <label className="text-[10px] font-sans text-ink/40 block mb-1">Date</label>
              <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="text-xs font-sans bg-cream border border-border rounded-lg px-2 py-1.5 text-ink focus:outline-none focus:border-peach-dark/50" />
            </div>
            <div>
              <label className="text-[10px] font-sans text-ink/40 block mb-1">Start</label>
              <input type="time" required value={startTime} onChange={(e) => setStartTime(e.target.value)} className="text-xs font-sans bg-cream border border-border rounded-lg px-2 py-1.5 text-ink focus:outline-none focus:border-peach-dark/50" />
            </div>
            <div>
              <label className="text-[10px] font-sans text-ink/40 block mb-1">End</label>
              <input type="time" required value={endTime} onChange={(e) => setEndTime(e.target.value)} className="text-xs font-sans bg-cream border border-border rounded-lg px-2 py-1.5 text-ink focus:outline-none focus:border-peach-dark/50" />
            </div>
            <button type="submit" disabled={saving} className="flex items-center gap-1.5 text-xs font-sans font-semibold bg-ink text-cream px-3 py-1.5 rounded-lg hover:bg-ink/80 disabled:opacity-50 transition-colors">
              <Plus size={12} />
              {saving ? "Adding…" : "Add Slot"}
            </button>
          </form>
        </>
      )}
    </div>
  )
}

// ─── Highlights Panel ─────────────────────────────────────────────────────────

function HighlightsPanel({ service, onUpdate }: { service: Service; onUpdate: (id: string, patch: Partial<Service>) => void }) {
  const [items, setItems] = useState<string[]>(service.highlights)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const save = async () => {
    setSaving(true)
    const filtered = items.map((s) => s.trim()).filter(Boolean)
    setItems(filtered)
    await fetch(`/api/admin/services/${service.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ highlights: filtered }),
    })
    onUpdate(service.id, { highlights: filtered })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  return (
    <div className="mt-3 border-t border-border pt-4">
      <p className="text-[10px] font-sans text-ink/40 uppercase tracking-widest mb-3">What We&apos;ll Cover</p>
      <div className="space-y-2 mb-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              value={item}
              onChange={(e) => setItems((prev) => prev.map((v, j) => j === i ? e.target.value : v))}
              className="flex-1 text-xs font-sans bg-cream border border-border rounded-lg px-3 py-1.5 text-ink focus:outline-none focus:border-peach-dark/50"
            />
            <button
              onClick={() => setItems((prev) => prev.filter((_, j) => j !== i))}
              className="text-ink/20 hover:text-red-400 transition-colors"
            >
              <X size={13} />
            </button>
          </div>
        ))}
        <button
          onClick={() => setItems((prev) => [...prev, ""])}
          className="flex items-center gap-1.5 text-[11px] font-sans text-ink/40 hover:text-peach-dark transition-colors"
        >
          <Plus size={11} /> add item
        </button>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={save}
          disabled={saving}
          className="text-xs font-sans font-semibold bg-ink text-cream px-4 py-1.5 rounded-lg hover:bg-ink/80 disabled:opacity-50 transition-colors"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        {saved && <span className="text-xs font-sans text-ink/50">Saved ✓</span>}
      </div>
    </div>
  )
}

// ─── Service Row ──────────────────────────────────────────────────────────────

function ServiceRow({
  service, onUpdate, onMove, onDelete, isFirst, isLast,
}: {
  service: Service
  onUpdate: (id: string, patch: Partial<Service>) => void
  onMove: (id: string, direction: "up" | "down") => void
  onDelete: (id: string) => void
  isFirst: boolean
  isLast: boolean
}) {
  const [price, setPrice] = useState(String(service.price / 100))
  const [duration, setDuration] = useState(String(service.durationMin ?? ""))
  const [showSlots, setShowSlots] = useState(false)
  const [showHighlights, setShowHighlights] = useState(false)

  const patch = async (data: Partial<Service>) => {
    await fetch(`/api/admin/services/${service.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    onUpdate(service.id, data)
  }

  const handleDelete = async () => {
    if (!confirm(`Delete "${service.title}"? This cannot be undone.`)) return
    await fetch(`/api/admin/services/${service.id}`, { method: "DELETE" })
    onDelete(service.id)
  }

  return (
    <div className={`bg-card border rounded-2xl p-5 ${service.isActive ? "border-border" : "border-border opacity-60"}`}>
      <div className="flex items-start gap-4">
        <div className="flex flex-col gap-1 pt-0.5">
          <button onClick={() => onMove(service.id, "up")} disabled={isFirst} className="p-1 rounded text-ink/30 hover:text-ink/60 disabled:opacity-20 transition-colors">
            <ChevronUp size={14} />
          </button>
          <button onClick={() => onMove(service.id, "down")} disabled={isLast} className="p-1 rounded text-ink/30 hover:text-ink/60 disabled:opacity-20 transition-colors">
            <ChevronDown size={14} />
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono text-ink/30">#{service.order}</span>
            <span className="text-[10px] bg-amber-tag text-ink/60 px-2 py-0.5 rounded font-sans">{service.type}</span>
            <span className="text-[10px] bg-peach/40 text-ink/50 px-2 py-0.5 rounded font-sans">{service.tag}</span>
            <span className="text-[10px] font-mono text-ink/25">{service.slug}</span>
          </div>
          <p className="font-heading text-base font-700 text-ink normal-case">{service.title}</p>
          <p className="font-sans text-xs text-ink/50 mt-1 leading-relaxed line-clamp-2">{service.description}</p>
          {service.highlights.length > 0 && (
            <p className="text-[10px] text-ink/30 font-sans mt-1">{service.highlights.length} highlights · {service.whoIsItFor ? "who it's for set" : "no who-it's-for"}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5 mt-1">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-sans text-ink/50">₹</span>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              onBlur={() => {
                const val = Math.round(parseFloat(price) * 100)
                if (!isNaN(val)) patch({ price: val })
              }}
              className="w-24 text-sm font-sans bg-cream border border-border rounded-lg px-2 py-1 text-ink focus:outline-none focus:border-peach-dark/50"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-sans text-ink/40">min</span>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              onBlur={() => {
                const val = parseInt(duration)
                if (!isNaN(val)) patch({ durationMin: val })
              }}
              className="w-16 text-sm font-sans bg-cream border border-border rounded-lg px-2 py-1 text-ink focus:outline-none focus:border-peach-dark/50"
            />
          </div>
        </div>

        <button
          onClick={() => { setShowHighlights((v) => !v); setShowSlots(false) }}
          className={`mt-1 flex items-center gap-1.5 text-xs font-sans px-2.5 py-1 rounded-lg border transition-colors ${
            showHighlights ? "bg-ink text-cream border-ink" : "bg-transparent text-ink/50 border-border hover:border-ink/30 hover:text-ink"
          }`}
          title="Edit highlights"
        >
          <ListChecks size={12} />
          {service.highlights.length > 0 ? service.highlights.length : "Highlights"}
        </button>

        {service.type === "call" && (
          <button
            onClick={() => { setShowSlots((v) => !v); setShowHighlights(false) }}
            className={`mt-1 flex items-center gap-1.5 text-xs font-sans px-2.5 py-1 rounded-lg border transition-colors ${
              showSlots ? "bg-ink text-cream border-ink" : "bg-transparent text-ink/50 border-border hover:border-ink/30 hover:text-ink"
            }`}
          >
            <CalendarDays size={12} />
            Slots
          </button>
        )}

        <button
          onClick={() => patch({ isActive: !service.isActive })}
          className={`mt-1 flex-shrink-0 w-10 h-5 rounded-full transition-colors relative ${service.isActive ? "bg-ink" : "bg-border"}`}
          aria-label={service.isActive ? "Deactivate" : "Activate"}
        >
          <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${service.isActive ? "left-5" : "left-0.5"}`} />
        </button>

        <button onClick={handleDelete} className="mt-1 p-1.5 rounded-lg text-ink/25 hover:text-red-500 hover:bg-red-50 transition-colors" aria-label="Delete">
          <Trash2 size={14} />
        </button>
      </div>

      {showHighlights && <HighlightsPanel service={service} onUpdate={onUpdate} />}
      {showSlots && service.type === "call" && <SlotsPanel service={service} />}
    </div>
  )
}

// ─── Add Service Form ─────────────────────────────────────────────────────────

const SERVICE_TAGS = ["fundraising", "strategy", "deals", "career", "urgent", "async", "general"]

function AddServiceForm({ onAdd }: { onAdd: (s: Service) => void }) {
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [highlightsText, setHighlightsText] = useState("")
  const [form, setForm] = useState({
    slug: "", title: "", shortDescription: "", description: "",
    price: "", originalPrice: "", durationMin: "", type: "call",
    tag: "general", whoIsItFor: "", urgencyNote: "",
    acceptsDeckLink: false, deckLinkLabel: "", deckLinkPlaceholder: "",
  })

  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const highlights = highlightsText.split("\n").map((l) => l.trim()).filter(Boolean)
    const res = await fetch("/api/admin/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: form.slug, title: form.title,
        shortDescription: form.shortDescription, description: form.description,
        price: parseFloat(form.price),
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : null,
        durationMin: form.durationMin ? parseInt(form.durationMin) : null,
        type: form.type, tag: form.tag,
        highlights, whoIsItFor: form.whoIsItFor || null,
        urgencyNote: form.urgencyNote || null,
        acceptsDeckLink: form.acceptsDeckLink,
        deckLinkLabel: form.deckLinkLabel || null,
        deckLinkPlaceholder: form.deckLinkPlaceholder || null,
      }),
    })
    const data = await res.json()
    onAdd(data)
    setForm({ slug: "", title: "", shortDescription: "", description: "", price: "", originalPrice: "", durationMin: "", type: "call", tag: "general", whoIsItFor: "", urgencyNote: "", acceptsDeckLink: false, deckLinkLabel: "", deckLinkPlaceholder: "" })
    setHighlightsText("")
    setOpen(false)
    setSaving(false)
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="flex items-center gap-2 text-sm font-sans font-semibold text-ink/60 border border-dashed border-border rounded-2xl px-5 py-3.5 hover:border-ink/30 hover:text-ink transition-colors w-full">
        <Plus size={14} /> Add Service
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-peach-dark/30 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="font-heading text-base font-700 text-ink">New Service</p>
        <button type="button" onClick={() => setOpen(false)} className="text-ink/30 hover:text-ink"><X size={16} /></button>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-3">
        <div className="col-span-2">
          <label className="text-[10px] font-sans text-ink/40 uppercase tracking-wide block mb-1">Slug *</label>
          <input required value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="e.g. pitch-deck-analysis" className="w-full text-sm font-sans bg-cream border border-border rounded-lg px-3 py-1.5 text-ink focus:outline-none focus:border-peach-dark/50" />
        </div>
        <div>
          <label className="text-[10px] font-sans text-ink/40 uppercase tracking-wide block mb-1">Type *</label>
          <select value={form.type} onChange={(e) => set("type", e.target.value)} className="w-full text-sm font-sans bg-cream border border-border rounded-lg px-3 py-1.5 text-ink focus:outline-none focus:border-peach-dark/50">
            <option value="call">call</option>
            <option value="dm">dm</option>
            <option value="report">report</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="text-[10px] font-sans text-ink/40 uppercase tracking-wide block mb-1">Tag *</label>
          <select value={form.tag} onChange={(e) => set("tag", e.target.value)} className="w-full text-sm font-sans bg-cream border border-border rounded-lg px-3 py-1.5 text-ink focus:outline-none focus:border-peach-dark/50">
            {SERVICE_TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-sans text-ink/40 uppercase tracking-wide block mb-1">Duration (min)</label>
          <input type="number" value={form.durationMin} onChange={(e) => set("durationMin", e.target.value)} placeholder="30" className="w-full text-sm font-sans bg-cream border border-border rounded-lg px-3 py-1.5 text-ink focus:outline-none focus:border-peach-dark/50" />
        </div>
      </div>

      <div className="mb-3">
        <label className="text-[10px] font-sans text-ink/40 uppercase tracking-wide block mb-1">Title *</label>
        <input required value={form.title} onChange={(e) => set("title", e.target.value)} className="w-full text-sm font-sans bg-cream border border-border rounded-lg px-3 py-1.5 text-ink focus:outline-none focus:border-peach-dark/50" />
      </div>

      <div className="mb-3">
        <label className="text-[10px] font-sans text-ink/40 uppercase tracking-wide block mb-1">Short Description</label>
        <input value={form.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} placeholder="One-liner shown on listing" className="w-full text-sm font-sans bg-cream border border-border rounded-lg px-3 py-1.5 text-ink focus:outline-none focus:border-peach-dark/50" />
      </div>

      <div className="mb-3">
        <label className="text-[10px] font-sans text-ink/40 uppercase tracking-wide block mb-1">Description *</label>
        <textarea required rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} className="w-full text-sm font-sans bg-cream border border-border rounded-lg px-3 py-1.5 text-ink focus:outline-none focus:border-peach-dark/50 resize-none" />
      </div>

      <div className="mb-3">
        <label className="text-[10px] font-sans text-ink/40 uppercase tracking-wide block mb-1">What We&apos;ll Cover (one item per line)</label>
        <textarea rows={4} value={highlightsText} onChange={(e) => setHighlightsText(e.target.value)} placeholder={"Slide-by-slide written feedback\nNarrative arc review\nRed flags flagged"} className="w-full text-sm font-sans bg-cream border border-border rounded-lg px-3 py-1.5 text-ink focus:outline-none focus:border-peach-dark/50 resize-none" />
      </div>

      <div className="mb-3">
        <label className="text-[10px] font-sans text-ink/40 uppercase tracking-wide block mb-1">Who Is This For</label>
        <textarea rows={2} value={form.whoIsItFor} onChange={(e) => set("whoIsItFor", e.target.value)} className="w-full text-sm font-sans bg-cream border border-border rounded-lg px-3 py-1.5 text-ink focus:outline-none focus:border-peach-dark/50 resize-none" />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="text-[10px] font-sans text-ink/40 uppercase tracking-wide block mb-1">Price (₹) *</label>
          <input required type="number" value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="3500" className="w-full text-sm font-sans bg-cream border border-border rounded-lg px-3 py-1.5 text-ink focus:outline-none focus:border-peach-dark/50" />
        </div>
        <div>
          <label className="text-[10px] font-sans text-ink/40 uppercase tracking-wide block mb-1">Original Price (₹)</label>
          <input type="number" value={form.originalPrice} onChange={(e) => set("originalPrice", e.target.value)} placeholder="optional" className="w-full text-sm font-sans bg-cream border border-border rounded-lg px-3 py-1.5 text-ink focus:outline-none focus:border-peach-dark/50" />
        </div>
      </div>

      <div className="mb-3">
        <label className="text-[10px] font-sans text-ink/40 uppercase tracking-wide block mb-1">Urgency Note</label>
        <input value={form.urgencyNote} onChange={(e) => set("urgencyNote", e.target.value)} placeholder="e.g. scheduled within 48 hours of booking" className="w-full text-sm font-sans bg-cream border border-border rounded-lg px-3 py-1.5 text-ink focus:outline-none focus:border-peach-dark/50" />
      </div>

      <div className="mb-4">
        <label className="flex items-center gap-2 text-sm font-sans text-ink/60 cursor-pointer">
          <input type="checkbox" checked={form.acceptsDeckLink} onChange={(e) => set("acceptsDeckLink", e.target.checked)} className="rounded" />
          Ask for deck / model link
        </label>
        {form.acceptsDeckLink && (
          <div className="grid grid-cols-2 gap-3 mt-2">
            <input value={form.deckLinkLabel} onChange={(e) => set("deckLinkLabel", e.target.value)} placeholder="Label, e.g. pitch deck link" className="text-sm font-sans bg-cream border border-border rounded-lg px-3 py-1.5 text-ink focus:outline-none focus:border-peach-dark/50" />
            <input value={form.deckLinkPlaceholder} onChange={(e) => set("deckLinkPlaceholder", e.target.value)} placeholder="Input placeholder" className="text-sm font-sans bg-cream border border-border rounded-lg px-3 py-1.5 text-ink focus:outline-none focus:border-peach-dark/50" />
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-3">
        <button type="button" onClick={() => setOpen(false)} className="text-sm font-sans text-ink/40 hover:text-ink">Cancel</button>
        <button type="submit" disabled={saving} className="text-sm font-sans font-semibold bg-ink text-cream px-4 py-2 rounded-lg hover:bg-ink/80 disabled:opacity-50 transition-colors">
          {saving ? "Saving…" : "Add Service"}
        </button>
      </div>
    </form>
  )
}

// ─── Services Tab ─────────────────────────────────────────────────────────────

function ServicesTab({ initialServices }: { initialServices: Service[] }) {
  const [services, setServices] = useState<Service[]>(initialServices)

  const handleUpdate = (id: string, patch: Partial<Service>) =>
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)))
  const handleDelete = (id: string) =>
    setServices((prev) => prev.filter((s) => s.id !== id))
  const handleAdd = (s: Service) =>
    setServices((prev) => [...prev, s])

  const handleMove = async (id: string, direction: "up" | "down") => {
    const idx = services.findIndex((s) => s.id === id)
    if (direction === "up" && idx === 0) return
    if (direction === "down" && idx === services.length - 1) return
    const swapIdx = direction === "up" ? idx - 1 : idx + 1
    const next = [...services]
    const aOrder = next[idx].order
    const bOrder = next[swapIdx].order
    next[idx] = { ...next[idx], order: bOrder }
    next[swapIdx] = { ...next[swapIdx], order: aOrder }
    ;[next[idx], next[swapIdx]] = [next[swapIdx], next[idx]]
    setServices(next)
    await Promise.all([
      fetch(`/api/admin/services/${next[swapIdx].id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: aOrder }) }),
      fetch(`/api/admin/services/${next[idx].id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: bOrder }) }),
    ])
  }

  return (
    <div className="flex flex-col gap-3 max-w-2xl">
      {services.map((s, i) => (
        <ServiceRow key={s.id} service={s} onUpdate={handleUpdate} onMove={handleMove} onDelete={handleDelete} isFirst={i === 0} isLast={i === services.length - 1} />
      ))}
      <AddServiceForm onAdd={handleAdd} />
    </div>
  )
}

// ─── Transactions Tab ─────────────────────────────────────────────────────────

const BOOKING_STATUS_OPTIONS = ["pending", "paid", "completed", "cancelled"]

function TxBookingRow({ booking, onUpdate }: { booking: Booking; onUpdate: (id: string, patch: Partial<Booking>) => void }) {
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
          onChange={async (e) => { setStatus(e.target.value); await save({ status: e.target.value }) }}
          className="text-xs font-sans bg-card border border-border rounded-lg px-2 py-1 text-ink focus:outline-none"
        >
          {BOOKING_STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
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

function TransactionsTab({ initialBookings }: { initialBookings: Booking[] }) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings)

  const handleUpdate = (id: string, patch: Partial<Booking>) =>
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)))

  if (bookings.length === 0) return <p className="font-sans text-sm text-ink/40">No transactions yet.</p>

  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full min-w-[900px]">
        <thead>
          <tr className="border-b border-border bg-card">
            {["Date", "Client", "Session", "Status", "Meet Link", "Notes"].map((h) => (
              <th key={h} className="py-3 px-4 text-left text-[10px] font-sans font-semibold text-ink/40 uppercase tracking-widest">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => <TxBookingRow key={b.id} booking={b} onUpdate={handleUpdate} />)}
        </tbody>
      </table>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type Tab = "transactions" | "list" | "slots"

const TAB_LABELS: Record<Tab, string> = {
  transactions: "Transactions",
  list: "List",
  slots: "Slots",
}

export default function ServicesClient({
  initialServices,
  initialBookings,
  defaultTab,
}: {
  initialServices: Service[]
  initialBookings: Booking[]
  defaultTab?: string
}) {
  const tab: Tab = (defaultTab as Tab) || "list"

  return (
    <div className="px-10 py-10">
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-800 text-ink">Connect Sessions</h1>
      </div>

      {tab === "transactions" && <TransactionsTab initialBookings={initialBookings} />}
      {tab === "list" && <ServicesTab initialServices={initialServices} />}
      {tab === "slots" && <AvailabilityTab />}
    </div>
  )
}
