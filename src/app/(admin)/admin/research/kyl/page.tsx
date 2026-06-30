"use client"

import { Fragment, useState } from "react"
import { ChevronRight } from "lucide-react"
import advisoryCompanies from "../../../../../../data/json/kyl/advisory-companies.json"
import competitorsResearchRaw from "../../../../../../data/json/kyl/competitors-research.json"
import competitorsVastuRaw from "../../../../../../data/json/kyl/competitors-vastu.json"
import contentCreatorsRaw from "../../../../../../data/json/kyl/content-creators.json"
import individualBuyers from "../../../../../../data/json/kyl/individual-buyers.json"
import developers from "../../../../../../data/json/kyl/developers.json"
import brokers from "../../../../../../data/json/kyl/brokers.json"
import banksInsurers from "../../../../../../data/json/kyl/banks-insurers.json"
import stateTotalsRaw from "../../../../../../data/json/kyl/state-totals.json"
import meta from "../../../../../../data/json/kyl/meta.json"

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

type Confidence = "high" | "medium" | "low"

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

// ── Summary numbers ──────────────────────────────────────────────────────────

// Individual Buyers totals: use state-level sourced totals where available (same logic as the table)
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
    area_sqft: individualBuyers.reduce((s, r) => s + r.area_sqft, 0),
    value_cr: IB_TOTALS.value_cr,
    districts: individualBuyers.length,
  },
  Developers: {
    transactions: developers.reduce((s, r) => s + r.transaction_count, 0),
    area_sqft: developers.reduce((s, r) => s + (r.area_acres * 43560), 0),
    value_cr: developers.reduce((s, r) => s + r.value_cr, 0),
    districts: developers.length,
  },
  Brokers: {
    transactions: brokers.reduce((s, r) => s + r.listing_count, 0),
    area_sqft: 0,
    value_cr: 0,
    districts: brokers.length,
  },
  "Banks / Insurers": {
    transactions: banksInsurers.reduce((s, r) => s + r.plot_loan_count, 0),
    area_sqft: 0,
    value_cr: banksInsurers.reduce((s, r) => s + r.plot_disbursement_cr, 0),
    districts: banksInsurers.length,
  },
}

const TOTAL = {
  transactions: Object.values(SEGMENTS).reduce((s, v) => s + v.transactions, 0),
  area_sqft: Object.values(SEGMENTS).reduce((s, v) => s + v.area_sqft, 0),
  value_cr: Object.values(SEGMENTS).reduce((s, v) => s + v.value_cr, 0),
  states: new Set([
    ...individualBuyers.map((r) => r.state),
    ...developers.map((r) => r.state),
    ...brokers.map((r) => r.state),
    ...banksInsurers.map((r) => r.state),
  ]).size,
}

const TABS = ["Total", "Individual Buyers", "Developers", "Brokers", "Banks / Insurers"] as const
type Tab = (typeof TABS)[number]

// ── Data Methodology collapsible ─────────────────────────────────────────────

type MethodologyStep = { label: string; detail: string }

