"use client"

import { useEffect, useState } from "react"

type Mistake = {
  id: string
  userName: string
  title: string
  body: string
  industry: string
  topic: string
  status: string
  adminNotes: string | null
  createdAt: string
}

const STATUS_OPTIONS = ["pending", "published", "rejected"]

function MistakeRow({ mistake, onUpdate }: { mistake: Mistake; onUpdate: (id: string, patch: Partial<Mistake>) => void }) {
  const [status, setStatus] = useState(mistake.status)
  const [adminNotes, setAdminNotes] = useState(mistake.adminNotes ?? "")
  const [expanded, setExpanded] = useState(false)

  const save = async (patch: Partial<Mistake>) => {
    await fetch(`/api/admin/startup-mistakes/${mistake.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    })
    onUpdate(mistake.id, patch)
  }

  return (
    <>
      <tr
        className="border-b border-border hover:bg-peach/20 transition-colors cursor-pointer"
        onClick={() => setExpanded((v) => !v)}
      >
        <td className="py-3 px-4 text-xs font-sans text-ink/50">
          {new Date(mistake.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
        </td>
        <td className="py-3 px-4">
          <p className="text-sm font-sans font-medium text-ink">{mistake.userName}</p>
        </td>
        <td className="py-3 px-4">
          <p className="text-xs font-sans text-ink/70 line-clamp-2 max-w-xs">{mistake.title}</p>
        </td>
        <td className="py-3 px-4 text-[11px] font-sans text-ink/40">{mistake.industry}</td>
        <td className="py-3 px-4 text-[11px] font-sans text-ink/40">{mistake.topic}</td>
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
          <td colSpan={7} className="px-4 py-3">
            <p className="text-[10px] font-sans text-ink/40 uppercase tracking-wide mb-1">Full Post</p>
            <p className="text-sm font-sans text-ink/70 leading-relaxed whitespace-pre-wrap">{mistake.body}</p>
          </td>
        </tr>
      )}
    </>
  )
}

export default function StartupMistakesAdminPage() {
  const [mistakes, setMistakes] = useState<Mistake[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "pending" | "published" | "rejected">("all")

  useEffect(() => {
    fetch("/api/admin/startup-mistakes")
      .then((r) => r.json())
      .then((data) => { setMistakes(data); setLoading(false) })
  }, [])

  const handleUpdate = (id: string, patch: Partial<Mistake>) => {
    setMistakes((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)))
  }

  const filtered = filter === "all" ? mistakes : mistakes.filter((m) => m.status === filter)

  return (
    <div className="px-10 py-10">
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-800 text-ink">Startup Mistakes</h1>
        <p className="font-sans text-sm text-ink/50 mt-1">{mistakes.length} total</p>
        <div className="flex items-center gap-1 mt-3">
          {(["all", "pending", "published", "rejected"] as const).map((f) => (
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
        <p className="font-sans text-sm text-ink/40">No mistakes yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="border-b border-border bg-card">
                {["Date", "Founder", "Title", "Industry", "Topic", "Status", "Notes"].map((h) => (
                  <th key={h} className="py-3 px-4 text-left text-[10px] font-sans font-semibold text-ink/40 uppercase tracking-widest">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <MistakeRow key={m.id} mistake={m} onUpdate={handleUpdate} />
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-[10px] font-sans text-ink/30 mt-3">click a row to expand full post</p>
    </div>
  )
}
