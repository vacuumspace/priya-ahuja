"use client"

import { useEffect, useState, useCallback } from "react"

const TABS = [
  { key: "all",                label: "All Lists" },
  { key: "angel-investor-list", label: "Angel Investors" },
  { key: "early-stage-vc-list", label: "Early Stage VC" },
  { key: "family-offices-list", label: "Family Offices" },
  { key: "incubators-list",     label: "Incubator & Accelerator" },
] as const

type TabKey = (typeof TABS)[number]["key"]

type Row = {
  id: string
  userName: string
  userEmail: string
  razorpayPaymentId: string | null
  downloadToken: string | null
  amountPaid: number | null
  price: number
  createdAt: string
  slug: string
  productTitle: string
}

type MonthSummary = {
  month: string
  count: number
  revenue: number
  bySlug: Record<string, { count: number; revenue: number }>
}

function fmt(date: string) {
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(date))
}
function fmtAmt(paise: number) {
  return "₹" + (paise / 100).toLocaleString("en-IN")
}
function fmtMonth(ym: string) {
  const [y, m] = ym.split("-")
  return new Date(Number(y), Number(m) - 1, 1).toLocaleString("en-IN", { month: "long", year: "numeric" })
}

const SLUG_LABELS: Record<string, string> = {
  "angel-investor-list":  "Angel Investors",
  "early-stage-vc-list":  "Early Stage VC",
  "family-offices-list":  "Family Offices",
  "incubators-list":      "Incubator & Accelerator",
}

export default function InvestorListAdminPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("all")
  const [month, setMonth] = useState("")
  const [page, setPage] = useState(1)

  const [rows, setRows] = useState<Row[]>([])
  const [total, setTotal] = useState(0)
  const [revenue, setRevenue] = useState(0)
  const [pageCount, setPageCount] = useState(1)
  const [monthlySummary, setMonthlySummary] = useState<MonthSummary[]>([])
  const [loading, setLoading] = useState(false)
  const [revoking, setRevoking] = useState<string | null>(null)

  const load = useCallback(async (tab: TabKey, m: string, p: number) => {
    setLoading(true)
    const params = new URLSearchParams({ listType: tab, page: String(p) })
    if (m) params.set("month", m)
    const res = await fetch(`/api/admin/investor-list?${params}`)
    const data = await res.json()
    setRows(data.rows ?? [])
    setTotal(data.total ?? 0)
    setRevenue(data.revenue ?? 0)
    setPageCount(data.pageCount ?? 1)
    setMonthlySummary(data.monthlySummary ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load(activeTab, month, page) }, [activeTab, month, page, load])

  const switchTab = (tab: TabKey) => {
    setActiveTab(tab)
    setMonth("")
    setPage(1)
  }

  const revoke = async (id: string, name: string) => {
    if (!confirm(`Revoke access for ${name}?`)) return
    setRevoking(id)
    await fetch("/api/admin/investor-list", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ purchaseId: id }),
    })
    setRows(prev => prev.map(r => r.id === id ? { ...r, downloadToken: null } : r))
    setRevoking(null)
  }

  // Unique months available for filter
  const availableMonths = monthlySummary.map(s => s.month)

  return (
    <div className="px-10 py-10">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-800 text-ink">Investor List</h1>
        <p className="font-sans text-sm text-ink/50 mt-1">
          {total} purchases · {fmtAmt(revenue)} revenue
          {month ? ` · ${fmtMonth(month)}` : ""}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border mb-6">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => switchTab(tab.key)}
            className={`px-4 py-2 text-xs font-sans font-semibold transition-colors border-b-2 -mb-px ${
              activeTab === tab.key
                ? "border-ink text-ink"
                : "border-transparent text-ink/40 hover:text-ink/70"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Month filter */}
      {availableMonths.length > 0 && (
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => { setMonth(""); setPage(1) }}
            className={`font-sans text-xs px-3 py-1.5 rounded-lg border transition-colors ${
              !month ? "border-ink bg-ink text-cream" : "border-border text-ink/50 hover:bg-card"
            }`}
          >
            All
          </button>
          {availableMonths.map(m => (
            <button
              key={m}
              onClick={() => { setMonth(month === m ? "" : m); setPage(1) }}
              className={`font-sans text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                month === m ? "border-ink bg-ink text-cream" : "border-border text-ink/50 hover:bg-card"
              }`}
            >
              {fmtMonth(m)}
            </button>
          ))}
        </div>
      )}

      {/* Transactions table */}
      {loading ? (
        <p className="font-sans text-sm text-ink/40">Loading...</p>
      ) : rows.length === 0 ? (
        <p className="font-sans text-sm text-ink/40">No purchases yet{month ? ` for ${fmtMonth(month)}` : ""}.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[780px]">
            <thead>
              <tr className="border-b border-border bg-card">
                {["#", "Name", "Email", activeTab === "all" ? "List" : "", "Amount", "Payment ID", "Date", "Access"]
                  .filter(Boolean)
                  .map(h => (
                    <th key={h} className="py-3 px-4 text-left text-[10px] font-sans font-semibold text-ink/40 uppercase tracking-widest">
                      {h}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.id} className={i !== rows.length - 1 ? "border-b border-border" : ""}>
                  <td className="py-3 px-4 font-sans text-xs text-ink/30">{(page - 1) * 10 + i + 1}</td>
                  <td className="py-3 px-4 font-sans text-sm font-medium text-ink">{row.userName}</td>
                  <td className="py-3 px-4 font-sans text-sm text-ink/70">{row.userEmail}</td>
                  {activeTab === "all" && (
                    <td className="py-3 px-4">
                      <span className="font-sans text-[11px] text-ink/60 bg-card border border-border rounded-md px-2 py-0.5">
                        {SLUG_LABELS[row.slug] ?? row.slug}
                      </span>
                    </td>
                  )}
                  <td className="py-3 px-4 font-sans text-sm font-medium text-ink">{fmtAmt(row.amountPaid ?? row.price)}</td>
                  <td className="py-3 px-4 font-sans text-xs text-ink/50">{row.razorpayPaymentId ?? "—"}</td>
                  <td className="py-3 px-4 font-sans text-xs text-ink/50">{fmt(row.createdAt)}</td>
                  <td className="py-3 px-4">
                    {row.downloadToken ? (
                      <button
                        onClick={() => revoke(row.id, row.userName)}
                        disabled={revoking === row.id}
                        className="font-sans text-[11px] text-red-500 hover:underline disabled:opacity-40"
                      >
                        {revoking === row.id ? "Revoking..." : "Revoke"}
                      </button>
                    ) : (
                      <span className="font-sans text-[11px] text-ink/30">Revoked</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {rows.length > 0 && (
        <div className="flex items-center gap-3 mt-4 justify-end">
          <button
            disabled={page <= 1}
            onClick={() => setPage(p => p - 1)}
            className="font-sans text-xs px-3 py-1.5 rounded-lg border border-border text-ink/60 disabled:opacity-30 hover:bg-card transition-colors"
          >
            Prev
          </button>
          <span className="font-sans text-xs text-ink/40">{page} / {pageCount}</span>
          <button
            disabled={page >= pageCount}
            onClick={() => setPage(p => p + 1)}
            className="font-sans text-xs px-3 py-1.5 rounded-lg border border-border text-ink/60 disabled:opacity-30 hover:bg-card transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
