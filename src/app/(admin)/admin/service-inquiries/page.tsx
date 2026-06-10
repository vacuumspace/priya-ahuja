"use client"

import { useEffect, useState } from "react"

type Inquiry = {
  id: string
  type: string
  name: string
  email: string
  phone: string | null
  budget: string | null
  projectDescription: string
  status: string
  adminNotes: string | null
  createdAt: string
}

const STATUS_OPTIONS = ["new", "reviewing", "in-progress", "closed"]

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    new: "bg-amber-tag text-ink/70",
    reviewing: "bg-blue-100 text-blue-800",
    "in-progress": "bg-green-100 text-green-800",
    closed: "bg-border text-ink/40",
  }
  return (
    <span className={`text-[10px] font-sans px-2 py-0.5 rounded font-medium ${colors[status] ?? "bg-border text-ink/60"}`}>
      {status}
    </span>
  )
}

function InquiryRow({ inquiry, onUpdate }: { inquiry: Inquiry; onUpdate: (id: string, patch: Partial<Inquiry>) => void }) {
  const [status, setStatus] = useState(inquiry.status)
  const [adminNotes, setAdminNotes] = useState(inquiry.adminNotes ?? "")
  const [expanded, setExpanded] = useState(false)

  const save = async (patch: Partial<Inquiry>) => {
    await fetch(`/api/admin/service-inquiries/${inquiry.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    })
    onUpdate(inquiry.id, patch)
  }

  return (
    <>
      <tr
        className="border-b border-border hover:bg-peach/20 transition-colors cursor-pointer"
        onClick={() => setExpanded((v) => !v)}
      >
        <td className="py-3 px-4 text-xs font-sans text-ink/50">
          {new Date(inquiry.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
        </td>
        <td className="py-3 px-4">
          <p className="text-sm font-sans font-medium text-ink">{inquiry.name}</p>
          <p className="text-[11px] font-sans text-ink/40">{inquiry.email}</p>
          {inquiry.phone && <p className="text-[11px] font-sans text-ink/40">{inquiry.phone}</p>}
        </td>
        <td className="py-3 px-4">
          <span className={`text-[10px] font-sans px-2 py-0.5 rounded font-medium ${
            inquiry.type === "tech" ? "bg-blue-100 text-blue-700" :
            inquiry.type === "branding" ? "bg-purple-100 text-purple-700" :
            inquiry.type === "accounting" ? "bg-green-100 text-green-700" :
            inquiry.type === "incorporation" ? "bg-orange-100 text-orange-700" :
            "bg-ink/10 text-ink/60"
          }`}>
            {inquiry.type === "tech" ? "tech dev" :
             inquiry.type === "branding" ? "branding" :
             inquiry.type === "accounting" ? "accounting" :
             inquiry.type === "incorporation" ? "incorporation" :
             inquiry.type}
          </span>
        </td>
        <td className="py-3 px-4 text-xs font-sans text-ink/60">{inquiry.budget ?? "—"}</td>
        <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
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
        <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
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
      {expanded && (
        <tr className="border-b border-border bg-peach/10">
          <td colSpan={6} className="px-4 py-3">
            <p className="text-[10px] font-sans text-ink/40 uppercase tracking-wide mb-1">Project Description</p>
            <p className="text-sm font-sans text-ink/70 leading-relaxed">{inquiry.projectDescription}</p>
          </td>
        </tr>
      )}
    </>
  )
}

export default function ServiceInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "tech" | "branding" | "accounting" | "incorporation">("all")

  useEffect(() => {
    fetch("/api/admin/service-inquiries")
      .then((r) => r.json())
      .then((data) => { setInquiries(data); setLoading(false) })
  }, [])

  const handleUpdate = (id: string, patch: Partial<Inquiry>) => {
    setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)))
  }

  const filtered = filter === "all" ? inquiries : inquiries.filter((i) => i.type === filter)

  return (
    <div className="px-10 py-10">
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-800 text-ink">Service Inquiries</h1>
        <p className="font-sans text-sm text-ink/50 mt-1">{inquiries.length} total</p>
        <div className="flex items-center gap-1 mt-3 flex-wrap">
          {(["all", "tech", "branding", "accounting", "incorporation"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-[11px] font-sans px-3 py-1.5 rounded-full border transition-all capitalize ${
                filter === f
                  ? "bg-ink text-cream border-ink"
                  : "bg-transparent text-ink/50 border-border hover:border-ink/30 hover:text-ink/70"
              }`}
            >
              {f === "all" ? "all" : f === "tech" ? "tech dev" : f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="font-sans text-sm text-ink/40">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="font-sans text-sm text-ink/40">No inquiries yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-border bg-card">
                {["Date", "Client", "Type", "Budget", "Status", "Notes"].map((h) => (
                  <th key={h} className="py-3 px-4 text-left text-[10px] font-sans font-semibold text-ink/40 uppercase tracking-widest">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((i) => (
                <InquiryRow key={i.id} inquiry={i} onUpdate={handleUpdate} />
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-[10px] font-sans text-ink/30 mt-3">click a row to expand project description</p>
    </div>
  )
}
