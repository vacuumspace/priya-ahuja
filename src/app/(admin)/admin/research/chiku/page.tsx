"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import brandsRaw from "../../../../../../data/json/chiku/brand-positioning.json"
import websitesRaw from "../../../../../../data/json/chiku/website-inspiration.json"
import ideasRaw from "../../../../../../data/json/chiku/brand-ideas.json"

// ── Types ────────────────────────────────────────────────────────────────────

type Brand = {
  brand: string
  segment: string
  positioning: string
  marketing_line: string
  marketing_line_type: "verbatim" | "descriptor"
  website: string
  parent: string
  price_band: string
  workwear_relevance: "high" | "medium" | "low"
}

const BRANDS = brandsRaw as Brand[]

const SEGMENTS = [
  "All",
  "Direct - Ethnic Workwear",
  "Mass-Premium National",
  "Premium D2C / Craft-led",
  "Luxury / Designer Benchmark",
  "D2C - Unique Brand Presence",
] as const

const SEGMENT_SHORT: Record<string, string> = {
  "Direct - Ethnic Workwear": "Direct",
  "Mass-Premium National": "Mass-premium",
  "Premium D2C / Craft-led": "Premium D2C",
  "Luxury / Designer Benchmark": "Luxury",
  "D2C - Unique Brand Presence": "Unique D2C",
}

const PAGE_SIZE = 10

const RELEVANCE_STYLES: Record<Brand["workwear_relevance"], string> = {
  high: "bg-green-100 text-green-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-gray-100 text-gray-500",
}

function RelevanceBadge({ r }: { r: Brand["workwear_relevance"] }) {
  return (
    <span className={`inline-block text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${RELEVANCE_STYLES[r]}`}>
      {r}
    </span>
  )
}

// ── Brand Positioning tab ────────────────────────────────────────────────────

