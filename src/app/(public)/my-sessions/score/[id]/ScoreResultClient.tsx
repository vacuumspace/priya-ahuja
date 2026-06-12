"use client"

import Link from "next/link"
import { ArrowLeft, CheckCircle } from "lucide-react"
import {
  PILLARS,
  getTopRecommendations,
  type Answers,
} from "@/lib/startup-score-data"

type Props = {
  id: string
  totalScore: number
  pillarScores: Record<number, { earned: number; max: number }>
  answers: Answers
}

export default function ScoreResultClient({ totalScore, pillarScores, answers }: Props) {
  const recs = getTopRecommendations(answers, 3)
  const deg = (totalScore / 100) * 360

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <div className="flex items-center gap-2 mb-2">
        <Link
          href="/my-sessions?tab=tools"
          className="inline-flex items-center gap-1.5 text-[11px] font-sans text-ink/40 hover:text-ink/70 transition-colors"
        >
          <ArrowLeft size={12} /> back to my activity
        </Link>
      </div>

      {/* Overall score */}
      <div className="bg-card border border-border rounded-2xl p-5 sm:p-8 text-center">
        <p className="text-[10px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-6">
          startup fundability score
        </p>
        <div className="relative w-36 h-36 mx-auto mb-5">
          <div
            className="w-full h-full rounded-full"
            style={{
              background: `conic-gradient(#FFA07A ${deg}deg, #E8DFC8 ${deg}deg)`,
            }}
          />
          <div className="absolute inset-3 rounded-full bg-card flex items-center justify-center flex-col gap-0.5">
            <span className="font-heading text-3xl font-bold text-ink leading-none">{totalScore}</span>
            <span className="font-sans text-[10px] text-ink/35">out of 100</span>
          </div>
        </div>
      </div>

      {/* Segment breakdown */}
      <div className="bg-card border border-border rounded-2xl p-4 sm:p-6">
        <p className="text-[10px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-5">
          segment breakdown
        </p>
        <div className="space-y-4">
          {PILLARS.map((pillar, i) => {
            const ps = pillarScores[pillar.index] ?? { earned: 0, max: pillar.maxPoints }
            const pct = (ps.earned / ps.max) * 100
            return (
              <div key={pillar.index}>
                <div className="flex justify-between text-[11px] font-sans text-ink/60 mb-1.5">
                  <span>{pillar.title}</span>
                  <span>{ps.earned} / {ps.max}</span>
                </div>
                <div className="h-2 bg-border rounded-full">
                  <div
                    className="h-2 bg-peach-dark rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, transitionDelay: `${i * 60}ms` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recommendations */}
      {recs.length > 0 ? (
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-6">
          <p className="text-[10px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-5">
            top areas to work on
          </p>
          <div className="space-y-3">
            {recs.map((rec, i) => (
              <div
                key={i}
                className="flex gap-3 bg-peach/15 border border-peach-dark/15 rounded-xl p-4"
              >
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

      {/* Upsell */}
      <div className="bg-peach/30 border border-peach-dark/20 rounded-2xl p-6">
        <p className="font-heading text-lg font-bold text-ink lowercase mb-1">
          want to go deeper?
        </p>
        <p className="font-sans text-sm text-ink/60 leading-relaxed mb-5">
          book a startup idea brainstorming session with priya — turn your score into a concrete action plan.
        </p>
        <Link
          href="/connect"
          className="inline-flex items-center gap-2 bg-ink text-cream text-xs font-sans font-semibold px-5 py-2.5 rounded-xl hover:bg-ink/80 transition-colors"
        >
          book brainstorming session
        </Link>
      </div>

      {/* Disclaimer */}
      <div className="border-t border-border pt-5 pb-2">
        <p className="font-sans text-[10px] text-ink/30 leading-relaxed text-center max-w-md mx-auto">
          disclaimer: this score is for informational and self-reflection purposes only. it is not a guarantee of business success or failure. startup outcomes depend on many factors beyond what any quiz can measure. use this as one data point, not a definitive verdict.
        </p>
      </div>
    </div>
  )
}
