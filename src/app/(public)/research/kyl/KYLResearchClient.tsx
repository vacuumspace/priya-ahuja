"use client"

import { Fragment, useState } from "react"
import { ChevronRight, ExternalLink } from "lucide-react"
import individualBuyers from "../../../../../data/json/kyl/individual-buyers.json"
import developers from "../../../../../data/json/kyl/developers.json"
import brokers from "../../../../../data/json/kyl/brokers.json"
import banksInsurers from "../../../../../data/json/kyl/banks-insurers.json"
import stateTotalsRaw from "../../../../../data/json/kyl/state-totals.json"
import meta from "../../../../../data/json/kyl/meta.json"

type Confidence = "high" | "medium" | "low"
type StateTotalEntry = {
  state: string
  total_transactions: number
  total_value_cr: number
  source: string
  source_url: string
  confidence: string
  notes: string
}

const stateTotalsMap = new Map<string, StateTotalEntry>(
  (stateTotalsRaw as StateTotalEntry[]).map((e) => [e.state, e])
)

const CONFIDENCE_STYLES: Record<Confidence, string> = {
  high: "bg-green-100 text-green-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-red-100 text-red-700",
}

function fmt(n: number) {
  if (n === 0) return "—"
  return n.toLocaleString("en-IN")
}

function ConfidenceBadge({ c }: { c: string }) {
  const cls = CONFIDENCE_STYLES[(c as Confidence)] ?? "bg-gray-100 text-gray-600"
  return (
    <span className={`inline-block text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full ${cls}`}>
      {c}
    </span>
  )
}

function worstConfidence(confidences: string[]): string {
  if (confidences.includes("low")) return "low"
  if (confidences.includes("medium")) return "medium"
  return "high"
}

function groupByState<T extends { state: string }>(rows: T[]): Map<string, T[]> {
  const map = new Map<string, T[]>()
  for (const row of rows) {
    const list = map.get(row.state) ?? []
    list.push(row)
    map.set(row.state, list)
  }
  return map
}

const IB_TOTALS = (() => {
  const grouped = new Map<string, typeof individualBuyers>()
  for (const row of individualBuyers) {
    const list = grouped.get(row.state) ?? []
    list.push(row)
    grouped.set(row.state, list)
  }
  let transactions = 0
  let value_cr = 0
  for (const [state, rows] of grouped.entries()) {
    const citySum = rows.reduce((s, r) => s + r.transaction_count, 0)
    const cityValue = rows.reduce((s, r) => s + r.value_cr, 0)
    const st = stateTotalsMap.get(state)
    transactions += st && st.total_transactions > citySum ? st.total_transactions : citySum
    value_cr += st && st.total_value_cr > cityValue ? st.total_value_cr : cityValue
  }
  return { transactions, value_cr }
})()

const SEGMENTS = {
  "Individual Buyers": {
    transactions: IB_TOTALS.transactions,
    value_cr: IB_TOTALS.value_cr,
  },
  Developers: {
    transactions: developers.reduce((s, r) => s + r.transaction_count, 0),
    value_cr: developers.reduce((s, r) => s + r.value_cr, 0),
  },
  Brokers: {
    transactions: brokers.reduce((s, r) => s + r.listing_count, 0),
    value_cr: 0,
  },
  "Banks / Insurers": {
    transactions: banksInsurers.reduce((s, r) => s + r.plot_loan_count, 0),
    value_cr: banksInsurers.reduce((s, r) => s + r.plot_disbursement_cr, 0),
  },
}

const TOTAL_VALUE = Object.values(SEGMENTS).reduce((s, v) => s + v.value_cr, 0)

const TABS = ["Individual Buyers", "Developers", "Brokers", "Banks / Insurers"] as const
type Tab = (typeof TABS)[number]

