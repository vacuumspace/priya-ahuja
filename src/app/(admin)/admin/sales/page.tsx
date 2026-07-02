"use client"

import { useEffect, useState, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"

type Transaction = {
  id: string
  type: string
  userName: string
  userEmail: string
  itemName: string
  amount: number | null
  razorpayPaymentId: string | null
  status: string
  createdAt: string
}

type MonthRow = {
  key: string
  label: string
  revenue: number
  count: number
  sessions: { revenue: number; count: number }
  templates: { revenue: number; count: number }
  investorList: { revenue: number; count: number }
}

type SummaryData = {
  totalRevenue: number
  totalTransactions: number
  byType: { label: string; revenue: number; count: number }[]
  monthly: MonthRow[]
}

function fmt(date: string) {
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(date))
}

function fmtAmount(paise: number | null) {
  if (paise == null) return "—"
  return "₹" + (paise / 100).toLocaleString("en-IN")
}

const TYPE_LABELS: Record<string, string> = {
  booking: "Session",
  template: "Template",
  score: "Score",
  angel: "Investor List",
}

const TYPE_COLORS: Record<string, string> = {
  booking:  "bg-emerald-100 text-emerald-700",
  template: "bg-violet-100 text-violet-700",
  angel:    "bg-pink-100 text-pink-700",
  score:    "bg-gray-100 text-gray-500",
}

const STATUS_COLORS: Record<string, string> = {
  paid: "bg-green-100 text-green-800",
  confirmed: "bg-green-100 text-green-800",
  completed: "bg-blue-100 text-blue-800",
}

// ─── Transactions Tab ─────────────────────────────────────────────────────────

