"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { grants, ALL_SECTORS, type StartupGrant, type GrantSector } from "@/lib/grants-data"

const PAGE_SIZE = 10

function SectorFilter({ active }: { active: string }) {
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
    params.delete("page")
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const options = ["All", ...ALL_SECTORS].filter((s) => counts[s] > 0)

  return (
    <div className="relative inline-block">
      <select
        value={active}
        onChange={(e) => setActive(e.target.value)}
        style={{ backgroundColor: "var(--card)", color: "var(--card-foreground)", colorScheme: "light dark" }}
        className="appearance-none text-[13px] font-sans pl-3.5 pr-9 py-2 rounded-full border border-border hover:border-ink/30 focus:outline-none focus:border-ink/40 cursor-pointer"
      >
        {options.map((sector) => (
          <option
            key={sector}
            value={sector}
            style={{ backgroundColor: "var(--card)", color: "var(--card-foreground)" }}
          >
            {sector} ({counts[sector]})
          </option>
        ))}
      </select>
      <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink/40" />
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

function Pagination({ page, totalPages, compact = false }: { page: number; totalPages: number; compact?: boolean }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function goTo(p: number) {
    const params = new URLSearchParams(searchParams.toString())
    if (p <= 1) {
      params.delete("page")
    } else {
      params.set("page", String(p))
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (totalPages <= 1) return null

  const btnSize = compact ? "w-7 h-7" : "w-8 h-8"
  const textSize = compact ? "text-[12px]" : "text-[13px]"

  return (
    <div className={`flex items-center gap-3 ${compact ? "" : "justify-center pt-4"}`}>
      <button
        onClick={() => goTo(page - 1)}
        disabled={page <= 1}
        className={`flex items-center justify-center ${btnSize} rounded-lg border border-border text-ink/50 hover:text-ink hover:border-ink/30 disabled:opacity-30 disabled:hover:text-ink/50 disabled:hover:border-border transition-colors`}
        aria-label="Previous page"
      >
        <ChevronLeft size={14} />
      </button>

      <span className={`${textSize} font-sans text-ink/50 tabular-nums whitespace-nowrap`}>
        Page {page} of {totalPages}
      </span>

      <button
        onClick={() => goTo(page + 1)}
        disabled={page >= totalPages}
        className={`flex items-center justify-center ${btnSize} rounded-lg border border-border text-ink/50 hover:text-ink hover:border-ink/30 disabled:opacity-30 disabled:hover:text-ink/50 disabled:hover:border-border transition-colors`}
        aria-label="Next page"
      >
        <ChevronRight size={14} />
      </button>
    </div>
  )
}

export function GrantsClient({ lastRefreshed }: { activeSector?: string; lastRefreshed?: string }) {
  const searchParams = useSearchParams()
  const activeSector = searchParams.get("sector") ?? "All"
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1)

  const updatedLabel = lastRefreshed
    ? new Date(lastRefreshed).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : null
  const filtered = activeSector === "All"
    ? grants
    : grants.filter((g) => g.sector === (activeSector as GrantSector))

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <div className="min-w-0 overflow-hidden">
      {updatedLabel && (
        <div className="px-4 md:px-10 pt-3 pb-1 flex justify-end">
          <span className="text-[11px] font-sans text-ink/30">last updated: {updatedLabel}</span>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 px-4 md:px-10 py-4 border-b border-border">
        <SectorFilter active={activeSector} />
        <div className="overflow-x-auto max-w-full">
          <Pagination page={currentPage} totalPages={totalPages} compact />
        </div>
      </div>

      <div className="px-4 md:px-10 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0">
          {paginated.map((grant) => (
            <GrantCard key={grant.slug} grant={grant} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="font-sans text-sm text-ink/40 text-center py-16">No grants in this sector yet.</p>
        )}

        <Pagination page={currentPage} totalPages={totalPages} />
      </div>
    </div>
  )
}