function IndividualBuyersTable() {
  const grouped = groupByState(individualBuyers)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  function toggle(state: string) {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(state) ? next.delete(state) : next.add(state)
      return next
    })
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm font-sans">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="pb-3 pr-3 text-xs text-ink/40 font-medium w-6"></th>
            <th className="pb-3 pr-3 text-xs text-ink/40 font-medium">State</th>
            <th className="pb-3 pr-3 text-xs text-ink/40 font-medium">City / District</th>
            <th className="pb-3 pr-3 text-xs text-ink/40 font-medium text-right">Transactions</th>
            <th className="pb-3 pr-3 text-xs text-ink/40 font-medium text-right">Value (₹ Cr)</th>
            <th className="pb-3 pr-3 text-xs text-ink/40 font-medium hidden md:table-cell">Source</th>
            <th className="pb-3 text-xs text-ink/40 font-medium">Data</th>
          </tr>
        </thead>
        <tbody>
          {Array.from(grouped.entries()).map(([state, rows]) => {
            const isOpen = expanded.has(state)
            const citySum = rows.reduce((s, r) => s + r.transaction_count, 0)
            const cityValue = rows.reduce((s, r) => s + r.value_cr, 0)
            const conf = worstConfidence(rows.map(r => r.confidence))
            const multiCity = rows.length > 1

            const stEntry = stateTotalsMap.get(state)
            const displayTotal = stEntry && stEntry.total_transactions > citySum ? stEntry.total_transactions : citySum
            const displayValue = stEntry && stEntry.total_value_cr > cityValue ? stEntry.total_value_cr : cityValue
            const othersCount = stEntry ? Math.max(0, stEntry.total_transactions - citySum) : 0
            const othersValue = stEntry ? Math.max(0, stEntry.total_value_cr - cityValue) : 0
            const hasOthers = othersCount > 0
            const isExpandable = multiCity || hasOthers

            return (
              <Fragment key={state}>
                <tr
                  onClick={() => isExpandable && toggle(state)}
                  className={`border-b border-border/40 ${isExpandable ? "cursor-pointer hover:bg-peach-dark/5" : ""}`}
                >
                  <td className="py-3 pr-1 w-6">
                    {isExpandable && (
                      <ChevronRight size={13} className={`text-ink/25 transition-transform ${isOpen ? "rotate-90" : ""}`} />
                    )}
                  </td>
                  <td className="py-3 pr-3 text-ink font-medium">{state}</td>
                  <td className="py-3 pr-3 text-ink/45 text-xs">
                    {isExpandable
                      ? isOpen ? "" : rows.map(r => r.city || r.district).join(", ") + (hasOthers ? " + others" : "")
                      : (rows[0].city || rows[0].district)}
                  </td>
                  <td className="py-3 pr-3 text-ink text-right font-medium">{fmt(displayTotal)}</td>
                  <td className="py-3 pr-3 text-ink text-right font-medium">₹ {fmt(displayValue)}</td>
                  <td className="py-3 pr-3 text-ink/40 text-xs hidden md:table-cell">
                    {stEntry ? (
                      <a href={stEntry.source_url} target="_blank" rel="noopener noreferrer" className="hover:text-ink underline underline-offset-2">
                        {stEntry.source.split("—")[0].trim()}
                      </a>
                    ) : !isExpandable ? (
                      <a href={rows[0].source_url} target="_blank" rel="noopener noreferrer" className="hover:text-ink underline underline-offset-2">
                        {rows[0].source.split("+")[0].trim()}
                      </a>
                    ) : null}
                  </td>
                  <td className="py-3"><ConfidenceBadge c={stEntry ? stEntry.confidence : conf} /></td>
                </tr>

                {isOpen && (
                  <>
                    {rows.map((r, i) => (
                      <tr key={`${state}-${i}`} className="border-b border-border/25 bg-peach-dark/4">
                        <td className="py-2 pr-1"></td>
                        <td className="py-2 pr-3"></td>
                        <td className="py-2 pr-3 text-ink/60 pl-3 text-xs">↳ {r.city || r.district}</td>
                        <td className="py-2 pr-3 text-ink/60 text-right text-xs">{fmt(r.transaction_count)}</td>
                        <td className="py-2 pr-3 text-ink/60 text-right text-xs">₹ {fmt(r.value_cr)}</td>
                        <td className="py-2 pr-3 text-ink/35 text-xs hidden md:table-cell">
                          <a href={r.source_url} target="_blank" rel="noopener noreferrer" className="hover:text-ink underline underline-offset-2">
                            {r.source.split("+")[0].trim()}
                          </a>
                        </td>
                        <td className="py-2"><ConfidenceBadge c={r.confidence} /></td>
                      </tr>
                    ))}
                    {hasOthers && (
                      <tr className="border-b border-border/25 bg-peach-dark/4">
                        <td className="py-2 pr-1"></td>
                        <td className="py-2 pr-3"></td>
                        <td className="py-2 pr-3 text-ink/35 pl-3 text-xs italic">↳ Others (rest of state)</td>
                        <td className="py-2 pr-3 text-ink/35 text-right text-xs">{fmt(othersCount)}</td>
                        <td className="py-2 pr-3 text-ink/35 text-right text-xs">₹ {fmt(othersValue)}</td>
                        <td className="py-2 pr-3 text-ink/25 text-xs hidden md:table-cell">
                          <a href={stEntry!.source_url} target="_blank" rel="noopener noreferrer" className="hover:text-ink underline underline-offset-2">
                            {stEntry!.source.split("—")[0].trim()}
                          </a>
                        </td>
                        <td className="py-2"><ConfidenceBadge c="low" /></td>
                      </tr>
                    )}
                  </>
                )}
              </Fragment>
            )
          })}
        </tbody>
      </table>
      <p className="mt-4 text-[11px] text-ink/35 font-sans leading-relaxed">
        State totals sourced from IGRS / RERA portals. City-level entries from Knight Frank Q1 2026 (high confidence) and IGRS district data (medium confidence). &ldquo;Others&rdquo; = state total minus identified cities (low confidence, derived). Includes land/plot purchases and independent house sales. Click any state row to expand.
      </p>
    </div>
  )
}