function BrandPositioningTab() {
  const [segment, setSegment] = useState<(typeof SEGMENTS)[number]>("All")
  const [page, setPage] = useState(1)
  const filtered = segment === "All" ? BRANDS : BRANDS.filter(b => b.segment === segment)
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function selectSegment(s: (typeof SEGMENTS)[number]) {
    setSegment(s)
    setPage(1)
  }

  return (
    <div>
      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Brands Tracked", value: BRANDS.length, sub: `across ${new Set(BRANDS.map(b => b.segment)).size} segments` },
          { label: "Direct Workwear Comps", value: BRANDS.filter(b => b.segment === "Direct - Ethnic Workwear").length, sub: "office-wear focused" },
          { label: "High Workwear Relevance", value: BRANDS.filter(b => b.workwear_relevance === "high").length, sub: "overlap with chiku" },
          { label: "Premium & Above", value: BRANDS.filter(b => b.price_band.toLowerCase().includes("premium") || b.price_band.toLowerCase().includes("luxury")).length, sub: "price band" },
        ].map(s => (
          <div key={s.label} className="bg-peach-dark/10 rounded-xl px-4 py-4">
            <p className="text-xs text-ink/50 font-sans mb-1">{s.label}</p>
            <p className="text-2xl font-heading font-bold text-ink">{s.value}</p>
            <p className="text-xs text-ink/40 font-sans mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Segment filter */}
      <div className="flex gap-2 mb-5 overflow-x-auto">
        {SEGMENTS.map(f => (
          <button key={f} onClick={() => selectSegment(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-sans font-medium transition-colors whitespace-nowrap ${segment === f ? "bg-ink text-white" : "bg-ink/8 text-ink/50 hover:bg-ink/15"}`}>
            {f === "All" ? "All" : SEGMENT_SHORT[f]}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm font-sans">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="pb-2 pr-3 text-xs text-ink/50 font-medium">#</th>
              <th className="pb-2 pr-3 text-xs text-ink/50 font-medium">Brand</th>
              <th className="pb-2 pr-3 text-xs text-ink/50 font-medium">Segment</th>
              <th className="pb-2 pr-3 text-xs text-ink/50 font-medium min-w-[280px]">Positioning</th>
              <th className="pb-2 pr-3 text-xs text-ink/50 font-medium min-w-[220px]">Marketing Line</th>
              <th className="pb-2 pr-3 text-xs text-ink/50 font-medium">Price Band</th>
              <th className="pb-2 text-xs text-ink/50 font-medium">Workwear Fit</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((b, i) => (
              <tr key={b.brand} className="border-b border-border/50 align-top">
                <td className="py-3 pr-3 text-ink/30 text-xs">{(page - 1) * PAGE_SIZE + i + 1}</td>
                <td className="py-3 pr-3">
                  <a href={b.website} target="_blank" rel="noopener noreferrer" className="font-medium text-ink hover:underline underline-offset-2 whitespace-nowrap">
                    {b.brand} ↗
                  </a>
                  <div className="text-[10px] text-ink/40 mt-0.5">{b.parent}</div>
                </td>
                <td className="py-3 pr-3">
                  <span className="text-xs text-ink/60 bg-ink/5 px-2 py-0.5 rounded-full whitespace-nowrap">{SEGMENT_SHORT[b.segment]}</span>
                </td>
                <td className="py-3 pr-3 text-xs text-ink/70 leading-relaxed">{b.positioning}</td>
                <td className="py-3 pr-3 text-xs leading-relaxed">
                  <span className={b.marketing_line_type === "verbatim" ? "text-ink italic" : "text-ink/60"}>
                    &ldquo;{b.marketing_line}&rdquo;
                  </span>
                </td>
                <td className="py-3 pr-3 text-xs text-ink/60 whitespace-nowrap">{b.price_band}</td>
                <td className="py-3"><RelevanceBadge r={b.workwear_relevance} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-ink/40 font-sans">
            Showing {(page - 1) * PAGE_SIZE + 1}&ndash;{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} brands
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-2.5 py-1 rounded-lg text-xs font-sans font-medium bg-ink/8 text-ink/60 hover:bg-ink/15 disabled:opacity-40 disabled:hover:bg-ink/8 transition-colors"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-7 h-7 rounded-lg text-xs font-sans font-medium transition-colors ${page === p ? "bg-ink text-white" : "bg-ink/8 text-ink/50 hover:bg-ink/15"}`}>
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-2.5 py-1 rounded-lg text-xs font-sans font-medium bg-ink/8 text-ink/60 hover:bg-ink/15 disabled:opacity-40 disabled:hover:bg-ink/8 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <p className="mt-4 text-[11px] text-ink/40 font-sans leading-relaxed">
        Compiled July 2026 from brand websites and market coverage. Marketing lines in <span className="italic text-ink/60">dark italic</span> are the brand&rsquo;s own tagline (verbatim); the rest are positioning descriptors summarised from how the brand presents itself &mdash; verify before quoting externally. &ldquo;Workwear Fit&rdquo; = overlap with chiku&rsquo;s premium ethnic workwear play, not brand size.
      </p>
    </div>
  )
}

// ── Website inspiration tab ──────────────────────────────────────────────────

type WebsiteInspo = {
  name: string
  category: string
  website: string
  why: string
  steal: string
}

const WEBSITES = websitesRaw as WebsiteInspo[]

function WebsiteTab() {
  const [page, setPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(WEBSITES.length / PAGE_SIZE))
  const paged = WEBSITES.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div>
      <p className="text-xs text-ink/45 font-sans mb-5 leading-relaxed">
        The internet&rsquo;s most distinctive D2C websites, any category &mdash; reference material for building chiku&rsquo;s own site. &ldquo;Steal this&rdquo; = the transferable idea, not the aesthetic.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm font-sans">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="pb-2 pr-3 text-xs text-ink/50 font-medium">#</th>
              <th className="pb-2 pr-3 text-xs text-ink/50 font-medium">Site</th>
              <th className="pb-2 pr-3 text-xs text-ink/50 font-medium">Category</th>
              <th className="pb-2 pr-3 text-xs text-ink/50 font-medium min-w-[280px]">Why It&rsquo;s Crazy</th>
              <th className="pb-2 text-xs text-ink/50 font-medium min-w-[240px]">Steal This</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((w, i) => (
              <tr key={w.name} className="border-b border-border/50 align-top">
                <td className="py-3 pr-3 text-ink/30 text-xs">{(page - 1) * PAGE_SIZE + i + 1}</td>
                <td className="py-3 pr-3">
                  <a href={w.website} target="_blank" rel="noopener noreferrer" className="font-medium text-ink hover:underline underline-offset-2 whitespace-nowrap">
                    {w.name} ↗
                  </a>
                  <div className="text-[10px] text-ink/40 mt-0.5">{w.website.replace("https://", "").replace("www.", "")}</div>
                </td>
                <td className="py-3 pr-3">
                  <span className="text-xs text-ink/60 bg-ink/5 px-2 py-0.5 rounded-full whitespace-nowrap">{w.category}</span>
                </td>
                <td className="py-3 pr-3 text-xs text-ink/70 leading-relaxed">{w.why}</td>
                <td className="py-3 text-xs text-ink/70 leading-relaxed">{w.steal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-5">
          <p className="text-xs text-ink/40 font-sans">
            Showing {(page - 1) * PAGE_SIZE + 1}&ndash;{Math.min(page * PAGE_SIZE, WEBSITES.length)} of {WEBSITES.length} sites
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-2.5 py-1 rounded-lg text-xs font-sans font-medium bg-ink/8 text-ink/60 hover:bg-ink/15 disabled:opacity-40 disabled:hover:bg-ink/8 transition-colors"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-7 h-7 rounded-lg text-xs font-sans font-medium transition-colors ${page === p ? "bg-ink text-white" : "bg-ink/8 text-ink/50 hover:bg-ink/15"}`}>
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-2.5 py-1 rounded-lg text-xs font-sans font-medium bg-ink/8 text-ink/60 hover:bg-ink/15 disabled:opacity-40 disabled:hover:bg-ink/8 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <p className="mt-4 text-[11px] text-ink/40 font-sans leading-relaxed">
        Compiled July 2026. Sites redesign often &mdash; the &ldquo;why&rdquo; describes what each brand is famous for, which may predate the current live version.
      </p>
    </div>
  )
}

// ── Market tab ───────────────────────────────────────────────────────────────

const MARKET_TABS = ["Brand Positions", "Website"] as const
type MarketTab = (typeof MARKET_TABS)[number]

function MarketTab() {
  const [marketTab, setMarketTab] = useState<MarketTab>("Brand Positions")

  return (
    <div>
      <div className="border-b border-border mb-6 overflow-x-auto">
        <div className="flex gap-0 min-w-max">
          {MARKET_TABS.map(t => (
            <button key={t} onClick={() => setMarketTab(t)}
              className={`px-4 py-2.5 text-sm font-sans font-medium border-b-2 transition-colors whitespace-nowrap ${marketTab === t ? "border-ink text-ink" : "border-transparent text-ink/50 hover:text-ink"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>
      {marketTab === "Brand Positions" && <BrandPositioningTab />}
      {marketTab === "Website" && <WebsiteTab />}
    </div>
  )
}

// ── Branding tab ─────────────────────────────────────────────────────────────

type BrandIdea = {
  name: string
  tagline: string
  vibe: string
  meaning: string
  similar_words: string[]
}

const IDEAS = ideasRaw as BrandIdea[]

const IDEA_DIMENSIONS = ["Tagline", "Vibe", "Its Meaning", "Similar Vibe"] as const

function IdeasTab() {
  const [index, setIndex] = useState(0)
  const [view, setView] = useState<"Cards" | "Compare">("Cards")
  const idea = IDEAS[index]
  const prev = () => setIndex(i => (i - 1 + IDEAS.length) % IDEAS.length)
  const next = () => setIndex(i => (i + 1) % IDEAS.length)

  if (IDEAS.length === 0) {
    return (
      <p className="text-sm text-ink/40 font-sans py-8 text-center">
        No ideas shortlisted yet &mdash; brand directions under discussion.
      </p>
    )
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-5">
        <p className="text-xs text-ink/45 font-sans leading-relaxed">
          Name directions for chiku &mdash; the vibe and the meaning behind each.
        </p>
        <div className="flex gap-1 flex-shrink-0 bg-ink/6 rounded-full p-0.5">
          {(["Cards", "Compare"] as const).map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`px-3 py-1 rounded-full text-xs font-sans font-medium transition-colors ${view === v ? "bg-ink text-white" : "text-ink/50 hover:text-ink"}`}>
              {v}
            </button>
          ))}
        </div>
      </div>

      {view === "Cards" && (
        <>
          <div className="flex items-stretch gap-2 sm:gap-4">
            <button
              onClick={prev}
              aria-label="Previous idea"
              className="flex-shrink-0 self-center w-9 h-9 rounded-full bg-ink/8 text-ink/60 hover:bg-ink hover:text-white transition-colors flex items-center justify-center"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex-1 min-w-0 border border-border/40 rounded-xl overflow-hidden">
              <div className="px-5 pt-8 pb-6 bg-ink/[0.02] border-b border-border/30 text-center">
                <p className="text-[10px] font-heading font-bold text-ink/25 tracking-widest mb-2">{String(index + 1).padStart(2, "0")}</p>
                <h3 className="text-4xl sm:text-5xl font-heading font-bold text-ink tracking-tight">{idea.name}</h3>
                <p className="text-sm text-ink/50 font-sans italic mt-3">&ldquo;{idea.tagline}&rdquo;</p>
              </div>

              <div className="px-5 py-5 space-y-4">
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-ink/40 font-sans font-semibold mb-1">Vibe</p>
                  <p className="text-sm text-ink/70 font-sans leading-relaxed">{idea.vibe}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-ink/40 font-sans font-semibold mb-1">Its Meaning</p>
                  <p className="text-sm text-ink/70 font-sans leading-relaxed">{idea.meaning}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-ink/40 font-sans font-semibold mb-1.5">Words With Similar Vibe</p>
                  <div className="flex flex-wrap gap-1.5">
                    {idea.similar_words.map(w => (
                      <span key={w} className="text-xs font-sans text-ink/60 bg-ink/6 px-2.5 py-1 rounded-full">{w}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={next}
              aria-label="Next idea"
              className="flex-shrink-0 self-center w-9 h-9 rounded-full bg-ink/8 text-ink/60 hover:bg-ink hover:text-white transition-colors flex items-center justify-center"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Dots + counter */}
          <div className="flex items-center justify-center gap-3 mt-5">
            <div className="flex items-center gap-1.5">
              {IDEAS.map((it, i) => (
                <button
                  key={it.name}
                  onClick={() => setIndex(i)}
                  aria-label={`Go to idea ${i + 1}: ${it.name}`}
                  className={`rounded-full transition-all ${i === index ? "w-5 h-2 bg-ink" : "w-2 h-2 bg-ink/20 hover:bg-ink/40"}`}
                />
              ))}
            </div>
            <p className="text-xs text-ink/40 font-sans">{index + 1} / {IDEAS.length}</p>
          </div>
        </>
      )}

      {view === "Compare" && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-sans">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-2 pr-3 text-xs text-ink/50 font-medium whitespace-nowrap"></th>
                {IDEAS.map(it => (
                  <th key={it.name} className="pb-2 pr-4 text-sm text-ink font-heading font-bold min-w-[220px]">{it.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {IDEA_DIMENSIONS.map(dim => (
                <tr key={dim} className="border-b border-border/50 align-top">
                  <td className="py-3 pr-3 text-[10px] uppercase tracking-wide text-ink/40 font-semibold whitespace-nowrap">{dim}</td>
                  {IDEAS.map(it => (
                    <td key={it.name} className="py-3 pr-4 text-xs leading-relaxed text-ink/70">
                      {dim === "Tagline" && <span className="italic">&ldquo;{it.tagline}&rdquo;</span>}
                      {dim === "Vibe" && it.vibe}
                      {dim === "Its Meaning" && it.meaning}
                      {dim === "Similar Vibe" && (
                        <span className="flex flex-wrap gap-1">
                          {it.similar_words.map(w => (
                            <span key={w} className="bg-ink/6 px-2 py-0.5 rounded-full whitespace-nowrap">{w}</span>
                          ))}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

const BRANDING_TABS = ["Ideas"] as const
type BrandingTab = (typeof BRANDING_TABS)[number]

function BrandingSection() {
  const [brandingTab, setBrandingTab] = useState<BrandingTab>("Ideas")

  return (
    <div>
      <div className="border-b border-border mb-6 overflow-x-auto">
        <div className="flex gap-0 min-w-max">
          {BRANDING_TABS.map(t => (
            <button key={t} onClick={() => setBrandingTab(t)}
              className={`px-4 py-2.5 text-sm font-sans font-medium border-b-2 transition-colors whitespace-nowrap ${brandingTab === t ? "border-ink text-ink" : "border-transparent text-ink/50 hover:text-ink"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>
      {brandingTab === "Ideas" && <IdeasTab />}
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

const MAIN_TABS = ["Market", "Branding"] as const
type MainTab = (typeof MAIN_TABS)[number]

export default function ChikuPage() {
  const [mainTab, setMainTab] = useState<MainTab>("Market")

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-ink">Chiku</h1>
        <p className="text-sm text-ink/50 font-sans mt-1">Premium women&rsquo;s ethnic workwear &mdash; market research workspace</p>
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

      {mainTab === "Market" && <MarketTab />}
      {mainTab === "Branding" && <BrandingSection />}
    </div>
  )
}
