"use client"

import { useEffect, useState, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

type Conversion = {
  label: string
  ctaId: string
  clicks: number
  completions: number
  rate: number | null
}

type StatsData = {
  totals: {
    users: number
    transactions: number
    scores: number
    paidScores: number
    inquiries: number
    pageViews: number
  }
  bookingsByService: { service: string; count: number }[]
  inquiriesByType: { type: string; count: number }[]
  monthly: {
    key: string
    label: string
    transactions: number
    newUsers: number
    inquiries: number
    scores: number
  }[]
  conversions: Conversion[]
}

function StatCard({ label, value, sub }: { label: string; value: number | string; sub?: string }) {
  return (
    <div className="bg-peach-dark/10 rounded-xl px-4 py-4">
      <p className="text-xs text-ink/50 mb-1">{label}</p>
      <p className="text-2xl font-heading font-bold text-ink">{value}</p>
      {sub && <p className="text-xs text-ink/40 mt-0.5">{sub}</p>}
    </div>
  )
}

function MiniBar({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-ink/70 w-32 truncate shrink-0">{label}</span>
      <div className="flex-1 bg-peach-dark/20 rounded-full h-2">
        <div className="bg-peach-dark/60 h-2 rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-sm font-medium text-ink w-6 text-right">{value}</span>
    </div>
  )
}

function RateBar({ pct }: { pct: number }) {
  return (
    <div className="flex-1 bg-peach-dark/20 rounded-full h-2">
      <div
        className={`h-2 rounded-full ${pct >= 50 ? "bg-green-400" : pct >= 20 ? "bg-amber-400" : "bg-peach-dark/60"}`}
        style={{ width: `${Math.min(100, pct)}%` }}
      />
    </div>
  )
}

type PageRow = {
  page: string
  views: number
  ctaId: string | null
  ctaClicks: number | null
}

function PageViewsTable() {
  const [rows, setRows] = useState<PageRow[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const pageCount = Math.max(1, Math.ceil(total / 10))

  const load = useCallback((p: number) => {
    setLoading(true)
    fetch(`/api/admin/stats/pages?page=${p}`)
      .then((r) => r.json())
      .then((d) => { setRows(d.rows); setTotal(d.total); setLoading(false) })
  }, [])

  useEffect(() => { load(page) }, [page, load])

  if (!loading && total === 0) {
    return <p className="text-sm text-ink/40">No page view data yet - visits will appear here once users browse the site.</p>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-ink/50">{total} pages tracked</p>
        <div className="flex items-center gap-2 text-sm">
          <button onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: "smooth" }) }} disabled={page === 1} className="p-1 rounded hover:bg-peach-dark/20 disabled:opacity-30"><ChevronLeft size={16} /></button>
          <span className="text-ink/60">{page} / {pageCount}</span>
          <button onClick={() => { setPage((p) => Math.min(pageCount, p + 1)); window.scrollTo({ top: 0, behavior: "smooth" }) }} disabled={page === pageCount} className="p-1 rounded hover:bg-peach-dark/20 disabled:opacity-30"><ChevronRight size={16} /></button>
        </div>
      </div>

      <div className="rounded-xl border border-peach-dark/20 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-peach-dark/10 text-left">
              <th className="px-4 py-3 font-medium text-ink/60">Page</th>
              <th className="px-4 py-3 font-medium text-ink/60 text-right">Views</th>
              <th className="px-4 py-3 font-medium text-ink/60 text-right">CTA Clicks</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={3} className="px-4 py-8 text-center text-ink/40">Loading…</td></tr>
            ) : rows.map((r) => (
              <tr key={r.page} className="border-t border-peach-dark/10 hover:bg-peach-dark/5">
                <td className="px-4 py-2.5 font-mono text-xs text-ink/80">{r.page}</td>
                <td className="px-4 py-2.5 text-right font-medium text-ink">{r.views.toLocaleString("en-IN")}</td>
                <td className="px-4 py-2.5 text-right">
                  {r.ctaClicks === null
                    ? <span className="text-ink/30"> - </span>
                    : <span className="font-medium text-ink">{r.ctaClicks}</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!loading && rows.length > 0 && (
        <div className="flex items-center justify-between mt-3 text-sm text-ink/50">
          <span>Showing {(page - 1) * 10 + 1}–{Math.min(page * 10, total)} of {total}</span>
          <div className="flex items-center gap-2">
            <button onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: "smooth" }) }} disabled={page === 1} className="px-3 py-1.5 rounded-lg border border-peach-dark/20 hover:bg-peach-dark/10 disabled:opacity-30">Previous</button>
            <button onClick={() => { setPage((p) => Math.min(pageCount, p + 1)); window.scrollTo({ top: 0, behavior: "smooth" }) }} disabled={page === pageCount} className="px-3 py-1.5 rounded-lg border border-peach-dark/20 hover:bg-peach-dark/10 disabled:opacity-30">Next</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function StatsPage() {
  const [data, setData] = useState<StatsData | null>(null)

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setData)
  }, [])

  if (!data) {
    return (
      <div className="px-10 py-10">
        <h1 className="font-heading text-3xl font-800 text-ink mb-6">Stats</h1>
        <div className="text-center py-12 text-ink/40">Loading…</div>
      </div>
    )
  }

  const maxTx = Math.max(...data.monthly.map((m) => m.transactions), 1)
  const maxUsers = Math.max(...data.monthly.map((m) => m.newUsers), 1)
  const maxInq = Math.max(...data.monthly.map((m) => m.inquiries), 1)
  const maxServiceCount = Math.max(...data.bookingsByService.map((s) => s.count), 1)
  const maxInqCount = Math.max(...data.inquiriesByType.map((t) => t.count), 1)

  return (
    <div className="px-10 py-10 max-w-6xl">
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-800 text-ink">Stats</h1>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        <StatCard label="Total Users" value={data.totals.users} />
        <StatCard label="Paid Transactions" value={data.totals.transactions} />
        <StatCard label="Startup Scores" value={data.totals.scores} sub={`${data.totals.paidScores} paid`} />
        <StatCard label="Service Inquiries" value={data.totals.inquiries} />
        <StatCard label="Page Views" value={data.totals.pageViews.toLocaleString("en-IN")} sub="all time" />
      </div>

      {/* Page visits */}
      <div className="mb-8">
        <h2 className="font-sans text-xs font-semibold text-ink/40 uppercase tracking-widest mb-3">Page Visits (all time, high → low)</h2>
        <PageViewsTable />
      </div>

      {/* CTA conversion rates */}
      <div className="mb-8">
        <h2 className="font-sans text-xs font-semibold text-ink/40 uppercase tracking-widest mb-3">CTA Conversion Rates</h2>
        {data.conversions.every((c) => c.clicks === 0) ? (
          <p className="text-sm text-ink/40">No CTA click data yet - rates will populate once users interact with the site.</p>
        ) : (
          <div className="rounded-xl border border-peach-dark/20 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-peach-dark/10 text-left">
                  <th className="px-4 py-3 font-medium text-ink/60">CTA</th>
                  <th className="px-4 py-3 font-medium text-ink/60 text-right">Clicks</th>
                  <th className="px-4 py-3 font-medium text-ink/60 text-right">Completions</th>
                  <th className="px-4 py-3 font-medium text-ink/60">Conversion</th>
                </tr>
              </thead>
              <tbody>
                {data.conversions.map((c) => (
                  <tr key={c.ctaId} className="border-t border-peach-dark/10">
                    <td className="px-4 py-3 text-ink/80">{c.label}</td>
                    <td className="px-4 py-3 text-right text-ink/60">{c.clicks}</td>
                    <td className="px-4 py-3 text-right text-ink/70 font-medium">{c.completions}</td>
                    <td className="px-4 py-3">
                      {c.rate === null ? (
                        <span className="text-ink/30 text-xs">no clicks yet</span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <RateBar pct={c.rate} />
                          <span className="text-sm font-semibold text-ink w-10 text-right">{c.rate}%</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Monthly activity */}
      <div className="mb-8">
        <h2 className="font-sans text-xs font-semibold text-ink/40 uppercase tracking-widest mb-3">Monthly Activity (last 12 months)</h2>
        <div className="rounded-xl border border-peach-dark/20 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-peach-dark/10 text-left">
                <th className="px-4 py-3 font-medium text-ink/60">Month</th>
                <th className="px-4 py-3 font-medium text-ink/60">Transactions</th>
                <th className="px-4 py-3 font-medium text-ink/60">New Users</th>
                <th className="px-4 py-3 font-medium text-ink/60">Inquiries</th>
                <th className="px-4 py-3 font-medium text-ink/60">Score Submissions</th>
              </tr>
            </thead>
            <tbody>
              {[...data.monthly].reverse().map((m) => (
                <tr key={m.key} className="border-t border-peach-dark/10">
                  <td className="px-4 py-2.5 font-medium text-ink/80">{m.label}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-peach-dark/20 rounded-full h-1.5 hidden sm:block">
                        <div className="bg-peach-dark/70 h-1.5 rounded-full" style={{ width: `${(m.transactions / maxTx) * 100}%` }} />
                      </div>
                      <span className="text-ink/70">{m.transactions}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-peach-dark/20 rounded-full h-1.5 hidden sm:block">
                        <div className="bg-blue-300 h-1.5 rounded-full" style={{ width: `${(m.newUsers / maxUsers) * 100}%` }} />
                      </div>
                      <span className="text-ink/70">{m.newUsers}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-peach-dark/20 rounded-full h-1.5 hidden sm:block">
                        <div className="bg-amber-300 h-1.5 rounded-full" style={{ width: `${(m.inquiries / maxInq) * 100}%` }} />
                      </div>
                      <span className="text-ink/70">{m.inquiries}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-ink/70">{m.scores}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Breakdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="font-sans text-xs font-semibold text-ink/40 uppercase tracking-widest mb-3">Bookings by Service</h2>
          {data.bookingsByService.length === 0 ? (
            <p className="text-sm text-ink/40">No data yet</p>
          ) : (
            <div className="space-y-3">
              {data.bookingsByService
                .sort((a, b) => b.count - a.count)
                .map((s) => (
                  <MiniBar key={s.service} label={s.service} value={s.count} max={maxServiceCount} />
                ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="font-sans text-xs font-semibold text-ink/40 uppercase tracking-widest mb-3">Service Inquiries by Type</h2>
          {data.inquiriesByType.length === 0 ? (
            <p className="text-sm text-ink/40">No data yet</p>
          ) : (
            <div className="space-y-3">
              {data.inquiriesByType
                .sort((a, b) => b.count - a.count)
                .map((t) => (
                  <MiniBar
                    key={t.type}
                    label={t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                    value={t.count}
                    max={maxInqCount}
                  />
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
