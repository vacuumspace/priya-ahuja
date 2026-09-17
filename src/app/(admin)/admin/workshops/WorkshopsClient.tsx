"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Trash2, Plus, X, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { formatWorkshopTimeRange } from "@/lib/workshop-time"
import { WORKSHOP_STAGES, WORKSHOP_SECTORS } from "@/lib/workshop-form-options"

const STAGE_LABELS = Object.fromEntries(WORKSHOP_STAGES.map((s) => [s.value, s.label]))
const SECTOR_LABELS = Object.fromEntries(WORKSHOP_SECTORS.map((s) => [s.value, s.label]))

type Workshop = {
  id: string
  slug: string
  title: string
  description: string
  thumbnailUrl: string | null
  date: string
  startTime: string
  endTime: string
  price: number
  isActive: boolean
  createdAt: string
  registered: number
  sales: number
  meetLink: string | null
}

type Registration = {
  id: string
  userName: string
  userEmail: string
  stage: string | null
  sector: string | null
  status: string
  amountPaid: number | null
  razorpayPaymentId: string | null
  calendarInviteSent: boolean
  createdAt: string
  workshopId: string
  workshopTitle: string | null
}

function fmtAmount(paise: number | null) {
  if (paise == null) return " - "
  return "₹" + (paise / 100).toLocaleString("en-IN")
}

function fmt(date: string) {
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(date))
}

const STATUS_COLORS: Record<string, string> = {
  confirmed: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  cancelled: "bg-red-100 text-red-500",
}

