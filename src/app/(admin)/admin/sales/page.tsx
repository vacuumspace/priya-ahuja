"use client"

import { useEffect, useState, useCallback } from "react"
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

type SummaryData = {
  totalRevenue: number
  totalTransactions: number
  byType: { label: string; revenue: number; count: number }[]
  monthly: { key: string; label: string; revenue: number; count: number }[]
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
                    <span className="text-xs font-medium bg-peach-dark/20 text-ink/70 px-2 py-0.5 rounded-full">
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

function SummaryTab() {
  const [data, setData] = useState<SummaryData | null>(null)

  useEffect(() => {
    fetch("/api/admin/sales/summary")
      .then((r) => r.json())
      .then(setData)
  }, [])

  if (!data) {
    return <div className="text-center py-12 text-ink/40">Loading…</div>
  }

  const maxRevenue = Math.max(...data.monthly.map((m) => m.revenue), 1)

  return (
    <div className="space-y-8">
      {/* Top-line stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Revenue" value={fmtAmount(data.totalRevenue)} />
        <StatCard label="Total Transactions" value={String(data.totalTransactions)} />
        {data.byType.map((t) => (
          <StatCard
            key={t.label}
            label={t.label}
            value={t.revenue > 0 ? fmtAmount(t.revenue) : String(t.count)}
            sub={t.revenue > 0 ? `${t.count} transactions` : "submissions"}
          />
        ))}
      </div>

      {/* Monthly revenue bar chart */}
      <div>
        <h3 className="text-sm font-medium text-ink/60 mb-4">Monthly Revenue (last 12 months)</h3>
        <div className="flex items-end gap-2 h-40">
          {data.monthly.map((m) => (
            <div key={m.key} className="flex-1 flex flex-col items-center gap-1 min-w-0">
              <div className="w-full relative flex justify-center">
                {m.revenue > 0 && (
                  <span className="text-[10px] text-ink/50 absolute -top-5 whitespace-nowrap">
                    {fmtAmount(m.revenue)}
                  </span>
                )}
                <div
                  className="w-full bg-peach-dark/40 rounded-t-sm"
                  style={{ height: `${Math.max(4, (m.revenue / maxRevenue) * 128)}px` }}
                />
              </div>
              <span className="text-[10px] text-ink/40 truncate w-full text-center">{m.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly count table */}
      <div>
        <h3 className="text-sm font-medium text-ink/60 mb-3">Monthly Breakdown</h3>
        <div className="rounded-xl border border-peach-dark/20 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-peach-dark/10 text-left">
                <th className="px-4 py-2.5 font-medium text-ink/60">Month</th>
                <th className="px-4 py-2.5 font-medium text-ink/60">Transactions</th>
                <th className="px-4 py-2.5 font-medium text-ink/60">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {[...data.monthly].reverse().map((m) => (
                <tr key={m.key} className="border-t border-peach-dark/10">
                  <td className="px-4 py-2.5 text-ink/80">{m.label}</td>
                  <td className="px-4 py-2.5 text-ink/70">{m.count}</td>
                  <td className="px-4 py-2.5 font-medium text-ink">
                    {m.revenue > 0 ? fmtAmount(m.revenue) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-peach-dark/10 rounded-xl px-4 py-4">
      <p className="text-xs text-ink/50 mb-1">{label}</p>
      <p className="text-xl font-heading font-bold text-ink">{value}</p>
      {sub && <p className="text-xs text-ink/40 mt-0.5">{sub}</p>}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SalesPage() {
  const [tab, setTab] = useState<"transactions" | "summary">("transactions")

  return (
    <div>
      <h1 className="text-2xl font-heading font-800 text-ink mb-6">Sales</h1>

      <div className="flex gap-1 mb-6 bg-peach-dark/10 rounded-xl p-1 w-fit">
        {(["transactions", "summary"] as const).map((t) => (
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
