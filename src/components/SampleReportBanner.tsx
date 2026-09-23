"use client"

import { useState } from "react"
import { Eye, ChevronDown, ChevronUp } from "lucide-react"

// Collapsible "sample report" container shown on tool intro pages. The example
// report renders inside the amber frame so it can't be mistaken for real results,
// and stays hidden behind a "view" CTA until the user asks for it.
export default function SampleReportBanner({
  description = "a preview of what your report will look like - example data, not yours",
  children,
}: {
  description?: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="bg-amber-50 dark:bg-[#1C1710] border border-amber-200 dark:border-amber-900/30 rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center gap-3 px-4 py-3.5 sm:px-5 text-left hover:bg-amber-100/50 dark:hover:bg-amber-950/30 transition-colors"
      >
        <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/30 flex items-center justify-center flex-shrink-0">
          <Eye size={16} className="text-amber-700 dark:text-amber-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-heading text-base font-bold text-amber-950 dark:text-amber-100 lowercase leading-tight">sample report</p>
          <p className="font-sans text-[12px] text-amber-800/80 dark:text-amber-200/50 leading-relaxed">{description}</p>
        </div>
        <span className="flex-shrink-0 inline-flex items-center gap-1.5 bg-ink text-cream font-sans text-xs font-semibold px-4 py-2 rounded-xl">
          {open ? "hide" : "view"}
          {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </span>
      </button>

      {open && (
        <div className="px-3 pb-3 sm:px-4 sm:pb-4">
          <div className="flex justify-end mb-2">
            <span className="text-[10px] font-sans font-bold uppercase tracking-wide bg-amber-400/90 text-amber-950 px-2.5 py-1 rounded-full">
              example only
            </span>
          </div>
          <div className="rounded-2xl overflow-hidden ring-1 ring-amber-900/10 dark:ring-amber-100/5">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}
