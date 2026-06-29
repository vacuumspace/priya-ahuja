"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, Check } from "lucide-react"

type SeriesPost = { slug: string; title: string; part: number }

type Props = {
  seriesName: string
  currentPart: number
  total: number
  seriesPosts: SeriesPost[]
}

export function SeriesDropdown({ seriesName, currentPart, total, seriesPosts }: Props) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const current = seriesPosts.find((p) => p.part === currentPart)

  return (
    <div className="mb-8 bg-amber-tag/40 border border-peach-dark/20 rounded-xl px-4 py-3 relative">
      <p className="font-sans text-[12px] text-ink/50 mb-0.5 uppercase tracking-wide">Series · Part {currentPart} of {total}</p>
      <p className="font-heading text-sm font-700 text-ink mb-2">{seriesName}</p>

      {/* Dropdown trigger */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between gap-2 w-full bg-cream/70 border border-peach-dark/20 rounded-lg px-3 py-2 text-left hover:border-peach-dark/50 transition-colors"
      >
        <span className="font-sans text-xs text-ink/70 truncate">
          <span className="text-ink/40 mr-1.5">{currentPart}.</span>
          {current?.title}
        </span>
        <ChevronDown
          size={13}
          className={`flex-shrink-0 text-ink/40 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown list */}
      {open && (
        <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-cream border border-border rounded-xl shadow-lg overflow-hidden mx-4">
          <div className="max-h-72 overflow-y-auto">
            {seriesPosts.map((p) => (
              <button
                key={p.slug}
                onClick={() => {
                  setOpen(false)
                  router.push(`/blog/${p.slug}`)
                }}
                className={`flex items-start gap-3 w-full px-4 py-3 text-left hover:bg-peach/20 transition-colors border-b border-border/50 last:border-0 ${
                  p.part === currentPart ? "bg-peach/10" : ""
                }`}
              >
                <span className="font-sans text-[12px] text-ink/30 w-4 flex-shrink-0 mt-0.5">{p.part}</span>
                <span className="font-sans text-xs text-ink/70 leading-snug flex-1">{p.title}</span>
                {p.part === currentPart && (
                  <Check size={11} className="text-peach-dark flex-shrink-0 mt-0.5" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