function DevelopersTable() {
  const grouped = groupByState(developers)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  function toggle(state: string) {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(state) ? next.delete(state) : next.add(state)
      return next
    })
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm font-sans">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="pb-3 pr-3 text-xs text-ink/40 font-medium w-6"></th>
            <th className="pb-3 pr-3 text-xs text-ink/40 font-medium">State</th>
            <th className="pb-3 pr-3 text-xs text-ink/40 font-medium">Market</th>
            <th className="pb-3 pr-3 text-xs text-ink/40 font-medium text-right">Land Deals</th>
            <th className="pb-3 pr-3 text-xs text-ink/40 font-medium text-right">Acres</th>
            <th className="pb-3 pr-3 text-xs text-ink/40 font-medium text-right">Value (₹ Cr)</th>
            <th className="pb-3 pr-3 text-xs text-ink/40 font-medium hidden md:table-cell">Source</th>
            <th className="pb-3 text-xs text-ink/40 font-medium">Data</th>
          </tr>
        </thead>
        <tbody>
          {Array.from(grouped.entries()).map(([state, rows]) => {
            const isOpen = expanded.has(state)
            const stateDeals = rows.reduce((s, r) => s + r.transaction_count, 0)
            const stateAcres = rows.reduce((s, r) => s + r.area_acres, 0)
            const stateValue = rows.reduce((s, r) => s + r.value_cr, 0)
            const conf = worstConfidence(rows.map(r => r.confidence))
            const multiCity = rows.length > 1

            return (
              <Fragment key={state}>
                <tr
                  onClick={() => multiCity && toggle(state)}
                  className={`border-b border-border/40 ${multiCity ? "cursor-pointer hover:bg-peach-dark/5" : ""}`}
                >
                  <td className="py-3 pr-1 w-6">
                    {multiCity && (
                      <ChevronRight size={13} className={`text-ink/25 transition-transform ${isOpen ? "rotate-90" : ""}`} />
                    )}
                  </td>
                  <td className="py-3 pr-3 text-ink font-medium">{state}</td>
                  <td className="py-3 pr-3 text-ink/45 text-xs">
                    {multiCity ? (isOpen ? "" : rows.map(r => r.city || r.district).join(", ")) : (rows[0].city || rows[0].district)}
                  </td>
                  <td className="py-3 pr-3 text-ink text-right font-medium">{fmt(stateDeals)}</td>
                  <td className="py-3 pr-3 text-ink/60 text-right">{fmt(stateAcres)}</td>
                  <td className="py-3 pr-3 text-ink text-right font-medium">₹ {fmt(stateValue)}</td>
                  <td className="py-3 pr-3 text-ink/40 text-xs hidden md:table-cell">
                    {!multiCity && (
                      <a href={rows[0].source_url} target="_blank" rel="noopener noreferrer" className="hover:text-ink underline underline-offset-2">
                        {rows[0].source.split("+")[0].trim()}
                      </a>
                    )}
                  </td>
                  <td className="py-3"><ConfidenceBadge c={conf} /></td>
                </tr>
                {isOpen && rows.map((r, i) => (
                  <tr key={`${state}-${i}`} className="border-b border-border/25 bg-peach-dark/4">
                    <td className="py-2 pr-1"></td>
                    <td className="py-2 pr-3"></td>
                    <td className="py-2 pr-3 text-ink/60 pl-3 text-xs">↳ {r.city || r.district}</td>
                    <td className="py-2 pr-3 text-ink/60 text-right text-xs">{fmt(r.transaction_count)}</td>
                    <td className="py-2 pr-3 text-ink/60 text-right text-xs">{fmt(r.area_acres)}</td>
                    <td className="py-2 pr-3 text-ink/60 text-right text-xs">₹ {fmt(r.value_cr)}</td>
                    <td className="py-2 pr-3 text-ink/35 text-xs hidden md:table-cell">
                      <a href={r.source_url} target="_blank" rel="noopener noreferrer" className="hover:text-ink underline underline-offset-2">
                        {r.source.split("+")[0].trim()}
                      </a>
                    </td>
                    <td className="py-2"><ConfidenceBadge c={r.confidence} /></td>
                  </tr>
                ))}
              </Fragment>
            )
          })}
        </tbody>
      </table>
      <p className="mt-4 text-[11px] text-ink/35 font-sans leading-relaxed">
        Developer land acquisition deals tracked from JLL India Land Transactions 2024 and Colliers India Real Estate 2026 report. Per industry multiplier, 5–10 plots are evaluated per successful deal.
      </p>
    </div>
  )
}

