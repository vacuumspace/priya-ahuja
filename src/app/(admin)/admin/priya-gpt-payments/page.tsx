"use client"

import { useEffect, useState, useCallback } from "react"

type Row = {
  id: string
  userName: string
  userEmail: string
  razorpayPaymentId: string | null
  amountPaise: number | null
  deltaMinutes: number
  createdAt: string
}

type MonthSummary = { month: string; count: number; revenue: number }

function fmt(date: string) {
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(date))
}
function fmtAmt(paise: number | null) {
  if (paise == null) return "—"
  return "₹" + (paise / 100).toLocaleString("en-IN")
}
function fmtMonth(ym: string) {
  const [y, m] = ym.split("-")
  return new Date(Number(y), Number(m) - 1, 1).toLocaleString("en-IN", { month: "long", year: "numeric" })
}

export default function PriyaGptPaymentsAdminPage() {
  const [month, setMonth] = useState("")
  const [page, setPage] = useState(1)

  const [rows, setRows] = useState<Row[]>([])
  const [total, setTotal] = useState(0)
  const [revenue, setRevenue] = useState(0)
  const [pageCount, setPageCount] = useState(1)
  const [monthlySummary, setMonthlySummary] = useState<MonthSummary[]>([])
  const [loading, setLoading] = useState(false)

  const load = useCallback(async (m: string, p: number) => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(p) })
    if (m) params.set("month", m)
    const res = await fetch(`/api/admin/priya-gpt-payments?${params}`)
    const data = await res.json()
    setRows(data.rows ?? [])
    setTotal(data.total ?? 0)
    setRevenue(data.revenue ?? 0)
    setPageCount(data.pageCount ?? 1)
    setMonthlySummary(data.monthlySummary ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load(month, page) }, [month, page, load])

  const availableMonths = monthlySummary.map((s) => s.month)

  return (
    <div className="px-10 py-10">
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-800 text-ink">PriyaGPT</h1>
        <p className="font-sans text-sm text-ink/50 mt-1">
          {total} payments · {fmtAmt(revenue)} revenue
          {month ? ` · ${fmtMonth(month)}` : ""}
        </p>
      </div>

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
          {availableMonths.map((m) => (
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

      {loading ? (
        <p className="font-sans text-sm text-ink/40">Loading...</p>
      ) : rows.length === 0 ? (
        <p className="font-sans text-sm text-ink/40">No payments yet{month ? ` for ${fmtMonth(month)}` : ""}.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[720px]">
            <thead>
              <tr className="border-b border-border bg-card">
                {["#", "Name", "Email", "Minutes", "Amount", "Payment ID", "Date"].map((h) => (
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
                  <td className="py-3 px-4 font-sans text-sm text-ink/70">{row.deltaMinutes} min</td>
                  <td className="py-3 px-4 font-sans text-sm font-medium text-ink">{fmtAmt(row.amountPaise)}</td>
                  <td className="py-3 px-4 font-sans text-xs text-ink/50">{row.razorpayPaymentId ?? "—"}</td>
                  <td className="py-3 px-4 font-sans text-xs text-ink/50">{fmt(row.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {rows.length > 0 && (
        <div className="flex items-center gap-3 mt-4 justify-end">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="font-sans text-xs px-3 py-1.5 rounded-lg border border-border text-ink/60 disabled:opacity-30 hover:bg-card transition-colors"
          >
            Prev
          </button>
          <span className="font-sans text-xs text-ink/40">{page} / {pageCount}</span>
          <button
            disabled={page >= pageCount}
            onClick={() => setPage((p) => p + 1)}
            className="font-sans text-xs px-3 py-1.5 rounded-lg border border-border text-ink/60 disabled:opacity-30 hover:bg-card transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
