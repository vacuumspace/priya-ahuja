"use client"

import Link from "next/link"
import { ArrowLeft, CheckCircle, ChevronDown, ChevronUp, Download } from "lucide-react"
import { useState } from "react"
import {
  PILLARS,
  QUESTIONS,
  getTopRecommendations,
  type Answers,
} from "@/lib/startup-score-data"

type Props = {
  id: string
  totalScore: number
  pillarScores: Record<number, { earned: number; max: number }>
  answers: Answers
}

function getScoreBand(score: number): { label: string; color: string; directional: string } {
  if (score >= 80) return {
    label: "investor-ready",
    color: "text-green-700",
    directional: "your fundamentals are strong. focus now on sharpening your pitch narrative and targeting the right investor pool. most startups at this level succeed or fail on story and timing, not substance.",
  }
  if (score >= 65) return {
    label: "almost there",
    color: "text-blue-700",
    directional: "you have solid foundations but a few gaps investors will probe. address the weak segments before you start pitching — one strong concern can kill an otherwise good meeting.",
  }
  if (score >= 50) return {
    label: "building blocks in place",
    color: "text-amber-700",
    directional: "there's real signal here but also meaningful gaps. investors at pre-seed can overlook some of these, but they'll want to see founder conviction and a clear path to closing the gaps in 6–12 months.",
  }
  if (score >= 35) return {
    label: "early stage, more to build",
    color: "text-orange-700",
    directional: "it's too early to pitch institutional investors. focus on validating the problem and building evidence — customer interviews, early traction, or a prototype. come back to fundraising when the score is above 50.",
  }
  return {
    label: "pre-validation",
    color: "text-red-700",
    directional: "the idea needs more grounding before it's pitchable. spend 2–3 months on customer discovery and problem validation. the goal right now is not to raise — it's to find out if the problem is real and whether people will pay.",
  }
}

function pillarColor(pct: number): string {
  if (pct >= 75) return "bg-green-400"
  if (pct >= 50) return "bg-peach-dark"
  if (pct >= 25) return "bg-amber-400"
  return "bg-red-400"
}

