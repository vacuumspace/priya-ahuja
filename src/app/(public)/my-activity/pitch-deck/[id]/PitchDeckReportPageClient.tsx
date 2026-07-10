"use client"

import Link from "next/link"
import { ArrowLeft, Download } from "lucide-react"
import PitchDeckReportView from "@/components/pitch-deck/PitchDeckReportView"
import type { PitchDeckReport } from "@/lib/pitch-deck-report"

export default function PitchDeckReportPageClient({ report, fileName }: { report: PitchDeckReport; fileName: string }) {
  return (
    <div className="max-w-xl mx-auto space-y-5">
      <div className="flex items-center justify-between mb-2 print:hidden">
        <Link
          href="/my-activity?tab=tools&sub=pitchdeck"
          className="inline-flex items-center gap-1.5 text-[13px] font-sans text-ink/40 hover:text-ink/70 transition-colors"
        >
          <ArrowLeft size={12} /> back to my activity
        </Link>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 text-[13px] font-sans text-ink/40 hover:text-ink/70 transition-colors border border-border rounded-lg px-3 py-1.5"
        >
          <Download size={11} /> save as PDF
        </button>
      </div>

      <PitchDeckReportView report={report} fileName={fileName} />
    </div>
  )
}