function WorkshopRow({
  workshop,
  expanded,
  onToggle,
  onUpdate,
  onDelete,
}: {
  workshop: Workshop
  expanded: boolean
  onToggle: () => void
  onUpdate: (id: string, patch: Partial<Workshop>) => void
  onDelete: (id: string) => void
}) {
  const [title, setTitle] = useState(workshop.title)
  const [description, setDescription] = useState(workshop.description)
  const [price, setPrice] = useState(String(workshop.price / 100))
  const [date, setDate] = useState(workshop.date)
  const [startTime, setStartTime] = useState(workshop.startTime)
  const [endTime, setEndTime] = useState(workshop.endTime)
  const [thumbnailUrl, setThumbnailUrl] = useState(workshop.thumbnailUrl ?? "")

  const patch = async (data: Partial<Workshop>) => {
    // Local state (and the rest of this component) works in paise, but the
    // PATCH endpoint takes rupees - same unit as POST /api/admin/workshops -
    // so convert only on the wire, not in what we store/display locally.
    const body = data.price !== undefined ? { ...data, price: data.price / 100 } : data
    await fetch(`/api/admin/workshops/${workshop.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    onUpdate(workshop.id, data)
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm(`Delete "${workshop.title}"? This cannot be undone.`)) return
    const res = await fetch(`/api/admin/workshops/${workshop.id}`, { method: "DELETE" })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      alert(data.error ?? "Failed to delete workshop.")
      return
    }
    onDelete(workshop.id)
  }

  return (
    <>
      <tr
        onClick={onToggle}
        className={`cursor-pointer hover:bg-peach-dark/5 transition-colors ${workshop.isActive ? "" : "opacity-50"}`}
      >
        <td className="py-3 px-4">
          <div className="flex items-center gap-2">
            <ChevronDown size={13} className={`text-ink/30 flex-shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`} />
            <div>
              <p className="font-sans text-sm font-semibold text-ink">{workshop.title}</p>
              <p className="text-[10px] font-mono text-ink/30">{workshop.slug}</p>
            </div>
          </div>
        </td>
        <td className="py-3 px-4 font-sans text-xs text-ink/60 whitespace-nowrap">
          {workshop.date} · {formatWorkshopTimeRange(workshop.startTime, workshop.endTime)}
        </td>
        <td className="py-3 px-4 font-sans text-sm text-ink">{fmtAmount(workshop.price)}</td>
        <td className="py-3 px-4 font-sans text-sm text-ink">{workshop.registered}</td>
        <td className="py-3 px-4 font-sans text-sm font-medium text-ink">{fmtAmount(workshop.sales)}</td>
        <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
          {workshop.meetLink ? (
            <a
              href={workshop.meetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-xs text-peach-dark hover:underline"
            >
              open →
            </a>
          ) : (
            <span className="font-sans text-xs text-ink/30">-</span>
          )}
        </td>
        <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-2">
            <button
              onClick={() => patch({ isActive: !workshop.isActive })}
              className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ${workshop.isActive ? "bg-ink" : "bg-border"}`}
              aria-label={workshop.isActive ? "Deactivate" : "Activate"}
            >
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${workshop.isActive ? "left-5" : "left-0.5"}`} />
            </button>
            <button onClick={handleDelete} className="p-1.5 rounded-lg text-ink/25 hover:text-red-500 hover:bg-red-50 transition-colors" aria-label="Delete">
              <Trash2 size={14} />
            </button>
          </div>
        </td>
      </tr>
      {expanded && (
        <tr className="bg-cream/60 border-b border-border">
          <td colSpan={7} className="p-5">
            <div className="max-w-xl">
              <div className="mb-3">
                <label className="text-[10px] font-sans text-ink/40 uppercase tracking-wide block mb-1">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={() => patch({ title })}
                  className="w-full text-sm font-sans bg-card border border-border rounded-lg px-3 py-1.5 text-ink focus:outline-none focus:border-peach-dark/50"
                />
              </div>

              <div className="grid grid-cols-3 gap-3 mb-3">
                <div>
                  <label className="text-[10px] font-sans text-ink/40 uppercase tracking-wide block mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    onBlur={() => patch({ date })}
                    className="w-full text-xs font-sans bg-card border border-border rounded-lg px-2 py-1.5 text-ink focus:outline-none focus:border-peach-dark/50"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-sans text-ink/40 uppercase tracking-wide block mb-1">Start</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    onBlur={() => patch({ startTime })}
                    className="w-full text-xs font-sans bg-card border border-border rounded-lg px-2 py-1.5 text-ink focus:outline-none focus:border-peach-dark/50"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-sans text-ink/40 uppercase tracking-wide block mb-1">End</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    onBlur={() => patch({ endTime })}
                    className="w-full text-xs font-sans bg-card border border-border rounded-lg px-2 py-1.5 text-ink focus:outline-none focus:border-peach-dark/50"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="text-[10px] font-sans text-ink/40 uppercase tracking-wide block mb-1">Price (₹)</label>
                <div className="flex items-center gap-1 max-w-[140px]">
                  <span className="text-sm font-sans text-ink/50">₹</span>
                  <input
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    onBlur={() => {
                      const val = Math.round(parseFloat(price) * 100)
                      if (!isNaN(val)) patch({ price: val })
                    }}
                    className="w-full text-sm font-sans bg-card border border-border rounded-lg px-2 py-1 text-ink focus:outline-none focus:border-peach-dark/50"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="text-[10px] font-sans text-ink/40 uppercase tracking-wide block mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onBlur={() => patch({ description })}
                  rows={4}
                  className="w-full text-xs font-sans bg-card border border-border rounded-lg px-3 py-1.5 text-ink focus:outline-none focus:border-peach-dark/50 resize-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-sans text-ink/40 uppercase tracking-wide block mb-1">Thumbnail URL</label>
                <input
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  onBlur={() => patch({ thumbnailUrl: thumbnailUrl || null })}
                  placeholder="/workshops/... or an external image URL"
                  className="w-full text-xs font-sans bg-card border border-border rounded-lg px-3 py-1.5 text-ink focus:outline-none focus:border-peach-dark/50"
                />
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

function AddWorkshopForm({ onAdd }: { onAdd: (w: Workshop) => void }) {
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    slug: "", title: "", description: "", price: "",
    date: "", startTime: "", endTime: "", thumbnailUrl: "",
  })

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const res = await fetch("/api/admin/workshops", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: form.slug,
        title: form.title,
        description: form.description,
        price: parseFloat(form.price),
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        thumbnailUrl: form.thumbnailUrl || null,
      }),
    })
    const data = await res.json()
    onAdd({ ...data, registered: 0, sales: 0 })
    setForm({ slug: "", title: "", description: "", price: "", date: "", startTime: "", endTime: "", thumbnailUrl: "" })
    setOpen(false)
    setSaving(false)
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="flex items-center gap-2 text-sm font-sans font-semibold text-ink/60 border border-dashed border-border rounded-2xl px-5 py-3.5 hover:border-ink/30 hover:text-ink transition-colors w-full mt-4">
        <Plus size={14} /> Add Workshop
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-peach-dark/30 rounded-2xl p-5 mt-4">
      <div className="flex items-center justify-between mb-4">
        <p className="font-heading text-base font-700 text-ink">New Workshop</p>
        <button type="button" onClick={() => setOpen(false)} className="text-ink/30 hover:text-ink"><X size={16} /></button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="text-[10px] font-sans text-ink/40 uppercase tracking-wide block mb-1">Slug *</label>
          <input required value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="e.g. fundable-pitch-deck" className="w-full text-sm font-sans bg-cream border border-border rounded-lg px-3 py-1.5 text-ink focus:outline-none focus:border-peach-dark/50" />
        </div>
        <div>
          <label className="text-[10px] font-sans text-ink/40 uppercase tracking-wide block mb-1">Price (₹) *</label>
          <input required type="number" value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="999" className="w-full text-sm font-sans bg-cream border border-border rounded-lg px-3 py-1.5 text-ink focus:outline-none focus:border-peach-dark/50" />
        </div>
      </div>

      <div className="mb-3">
        <label className="text-[10px] font-sans text-ink/40 uppercase tracking-wide block mb-1">Title *</label>
        <input required value={form.title} onChange={(e) => set("title", e.target.value)} className="w-full text-sm font-sans bg-cream border border-border rounded-lg px-3 py-1.5 text-ink focus:outline-none focus:border-peach-dark/50" />
      </div>

      <div className="mb-3">
        <label className="text-[10px] font-sans text-ink/40 uppercase tracking-wide block mb-1">Description *</label>
        <textarea required rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} className="w-full text-sm font-sans bg-cream border border-border rounded-lg px-3 py-1.5 text-ink focus:outline-none focus:border-peach-dark/50 resize-none" />
      </div>

      <div className="grid grid-cols-3 gap-3 mb-3">
        <div>
          <label className="text-[10px] font-sans text-ink/40 uppercase tracking-wide block mb-1">Date *</label>
          <input required type="date" value={form.date} onChange={(e) => set("date", e.target.value)} className="w-full text-sm font-sans bg-cream border border-border rounded-lg px-3 py-1.5 text-ink focus:outline-none focus:border-peach-dark/50" />
        </div>
        <div>
          <label className="text-[10px] font-sans text-ink/40 uppercase tracking-wide block mb-1">Start *</label>
          <input required type="time" value={form.startTime} onChange={(e) => set("startTime", e.target.value)} className="w-full text-sm font-sans bg-cream border border-border rounded-lg px-3 py-1.5 text-ink focus:outline-none focus:border-peach-dark/50" />
        </div>
        <div>
          <label className="text-[10px] font-sans text-ink/40 uppercase tracking-wide block mb-1">End *</label>
          <input required type="time" value={form.endTime} onChange={(e) => set("endTime", e.target.value)} className="w-full text-sm font-sans bg-cream border border-border rounded-lg px-3 py-1.5 text-ink focus:outline-none focus:border-peach-dark/50" />
        </div>
      </div>

      <div className="mb-4">
        <label className="text-[10px] font-sans text-ink/40 uppercase tracking-wide block mb-1">Thumbnail URL</label>
        <input value={form.thumbnailUrl} onChange={(e) => set("thumbnailUrl", e.target.value)} placeholder="/workshops/... or an external image URL" className="w-full text-sm font-sans bg-cream border border-border rounded-lg px-3 py-1.5 text-ink focus:outline-none focus:border-peach-dark/50" />
      </div>

      <div className="flex items-center justify-end gap-3">
        <button type="button" onClick={() => setOpen(false)} className="text-sm font-sans text-ink/40 hover:text-ink">Cancel</button>
        <button type="submit" disabled={saving} className="text-sm font-sans font-semibold bg-ink text-cream px-4 py-2 rounded-lg hover:bg-ink/80 disabled:opacity-50 transition-colors">
          {saving ? "Saving…" : "Add Workshop"}
        </button>
      </div>
    </form>
  )
}

function ListTab({ initialWorkshops }: { initialWorkshops: Workshop[] }) {
  const [workshopList, setWorkshopList] = useState<Workshop[]>(initialWorkshops)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const handleUpdate = (id: string, patch: Partial<Workshop>) =>
    setWorkshopList((prev) => prev.map((w) => (w.id === id ? { ...w, ...patch } : w)))
  const handleDelete = (id: string) =>
    setWorkshopList((prev) => prev.filter((w) => w.id !== id))
  const handleAdd = (w: Workshop) =>
    setWorkshopList((prev) => [w, ...prev])

  return (
    <div>
      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[820px]">
          <thead>
            <tr className="border-b border-border bg-card">
              {["Title", "Date", "Price", "Registered", "Sales", "Meet Link", ""].map((h) => (
                <th key={h} className="py-3 px-4 text-left text-[10px] font-sans font-semibold text-ink/40 uppercase tracking-widest">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {workshopList.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-ink/40 font-sans text-sm">No workshops yet</td>
              </tr>
            ) : (
              workshopList.map((w) => (
                <WorkshopRow
                  key={w.id}
                  workshop={w}
                  expanded={expandedId === w.id}
                  onToggle={() => setExpandedId((prev) => (prev === w.id ? null : w.id))}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
      <AddWorkshopForm onAdd={handleAdd} />
    </div>
  )
}

const PAGE_SIZE = 10

function RegistrationsTab() {
  const [registrations, setRegistrations] = useState<Registration[] | null>(null)
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetch("/api/admin/workshops/registrations")
      .then((r) => r.json())
      .then(setRegistrations)
  }, [])

  if (!registrations) return <div className="text-center py-12 text-ink/40">Loading…</div>

  const revenue = registrations
    .filter((r) => r.status === "confirmed")
    .reduce((sum, r) => sum + (r.amountPaid ?? 0), 0)

  const pageCount = Math.max(1, Math.ceil(registrations.length / PAGE_SIZE))
  const pageRows = registrations.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="font-sans text-xs text-ink/40">
          {registrations.length} registrations · {fmtAmount(revenue)} revenue
        </p>
        {registrations.length > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1 rounded hover:bg-peach-dark/20 disabled:opacity-30"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-ink/60 text-xs">{page} / {pageCount}</span>
            <button
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              disabled={page === pageCount}
              className="p-1 rounded hover:bg-peach-dark/20 disabled:opacity-30"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[1100px]">
          <thead>
            <tr className="border-b border-border bg-card">
              {["Name", "Email", "Stage", "Sector", "Workshop", "Amount", "Payment ID", "Calendar Invite", "Registered", "Status"].map((h) => (
                <th key={h} className="py-3 px-4 text-left text-[10px] font-sans font-semibold text-ink/40 uppercase tracking-widest">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-ink/40 font-sans text-sm">No registrations yet</td>
              </tr>
            ) : (
              pageRows.map((r, i) => (
                <tr key={r.id} className={i !== pageRows.length - 1 ? "border-b border-border" : ""}>
                  <td className="py-3 px-4 font-sans text-sm font-medium text-ink">{r.userName}</td>
                  <td className="py-3 px-4 font-sans text-sm text-ink/70">{r.userEmail}</td>
                  <td className="py-3 px-4 font-sans text-xs text-ink/60">{r.stage ? STAGE_LABELS[r.stage] ?? r.stage : " - "}</td>
                  <td className="py-3 px-4 font-sans text-xs text-ink/60">{r.sector ? SECTOR_LABELS[r.sector] ?? r.sector : " - "}</td>
                  <td className="py-3 px-4 font-sans text-xs text-ink/60">{r.workshopTitle ?? " - "}</td>
                  <td className="py-3 px-4 font-sans text-sm font-medium text-ink">{fmtAmount(r.amountPaid)}</td>
                  <td className="py-3 px-4 font-sans text-xs text-ink/50">{r.razorpayPaymentId ?? " - "}</td>
                  <td className="py-3 px-4 font-sans text-xs text-ink/50">{r.calendarInviteSent ? "sent" : " - "}</td>
                  <td className="py-3 px-4 font-sans text-xs text-ink/50 whitespace-nowrap">{fmt(r.createdAt)}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[r.status] ?? "bg-ink/10 text-ink/60"}`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

type WorkshopTab = "list" | "registrations"

export default function WorkshopsClient({
  initialWorkshops,
  registrationCount,
  defaultTab,
}: {
  initialWorkshops: Workshop[]
  registrationCount: number
  defaultTab?: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tab: WorkshopTab = defaultTab === "list" ? "list" : "registrations"

  const setTab = useCallback((t: WorkshopTab) => {
    const qs = new URLSearchParams(searchParams.toString())
    qs.set("tab", t)
    router.push(`/admin/workshops?${qs.toString()}`)
  }, [router, searchParams])

  return (
    <div className="px-10 py-10">
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-800 text-ink">Workshops</h1>
        <p className="font-sans text-sm text-ink/50 mt-1">Manage workshops and view registrations.</p>
      </div>

      <div className="flex gap-1 mb-6 bg-peach-dark/10 rounded-xl p-1 w-fit">
        {([
          { key: "registrations", label: `Registrations (${registrationCount})` },
          { key: "list", label: "Workshops" },
        ] as const).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t.key ? "bg-peach text-ink shadow-sm" : "text-ink/60 hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "list" ? <ListTab initialWorkshops={initialWorkshops} /> : <RegistrationsTab />}
    </div>
  )
}