export default function ScoreResultClient({ totalScore, pillarScores, answers }: Props) {
  const recs = getTopRecommendations(answers, 3)
  const band = getScoreBand(totalScore)
  const deg = (totalScore / 100) * 360
  const [expandedPillar, setExpandedPillar] = useState<number | null>(null)

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <div className="flex items-center justify-between mb-2 print:hidden">
        <Link
          href="/my-sessions?tab=tools"
          className="inline-flex items-center gap-1.5 text-[11px] font-sans text-ink/40 hover:text-ink/70 transition-colors"
        >
          <ArrowLeft size={12} /> back to my activity
        </Link>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 text-[11px] font-sans text-ink/40 hover:text-ink/70 transition-colors border border-border rounded-lg px-3 py-1.5"
        >
          <Download size={11} /> save as PDF
        </button>
      </div>

      {/* ── Overall scorecard ── */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="bg-ink px-6 py-4">
          <p className="text-[10px] font-sans text-cream/40 uppercase tracking-[0.18em]">startup fundability score</p>
        </div>
        <div className="px-6 py-6 flex items-center gap-6">
          {/* Donut */}
          <div className="relative w-28 h-28 flex-shrink-0">
            <div
              className="w-full h-full rounded-full"
              style={{ background: `conic-gradient(#FFA07A ${deg}deg, #E8DFC8 ${deg}deg)` }}
            />
            <div className="absolute inset-2.5 rounded-full bg-card flex items-center justify-center flex-col">
              <span className="font-heading text-2xl font-bold text-ink leading-none">{totalScore}</span>
              <span className="font-sans text-[9px] text-ink/35">/ 100</span>
            </div>
          </div>
          {/* Band + directional */}
          <div className="flex-1">
            <span className={`font-sans text-xs font-semibold uppercase tracking-wide ${band.color}`}>{band.label}</span>
            <p className="font-sans text-[11px] text-ink/60 mt-2 leading-relaxed">{band.directional}</p>
          </div>
        </div>
        {/* Score scale bar */}
        <div className="px-6 pb-5">
          <div className="relative w-full h-2 bg-border rounded-full">
            <div className="h-2 bg-peach-dark rounded-full" style={{ width: `${totalScore}%` }} />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-ink border-2 border-cream shadow"
              style={{ left: `calc(${totalScore}% - 6px)` }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[9px] font-sans text-ink/30">0 · pre-validation</span>
            <span className="text-[9px] font-sans text-ink/30">100 · investor-ready</span>
          </div>
        </div>
      </div>

      {/* ── Segment breakdown (clickable to expand Q&A) ── */}
      <div className="bg-card border border-border rounded-2xl p-4 sm:p-6">
        <p className="text-[10px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-5">
          segment breakdown · tap to see your answers
        </p>
        <div className="space-y-3">
          {PILLARS.map((pillar) => {
            const ps = pillarScores[pillar.index] ?? { earned: 0, max: pillar.maxPoints }
            const pct = Math.round((ps.earned / ps.max) * 100)
            const isOpen = expandedPillar === pillar.index
            const pillarQuestions = QUESTIONS.filter((q) => q.pillarIndex === pillar.index)

            return (
              <div key={pillar.index} className="border border-border rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpandedPillar(isOpen ? null : pillar.index)}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-peach/10 transition-colors text-left"
                >
                  {/* Pill score */}
                  <span className={`flex-shrink-0 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full text-white ${pillarColor(pct)}`}>
                    {ps.earned}/{ps.max}
                  </span>
                  {/* Bar */}
                  <div className="flex-1 h-1.5 bg-border rounded-full">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-500 ${pillarColor(pct)}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs font-sans font-semibold text-ink/70 w-36 text-left">{pillar.title}</span>
                  {isOpen ? <ChevronUp size={13} className="text-ink/30 flex-shrink-0" /> : <ChevronDown size={13} className="text-ink/30 flex-shrink-0" />}
                </button>

                {/* Q&A for this pillar */}
                {isOpen && (
                  <div className="border-t border-border divide-y divide-border/60 bg-cream/50">
                    {pillarQuestions.map((q) => {
                      const optIdx = answers[q.id]
                      const chosen = optIdx !== undefined ? q.options[optIdx] : null
                      const maxPoints = q.options[2].points
                      const isMax = chosen?.points === maxPoints
                      return (
                        <div key={q.id} className="px-4 py-3">
                          <p className="font-sans text-[11px] text-ink/60 leading-snug mb-1.5">{q.text}</p>
                          {chosen ? (
                            <div className={`inline-flex items-center gap-1.5 text-[11px] font-sans font-semibold px-2.5 py-1 rounded-lg ${
                              isMax ? "bg-green-100 text-green-700" : chosen.points === 0 ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-700"
                            }`}>
                              {isMax ? <CheckCircle size={11} /> : null}
                              {chosen.label}
                              {chosen.sublabel && <span className="font-normal text-inherit/70">· {chosen.sublabel}</span>}
                            </div>
                          ) : (
                            <span className="text-[11px] font-sans text-ink/30">not answered</span>
                          )}
                          {/* Recommendation if any */}
                          {optIdx !== undefined && q.recommendationByOption[optIdx] && (
                            <p className="font-sans text-[10px] text-ink/45 mt-1.5 leading-relaxed border-l-2 border-peach-dark/30 pl-2">
                              {q.recommendationByOption[optIdx]}
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Top recommendations ── */}
      {recs.length > 0 ? (
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-6">
          <p className="text-[10px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-5">
            top areas to strengthen
          </p>
          <div className="space-y-3">
            {recs.map((rec, i) => (
              <div key={i} className="flex gap-3 bg-peach/15 border border-peach-dark/15 rounded-xl p-4">
                <span className="font-heading text-lg font-bold text-peach-dark/60 w-5 flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="font-sans text-sm text-ink/70 leading-relaxed">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 bg-peach/20 border border-peach-dark/20 rounded-xl px-5 py-4">
          <CheckCircle size={16} className="text-peach-dark flex-shrink-0" />
          <p className="font-sans text-sm text-ink/70">
            exceptional score — you&apos;ve addressed every key area.
          </p>
        </div>
      )}

      {/* ── Upsell ── */}
      <div className="bg-peach/30 border border-peach-dark/20 rounded-2xl p-6">
        <p className="font-heading text-lg font-bold text-ink lowercase mb-1">
          want to go deeper?
        </p>
        <p className="font-sans text-sm text-ink/60 leading-relaxed mb-5">
          book a 1:1 session with priya — turn your score into a concrete action plan.
        </p>
        <Link
          href="/connect"
          className="inline-flex items-center gap-2 bg-ink text-cream text-xs font-sans font-semibold px-5 py-2.5 rounded-xl hover:bg-ink/80 transition-colors"
        >
          book a session
        </Link>
      </div>

      {/* ── Disclaimer ── */}
      <div className="border-t border-border pt-5 pb-2">
        <p className="font-sans text-[10px] text-ink/30 leading-relaxed text-center max-w-md mx-auto">
          disclaimer: this score is for self-reflection only. it is not a guarantee of business success or failure. startup outcomes depend on many factors beyond what any quiz can measure. use this as one directional data point.
        </p>
      </div>
    </div>
  )
}
