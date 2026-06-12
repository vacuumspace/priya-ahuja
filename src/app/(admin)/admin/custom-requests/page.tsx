"use client"

import { useEffect, useState } from "react"

type CustomRequest = {
  id: string
  name: string
  email: string
  message: string
  source: string | null
  status: string
  adminNotes: string | null
  createdAt: string
}

const STATUS_OPTIONS = ["new", "reviewed", "closed"]

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    new: "bg-amber-tag text-ink/70",
    reviewed: "bg-blue-100 text-blue-800",
    closed: "bg-border text-ink/40",
  }
  return (
    <span className={`text-[10px] font-sans px-2 py-0.5 rounded font-medium ${colors[status] ?? "bg-border text-ink/60"}`}>
      {status}
    </span>
  )
}

function RequestRow({ request, onUpdate }: { request: CustomRequest; onUpdate: (id: string, patch: Partial<CustomRequest>) => void }) {
  const [status, setStatus] = useState(request.status)
  const [adminNotes, setAdminNotes] = useState(request.adminNotes ?? "")
  const [expanded, setExpanded] = useState(false)

  const save = async (patch: Partial<CustomRequest>) => {
    await fetch(`/api/admin/custom-requests/${request.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    })
    onUpdate(request.id, patch)
  }

  return (
    <>
      <tr
        className="border-b border-border hover:bg-peach/20 transition-colors cursor-pointer"
        onClick={() => setExpanded((v) => !v)}
      >
        <td className="py-3 px-4 text-xs font-sans text-ink/50">
          {new Date(request.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
        </td>
        <td className="py-3 px-4">
          <p className="text-sm font-sans font-medium text-ink">{request.name}</p>
          <p className="text-[11px] font-sans text-ink/40">{request.email}</p>
        </td>
        <td className="py-3 px-4">
          <p className="text-xs font-sans text-ink/70 line-clamp-2 max-w-xs">{request.message}</p>
        </td>
        <td className="py-3 px-4 text-[11px] font-sans text-ink/40">{request.source ?? "—"}</td>
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
            <p className="text-[10px] font-sans text-ink/40 uppercase tracking-wide mb-1">Full Message</p>
            <p className="text-sm font-sans text-ink/70 leading-relaxed whitespace-pre-wrap">{request.message}</p>
          </td>
        </tr>
      )}
    </>
  )
}

export default function CustomRequestsPage() {
  const [requests, setRequests] = useState<CustomRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "new" | "reviewed" | "closed">("all")

  useEffect(() => {
    fetch("/api/admin/custom-requests")
      .then((r) => r.json())
      .then((data) => { setRequests(data); setLoading(false) })
  }, [])

  const handleUpdate = (id: string, patch: Partial<CustomRequest>) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  }

  const filtered = filter === "all" ? requests : requests.filter((r) => r.status === filter)

  return (
    <div className="px-10 py-10">
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-800 text-ink">Custom Requests</h1>
        <p className="font-sans text-sm text-ink/50 mt-1">{requests.length} total</p>
        <div className="flex items-center gap-1 mt-3">
          {(["all", "new", "reviewed", "closed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-[11px] font-sans px-3 py-1.5 rounded-full border transition-all capitalize ${
                filter === f
                  ? "bg-ink text-cream border-ink"
                  : "bg-transparent text-ink/50 border-border hover:border-ink/30 hover:text-ink/70"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="font-sans text-sm text-ink/40">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="font-sans text-sm text-ink/40">No requests yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-border bg-card">
                {["Date", "From", "Message", "Source", "Status", "Notes"].map((h) => (
                  <th key={h} className="py-3 px-4 text-left text-[10px] font-sans font-semibold text-ink/40 uppercase tracking-widest">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <RequestRow key={r.id} request={r} onUpdate={handleUpdate} />
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-[10px] font-sans text-ink/30 mt-3">click a row to expand full message</p>
    </div>
  )
}
