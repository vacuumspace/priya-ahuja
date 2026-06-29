"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import Link from "next/link"
import { grants, ALL_SECTORS, type StartupGrant, type GrantSector } from "@/lib/grants-data"

function SectorTabs({ active }: { active: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const counts: Record<string, number> = { All: grants.length }
  for (const s of ALL_SECTORS) {
    counts[s] = grants.filter((g) => g.sector === s).length
  }

  function setActive(sector: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (sector === "All") {
      params.delete("sector")
    } else {
      params.set("sector", sector)
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="flex items-center gap-2 pb-1 w-max">
      {["All", ...ALL_SECTORS].filter((s) => counts[s] > 0).map((sector) => (
        <button
          key={sector}
          onClick={() => setActive(sector)}
          className={`flex items-center gap-1.5 text-[13px] font-sans px-3 py-1.5 rounded-full border whitespace-nowrap transition-all flex-shrink-0 ${
            active === sector
              ? "bg-ink text-cream border-ink"
              : "bg-transparent text-ink/50 border-border hover:border-ink/30 hover:text-ink/70"
          }`}
        >
          {sector}
          <span className={`text-[11px] tabular-nums ${active === sector ? "opacity-60" : "opacity-50"}`}>
            {counts[sector]}
          </span>
        </button>
      ))}
    </div>
  )
}

function isDeadlineSoon(deadlineLabel: string): boolean {
  const match = deadlineLabel.match(/(\d{4}-\d{2}-\d{2})/)
  if (!match) return false
  const deadline = new Date(match[1])
  const daysLeft = (deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  return daysLeft > 0 && daysLeft <= 30
}

function GrantCard({ grant }: { grant: StartupGrant }) {
  const soon = isDeadlineSoon(grant.deadlineLabel)

  return (
    <Link href={`/fundraise/grants/${grant.slug}`}>
      <div className="bg-card border border-border rounded-2xl p-5 hover:border-peach-dark/40 hover:shadow-sm transition-all h-full flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-sans text-[11px] text-ink/40 uppercase tracking-wide mb-1">{grant.org}</p>
            <h3 className="font-heading text-base font-700 text-ink leading-tight">{grant.title}</h3>
          </div>
          {grant.featured && (
            <span className="flex-shrink-0 text-[10px] font-sans font-semibold uppercase tracking-wide bg-peach/60 text-peach-dark rounded px-2 py-0.5">
              Notable
            </span>
          )}
        </div>

        <p className="font-sans text-sm text-ink/60 leading-relaxed flex-1">{grant.description}</p>

        {grant.amountLabel && (
          <div className="inline-flex items-center gap-1.5 text-[12px] font-sans font-medium px-2.5 py-1 rounded-lg self-start bg-green-50 text-green-700 border border-green-100">
            <span>💰</span>
            <span>{grant.amountLabel}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-1 border-t border-border/50">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-sans px-2 py-0.5 rounded bg-green-50 text-green-700">{grant.sector}</span>
            <span className={`text-[11px] font-sans ${soon ? "text-red-500 font-medium" : "text-ink/30"}`}>
              {soon ? "⏰ " : ""}{grant.deadlineLabel}
            </span>
          </div>
          <span className="text-xs font-sans text-ink/40">view details →</span>
        </div>
      </div>
    </Link>
  )
}

export function GrantsClient({ lastRefreshed }: { activeSector?: string; lastRefreshed?: string }) {
  const searchParams = useSearchParams()
  const activeSector = searchParams.get("sector") ?? "All"

  const updatedLabel = lastRefreshed
    ? new Date(lastRefreshed).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : null
  const filtered = activeSector === "All"
    ? grants
    : grants.filter((g) => g.sector === (activeSector as GrantSector))

  return (
    <div className="min-w-0 overflow-hidden">
      {updatedLabel && (
        <div className="px-4 md:px-10 pt-3 pb-1 flex justify-end">
          <span className="text-[11px] font-sans text-ink/30">last updated: {updatedLabel}</span>
        </div>
      )}

      <div className="relative border-b border-border overflow-hidden">
        <div
          className="overflow-x-auto py-4 px-4 md:px-10 pb-3"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(128,128,128,0.25) transparent",
          }}
        >
          <SectorTabs active={activeSector} />
        </div>
        <div className="pointer-events-none absolute right-0 top-0 h-[calc(100%-6px)] w-16 bg-gradient-to-l from-cream to-transparent" />
      </div>

      <div className="px-4 md:px-10 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0">
          {filtered.map((grant) => (
            <GrantCard key={grant.slug} grant={grant} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="font-sans text-sm text-ink/40 text-center py-16">No grants in this sector yet.</p>
        )}
      </div>
    </div>
  )
}
