"use client"

import { useState } from "react"
import { CheckCircle, AlertTriangle, HelpCircle, Quote, ListChecks, Sparkles, Eye } from "lucide-react"
import { getDeckScoreBand, deckDimensionColor, type PitchDeckReport } from "@/lib/pitch-deck-report"

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ")
}

const severityStyles: Record<string, string> = {
  critical: "bg-red-50 text-red-600 border-red-200",
  important: "bg-amber-50 text-amber-700 border-amber-200",
  polish: "bg-ink/5 text-ink/50 border-border",
}

const DIMENSION_LABELS: { key: keyof PitchDeckReport["dimensions"]; label: string; hint: string }[] = [
  { key: "story", label: "story & narrative", hint: "does the deck build a story an investor wants to finish?" },
  { key: "clarity", label: "clarity", hint: "one idea per slide, headlines that carry the takeaway" },
  { key: "evidence", label: "evidence & credibility", hint: "claims backed by numbers, proof placed early" },
  { key: "design", label: "design & readability", hint: "does the deck communicate visually?" },
]

export default function PitchDeckReportView({ report, fileName }: { report: PitchDeckReport; fileName?: string }) {
  const band = getDeckScoreBand(report.overallScore)
  const deg = (report.overallScore / 100) * 360
  const [expandedSection, setExpandedSection] = useState<number | null>(null)

  const presentCount = report.sections.filter((s) => s.present).length

  return (
    <div className="space-y-5">
      {/* ── Overall score ── */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="bg-ink px-6 py-4 flex items-center justify-between gap-3">
          <p className="text-[12px] font-sans text-cream/40 uppercase tracking-[0.18em]">pitch deck analysis</p>
          {fileName && <p className="text-[11px] font-sans text-cream/30 truncate max-w-[45%]">{fileName}</p>}
        </div>
        <div className="px-6 py-6 flex flex-col sm:flex-row items-center gap-6">
          <div className="relative w-32 h-32 flex-shrink-0">
            <div className="w-full h-full rounded-full" style={{ background: `conic-gradient(#FFA07A ${deg}deg, #E8DFC8 ${deg}deg)` }} />
            <div className="absolute inset-3 rounded-full bg-card flex items-center justify-center flex-col">
              <span className="font-heading text-3xl font-bold text-ink leading-none">{report.overallScore}</span>
              <span className="font-sans text-[10px] text-ink/35">/ 100</span>
            </div>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <span className={`font-sans text-xs font-semibold uppercase tracking-wide ${band.color}`}>{band.label}</span>
            <p className="font-sans text-[13px] text-ink/60 mt-2 leading-relaxed">{band.directional}</p>
          </div>
        </div>
        <div className="px-6 pb-5">
          <div className="relative w-full h-2 bg-border rounded-full">
            <div className="h-2 bg-peach-dark rounded-full" style={{ width: `${report.overallScore}%` }} />
            <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-ink border-2 border-cream shadow" style={{ left: `calc(${report.overallScore}% - 6px)` }} />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[9px] font-sans text-ink/30">0 · not pitch-ready</span>
            <span className="text-[9px] font-sans text-ink/30">100 · vc-ready story</span>
          </div>
        </div>
      </div>

      {/* ── Verdict ── */}
      <div className="bg-card border border-border rounded-2xl p-5 sm:p-6">
        <p className="text-[12px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-3">the honest verdict</p>
        <p className="font-sans text-sm text-ink/75 leading-relaxed">{report.verdict}</p>
      </div>

      {/* ── Deck snapshot ── */}
      <div className="bg-card border border-border rounded-2xl p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-1">
          <Eye size={14} className="text-peach-dark" />
          <p className="text-[12px] font-sans text-ink/30 uppercase tracking-[0.18em]">what an investor took away</p>
        </div>
        <p className="font-sans text-[12px] text-ink/40 mb-4 leading-relaxed">
          this is what your deck communicated on a first read. if anything below is wrong or fuzzy, your deck - not the reader - is the problem.
        </p>
        <div className="rounded-xl border border-border overflow-hidden">
          {[
            ["company", report.deckSnapshot.company],
            ["what you do", report.deckSnapshot.oneLiner],
            ["stage", report.deckSnapshot.stage],
            ["sector", report.deckSnapshot.sector],
            ["the ask", report.deckSnapshot.ask],
          ].map(([label, value]) => (
            <div key={label} className="grid grid-cols-[110px_1fr] px-4 py-2.5 border-b border-border/50 last:border-0">
              <span className="font-sans text-xs text-ink/35">{label}</span>
              <span className="font-sans text-[13px] text-ink/75 leading-relaxed">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Dimensions ── */}
      <div className="bg-card border border-border rounded-2xl p-5 sm:p-6">
        <p className="text-[12px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-4">how your story holds up</p>
        <div className="space-y-5">
          {DIMENSION_LABELS.map(({ key, label, hint }) => {
            const d = report.dimensions[key]
            const pct = (d.score / 10) * 100
            return (
              <div key={key}>
                <div className="flex justify-between items-baseline mb-1.5">
                  <span className="font-sans text-[13px] font-semibold text-ink/75">{label}</span>
                  <span className="font-sans text-xs text-ink/45">{d.score} / 10</span>
                </div>
                <div className="h-2 bg-border rounded-full mb-2">
                  <div className={`h-2 rounded-full transition-all duration-700 ${deckDimensionColor(d.score)}`} style={{ width: `${pct}%` }} />
                </div>
                <p className="font-sans text-[12px] text-ink/50 leading-relaxed">{d.assessment || hint}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Section-by-section ── */}
      <div className="bg-card border border-border rounded-2xl p-4 sm:p-6">
        <p className="text-[12px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-1">the {report.sections.length} sections investors look for</p>
        <p className="font-sans text-[12px] text-ink/40 mb-4">{presentCount} of {report.sections.length} covered in your deck · tap a section for feedback</p>
        <div className="space-y-2">
          {report.sections.map((s, i) => {
            const isOpen = expandedSection === i
            const pct = (s.score / 10) * 100
            return (
              <div key={s.name} className="border border-border rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpandedSection(isOpen ? null : i)}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-peach/10 transition-colors text-left"
                >
                  <span className={cn(
                    "flex-shrink-0 text-[12px] font-mono font-semibold px-2 py-0.5 rounded-full",
                    s.present ? `text-white ${deckDimensionColor(s.score)}` : "bg-red-50 text-red-500 border border-red-200"
                  )}>
                    {s.present ? `${s.score}/10` : "missing"}
                  </span>
                  <div className="flex-1 h-1.5 bg-border rounded-full">
                    <div className={`h-1.5 rounded-full ${s.present ? deckDimensionColor(s.score) : "bg-red-300"}`} style={{ width: `${s.present ? pct : 0}%` }} />
                  </div>
                  <span className="text-xs font-sans font-semibold text-ink/70 w-32 sm:w-40 text-left leading-tight">{s.name}</span>
                  <span className="text-ink/30 text-xs flex-shrink-0">{isOpen ? "▲" : "▼"}</span>
                </button>
                {isOpen && (
                  <div className="border-t border-border bg-cream/50 px-4 py-3">
                    {s.slideRef && (
                      <p className="font-sans text-[11px] text-ink/35 uppercase tracking-wide mb-1.5">{s.slideRef}</p>
                    )}
                    <p className="font-sans text-[13px] text-ink/65 leading-relaxed">{s.feedback}</p>
                    {s.fix && (
                      <p className="font-sans text-[12px] text-ink/55 leading-relaxed border-l-2 border-peach-dark/40 pl-2.5 mt-2.5">
                        <span className="font-semibold text-ink/70">fix: </span>{s.fix}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Strengths ── */}
      {report.strengths.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle size={14} className="text-green-600" />
            <p className="text-[12px] font-sans text-ink/30 uppercase tracking-[0.18em]">what&apos;s working - don&apos;t touch these</p>
          </div>
          <div className="space-y-2.5">
            {report.strengths.map((s, i) => (
              <div key={i} className="flex gap-2.5 items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0 mt-1.5" />
                <p className="font-sans text-[13px] text-ink/70 leading-relaxed">{s}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Improvement areas ── */}
      {report.improvements.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={14} className="text-peach-dark" />
            <p className="text-[12px] font-sans text-ink/30 uppercase tracking-[0.18em]">improvement areas</p>
          </div>
          <div className="space-y-3">
            {report.improvements.map((imp, i) => (
              <div key={i} className="border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className={`text-[11px] font-sans font-semibold px-2 py-0.5 rounded-full border ${severityStyles[imp.severity]}`}>
                    {imp.severity}
                  </span>
                  <p className="font-sans text-[13px] font-semibold text-ink">{imp.title}</p>
                </div>
                <p className="font-sans text-[12px] text-ink/50 leading-relaxed mb-1.5">{imp.why}</p>
                <p className="font-sans text-[13px] text-ink/70 leading-relaxed border-l-2 border-peach-dark/40 pl-2.5">{imp.how}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Red flags ── */}
      {report.redFlags.length > 0 && (
        <div className="bg-card border border-red-200 rounded-2xl p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={14} className="text-red-500" />
            <p className="text-[12px] font-sans text-red-500/70 uppercase tracking-[0.18em]">silent deal-killers</p>
          </div>
          <p className="font-sans text-[12px] text-ink/40 mb-4 leading-relaxed">
            investors rarely tell you these - they just don&apos;t reply.
          </p>
          <div className="space-y-2.5">
            {report.redFlags.map((flag, i) => (
              <div key={i} className="flex gap-2.5 items-start bg-red-50/50 border border-red-100 rounded-xl px-4 py-3">
                <span className="font-heading text-sm font-bold text-red-400 flex-shrink-0">!</span>
                <p className="font-sans text-[13px] text-ink/70 leading-relaxed">{flag}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Investor questions ── */}
      {report.investorQuestions.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-1">
            <HelpCircle size={14} className="text-peach-dark" />
            <p className="text-[12px] font-sans text-ink/30 uppercase tracking-[0.18em]">questions your deck doesn&apos;t answer</p>
          </div>
          <p className="font-sans text-[12px] text-ink/40 mb-4 leading-relaxed">
            you&apos;ll get these in the meeting. prepare answers - or better, answer them in the deck.
          </p>
          <div className="space-y-2.5">
            {report.investorQuestions.map((q, i) => (
              <div key={i} className="flex gap-3 items-start border border-border rounded-xl px-4 py-3">
                <span className="font-heading text-sm font-bold text-peach-dark/60 flex-shrink-0">Q{i + 1}</span>
                <p className="font-sans text-[13px] text-ink/70 leading-relaxed italic">&ldquo;{q}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Story rewrites ── */}
      {report.rewrites.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-1">
            <Quote size={14} className="text-peach-dark" />
            <p className="text-[12px] font-sans text-ink/30 uppercase tracking-[0.18em]">story rewrites</p>
          </div>
          <p className="font-sans text-[12px] text-ink/40 mb-4 leading-relaxed">
            your weakest lines, rewritten the way an investor needs to read them - using your own facts.
          </p>
          <div className="space-y-4">
            {report.rewrites.map((r, i) => (
              <div key={i} className="border border-border rounded-xl overflow-hidden">
                <p className="font-sans text-[11px] text-ink/40 uppercase tracking-wide px-4 pt-3">{r.slide}</p>
                <div className="px-4 py-3 space-y-2.5">
                  <div className="bg-red-50/60 border border-red-100 rounded-lg px-3 py-2.5">
                    <p className="font-sans text-[10px] text-red-400 uppercase tracking-wide mb-1">your deck says</p>
                    <p className="font-sans text-[13px] text-ink/60 leading-relaxed line-through decoration-red-300/60">{r.current}</p>
                  </div>
                  <div className="bg-green-50/60 border border-green-100 rounded-lg px-3 py-2.5">
                    <p className="font-sans text-[10px] text-green-600 uppercase tracking-wide mb-1">make it say</p>
                    <p className="font-sans text-[13px] font-medium text-ink/80 leading-relaxed">{r.suggested}</p>
                  </div>
                  <p className="font-sans text-[12px] text-ink/45 leading-relaxed">{r.why}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Action plan ── */}
      {report.actionPlan.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <ListChecks size={14} className="text-peach-dark" />
            <p className="text-[12px] font-sans text-ink/30 uppercase tracking-[0.18em]">your fix list - this week, in this order</p>
          </div>
          <div className="space-y-3">
            {report.actionPlan.map((step, i) => (
              <div key={i} className="flex gap-3 bg-peach/15 border border-peach-dark/15 rounded-xl p-4">
                <span className="font-heading text-lg font-bold text-peach-dark/60 w-5 flex-shrink-0 mt-0.5">{i + 1}</span>
                <p className="font-sans text-sm text-ink/70 leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Report footer: brand + disclaimer (included in saved PDFs) ── */}
      <div className="border-t border-border pt-5 pb-2">
        <div className="flex items-baseline justify-between gap-3 mb-3">
          <p className="font-heading text-sm font-bold text-ink">Priya Ahuja · Pitch Deck Analyser</p>
          <p className="font-sans text-[11px] text-ink/40">priyaahuja.in/fundraise/tools/pitch-deck-analyser</p>
        </div>
        <p className="font-sans text-[11px] text-ink/40 mb-3">
          report generated by AI analysis · questions or feedback: hi@priyaahuja.in
        </p>
        <p className="font-sans text-[11px] text-ink/35 leading-relaxed">
          disclaimer: this AI-generated analysis is for informational purposes only. it is not investment, legal, or financial advice, and no guarantee of fundraising outcomes is made or implied. investors weigh many factors beyond the deck. use this report as one honest data point, not a verdict.
        </p>
      </div>
    </div>
  )
}