function DataMethodology({ steps }: { steps: MethodologyStep[] }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="mt-5 border border-border/40 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left bg-ink/[0.02] hover:bg-ink/[0.04] transition-colors"
      >
        <span className="text-xs font-sans font-semibold text-ink/50 uppercase tracking-wider">
          How we gathered this data
        </span>
        <ChevronRight size={14} className={`text-ink/30 transition-transform flex-shrink-0 ${open ? "rotate-90" : ""}`} />
      </button>
      {open && (
        <div className="px-4 pb-4 pt-3 grid sm:grid-cols-2 gap-x-8 gap-y-4">
          {steps.map((s, i) => (
            <div key={i} className="flex gap-3">
              <span className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-peach-dark/20 text-[10px] font-bold text-ink/50 flex items-center justify-center">
                {i + 1}
              </span>
              <div>
                <p className="text-xs font-sans font-semibold text-ink/70 mb-0.5">{s.label}</p>
                <p className="text-xs font-sans text-ink/45 leading-relaxed">{s.detail}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const METHODOLOGY = {
  individualBuyers: [
    {
      label: "Knight Frank Q1 2026 report (primary, 7 cities)",
      detail: "Downloaded the Knight Frank India Real Estate Q1 2026 PDF. Extracted city-wise residential unit sales table covering Mumbai, Pune, Bengaluru, Hyderabad, Delhi NCR, Chennai, Kolkata. Applied ~12–15% land-linked share (plots + independent houses) to isolate non-apartment transactions. Marked high confidence.",
    },
    {
      label: "IGRS state portals (district-level, 10 states)",
      detail: "Accessed IGRS/registration portals for Maharashtra (igrmaharashtra.gov.in), Karnataka (Kaveri Online), Telangana, AP, UP, Tamil Nadu, Odisha, Kerala, J&K, and Goa. Pulled annual property registration counts filtered to site/plot/bhumi document types. Marked medium confidence.",
    },
    {
      label: "State RERA annual reports (supplementary)",
      detail: "For states with active RERA portals (Gujarat, Rajasthan, Punjab, Haryana, MP, Bihar, Jharkhand, CG, Assam, Uttarakhand, HP), cross-referenced plot project registration counts to estimate transaction volumes. Used as a cross-check against IGRS data.",
    },
    {
      label: "Indiastat as fill-in for gaps",
      detail: "For Tier-2/3 cities where neither Knight Frank nor IGRS had granular district data, used Indiastat property transaction aggregates to estimate volumes. These are marked low confidence and distributed proportionally from the known state total.",
    },
    {
      label: "State totals from IGRS portals (reconciliation)",
      detail: "Each state row in the table now uses the independently sourced IGRS state total (from state-totals.json) rather than summing only the cities we could name. The gap between state total and identified cities appears as 'Others (rest of state)' in the expanded city view.",
    },
    {
      label: "Value (₹ Cr) estimation",
      detail: "Transaction values sourced from Knight Frank (direct) and IGRS stamp duty receipts (derived: if stamp duty = 5–7% of sale value, back-calculated sale value). For low-confidence entries, value estimated from average per-transaction rates observed in adjacent verified cities in the same state.",
    },
  ],
  developers: [
    {
      label: "JLL India Land Transactions 2024 report",
      detail: "JLL publishes an annual land deal tracker for institutional transactions above ~5 acres. Extracted deal count, acreage, and value for each city. This covers all developer categories — residential, commercial, industrial. Metro cities (Mumbai, Pune, Bengaluru, Hyderabad, Delhi NCR) classified as high confidence.",
    },
    {
      label: "Colliers India Real Estate 2026 report",
      detail: "Colliers publishes semi-annual India market reports with a land transactions section. Used for secondary metros (Nagpur, Kolkata, Odisha, Tier-2 Karnataka) where JLL coverage was thinner. Marked medium confidence.",
    },
    {
      label: "IGRS AP + CRDA for Andhra Pradesh",
      detail: "Amaravati capital region has specific CRDA (Capital Region Development Authority) land data available. Combined with IGRS AP records to separate developer acquisitions from individual buyer transactions.",
    },
    {
      label: "RERA + Indiastat for Tier-2 developer markets",
      detail: "For states like Rajasthan, MP, UP, WB, Bihar — RERA project registrations indicate developer-acquired land parcels. Transactions below 5 acres are under-tracked by JLL/Colliers; estimated from RERA project pipeline and Indiastat data. Marked low confidence.",
    },
    {
      label: "Transaction count vs. deal multiplier",
      detail: "The 5–10x multiplier note in each entry reflects industry practice: developers evaluate 5–10 plots/parcels for every one they close. So 631 recorded deals implies ~3,000–6,000 title search / land report needs.",
    },
  ],
  brokers: [
    {
      label: "99acres plot listing scrape (primary)",
      detail: "Used 99acres property search API (type=Residential Plot/Land) to pull active listing counts by city. Searched each metro and Tier-2 city individually using the city filter. Listings counted as of FY2025 period. This is the primary source for all 'high' and 'medium' confidence entries.",
    },
    {
      label: "Magicbricks cross-check",
      detail: "For major cities (Mumbai, Delhi NCR, Bengaluru, Hyderabad, Pune, Chennai), cross-checked against Magicbricks plot listings. Where the two differed by >20%, used the average. Where one portal had significantly more coverage (e.g. 99acres in North India, Magicbricks in South), used the dominant portal.",
    },
    {
      label: "State-level scaling for Tier-2/3",
      detail: "For smaller cities where individual searches returned <200 listings (thin market signal), aggregated at the district group level. Listing counts for Tier-2/3 grouped entries (e.g. 'Gorakhpur / Bareilly / Aligarh') are sums across those cities in a single 99acres search.",
    },
    {
      label: "Interpretation caveat",
      detail: "Broker listing count is a proxy for market activity, not closed transactions. One broker may post the same plot on both portals (double counting risk estimated at 15–20% in metros). Each listing does not equal a unique plot — same plot can be re-listed by multiple agents.",
    },
  ],
  banksInsurers: [
    {
      label: "NHB Annual Report 2024-25 (primary source)",
      detail: "National Housing Bank publishes state-wise home loan disbursement data in its Annual Report. Downloaded the PDF from nhb.org.in and extracted the state-level loan count and disbursement tables from the 'Housing Finance' statistical appendix.",
    },
    {
      label: "15% plot loan share methodology",
      detail: "NHB does not separately classify 'plot loans' vs 'home construction loans' in all states. Applied the ~15% estimate from NHB's own commentary in the FY2024-25 report which notes plot/land loans constitute ~14–16% of total housing loan portfolios at major HFCs. This is the key assumption — marked medium confidence.",
    },
    {
      label: "RBI DBIE cross-check",
      detail: "RBI's Database on Indian Economy (DBIE) publishes state-wise priority-sector lending data which includes home loans. Used this to cross-verify NHB state totals for the top 10 states. Discrepancies were typically under 8% — within rounding error.",
    },
    {
      label: "Why banks matter for KYL",
      detail: "Banks and HFCs require a title search / land report for plot loans above ₹50L ticket size. With 5,01,900 plot loans estimated, each is a potential KYL report trigger. Higher average ticket = higher willingness to pay for a thorough report.",
    },
  ],
  advisory: [
    {
      label: "Listed company annual reports (high confidence)",
      detail: "Square Yards (BSE/NSE listed) and Info Edge/99acres (NSE listed) revenue figures come directly from their filed annual reports. These are the most reliable numbers. Square Yards FY2024: ₹765 Cr confirmed from BSE filing.",
    },
    {
      label: "MCA filings for global firms (medium confidence)",
      detail: "JLL, CBRE, Cushman & Wakefield, Knight Frank, and Colliers file annual accounts with India's Ministry of Corporate Affairs (MCA21 portal) through their Indian subsidiaries. Revenue extracted from P&L statements of: Jones Lang LaSalle Property Consultants India Pvt Ltd, CBRE South Asia Pvt Ltd, Cushman & Wakefield India Pvt Ltd, etc.",
    },
    {
      label: "Funding disclosures for private firms (medium/low)",
      detail: "NoBroker's revenue estimated from funding round disclosures and media interviews by founders (CEO Amit Agarwal has publicly discussed revenue milestones). Anarock revenue from General Atlantic investment press releases and media coverage. These are not filed accounts — treated as directional estimates.",
    },
    {
      label: "Historical reconstruction (FY2021–FY2022)",
      detail: "Pre-FY2023 figures for most global advisory firms were reconstructed from: (a) their parent company India-segment commentary in global annual reports, (b) employee headcount growth as a proxy for revenue trend, (c) analyst reports on Indian RE advisory sector. Marked low confidence for FY2021-22 where MCA filings were not directly available.",
    },
    {
      label: "FY2027 projections methodology",
      detail: "Projections computed by applying each company's observed FY2023–FY2025 CAGR forward to FY2027. Where the CAGR seemed unsustainable (>30%), moderated to a sector-average ~22% to account for market saturation and competitive pressure. These are internal estimates, not analyst consensus.",
    },
    {
      label: "Market size (₹8,420 Cr organised)",
      detail: "Summed FY2025 revenue estimates of the 12 tracked firms. Unorganised market (₹19,000 Cr) estimated as the residual: India has ~1.2 million registered real estate agents (RERA estimate) of which ~95% operate outside top-10 firms — their aggregate commission income at ₹15,000–20,000 avg deal commission × estimated annual transactions.",
    },
  ],
}

// ── Generic group-by-state helper ────────────────────────────────────────────

function groupByState<T extends { state: string }>(rows: T[]): Map<string, T[]> {
  const map = new Map<string, T[]>()
  for (const row of rows) {
    const list = map.get(row.state) ?? []
    list.push(row)
    map.set(row.state, list)
  }
  return map
}

// ── Tables ───────────────────────────────────────────────────────────────────

function TotalTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm font-sans">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="pb-2 pr-4 text-xs text-ink/50 font-medium">Segment</th>
            <th className="pb-2 pr-4 text-xs text-ink/50 font-medium text-right">Volume (transactions / listings)</th>
            <th className="pb-2 pr-4 text-xs text-ink/50 font-medium text-right">Area (sq ft)</th>
            <th className="pb-2 text-xs text-ink/50 font-medium text-right">Value (₹ Cr)</th>
          </tr>
        </thead>
        <tbody>
          {(Object.entries(SEGMENTS) as [string, typeof SEGMENTS["Brokers"]][]).map(([seg, v]) => (
            <tr key={seg} className="border-b border-border/50">
              <td className="py-3 pr-4 text-ink font-medium">{seg}</td>
              <td className="py-3 pr-4 text-ink text-right">{fmt(v.transactions)}</td>
              <td className="py-3 pr-4 text-ink/60 text-right">{v.area_sqft > 0 ? fmt(Math.round(v.area_sqft)) : "—"}</td>
              <td className="py-3 text-ink text-right">{v.value_cr > 0 ? `₹ ${fmt(v.value_cr)}` : "—"}</td>
            </tr>
          ))}
          <tr className="bg-peach-dark/10">
            <td className="py-3 pr-4 text-ink font-bold">Total</td>
            <td className="py-3 pr-4 text-ink font-bold text-right">{fmt(TOTAL.transactions)}</td>
            <td className="py-3 pr-4 text-ink/60 font-bold text-right">{TOTAL.area_sqft > 0 ? fmt(Math.round(TOTAL.area_sqft)) : "—"}</td>
            <td className="py-3 text-ink font-bold text-right">₹ {fmt(TOTAL.value_cr)}</td>
          </tr>
        </tbody>
      </table>
      <p className="mt-3 text-[11px] text-ink/40 font-sans">
        Brokers segment shows active listing count (proxy for market activity), not closed transactions. Banks segment shows plot/land loan count (~15% of total home loans per NHB).
      </p>
    </div>
  )
}

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
            <th className="pb-2 pr-3 text-xs text-ink/50 font-medium w-6"></th>
            <th className="pb-2 pr-3 text-xs text-ink/50 font-medium">State</th>
            <th className="pb-2 pr-3 text-xs text-ink/50 font-medium">City / District</th>
            <th className="pb-2 pr-3 text-xs text-ink/50 font-medium text-right">Transactions</th>
            <th className="pb-2 pr-3 text-xs text-ink/50 font-medium text-right">Value (₹ Cr)</th>
            <th className="pb-2 pr-3 text-xs text-ink/50 font-medium">Source</th>
            <th className="pb-2 text-xs text-ink/50 font-medium">Confidence</th>
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
                {/* State row */}
                <tr
                  onClick={() => isExpandable && toggle(state)}
                  className={`border-b border-border/50 ${isExpandable ? "cursor-pointer hover:bg-peach-dark/5" : ""}`}
                >
                  <td className="py-2.5 pr-1 w-6">
                    {isExpandable && (
                      <ChevronRight
                        size={14}
                        className={`text-ink/30 transition-transform ${isOpen ? "rotate-90" : ""}`}
                      />
                    )}
                  </td>
                  <td className="py-2.5 pr-3 text-ink font-medium">{state}</td>
                  <td className="py-2.5 pr-3 text-ink/50 text-xs">
                    {isExpandable
                      ? isOpen ? "" : rows.map(r => r.city || r.district).join(", ") + (hasOthers ? " + others" : "")
                      : (rows[0].city || rows[0].district)}
                  </td>
                  <td className="py-2.5 pr-3 text-ink text-right font-medium">{fmt(displayTotal)}</td>
                  <td className="py-2.5 pr-3 text-ink text-right font-medium">₹ {fmt(displayValue)}</td>
                  <td className="py-2.5 pr-3 text-ink/50 text-xs">
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
                  <td className="py-2.5"><ConfidenceBadge c={stEntry ? stEntry.confidence : conf} /></td>
                </tr>

                {/* City rows + Others row (shown when expanded) */}
                {isOpen && (
                  <>
                    {rows.map((r, i) => (
                      <tr key={`${state}-${i}`} className="border-b border-border/30 bg-peach-dark/5">
                        <td className="py-2 pr-1"></td>
                        <td className="py-2 pr-3"></td>
                        <td className="py-2 pr-3 text-ink/70 pl-3 text-xs">↳ {r.city || r.district}</td>
                        <td className="py-2 pr-3 text-ink/70 text-right text-xs">{fmt(r.transaction_count)}</td>
                        <td className="py-2 pr-3 text-ink/70 text-right text-xs">₹ {fmt(r.value_cr)}</td>
                        <td className="py-2 pr-3 text-ink/40 text-xs">
                          <a href={r.source_url} target="_blank" rel="noopener noreferrer" className="hover:text-ink underline underline-offset-2">
                            {r.source.split("+")[0].trim()}
                          </a>
                        </td>
                        <td className="py-2"><ConfidenceBadge c={r.confidence} /></td>
                      </tr>
                    ))}
                    {hasOthers && (
                      <tr className="border-b border-border/30 bg-peach-dark/5">
                        <td className="py-2 pr-1"></td>
                        <td className="py-2 pr-3"></td>
                        <td className="py-2 pr-3 text-ink/40 pl-3 text-xs italic">↳ Others (rest of state)</td>
                        <td className="py-2 pr-3 text-ink/40 text-right text-xs">{fmt(othersCount)}</td>
                        <td className="py-2 pr-3 text-ink/40 text-right text-xs">₹ {fmt(othersValue)}</td>
                        <td className="py-2 pr-3 text-ink/30 text-xs">
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
      <p className="mt-3 text-[11px] text-ink/40 font-sans">
        State totals sourced from IGRS/RERA portals. "Others" = state total minus identified cities. Counts include land/plot purchases + independent house sales (land-linked). Click a state to expand. Data period: {meta.period}.
      </p>
      <DataMethodology steps={METHODOLOGY.individualBuyers} />
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
            <th className="pb-2 pr-3 text-xs text-ink/50 font-medium w-6"></th>
            <th className="pb-2 pr-3 text-xs text-ink/50 font-medium">State</th>
            <th className="pb-2 pr-3 text-xs text-ink/50 font-medium">Market</th>
            <th className="pb-2 pr-3 text-xs text-ink/50 font-medium text-right">Land Deals</th>
            <th className="pb-2 pr-3 text-xs text-ink/50 font-medium text-right">Acres</th>
            <th className="pb-2 pr-3 text-xs text-ink/50 font-medium text-right">Value (₹ Cr)</th>
            <th className="pb-2 pr-3 text-xs text-ink/50 font-medium">Source</th>
            <th className="pb-2 text-xs text-ink/50 font-medium">Confidence</th>
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
                  className={`border-b border-border/50 ${multiCity ? "cursor-pointer hover:bg-peach-dark/5" : ""}`}
                >
                  <td className="py-2.5 pr-1 w-6">
                    {multiCity && (
                      <ChevronRight
                        size={14}
                        className={`text-ink/30 transition-transform ${isOpen ? "rotate-90" : ""}`}
                      />
                    )}
                  </td>
                  <td className="py-2.5 pr-3 text-ink font-medium">{state}</td>
                  <td className="py-2.5 pr-3 text-ink/50 text-xs">
                    {multiCity
                      ? isOpen ? "" : rows.map(r => r.city || r.district).join(", ")
                      : (rows[0].city || rows[0].district)}
                  </td>
                  <td className="py-2.5 pr-3 text-ink text-right font-medium">{fmt(stateDeals)}</td>
                  <td className="py-2.5 pr-3 text-ink/70 text-right font-medium">{fmt(stateAcres)}</td>
                  <td className="py-2.5 pr-3 text-ink text-right font-medium">₹ {fmt(stateValue)}</td>
                  <td className="py-2.5 pr-3 text-ink/50 text-xs">
                    {!multiCity && (
                      <a href={rows[0].source_url} target="_blank" rel="noopener noreferrer" className="hover:text-ink underline underline-offset-2">
                        {rows[0].source.split("+")[0].trim()}
                      </a>
                    )}
                  </td>
                  <td className="py-2.5"><ConfidenceBadge c={conf} /></td>
                </tr>

                {isOpen && rows.map((r, i) => (
                  <tr key={`${state}-${i}`} className="border-b border-border/30 bg-peach-dark/5">
                    <td className="py-2 pr-1"></td>
                    <td className="py-2 pr-3"></td>
                    <td className="py-2 pr-3 text-ink/70 pl-3 text-xs">↳ {r.city || r.district}</td>
                    <td className="py-2 pr-3 text-ink/70 text-right text-xs">{fmt(r.transaction_count)}</td>
                    <td className="py-2 pr-3 text-ink/70 text-right text-xs">{fmt(r.area_acres)}</td>
                    <td className="py-2 pr-3 text-ink/70 text-right text-xs">₹ {fmt(r.value_cr)}</td>
                    <td className="py-2 pr-3 text-ink/40 text-xs">
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
      <p className="mt-3 text-[11px] text-ink/40 font-sans">
        Per the segment multiplier: 5–10 plots evaluated per successful deal. Click a state to expand city breakdown. Data period: {meta.period}.
      </p>
      <DataMethodology steps={METHODOLOGY.developers} />
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
            <th className="pb-2 pr-3 text-xs text-ink/50 font-medium w-6"></th>
            <th className="pb-2 pr-3 text-xs text-ink/50 font-medium">State</th>
            <th className="pb-2 pr-3 text-xs text-ink/50 font-medium">City / District</th>
            <th className="pb-2 pr-3 text-xs text-ink/50 font-medium text-right">Active Listings</th>
            <th className="pb-2 pr-3 text-xs text-ink/50 font-medium">Source</th>
            <th className="pb-2 text-xs text-ink/50 font-medium">Confidence</th>
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
                  className={`border-b border-border/50 ${multiCity ? "cursor-pointer hover:bg-peach-dark/5" : ""}`}
                >
                  <td className="py-2.5 pr-1 w-6">
                    {multiCity && (
                      <ChevronRight
                        size={14}
                        className={`text-ink/30 transition-transform ${isOpen ? "rotate-90" : ""}`}
                      />
                    )}
                  </td>
                  <td className="py-2.5 pr-3 text-ink font-medium">{state}</td>
                  <td className="py-2.5 pr-3 text-ink/50 text-xs">
                    {multiCity
                      ? isOpen ? "" : rows.map(r => r.city || r.district).join(", ")
                      : (rows[0].city || rows[0].district)}
                  </td>
                  <td className="py-2.5 pr-3 text-ink text-right font-medium">{fmt(stateListings)}</td>
                  <td className="py-2.5 pr-3 text-ink/50 text-xs">
                    {!multiCity && (
                      <a href={rows[0].source_url} target="_blank" rel="noopener noreferrer" className="hover:text-ink underline underline-offset-2">
                        {rows[0].source.split("(")[0].trim()}
                      </a>
                    )}
                  </td>
                  <td className="py-2.5"><ConfidenceBadge c={conf} /></td>
                </tr>

                {isOpen && rows.map((r, i) => (
                  <tr key={`${state}-${i}`} className="border-b border-border/30 bg-peach-dark/5">
                    <td className="py-2 pr-1"></td>
                    <td className="py-2 pr-3"></td>
                    <td className="py-2 pr-3 text-ink/70 pl-3 text-xs">↳ {r.city || r.district}</td>
                    <td className="py-2 pr-3 text-ink/70 text-right text-xs">{fmt(r.listing_count)}</td>
                    <td className="py-2 pr-3 text-ink/40 text-xs">
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
      <p className="mt-3 text-[11px] text-ink/40 font-sans">
        Listing count = active Plot/Land listings on 99acres + Magicbricks (type=Plot filter). Click a state to expand city breakdown. Data period: {meta.period}.
      </p>
      <DataMethodology steps={METHODOLOGY.brokers} />
    </div>
  )
}

function BanksTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm font-sans">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="pb-2 pr-3 text-xs text-ink/50 font-medium">State</th>
            <th className="pb-2 pr-3 text-xs text-ink/50 font-medium text-right">Total Loans</th>
            <th className="pb-2 pr-3 text-xs text-ink/50 font-medium text-right">Plot Loans (~15%)</th>
            <th className="pb-2 pr-3 text-xs text-ink/50 font-medium text-right">Total Disbursed (₹ Cr)</th>
            <th className="pb-2 pr-3 text-xs text-ink/50 font-medium text-right">Plot Disbursed (₹ Cr)</th>
            <th className="pb-2 pr-3 text-xs text-ink/50 font-medium text-right">Avg Ticket (₹ L)</th>
            <th className="pb-2 pr-3 text-xs text-ink/50 font-medium">Source</th>
            <th className="pb-2 text-xs text-ink/50 font-medium">Confidence</th>
          </tr>
        </thead>
        <tbody>
          {banksInsurers.map((r, i) => (
            <tr key={i} className="border-b border-border/50">
              <td className="py-2.5 pr-3 text-ink">{r.state}</td>
              <td className="py-2.5 pr-3 text-ink/70 text-right">{fmt(r.loan_count)}</td>
              <td className="py-2.5 pr-3 text-ink font-medium text-right">{fmt(r.plot_loan_count)}</td>
              <td className="py-2.5 pr-3 text-ink/70 text-right">₹ {fmt(r.disbursement_cr)}</td>
              <td className="py-2.5 pr-3 text-ink font-medium text-right">₹ {fmt(r.plot_disbursement_cr)}</td>
              <td className="py-2.5 pr-3 text-ink/70 text-right">{r.avg_ticket_lakh}</td>
              <td className="py-2.5 pr-3 text-ink/50 text-xs">
                <a href={r.source_url} target="_blank" rel="noopener noreferrer" className="hover:text-ink underline underline-offset-2">
                  NHB 2024-25
                </a>
              </td>
              <td className="py-2.5"><ConfidenceBadge c={r.confidence} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-[11px] text-ink/40 font-sans">
        Plot loans estimated at ~15% of total housing loans per NHB 2024-25 report. Banks require land reports for loans above ₹50L ticket. Data period: {meta.period}.
      </p>
      <DataMethodology steps={METHODOLOGY.banksInsurers} />
    </div>
  )
}

// ── Advisory Market ──────────────────────────────────────────────────────────

const ADVISORY_YEARS = ["FY2021", "FY2022", "FY2023", "FY2024", "FY2025"]
const ADVISORY_CONF_STYLES: Record<string, string> = {
  high: "text-green-700",
  medium: "text-ink",
  low: "text-ink/40",
}

const ADVISORY_MARKET = {
  totalOrganised_cr: 8420,
  totalOrganised_fy: "FY2025",
  cagr_pct: 22,
  cagr_period: "FY23–25",
  proj_fy2027_cr: 12800,
  unorganised_cr: 19000,
}

type AdvisoryCompany = {
  company: string
  category: string
  parent: string
  founded_india: number
  hq_india: string
  employees_india: number
  market_focus: string[]
  revenue_history: { year: string; revenue_cr: number; confidence: string }[]
  revenue_fy2027_proj_cr: number
  listed: boolean
  exchange: string | null
  notes: string
  source: string
  source_url: string
  confidence: string
}

function AdvisoryTable() {
  const companies = advisoryCompanies as AdvisoryCompany[]
  const [detail, setDetail] = useState<string | null>(null)

  const byCategory = new Map<string, AdvisoryCompany[]>()
  for (const c of companies) {
    const list = byCategory.get(c.category) ?? []
    list.push(c)
    byCategory.set(c.category, list)
  }

  return (
    <div>
      {/* Market overview cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div className="bg-peach-dark/10 rounded-xl px-4 py-4">
          <p className="text-xs text-ink/50 font-sans mb-1">Organised Market ({ADVISORY_MARKET.totalOrganised_fy})</p>
          <p className="text-2xl font-heading font-bold text-ink">₹ {fmt(ADVISORY_MARKET.totalOrganised_cr)} Cr</p>
          <p className="text-xs text-ink/40 font-sans mt-0.5">top firms + portals combined</p>
        </div>
        <div className="bg-peach-dark/10 rounded-xl px-4 py-4">
          <p className="text-xs text-ink/50 font-sans mb-1">Revenue CAGR ({ADVISORY_MARKET.cagr_period})</p>
          <p className="text-2xl font-heading font-bold text-ink">{ADVISORY_MARKET.cagr_pct}%</p>
          <p className="text-xs text-ink/40 font-sans mt-0.5">organised advisory segment</p>
        </div>
        <div className="bg-peach-dark/10 rounded-xl px-4 py-4">
          <p className="text-xs text-ink/50 font-sans mb-1">Projected FY2027</p>
          <p className="text-2xl font-heading font-bold text-ink">₹ {fmt(ADVISORY_MARKET.proj_fy2027_cr)} Cr</p>
          <p className="text-xs text-ink/40 font-sans mt-0.5">organised; at ~23% CAGR</p>
        </div>
        <div className="bg-peach-dark/10 rounded-xl px-4 py-4">
          <p className="text-xs text-ink/50 font-sans mb-1">Unorganised Market</p>
          <p className="text-2xl font-heading font-bold text-ink">₹ {fmt(ADVISORY_MARKET.unorganised_cr)} Cr</p>
          <p className="text-xs text-ink/40 font-sans mt-0.5">~{Math.round(ADVISORY_MARKET.unorganised_cr / (ADVISORY_MARKET.unorganised_cr + ADVISORY_MARKET.totalOrganised_cr) * 100)}% of total market</p>
        </div>
      </div>

      {/* Company table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm font-sans">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="pb-2 pr-3 text-xs text-ink/50 font-medium">Company</th>
              <th className="pb-2 pr-3 text-xs text-ink/50 font-medium">Category</th>
              {ADVISORY_YEARS.map(y => (
                <th key={y} className="pb-2 pr-3 text-xs text-ink/50 font-medium text-right whitespace-nowrap">{y} (₹ Cr)</th>
              ))}
              <th className="pb-2 pr-3 text-xs text-ink/50 font-medium text-right whitespace-nowrap">FY2027 Proj.</th>
              <th className="pb-2 text-xs text-ink/50 font-medium">Data</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((c) => {
              const revenueMap = new Map(c.revenue_history.map(r => [r.year, r]))
              const isOpen = detail === c.company
              return (
                <Fragment key={c.company}>
                  <tr
                    onClick={() => setDetail(isOpen ? null : c.company)}
                    className="border-b border-border/50 cursor-pointer hover:bg-peach-dark/5"
                  >
                    <td className="py-2.5 pr-3">
                      <div className="font-medium text-ink">{c.company}</div>
                      <div className="text-[10px] text-ink/40 mt-0.5">{c.hq_india} · {fmt(c.employees_india)} employees</div>
                    </td>
                    <td className="py-2.5 pr-3">
                      <span className="text-xs text-ink/60 bg-ink/5 px-2 py-0.5 rounded-full whitespace-nowrap">{c.category}</span>
                    </td>
                    {ADVISORY_YEARS.map(y => {
                      const entry = revenueMap.get(y)
                      return (
                        <td key={y} className={`py-2.5 pr-3 text-right text-sm font-medium ${entry ? ADVISORY_CONF_STYLES[entry.confidence] : "text-ink/20"}`}>
                          {entry ? fmt(entry.revenue_cr) : "—"}
                        </td>
                      )
                    })}
                    <td className="py-2.5 pr-3 text-right text-sm text-ink/40 italic">{fmt(c.revenue_fy2027_proj_cr)}</td>
                    <td className="py-2.5"><ConfidenceBadge c={c.confidence} /></td>
                  </tr>
                  {isOpen && (
                    <tr className="border-b border-border/30 bg-peach-dark/5">
                      <td colSpan={ADVISORY_YEARS.length + 4} className="px-3 py-3">
                        <div className="grid sm:grid-cols-3 gap-4 text-xs font-sans">
                          <div>
                            <p className="text-ink/40 mb-1">Parent / Listed</p>
                            <p className="text-ink">{c.parent}</p>
                            <p className="text-ink/50 mt-0.5">{c.listed ? `Listed: ${c.exchange}` : "Private"} · India since {c.founded_india}</p>
                          </div>
                          <div>
                            <p className="text-ink/40 mb-1">Market Focus</p>
                            <div className="flex flex-wrap gap-1">
                              {c.market_focus.map(f => (
                                <span key={f} className="bg-ink/8 px-1.5 py-0.5 rounded text-ink/70">{f}</span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-ink/40 mb-1">Notes</p>
                            <p className="text-ink/70 leading-relaxed">{c.notes}</p>
                            <a href={c.source_url} target="_blank" rel="noopener noreferrer" className="text-ink/40 hover:text-ink underline underline-offset-2 mt-1 inline-block">
                              {c.source.split("+")[0].trim()} ↗
                            </a>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-[11px] text-ink/40 font-sans">
        Revenue figures in ₹ Cr. <span className="text-green-700 font-semibold">Bold</span> = high confidence (filed accounts). <span className="text-ink font-medium">Regular</span> = medium (MCA filings / analyst estimates). <span className="text-ink/40">Faded</span> = low (media + funding disclosures). Click any row to expand details.
      </p>
      <DataMethodology steps={METHODOLOGY.advisory} />
    </div>
  )
}

// ── Competition Tab ───────────────────────────────────────────────────────────

type ResearchCompetitor = {
  company: string
  region: string
  category: string
  hq: string
  founded: number
  positioning: string
  description: string
  key_problem: string
  revenue_model: string
  funding_usd: number
  funding_stage: string
  investors: string[]
  employees: number
  app_available: boolean
  app_store_rating: number | null
  website: string
  market_focus: string[]
  differentiator: string
  weakness: string
  status: string
  notes: string
}

type VastuCompetitor = {
  company: string
  type: string
  hq: string
  founded: number
  positioning: string
  description: string
  key_problem: string
  revenue_model: string
  funding_usd: number
  funding_stage: string
  investors: string[]
  employees: number
  app_available: boolean
  app_store_rating: number | null
  play_store_installs: string | null
  website: string
  service_type: string[]
  geography: string[]
  differentiator: string
  weakness: string
  status: string
  notes: string
}

function fmtFunding(usd: number): string {
  if (usd === 0) return "—"
  if (usd >= 1_000_000) return `$${(usd / 1_000_000).toFixed(1)}M`
  return `$${(usd / 1_000).toFixed(0)}K`
}

function ResearchCards({ items }: { items: ResearchCompetitor[] }) {
  const [open, setOpen] = useState<string | null>(null)
  const [filter, setFilter] = useState("All")
  const filtered = filter === "All" ? items
    : filter === "India" ? items.filter(c => c.region === "India")
    : items.filter(c => c.region === "Global")

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Tracked", value: items.length, sub: "India + Global" },
          { label: "India Players", value: items.filter(c => c.region === "India").length, sub: "direct + adjacent" },
          { label: "Have App", value: items.filter(c => c.app_available).length, sub: "Play Store / App Store" },
          { label: "VC Funded", value: items.filter(c => c.funding_usd > 0 && !c.funding_stage.includes("Public") && !c.funding_stage.includes("Government") && !c.funding_stage.includes("Part of")).length, sub: "raised external capital" },
        ].map(s => (
          <div key={s.label} className="bg-peach-dark/10 rounded-xl px-4 py-4">
            <p className="text-xs text-ink/50 font-sans mb-1">{s.label}</p>
            <p className="text-2xl font-heading font-bold text-ink">{s.value}</p>
            <p className="text-xs text-ink/40 font-sans mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-5">
        {["All", "India", "Global"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-sans font-medium transition-colors ${filter === f ? "bg-ink text-white" : "bg-ink/8 text-ink/50 hover:bg-ink/15"}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {filtered.map(c => {
          const isOpen = open === c.company
          return (
            <div key={c.company} className={`border rounded-xl overflow-hidden ${isOpen ? "border-border" : "border-border/40"}`}>
              <button onClick={() => setOpen(isOpen ? null : c.company)} className="w-full text-left px-4 py-4 hover:bg-peach-dark/5 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="text-sm font-semibold text-ink font-sans">{c.company}</p>
                    <p className="text-[11px] text-ink/40 font-sans mt-0.5">{c.hq} · est. {c.founded}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-[10px] font-sans font-medium bg-ink/6 text-ink/50 px-2 py-0.5 rounded-full whitespace-nowrap">{c.region}</span>
                    {c.app_available && <span className="text-[10px] font-sans font-medium bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">App ★{c.app_store_rating}</span>}
                  </div>
                </div>
                <p className="text-xs text-ink/65 font-sans leading-relaxed">{c.positioning}</p>
                <div className="flex flex-wrap gap-3 mt-3 text-[11px] font-sans text-ink/40">
                  <span>{fmtFunding(c.funding_usd) !== "—" ? `${fmtFunding(c.funding_usd)} · ${c.funding_stage}` : c.funding_stage}</span>
                  <span>· {c.employees.toLocaleString("en-IN")} people</span>
                </div>
              </button>
              {isOpen && (
                <div className="border-t border-border/30 px-4 py-4 bg-peach-dark/4 space-y-3 text-xs font-sans">
                  <div><p className="text-ink/40 uppercase tracking-wide text-[10px] mb-1">Problem they solve</p><p className="text-ink/70 leading-relaxed">{c.key_problem}</p></div>
                  <div><p className="text-ink/40 uppercase tracking-wide text-[10px] mb-1">Revenue model</p><p className="text-ink/70 leading-relaxed">{c.revenue_model}</p></div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div><p className="text-ink/40 uppercase tracking-wide text-[10px] mb-1">Edge</p><p className="text-ink/70 leading-relaxed">{c.differentiator}</p></div>
                    <div><p className="text-ink/40 uppercase tracking-wide text-[10px] mb-1">Weakness</p><p className="text-ink/70 leading-relaxed">{c.weakness}</p></div>
                  </div>
                  {c.market_focus.length > 0 && (
                    <div><p className="text-ink/40 uppercase tracking-wide text-[10px] mb-1.5">Focus</p>
                      <div className="flex flex-wrap gap-1">{c.market_focus.map(f => <span key={f} className="bg-ink/8 px-1.5 py-0.5 rounded text-ink/60">{f}</span>)}</div>
                    </div>
                  )}
                  {c.investors.length > 0 && <div><p className="text-ink/40 uppercase tracking-wide text-[10px] mb-1">Investors</p><p className="text-ink/60">{c.investors.join(", ")}</p></div>}
                  <div><p className="text-ink/40 uppercase tracking-wide text-[10px] mb-1">KYL relevance</p><p className="text-ink/60 leading-relaxed">{c.notes}</p></div>
                  <a href={c.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-ink/40 hover:text-ink underline underline-offset-2">{c.website.replace("https://", "")} ↗</a>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function VastuCards({ items }: { items: VastuCompetitor[] }) {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Players Tracked", value: items.length, sub: "consultants + apps" },
          { label: "Have App", value: items.filter(c => c.app_available).length, sub: "Play Store / App Store" },
          { label: "With Training Academy", value: items.filter(c => c.service_type.some(s => s.includes("Training") || s.includes("Academy"))).length, sub: "teach Vastu" },
          { label: "Digital-first", value: items.filter(c => c.type.toLowerCase().includes("app")).length, sub: "app or platform" },
        ].map(s => (
          <div key={s.label} className="bg-peach-dark/10 rounded-xl px-4 py-4">
            <p className="text-xs text-ink/50 font-sans mb-1">{s.label}</p>
            <p className="text-2xl font-heading font-bold text-ink">{s.value}</p>
            <p className="text-xs text-ink/40 font-sans mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-ink/45 font-sans mb-5 leading-relaxed">
        No Vastu app or consultant integrates with property addresses, land records, or due diligence data — this is the white space KYL can own with a plot-level Vastu score layer.
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        {items.map(c => {
          const isOpen = open === c.company
          return (
            <div key={c.company} className={`border rounded-xl overflow-hidden ${isOpen ? "border-border" : "border-border/40"}`}>
              <button onClick={() => setOpen(isOpen ? null : c.company)} className="w-full text-left px-4 py-4 hover:bg-peach-dark/5 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="text-sm font-semibold text-ink font-sans">{c.company}</p>
                    <p className="text-[11px] text-ink/40 font-sans mt-0.5">{c.hq} · est. {c.founded}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-[10px] font-sans font-medium bg-ink/6 text-ink/50 px-2 py-0.5 rounded-full whitespace-nowrap">{c.type}</span>
                    {c.app_available && <span className="text-[10px] font-sans font-medium bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">App ★{c.app_store_rating ?? "—"}</span>}
                  </div>
                </div>
                <p className="text-xs text-ink/65 font-sans leading-relaxed">{c.positioning}</p>
                <div className="flex flex-wrap gap-3 mt-3 text-[11px] font-sans text-ink/40">
                  {c.play_store_installs && <span>{c.play_store_installs} installs</span>}
                  <span>{c.employees} people</span>
                </div>
              </button>
              {isOpen && (
                <div className="border-t border-border/30 px-4 py-4 bg-peach-dark/4 space-y-3 text-xs font-sans">
                  <div><p className="text-ink/40 uppercase tracking-wide text-[10px] mb-1">Problem they solve</p><p className="text-ink/70 leading-relaxed">{c.key_problem}</p></div>
                  <div><p className="text-ink/40 uppercase tracking-wide text-[10px] mb-1">Revenue model</p><p className="text-ink/70 leading-relaxed">{c.revenue_model}</p></div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div><p className="text-ink/40 uppercase tracking-wide text-[10px] mb-1">Edge</p><p className="text-ink/70 leading-relaxed">{c.differentiator}</p></div>
                    <div><p className="text-ink/40 uppercase tracking-wide text-[10px] mb-1">Weakness</p><p className="text-ink/70 leading-relaxed">{c.weakness}</p></div>
                  </div>
                  {c.service_type.length > 0 && (
                    <div><p className="text-ink/40 uppercase tracking-wide text-[10px] mb-1.5">Services</p>
                      <div className="flex flex-wrap gap-1">{c.service_type.map(f => <span key={f} className="bg-ink/8 px-1.5 py-0.5 rounded text-ink/60">{f}</span>)}</div>
                    </div>
                  )}
                  <div><p className="text-ink/40 uppercase tracking-wide text-[10px] mb-1">KYL relevance</p><p className="text-ink/60 leading-relaxed">{c.notes}</p></div>
                  <a href={c.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-ink/40 hover:text-ink underline underline-offset-2">{c.website.replace("https://", "")} ↗</a>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Content Creators Tab ──────────────────────────────────────────────────────

type ContentCreator = {
  name: string
  handle: string
  platforms: string[]
  platform_urls: Record<string, string>
  profile_url: string
  bio: string
  followers: Record<string, number>
  language: string[]
  content_focus: string[]
  geography_focus: string[]
  posting_frequency: string
  monetisation: string[]
  relevance_to_kyl: string
  confidence: string
  notes: string
}

function fmtFollowers(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return String(n)
}

const PLATFORM_COLORS: Record<string, string> = {
  YouTube: "bg-red-50 text-red-600",
  Instagram: "bg-pink-50 text-pink-600",
  Facebook: "bg-blue-50 text-blue-600",
  LinkedIn: "bg-sky-50 text-sky-700",
  "Twitter/X": "bg-ink/8 text-ink/60",
}

function ContentCreatorsTab() {
  const creators = contentCreatorsRaw as unknown as ContentCreator[]
  const [open, setOpen] = useState<string | null>(null)
  const [langFilter, setLangFilter] = useState("All")
  const [platformFilter, setPlatformFilter] = useState("All")

  const allLangs = ["All", "English", "Hindi", "Hinglish", "Marathi", "Gujarati", "Kannada", "Telugu", "Tamil", "Bengali"]
  const allPlatforms = ["All", "YouTube", "Instagram", "Facebook", "LinkedIn"]

  const filtered = creators.filter(c => {
    const langOk = langFilter === "All" || c.language.some(l => l === langFilter)
    const platOk = platformFilter === "All" || c.platforms.includes(platformFilter)
    return langOk && platOk
  })

  const totalFollowers = creators.reduce((s, c) => s + Object.values(c.followers).reduce((a, b) => a + b, 0), 0)

  return (
    <div>
      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-peach-dark/10 rounded-xl px-4 py-4">
          <p className="text-xs text-ink/50 font-sans mb-1">Creators Tracked</p>
          <p className="text-2xl font-heading font-bold text-ink">{creators.length}</p>
          <p className="text-xs text-ink/40 font-sans mt-0.5">India-focused</p>
        </div>
        <div className="bg-peach-dark/10 rounded-xl px-4 py-4">
          <p className="text-xs text-ink/50 font-sans mb-1">Total Reach</p>
          <p className="text-2xl font-heading font-bold text-ink">{fmtFollowers(totalFollowers)}</p>
          <p className="text-xs text-ink/40 font-sans mt-0.5">combined followers</p>
        </div>
        <div className="bg-peach-dark/10 rounded-xl px-4 py-4">
          <p className="text-xs text-ink/50 font-sans mb-1">Languages</p>
          <p className="text-2xl font-heading font-bold text-ink">9</p>
          <p className="text-xs text-ink/40 font-sans mt-0.5">regional + English</p>
        </div>
        <div className="bg-peach-dark/10 rounded-xl px-4 py-4">
          <p className="text-xs text-ink/50 font-sans mb-1">Plot/Land Focus</p>
          <p className="text-2xl font-heading font-bold text-ink">{creators.filter(c => c.content_focus.some(f => f.toLowerCase().includes("plot") || f.toLowerCase().includes("land"))).length}</p>
          <p className="text-xs text-ink/40 font-sans mt-0.5">direct KYL audience</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-3">
        {allPlatforms.map(p => (
          <button key={p} onClick={() => setPlatformFilter(p)}
            className={`px-3 py-1.5 rounded-full text-xs font-sans font-medium transition-colors ${platformFilter === p ? "bg-ink text-white" : "bg-ink/8 text-ink/50 hover:bg-ink/15"}`}>
            {p}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {allLangs.map(l => (
          <button key={l} onClick={() => setLangFilter(l)}
            className={`px-3 py-1.5 rounded-full text-xs font-sans font-medium transition-colors ${langFilter === l ? "bg-peach-dark text-white" : "bg-ink/5 text-ink/50 hover:bg-ink/10"}`}>
            {l}
          </button>
        ))}
      </div>

      {/* Creator cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        {filtered.map(c => {
          const isOpen = open === c.name
          const totalReach = Object.values(c.followers).reduce((a, b) => a + b, 0)
          return (
            <div key={c.name} className={`border rounded-xl overflow-hidden ${isOpen ? "border-border" : "border-border/40"}`}>
              <button onClick={() => setOpen(isOpen ? null : c.name)} className="w-full text-left px-4 py-4 hover:bg-peach-dark/5 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink font-sans">{c.name}</p>
                    <p className="text-[11px] text-ink/40 font-sans mt-0.5">{c.handle}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-base font-heading font-bold text-ink">{fmtFollowers(totalReach)}</p>
                    <p className="text-[10px] text-ink/35 font-sans">total reach</p>
                  </div>
                </div>

                {/* Platform badges — linked */}
                <div className="flex flex-wrap gap-1 mb-2">
                  {c.platforms.map(p => (
                    c.platform_urls[p] ? (
                      <a key={p} href={c.platform_urls[p]} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                        className={`text-[10px] font-sans font-medium px-2 py-0.5 rounded-full hover:opacity-75 transition-opacity ${PLATFORM_COLORS[p] ?? "bg-ink/8 text-ink/50"}`}>{p} ↗</a>
                    ) : (
                      <span key={p} className={`text-[10px] font-sans font-medium px-2 py-0.5 rounded-full ${PLATFORM_COLORS[p] ?? "bg-ink/8 text-ink/50"}`}>{p}</span>
                    )
                  ))}
                </div>

                {/* Language badges */}
                <div className="flex flex-wrap gap-1 mb-2">
                  {c.language.map(l => (
                    <span key={l} className="text-[10px] font-sans bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">{l}</span>
                  ))}
                </div>

                <p className="text-xs text-ink/55 font-sans leading-relaxed line-clamp-2">{c.bio}</p>

                <div className="flex flex-wrap gap-1 mt-2">
                  {c.content_focus.slice(0, 3).map(f => (
                    <span key={f} className="text-[10px] bg-ink/5 text-ink/50 px-1.5 py-0.5 rounded font-sans">{f}</span>
                  ))}
                  {c.content_focus.length > 3 && <span className="text-[10px] text-ink/35 font-sans px-1">+{c.content_focus.length - 3}</span>}
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-border/30 px-4 py-4 bg-peach-dark/4 space-y-3 text-xs font-sans">
                  <div>
                    <p className="text-ink/40 uppercase tracking-wide text-[10px] mb-1">About</p>
                    <p className="text-ink/70 leading-relaxed">{c.bio}</p>
                  </div>

                  {/* Per-platform followers */}
                  <div>
                    <p className="text-ink/40 uppercase tracking-wide text-[10px] mb-1.5">Followers by platform</p>
                    <div className="flex flex-wrap gap-3">
                      {Object.entries(c.followers).map(([plat, count]) => {
                        const url = c.platform_urls[plat]
                        const badge = <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${PLATFORM_COLORS[plat] ?? "bg-ink/8 text-ink/50"}`}>{plat}</span>
                        return (
                          <div key={plat} className="flex items-center gap-1">
                            {url ? <a href={url} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">{badge}</a> : badge}
                            <span className="text-ink/60 font-semibold">{fmtFollowers(count)}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <p className="text-ink/40 uppercase tracking-wide text-[10px] mb-1">Geography</p>
                      <p className="text-ink/65">{c.geography_focus.join(", ")}</p>
                    </div>
                    <div>
                      <p className="text-ink/40 uppercase tracking-wide text-[10px] mb-1">Posts</p>
                      <p className="text-ink/65">{c.posting_frequency}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-ink/40 uppercase tracking-wide text-[10px] mb-1">How they earn</p>
                    <p className="text-ink/65">{c.monetisation.join(", ")}</p>
                  </div>

                  <div>
                    <p className="text-ink/40 uppercase tracking-wide text-[10px] mb-1">KYL partnership angle</p>
                    <p className="text-ink/70 leading-relaxed">{c.relevance_to_kyl}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <a href={c.profile_url} target="_blank" rel="noopener noreferrer" className="text-ink/40 hover:text-ink underline underline-offset-2">{c.handle} ↗</a>
                    <ConfidenceBadge c={c.confidence} />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <p className="mt-5 text-[11px] text-ink/35 font-sans leading-relaxed">
        Follower counts are approximate and sourced from public profiles. Confidence badge reflects data reliability. Platform reach is additive across platforms for each creator (some audience overlap expected).
      </p>
    </div>
  )
}

const COMP_TABS = ["Research", "Vastu"] as const
type CompTab = (typeof COMP_TABS)[number]

function CompetitionTab() {
  const [compTab, setCompTab] = useState<CompTab>("Research")
  const research = competitorsResearchRaw as ResearchCompetitor[]
  const vastu = competitorsVastuRaw as VastuCompetitor[]

  return (
    <div>
      <div className="border-b border-border mb-6 overflow-x-auto">
        <div className="flex gap-0 min-w-max">
          {COMP_TABS.map(t => (
            <button key={t} onClick={() => setCompTab(t)}
              className={`px-4 py-2.5 text-sm font-sans font-medium border-b-2 transition-colors whitespace-nowrap ${compTab === t ? "border-ink text-ink" : "border-transparent text-ink/50 hover:text-ink"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>
      {compTab === "Research" && <ResearchCards items={research} />}
      {compTab === "Vastu" && <VastuCards items={vastu} />}
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

const MAIN_TABS = ["Bottom-up Market", "Advisory Market", "Competition", "Content Creators"] as const
type MainTab = (typeof MAIN_TABS)[number]

export default function KYLPage() {
  const [mainTab, setMainTab] = useState<MainTab>("Bottom-up Market")
  const [activeTab, setActiveTab] = useState<Tab>("Total")

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-ink">KYL — Know Your Land</h1>
      </div>

      {/* Main tabs */}
      <div className="border-b border-border mb-6 overflow-x-auto">
        <div className="flex gap-0 min-w-max">
          {MAIN_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setMainTab(tab)}
              className={`px-5 py-2.5 text-sm font-sans font-semibold border-b-2 transition-colors whitespace-nowrap ${
                mainTab === tab
                  ? "border-ink text-ink"
                  : "border-transparent text-ink/40 hover:text-ink"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── Bottom-up Market ── */}
      {mainTab === "Bottom-up Market" && (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            <div className="bg-peach-dark/10 rounded-xl px-4 py-4">
              <p className="text-xs text-ink/50 font-sans mb-1">Total Volume</p>
              <p className="text-2xl font-heading font-bold text-ink">{fmt(TOTAL.transactions)}</p>
              <p className="text-xs text-ink/40 font-sans mt-0.5">transactions + listings</p>
            </div>
            <div className="bg-peach-dark/10 rounded-xl px-4 py-4">
              <p className="text-xs text-ink/50 font-sans mb-1">Total Area</p>
              <p className="text-2xl font-heading font-bold text-ink">
                {TOTAL.area_sqft > 0 ? `${(TOTAL.area_sqft / 1e6).toFixed(1)}M` : "—"}
              </p>
              <p className="text-xs text-ink/40 font-sans mt-0.5">sq ft (developers)</p>
            </div>
            <div className="bg-peach-dark/10 rounded-xl px-4 py-4">
              <p className="text-xs text-ink/50 font-sans mb-1">Total Value</p>
              <p className="text-2xl font-heading font-bold text-ink">₹ {fmt(TOTAL.value_cr)}</p>
              <p className="text-xs text-ink/40 font-sans mt-0.5">Crore (excl. brokers)</p>
            </div>
            <div className="bg-peach-dark/10 rounded-xl px-4 py-4">
              <p className="text-xs text-ink/50 font-sans mb-1">States Covered</p>
              <p className="text-2xl font-heading font-bold text-ink">{TOTAL.states}</p>
              <p className="text-xs text-ink/40 font-sans mt-0.5">with data across segments</p>
            </div>
          </div>

          {/* Sub-tabs */}
          <div className="border-b border-border mb-6 overflow-x-auto">
            <div className="flex gap-0 min-w-max">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2.5 text-sm font-sans font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab
                      ? "border-ink text-ink"
                      : "border-transparent text-ink/50 hover:text-ink"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div>
            {activeTab === "Total" && <TotalTable />}
            {activeTab === "Individual Buyers" && <IndividualBuyersTable />}
            {activeTab === "Developers" && <DevelopersTable />}
            {activeTab === "Brokers" && <BrokersTable />}
            {activeTab === "Banks / Insurers" && <BanksTable />}
          </div>

          {/* Sources footer — only in Bottom-up Market */}
          <div className="mt-10 pt-6 border-t border-border">
            <p className="text-xs text-ink/40 font-sans font-medium mb-2">Data Sources</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {meta.sources.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-ink/40 hover:text-ink underline underline-offset-2 font-sans"
                >
                  {s.name}
                </a>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── Advisory Market ── */}
      {mainTab === "Advisory Market" && <AdvisoryTable />}

      {/* ── Competition ── */}
      {mainTab === "Competition" && <CompetitionTab />}

      {/* ── Content Creators ── */}
      {mainTab === "Content Creators" && <ContentCreatorsTab />}
    </div>
  )
}