function BrokersTable() {
  const grouped = groupByState(brokers)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  function toggle(state: string) {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(state) ? next.delete(state) : next.add(state)
      return next
    })
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm font-sans">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="pb-3 pr-3 text-xs text-ink/40 font-medium w-6"></th>
            <th className="pb-3 pr-3 text-xs text-ink/40 font-medium">State</th>
            <th className="pb-3 pr-3 text-xs text-ink/40 font-medium">City / District</th>
            <th className="pb-3 pr-3 text-xs text-ink/40 font-medium text-right">Active Listings</th>
            <th className="pb-3 pr-3 text-xs text-ink/40 font-medium hidden md:table-cell">Source</th>
            <th className="pb-3 text-xs text-ink/40 font-medium">Data</th>
          </tr>
        </thead>
        <tbody>
          {Array.from(grouped.entries()).map(([state, rows]) => {
            const isOpen = expanded.has(state)
            const stateListings = rows.reduce((s, r) => s + r.listing_count, 0)
            const conf = worstConfidence(rows.map(r => r.confidence))
            const multiCity = rows.length > 1

            return (
              <Fragment key={state}>
                <tr
                  onClick={() => multiCity && toggle(state)}
                  className={`border-b border-border/40 ${multiCity ? "cursor-pointer hover:bg-peach-dark/5" : ""}`}
                >
                  <td className="py-3 pr-1 w-6">
                    {multiCity && (
                      <ChevronRight size={13} className={`text-ink/25 transition-transform ${isOpen ? "rotate-90" : ""}`} />
                    )}
                  </td>
                  <td className="py-3 pr-3 text-ink font-medium">{state}</td>
                  <td className="py-3 pr-3 text-ink/45 text-xs">
                    {multiCity ? (isOpen ? "" : rows.map(r => r.city || r.district).join(", ")) : (rows[0].city || rows[0].district)}
                  </td>
                  <td className="py-3 pr-3 text-ink text-right font-medium">{fmt(stateListings)}</td>
                  <td className="py-3 pr-3 text-ink/40 text-xs hidden md:table-cell">
                    {!multiCity && (
                      <a href={rows[0].source_url} target="_blank" rel="noopener noreferrer" className="hover:text-ink underline underline-offset-2">
                        {rows[0].source.split("(")[0].trim()}
                      </a>
                    )}
                  </td>
                  <td className="py-3"><ConfidenceBadge c={conf} /></td>
                </tr>
                {isOpen && rows.map((r, i) => (
                  <tr key={`${state}-${i}`} className="border-b border-border/25 bg-peach-dark/4">
                    <td className="py-2 pr-1"></td>
                    <td className="py-2 pr-3"></td>
                    <td className="py-2 pr-3 text-ink/60 pl-3 text-xs">↳ {r.city || r.district}</td>
                    <td className="py-2 pr-3 text-ink/60 text-right text-xs">{fmt(r.listing_count)}</td>
                    <td className="py-2 pr-3 text-ink/35 text-xs hidden md:table-cell">
                      <a href={r.source_url} target="_blank" rel="noopener noreferrer" className="hover:text-ink underline underline-offset-2">
                        {r.source.split("(")[0].trim()}
                      </a>
                    </td>
                    <td className="py-2"><ConfidenceBadge c={r.confidence} /></td>
                  </tr>
                ))}
              </Fragment>
            )
          })}
        </tbody>
      </table>
      <p className="mt-4 text-[11px] text-ink/35 font-sans leading-relaxed">
        Active plot/land listings from 99acres and Magicbricks (type=Plot filter). Listing count is a proxy for broker market activity, not closed transactions.
      </p>
    </div>
  )
}

function BanksTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm font-sans">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="pb-3 pr-3 text-xs text-ink/40 font-medium">State</th>
            <th className="pb-3 pr-3 text-xs text-ink/40 font-medium text-right">Total Loans</th>
            <th className="pb-3 pr-3 text-xs text-ink/40 font-medium text-right">Plot Loans (~15%)</th>
            <th className="pb-3 pr-3 text-xs text-ink/40 font-medium text-right">Plot Disbursed (₹ Cr)</th>
            <th className="pb-3 pr-3 text-xs text-ink/40 font-medium text-right hidden md:table-cell">Avg Ticket (₹ L)</th>
            <th className="pb-3 pr-3 text-xs text-ink/40 font-medium hidden md:table-cell">Source</th>
            <th className="pb-3 text-xs text-ink/40 font-medium">Data</th>
          </tr>
        </thead>
        <tbody>
          {banksInsurers.map((r, i) => (
            <tr key={i} className="border-b border-border/40">
              <td className="py-3 pr-3 text-ink">{r.state}</td>
              <td className="py-3 pr-3 text-ink/60 text-right">{fmt(r.loan_count)}</td>
              <td className="py-3 pr-3 text-ink font-medium text-right">{fmt(r.plot_loan_count)}</td>
              <td className="py-3 pr-3 text-ink font-medium text-right">₹ {fmt(r.plot_disbursement_cr)}</td>
              <td className="py-3 pr-3 text-ink/60 text-right hidden md:table-cell">{r.avg_ticket_lakh}</td>
              <td className="py-3 pr-3 text-ink/40 text-xs hidden md:table-cell">
                <a href={r.source_url} target="_blank" rel="noopener noreferrer" className="hover:text-ink underline underline-offset-2">
                  NHB 2024-25
                </a>
              </td>
              <td className="py-3"><ConfidenceBadge c={r.confidence} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-4 text-[11px] text-ink/35 font-sans leading-relaxed">
        Home loan disbursements from NHB Annual Report 2024-25. Plot/land loans estimated at ~15% of total housing loans — banks require title and land research reports for loans above ₹50L.
      </p>
    </div>
  )
}

export default function KYLResearchClient() {
  const [activeTab, setActiveTab] = useState<Tab>("Individual Buyers")

  return (
    <div className="px-4 md:px-8 py-8 md:py-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] font-sans font-semibold text-ink/40 uppercase tracking-wider">Research</span>
          <span className="text-ink/20 text-xs">·</span>
          <span className="text-[11px] font-sans font-semibold text-ink/40 uppercase tracking-wider">Land Market India</span>
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-ink mb-3">
          Know Your Land (KYL)
        </h1>
        <p className="text-base text-ink/60 font-sans max-w-2xl leading-relaxed">
          Bottom-up sizing of India&rsquo;s land transaction market across four buyer segments — individual buyers, developers, brokers, and banks. Data sourced from IGRS portals, RERA registries, NHB, Knight Frank, JLL, and Colliers.
        </p>
        <p className="text-xs text-ink/35 font-sans mt-2">
          Period: {meta.period} · Last updated: {meta.last_updated}
        </p>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        {(Object.entries(SEGMENTS) as [string, { transactions: number; value_cr: number }][]).map(([name, v]) => (
          <div key={name} className="bg-peach-dark/8 rounded-xl px-4 py-4 border border-border/30">
            <p className="text-[10px] text-ink/40 font-sans uppercase tracking-wide mb-1">{name}</p>
            <p className="text-xl font-heading font-bold text-ink">{fmt(v.transactions)}</p>
            <p className="text-xs text-ink/40 font-sans mt-0.5">
              {v.value_cr > 0 ? `₹ ${fmt(v.value_cr)} Cr` : "listings"}
            </p>
          </div>
        ))}
      </div>

      {/* Market size callout */}
      <div className="bg-ink/[0.03] border border-border/40 rounded-xl px-5 py-4 mb-8 flex flex-wrap gap-6 items-center">
        <div>
          <p className="text-xs text-ink/40 font-sans mb-0.5">Total addressable value (excl. brokers)</p>
          <p className="text-2xl font-heading font-bold text-ink">₹ {fmt(TOTAL_VALUE)} Cr</p>
        </div>
        <div className="flex-1 min-w-[200px]">
          <p className="text-xs text-ink/50 font-sans leading-relaxed">
            Land research reports are required for plot loans above ₹50L (banks) and for developer due diligence. KYL sizes the total transactions that need a land report.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border mb-6 overflow-x-auto">
        <div className="flex gap-0 min-w-max">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-sans font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? "border-ink text-ink"
                  : "border-transparent text-ink/45 hover:text-ink"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div>
        {activeTab === "Individual Buyers" && <IndividualBuyersTable />}
        {activeTab === "Developers" && <DevelopersTable />}
        {activeTab === "Brokers" && <BrokersTable />}
        {activeTab === "Banks / Insurers" && <BanksTable />}
      </div>

      {/* Methodology note */}
      <div className="mt-12 pt-6 border-t border-border/40">
        <p className="text-xs text-ink/40 font-sans font-semibold mb-3 uppercase tracking-wide">Methodology</p>
        <div className="grid md:grid-cols-3 gap-4 text-xs text-ink/50 font-sans leading-relaxed">
          <div>
            <p className="font-semibold text-ink/60 mb-1">Confidence levels</p>
            <p><span className="font-semibold text-green-600">High</span> — directly from Knight Frank / JLL / NHB published reports with city-level data.</p>
            <p className="mt-1"><span className="font-semibold text-amber-600">Medium</span> — from IGRS / RERA portals with district-level registration data.</p>
            <p className="mt-1"><span className="font-semibold text-red-600">Low</span> — distributed from state totals or estimated from Indiastat proxy data.</p>
          </div>
          <div>
            <p className="font-semibold text-ink/60 mb-1">State totals vs. cities</p>
            <p>State-level totals come from IGRS annual statistics. City-level splits use published district data where available; remaining volume appears as &ldquo;Others (rest of state)&rdquo; in the expanded rows.</p>
          </div>
          <div>
            <p className="font-semibold text-ink/60 mb-1">Scope</p>
            <p>Counts land/plot purchases and independent house sales (land-linked). Apartment sales are excluded where data allows. Broker tab shows active listings, not closed deals.</p>
          </div>
        </div>
      </div>

      {/* Sources */}
      <div className="mt-6 pt-4 border-t border-border/30">
        <p className="text-xs text-ink/35 font-sans font-medium mb-2">Primary Sources</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {meta.sources.map((s) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-ink/35 hover:text-ink underline underline-offset-2 font-sans"
            >
              {s.name}
              <ExternalLink size={9} />
            </a>
          ))}
        </div>
        <p className="mt-3 text-[10px] text-ink/25 font-sans">
          This is research data compiled for market sizing purposes. Not financial or investment advice. Some figures are estimates derived from state-level totals.
        </p>
      </div>
    </div>
  )
}
