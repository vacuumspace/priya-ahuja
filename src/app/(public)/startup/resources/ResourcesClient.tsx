"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import Link from "next/link"
import { resources, ALL_CATEGORIES, getDealBadgeClass, type StartupResource, type ResourceCategory } from "@/lib/resources-data"

function CategoryTabs({ active }: { active: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function setActive(cat: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (cat === "All") {
      params.delete("category")
    } else {
      params.set("category", cat)
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="flex items-center gap-2 pb-1 w-max">
      {["All", ...ALL_CATEGORIES].map((cat) => (
        <button
          key={cat}
          onClick={() => setActive(cat)}
          className={`text-[13px] font-sans px-3 py-1.5 rounded-full border whitespace-nowrap transition-all flex-shrink-0 ${
            active === cat
              ? "bg-ink text-cream border-ink"
              : "bg-transparent text-ink/50 border-border hover:border-ink/30 hover:text-ink/70"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}

function ResourceCard({ resource }: { resource: StartupResource }) {
  return (
    <Link href={`/startup/resources/${resource.slug}`}>
      <div className="bg-card border border-border rounded-2xl p-5 hover:border-peach-dark/40 hover:shadow-sm transition-all h-full flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-sans text-[11px] text-ink/40 uppercase tracking-wide mb-1">{resource.category}</p>
            <h3 className="font-heading text-base font-700 text-ink leading-tight">{resource.name}</h3>
          </div>
          {resource.featured && (
            <span className="flex-shrink-0 text-[10px] font-sans font-semibold uppercase tracking-wide bg-peach/60 text-peach-dark rounded px-2 py-0.5">
              Top Pick
            </span>
          )}
        </div>

        <p className="font-sans text-sm text-ink/60 leading-relaxed flex-1">{resource.tagline}</p>

        {resource.deal && (
          <div className={`inline-flex items-center gap-1.5 text-[12px] font-sans font-medium px-2.5 py-1 rounded-lg self-start ${getDealBadgeClass(resource.dealType)}`}>
            <span>💰</span>
            <span>{resource.deal}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-1 border-t border-border/50">
          <span className="text-[11px] font-sans text-ink/30">{resource.dealType ?? "free tier"}</span>
          <span className="text-xs font-sans text-ink/40">view details →</span>
        </div>
      </div>
    </Link>
  )
}

export function ResourcesClient({ activeCategory }: { activeCategory: string }) {
  const filtered = activeCategory === "All"
    ? resources
    : resources.filter((r) => r.category === (activeCategory as ResourceCategory))

  return (
    <div className="min-w-0 overflow-hidden">
      <div className="relative border-b border-border overflow-hidden">
        <div
          className="overflow-x-auto py-4 px-4 md:px-10 pb-3"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(128,128,128,0.25) transparent",
          }}
        >
          <CategoryTabs active={activeCategory} />
        </div>
        <div className="pointer-events-none absolute right-0 top-0 h-[calc(100%-6px)] w-16 bg-gradient-to-l from-cream to-transparent" />
      </div>

      <div className="px-4 md:px-10 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0">
          {filtered.map((resource) => (
            <ResourceCard key={resource.slug} resource={resource} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="font-sans text-sm text-ink/40 text-center py-16">No resources in this category yet.</p>
        )}
      </div>
    </div>
  )
}