function TransactionsTab() {
  const [data, setData] = useState<Transaction[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const pageCount = Math.max(1, Math.ceil(total / 10))

  const load = useCallback((p: number) => {
    setLoading(true)
    fetch(`/api/admin/sales/transactions?page=${p}`)
      .then((r) => r.json())
      .then((d) => {
        setData(d.transactions)
        setTotal(d.total)
        setLoading(false)
      })
  }, [])

  useEffect(() => { load(page) }, [page, load])

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-ink/50">{total} transactions total</p>
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1 rounded hover:bg-peach-dark/20 disabled:opacity-30"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-ink/60">
            {page} / {pageCount}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
            disabled={page === pageCount}
            className="p-1 rounded hover:bg-peach-dark/20 disabled:opacity-30"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-peach-dark/20 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-peach-dark/10 text-left">
              <th className="px-4 py-3 font-medium text-ink/60">Date</th>
              <th className="px-4 py-3 font-medium text-ink/60">Type</th>
              <th className="px-4 py-3 font-medium text-ink/60">Customer</th>
              <th className="px-4 py-3 font-medium text-ink/60">Item</th>
              <th className="px-4 py-3 font-medium text-ink/60">Amount</th>
              <th className="px-4 py-3 font-medium text-ink/60">Payment ID</th>
              <th className="px-4 py-3 font-medium text-ink/60">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-ink/40">
                  Loading…
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-ink/40">
                  No transactions yet
                </td>
              </tr>
            ) : (
              data.map((tx) => (
                <tr key={tx.id} className="border-t border-peach-dark/10 hover:bg-peach-dark/5">
                  <td className="px-4 py-3 text-ink/70 whitespace-nowrap">{fmt(tx.createdAt)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TYPE_COLORS[tx.type] ?? "bg-ink/10 text-ink/50"}`}>
                      {TYPE_LABELS[tx.type] ?? tx.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-ink">{tx.userName}</div>
                    <div className="text-xs text-ink/50">{tx.userEmail}</div>
                  </td>
                  <td className="px-4 py-3 text-ink/80">{tx.itemName}</td>
                  <td className="px-4 py-3 font-medium text-ink">{fmtAmount(tx.amount)}</td>
                  <td className="px-4 py-3 text-ink/50 font-mono text-xs">
                    {tx.razorpayPaymentId ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        STATUS_COLORS[tx.status] ?? "bg-ink/10 text-ink/60"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && data.length > 0 && (
        <div className="flex items-center justify-between mt-4 text-sm text-ink/50">
          <span>
            Showing {(page - 1) * 10 + 1}–{Math.min(page * 10, total)} of {total}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg border border-peach-dark/20 hover:bg-peach-dark/10 disabled:opacity-30"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              disabled={page === pageCount}
              className="px-3 py-1.5 rounded-lg border border-peach-dark/20 hover:bg-peach-dark/10 disabled:opacity-30"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Summary Tab ──────────────────────────────────────────────────────────────

const SEG = {
  total:        { bar: "bg-peach-dark/60",   text: "text-peach-dark",  dot: "bg-peach-dark" },
  sessions:     { bar: "bg-emerald-500/60", text: "text-emerald-400", dot: "bg-emerald-400" },
  templates:    { bar: "bg-violet-500/60",  text: "text-violet-400",  dot: "bg-violet-400" },
  investorList: { bar: "bg-pink-500/60",    text: "text-pink-400",    dot: "bg-pink-400" },
} as const

const CHART_VIEWS = [
  { key: "total",        label: "Total",        color: SEG.total.bar },
  { key: "sessions",     label: "Sessions",     color: SEG.sessions.bar },
  { key: "templates",    label: "Templates",    color: SEG.templates.bar },
  { key: "investorList", label: "Investor List",color: SEG.investorList.bar },
] as const

type ChartViewKey = (typeof CHART_VIEWS)[number]["key"]

function getSegVal(m: MonthRow, view: ChartViewKey, field: "revenue" | "count"): number {
  if (view === "total") return m[field]
  return m[view][field]
}

function MiniBar({ months, getVal, color, fmt: fmtVal, label }: {
  months: MonthRow[]
  getVal: (m: MonthRow) => number
  color: string
  fmt: (v: number) => string
  label: string
}) {
  const max = Math.max(...months.map(getVal), 1)
  return (
    <div>
      <p className="text-[10px] font-sans text-ink/40 uppercase tracking-widest mb-5">{label}</p>
      <div className="flex items-end gap-1 h-20">
        {months.map(m => {
          const val = getVal(m)
          return (
            <div key={m.key} className="flex-1 flex flex-col items-center gap-0.5 min-w-0">
              <div className="w-full relative flex justify-center">
                {val > 0 && (
                  <span className="text-[11px] font-medium text-ink/50 absolute -top-4 whitespace-nowrap">{fmtVal(val)}</span>
                )}
                <div className={`w-full rounded-t-sm ${color}`} style={{ height: `${Math.max(2, (val / max) * 68)}px` }} />
              </div>
              <span className="text-[10px] text-ink/40 truncate w-full text-center">{m.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function SummaryTab() {
  const [data, setData] = useState<SummaryData | null>(null)
  const [monthIdx, setMonthIdx] = useState<number | null>(null)
  const [chartView, setChartView] = useState<number>(0)

  useEffect(() => {
    fetch("/api/admin/sales/summary")
      .then(r => r.json())
      .then((d: SummaryData) => {
        setData(d)
        // default to current month (June 2026 = index 0)
        const now = new Date()
        const curKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
        const idx = d.monthly.findIndex(m => m.key === curKey)
        setMonthIdx(idx >= 0 ? idx : 0)
      })
  }, [])

  if (!data || monthIdx === null) {
    return <div className="text-center py-12 text-ink/40">Loading…</div>
  }

  const activeMonths = data.monthly.filter(m => m.count > 0 || m.revenue > 0)
  const sel = data.monthly[monthIdx]
  const view = CHART_VIEWS[chartView]

  const statRows: { label: string; revenue: number; count: number; text: string; dot: string }[] = [
    { label: "Total",        revenue: sel.revenue,              count: sel.count,              text: SEG.total.text,        dot: SEG.total.dot },
    { label: "Sessions",     revenue: sel.sessions.revenue,     count: sel.sessions.count,     text: SEG.sessions.text,     dot: SEG.sessions.dot },
    { label: "Templates",    revenue: sel.templates.revenue,    count: sel.templates.count,    text: SEG.templates.text,    dot: SEG.templates.dot },
    { label: "Investor List",revenue: sel.investorList.revenue, count: sel.investorList.count, text: SEG.investorList.text, dot: SEG.investorList.dot },
  ]

  return (
    <div className="space-y-10">
      {/* Charts */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-5">
          <p className="font-sans text-xs font-semibold text-ink/50 uppercase tracking-widest flex items-center gap-1.5">
            <span className={`inline-block w-2 h-2 rounded-sm ${SEG[view.key as keyof typeof SEG].dot}`} />
            {view.label}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setChartView(v => Math.max(0, v - 1))}
              disabled={chartView === 0}
              className="p-1 rounded hover:bg-ink/10 disabled:opacity-20 transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="font-sans text-xs text-ink/50 px-1">{chartView + 1} / {CHART_VIEWS.length}</span>
            <button
              onClick={() => setChartView(v => Math.min(CHART_VIEWS.length - 1, v + 1))}
              disabled={chartView === CHART_VIEWS.length - 1}
              className="p-1 rounded hover:bg-ink/10 disabled:opacity-20 transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
        <div className="space-y-6">
          <MiniBar
            months={data.monthly}
            getVal={m => getSegVal(m, view.key, "revenue")}
            color={view.color}
            fmt={fmtAmount}
            label="Amount"
          />
          <MiniBar
            months={data.monthly}
            getVal={m => getSegVal(m, view.key, "count")}
            color={view.color}
            fmt={v => String(v)}
            label="Volume"
          />
        </div>
      </div>

      {/* Month stats panel */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="font-sans text-xs font-semibold text-ink/50 uppercase tracking-widest">{sel.label} — breakdown</p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setMonthIdx(i => Math.max(0, i! - 1))}
              disabled={monthIdx === 0}
              className="p-1 rounded hover:bg-ink/10 disabled:opacity-20 transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="font-sans text-xs text-ink/50 px-1">{sel.label}</span>
            <button
              onClick={() => setMonthIdx(i => Math.min(data.monthly.length - 1, i! + 1))}
              disabled={monthIdx === data.monthly.length - 1}
              className="p-1 rounded hover:bg-ink/10 disabled:opacity-20 transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {statRows.map(row => (
            <div key={row.label} className="bg-background rounded-xl px-4 py-3">
              <div className="flex items-center gap-1.5 mb-1">
                <span className={`w-2 h-2 rounded-sm flex-shrink-0 ${row.dot}`} />
                <p className="font-sans text-[11px] text-ink/40">{row.label}</p>
              </div>
              <p className={`font-sans text-base font-bold ${row.text}`}>{fmtAmount(row.revenue)}</p>
              <p className="font-sans text-[11px] text-ink/40 mt-0.5">{row.count} sales</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-peach-dark/10 rounded-xl px-3 py-2.5 min-w-[120px]">
      <p className="text-[11px] text-ink/50 mb-0.5">{label}</p>
      <p className="text-base font-heading font-bold text-ink">{value}</p>
      {sub && <p className="text-[10px] text-ink/40">{sub}</p>}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SalesPage() {
  const searchParams = useSearchParams()
  const [tab, setTab] = useState<"transactions" | "summary">(
    searchParams.get("tab") === "transactions" ? "transactions" : "summary"
  )

  return (
    <div className="px-10 py-10">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-800 text-ink">Sales</h1>
        <p className="font-sans text-sm text-ink/50 mt-1">Revenue, transactions, and summaries.</p>
      </div>

      <div className="flex gap-1 mb-6 bg-peach-dark/10 rounded-xl p-1 w-fit">
        {(["summary", "transactions"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              tab === t
                ? "bg-peach text-ink shadow-sm"
                : "text-ink/60 hover:text-ink"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "transactions" ? <TransactionsTab /> : <SummaryTab />}
    </div>
  )
}
