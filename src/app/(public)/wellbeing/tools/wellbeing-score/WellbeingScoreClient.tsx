"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, RotateCcw, CheckCircle } from "lucide-react"
import SignInOptions from "@/components/SignInOptions"
import SampleReportBanner from "@/components/SampleReportBanner"
import {
  WELLBEING_CATEGORIES,
  WELLBEING_QUESTIONS,
  getWellbeingTopTips,
  getWellbeingBand,
  type Answers,
  type OptionValue,
} from "@/lib/wellbeing-score-data"

type ResultData = {
  totalScore: number
  categoryScores: Record<number, { earned: number; max: number }>
}

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ")
}

// ── Sample Scorecard ──────────────────────────────────────────────────────────

const SAMPLE_WELLBEING_SCORE = 54
const SAMPLE_WELLBEING_CATEGORIES = [
  { title: "sleep & energy", earned: 7, max: 15 },
  { title: "stress & coping", earned: 9, max: 15 },
  { title: "relationships & support", earned: 8, max: 15 },
  { title: "purpose & identity", earned: 8, max: 15 },
  { title: "financial anxiety", earned: 6, max: 15 },
  { title: "work-life boundaries", earned: 7, max: 15 },
  { title: "physical health", earned: 8, max: 15 },
  { title: "emotional regulation", earned: 8, max: 15 },
  { title: "leadership & team pressure", earned: 9, max: 15 },
  { title: "hope & future outlook", earned: 8, max: 15 },
]
const SAMPLE_WELLBEING_TIPS = [
  "zero days off is the single biggest predictor of founder burnout. even 24 hours fully offline recalibrates you more than people expect.",
  "the loneliness of final-call decisions is one of the most under-discussed parts of founding a company. a founder peer group or mentor relationship makes a measurable difference.",
  "avoiding your personal runway number usually makes the anxiety louder, not quieter. a 20-minute exercise with your actual expenses will likely give you more clarity than weeks of vague worry.",
]

function wellbeingBarColor(pct: number) {
  if (pct >= 75) return "bg-green-400"
  if (pct >= 50) return "bg-peach-dark"
  if (pct >= 25) return "bg-amber-400"
  return "bg-red-400"
}

function SampleWellbeingScorecard({ userEmail }: { userEmail: string | null }) {
  const isSignedIn = !!userEmail
  const [showSignIn, setShowSignIn] = useState(false)
  const deg = (SAMPLE_WELLBEING_SCORE / 100) * 360
  const band = getWellbeingBand(SAMPLE_WELLBEING_SCORE)

  return (
    <SampleReportBanner description="how your wellbeing scorecard will look - example answers, not yours">
      <div className={cn("relative", !isSignedIn && "select-none")}>
        <div className={cn(!isSignedIn && "blur-sm pointer-events-none")}>
          <div className="bg-card border border-border rounded-2xl overflow-hidden mb-4">
            <div className="bg-ink px-6 py-4">
              <p className="text-[12px] font-sans text-cream/40 uppercase tracking-[0.18em]">founder wellbeing score</p>
            </div>
            <div className="px-6 py-6 flex items-center gap-6">
              <div className="relative w-28 h-28 flex-shrink-0">
                <div className="w-full h-full rounded-full" style={{ background: `conic-gradient(#FFA07A ${deg}deg, #E8DFC8 ${deg}deg)` }} />
                <div className="absolute inset-2.5 rounded-full bg-card flex items-center justify-center flex-col">
                  <span className="font-heading text-2xl font-bold text-ink leading-none">{SAMPLE_WELLBEING_SCORE}</span>
                  <span className="font-sans text-[9px] text-ink/35">/ 100</span>
                </div>
              </div>
              <div className="flex-1">
                <span className={`font-sans text-xs font-semibold uppercase tracking-wide ${band.color}`}>{band.label}</span>
                <p className="font-sans text-[13px] text-ink/60 mt-2 leading-relaxed">{band.directional}</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 mb-4">
            <p className="text-[12px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-4">category breakdown</p>
            <div className="space-y-3">
              {SAMPLE_WELLBEING_CATEGORIES.map((c, i) => {
                const pct = Math.round((c.earned / c.max) * 100)
                return (
                  <div key={i}>
                    <div className="flex justify-between text-[13px] font-sans text-ink/60 mb-1.5">
                      <span>{c.title}</span>
                      <span>{c.earned} / {c.max}</span>
                    </div>
                    <div className="h-2 bg-border rounded-full">
                      <div className={`h-2 rounded-full ${wellbeingBarColor(pct)}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-4 sm:p-6">
            <p className="text-[12px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-4">top things to work on</p>
            <div className="space-y-3">
              {SAMPLE_WELLBEING_TIPS.map((tip, i) => (
                <div key={i} className="flex gap-3 bg-peach/15 border border-peach-dark/15 rounded-xl p-4">
                  <span className="font-heading text-lg font-bold text-peach-dark/60 w-5 flex-shrink-0 mt-0.5">{i + 1}</span>
                  <p className="font-sans text-base text-ink/70 leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {!isSignedIn && (
          <div className="absolute inset-0 flex items-start justify-center pt-6">
            <div className="bg-cream/95 border border-border rounded-2xl px-6 py-5 text-center shadow-sm max-w-xs mx-4">
              <p className="font-heading text-base font-bold text-ink lowercase mb-1">see a sample report</p>
              <p className="font-sans text-xs text-ink/55 leading-relaxed mb-4">sign in to preview what your scorecard will look like.</p>
              {showSignIn ? (
                <SignInOptions callbackUrl="/wellbeing/tools/wellbeing-score" compact googleLabel="sign in to preview" />
              ) : (
                <button
                  onClick={() => setShowSignIn(true)}
                  className="inline-flex items-center gap-2 bg-ink text-cream font-sans text-xs font-semibold px-5 py-2.5 rounded-xl hover:bg-ink/80 transition-colors"
                >
                  sample report
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </SampleReportBanner>
  )
}

// ── Intro ─────────────────────────────────────────────────────────────────────

function IntroView({ userEmail, onStart }: { userEmail: string | null; onStart: () => void }) {
  const isSignedIn = !!userEmail

  const startButton = (className?: string) => (
    <button
      onClick={isSignedIn ? onStart : () => signIn("google", { callbackUrl: "/wellbeing/tools/wellbeing-score" })}
      className={cn(
        "w-full inline-flex items-center justify-center gap-2 bg-ink text-cream font-sans text-base font-bold px-6 py-4 rounded-xl hover:bg-ink/80 transition-colors shadow-md",
        className
      )}
    >
      {isSignedIn ? "start the scorecard" : "sign in to start"}
      <ArrowRight size={18} />
    </button>
  )

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <div className="bg-card border border-border rounded-2xl p-5 sm:p-8">
        <p className="text-[12px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-5">
          50 questions · 10 categories · 100% free
        </p>
        <h1 className="font-heading text-3xl font-bold text-ink mb-3 lowercase">
          founder wellbeing scorecard
        </h1>
        <p className="font-sans text-sm text-ink/60 leading-relaxed mb-3">
          burnout doesn&apos;t announce itself - it creeps up through sleep debt, isolation, and a slowly fusing sense of identity with the company. this free scorecard gives you an honest read on where you stand.
        </p>
        <p className="font-sans text-sm text-ink/60 leading-relaxed mb-6">
          50 questions across 10 categories: sleep & energy, stress & coping, relationships & support, purpose & identity, financial anxiety, work-life boundaries, physical health, emotional regulation, leadership & team pressure, and hope & future outlook. no payment, no report is sold to you - just an honest score and a few concrete things to work on.
        </p>

        {startButton("mb-7")}

        {/* Category table */}
        <div className="rounded-xl border border-border overflow-hidden mb-2">
          <div className="grid grid-cols-2 text-[12px] font-sans text-ink/35 uppercase tracking-widest px-4 py-2 bg-peach/20 border-b border-border">
            <span>category</span>
            <span className="text-right">questions</span>
          </div>
          {WELLBEING_CATEGORIES.map((c) => (
            <div
              key={c.index}
              className="grid grid-cols-2 px-4 py-2.5 border-b border-border/50 last:border-0"
            >
              <span className="font-sans text-xs text-ink/70">{c.title}</span>
              <span className="font-sans text-xs text-ink/40 text-right">{c.questionIds.length}</span>
            </div>
          ))}
          <div className="grid grid-cols-2 px-4 py-2.5 bg-peach/10">
            <span className="font-sans text-xs font-semibold text-ink">total</span>
            <span className="font-sans text-xs font-semibold text-ink text-right">50</span>
          </div>
        </div>
      </div>

      {isSignedIn && (
        <p className="text-[12px] font-sans text-ink/30 text-center">
          signed in as {userEmail}
        </p>
      )}

      <SampleWellbeingScorecard userEmail={userEmail} />

      <div className="border-t border-border pt-5 pb-2">
        <p className="font-sans text-[12px] text-ink/30 leading-relaxed text-center max-w-md mx-auto">
          disclaimer: this scorecard is a self-reflection tool, not a clinical diagnostic. it cannot assess mental health conditions. if you&apos;re struggling, please talk to a doctor, therapist, or someone you trust.
        </p>
      </div>
    </div>
  )
}

// ── Option Card ───────────────────────────────────────────────────────────────

function OptionCard({
  label,
  selected,
  onClick,
}: {
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-xl border px-3 py-2.5 transition-all duration-150 select-none",
        selected
          ? "bg-peach/30 border-peach-dark ring-1 ring-peach-dark/40"
          : "bg-card border-border hover:border-peach-dark/40 hover:bg-peach/10"
      )}
    >
      <p className="font-sans font-semibold text-[13px] text-ink">{label}</p>
    </div>
  )
}

// ── Quiz ──────────────────────────────────────────────────────────────────────

function QuizView({
  step,
  answers,
  onAnswer,
  onBack,
  onNext,
  submitting,
}: {
  step: number
  answers: Answers
  onAnswer: (qId: number, val: OptionValue) => void
  onBack: () => void
  onNext: () => void
  submitting: boolean
}) {
  const category = WELLBEING_CATEGORIES[step]
  const questions = category.questionIds.map((id) => WELLBEING_QUESTIONS.find((q) => q.id === id)!)
  const allAnswered = category.questionIds.every((id) => answers[id] !== undefined)
  const isLast = step === WELLBEING_CATEGORIES.length - 1
  const totalAnswered = Object.keys(answers).length

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <p key={step} className="text-[12px] font-sans text-ink/40 animate-in fade-in duration-300">
            category {step + 1} of {WELLBEING_CATEGORIES.length} ·{" "}
            <span className="font-semibold text-ink/70 bg-peach/40 px-1 py-0.5 rounded animate-in fade-in duration-500">
              {category.title}
            </span>
          </p>
          <p className="text-[12px] font-sans text-ink/30">
            {totalAnswered} / 50 answered
          </p>
        </div>
        <div
          role="progressbar"
          aria-valuenow={Math.round(((step + 1) / WELLBEING_CATEGORIES.length) * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Quiz progress: category ${step + 1} of ${WELLBEING_CATEGORIES.length}`}
          className="w-full bg-border rounded-full h-1.5"
        >
          <div
            className="bg-peach-dark rounded-full h-1.5 transition-all duration-500"
            style={{ width: `${((step + 1) / WELLBEING_CATEGORIES.length) * 100}%` }}
          />
        </div>
      </div>

      <div key={step} className="animate-in fade-in duration-300 space-y-7">
        {questions.map((q) => (
          <div key={q.id}>
            <p className="font-sans text-sm font-medium text-ink mb-3 leading-relaxed">
              {q.text}
            </p>
            <div className="space-y-2">
              {q.options.map((opt, idx) => (
                <OptionCard
                  key={idx}
                  label={opt.label}
                  selected={answers[q.id] === idx}
                  onClick={() => onAnswer(q.id, idx as OptionValue)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-sans text-ink/50 hover:text-ink transition-colors"
        >
          <ArrowLeft size={14} /> back
        </button>

        <button
          onClick={onNext}
          disabled={!allAnswered || submitting}
          className={cn(
            "inline-flex items-center gap-2 font-sans text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors",
            allAnswered && !submitting
              ? "bg-ink text-cream hover:bg-ink/80"
              : "bg-ink/20 text-ink/40 cursor-not-allowed"
          )}
        >
          {submitting ? "scoring…" : isLast ? "get my score" : "next"}
        </button>
      </div>
    </div>
  )
}

// ── Results ───────────────────────────────────────────────────────────────────

function ResultsView({
  result,
  answers,
  onReset,
}: {
  result: ResultData
  answers: Answers
  onReset: () => void
}) {
  const tips = getWellbeingTopTips(answers, 3)
  const band = getWellbeingBand(result.totalScore)
  const deg = (result.totalScore / 100) * 360

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <div className="bg-card border border-border rounded-2xl p-5 sm:p-8 text-center">
        <p className="text-[12px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-6">
          founder wellbeing score
        </p>
        <div className="relative w-36 h-36 mx-auto mb-5">
          <div
            className="w-full h-full rounded-full"
            style={{ background: `conic-gradient(#FFA07A ${deg}deg, #E8DFC8 ${deg}deg)` }}
          />
          <div className="absolute inset-3 rounded-full bg-card flex items-center justify-center flex-col gap-0.5">
            <span className="font-heading text-3xl font-bold text-ink leading-none">{result.totalScore}</span>
            <span className="font-sans text-[12px] text-ink/35">out of 100</span>
          </div>
        </div>
        <span className={`font-sans text-xs font-semibold uppercase tracking-wide ${band.color}`}>{band.label}</span>
        <p className="font-sans text-sm text-ink/60 mt-2 leading-relaxed">{band.directional}</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-4 sm:p-6">
        <p className="text-[12px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-5">
          category breakdown
        </p>
        <div className="space-y-4">
          {WELLBEING_CATEGORIES.map((cat, i) => {
            const cs = result.categoryScores[cat.index] ?? { earned: 0, max: cat.maxPoints }
            const pct = (cs.earned / cs.max) * 100
            return (
              <div key={cat.index}>
                <div className="flex justify-between text-[13px] font-sans text-ink/60 mb-1.5">
                  <span>{cat.title}</span>
                  <span>{cs.earned} / {cs.max}</span>
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

      {tips.length > 0 ? (
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-6">
          <p className="text-[12px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-5">
            top things to work on
          </p>
          <div className="space-y-3">
            {tips.map((tip, i) => (
              <div key={i} className="flex gap-3 bg-peach/15 border border-peach-dark/15 rounded-xl p-4">
                <span className="font-heading text-lg font-bold text-peach-dark/60 w-5 flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="font-sans text-base text-ink/70 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 bg-peach/20 border border-peach-dark/20 rounded-xl px-5 py-4">
          <CheckCircle size={16} className="text-peach-dark flex-shrink-0" />
          <p className="font-sans text-sm text-ink/70">
            strong fundamentals across the board - keep protecting what&apos;s working.
          </p>
        </div>
      )}

      <div className="bg-peach/30 border border-peach-dark/20 rounded-2xl p-6">
        <p className="font-heading text-lg font-bold text-ink lowercase mb-1">
          want to talk it through?
        </p>
        <p className="font-sans text-sm text-ink/60 leading-relaxed mb-5">
          book a 1:1 session with priya to talk through what&apos;s actually driving the pressure - not just the business plan.
        </p>
        <Link
          href="/connect"
          className="inline-flex items-center gap-2 bg-ink text-cream text-xs font-sans font-semibold px-5 py-2.5 rounded-xl hover:bg-ink/80 transition-colors"
        >
          book a session
        </Link>
      </div>

      <div className="text-center pb-4">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 text-[13px] font-sans text-ink/35 hover:text-ink/60 transition-colors"
        >
          <RotateCcw size={11} /> take it again
        </button>
      </div>

      <div className="border-t border-border pt-5 pb-2">
        <p className="font-sans text-[12px] text-ink/30 leading-relaxed text-center max-w-md mx-auto">
          disclaimer: this scorecard is a self-reflection tool, not a clinical diagnostic. it cannot assess mental health conditions. if you&apos;re struggling, please talk to a doctor, therapist, or someone you trust.
        </p>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function WellbeingScoreClient({ userEmail }: { userEmail: string | null }) {
  const [view, setView] = useState<"intro" | "quiz" | "results">("intro")
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [result, setResult] = useState<ResultData | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")

  function handleAnswer(qId: number, val: OptionValue) {
    setAnswers((prev) => ({ ...prev, [qId]: val }))
  }

  function handleBack() {
    if (view === "quiz" && step === 0) { setView("intro"); return }
    if (view === "quiz" && step > 0) { setStep((s) => s - 1); return }
  }

  async function handleNext() {
    window.scrollTo({ top: 0, behavior: "smooth" })
    if (step < WELLBEING_CATEGORIES.length - 1) {
      setStep((s) => s + 1)
      return
    }
    setSubmitting(true)
    setSubmitError("")
    try {
      const res = await fetch("/api/tools/wellbeing-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      })
      const data = await res.json()
      if (!res.ok) {
        setSubmitError(data.error || "Something went wrong. Please try again.")
        setSubmitting(false)
        return
      }
      const categoryScores: Record<number, { earned: number; max: number }> = {}
      for (const [k, v] of Object.entries(data.categoryScores as Record<string, { earned: number; max: number }>)) {
        categoryScores[Number(k)] = v
      }
      setResult({ totalScore: data.totalScore, categoryScores })
      setView("results")
      setSubmitting(false)
    } catch {
      setSubmitError("Something went wrong. Please try again.")
      setSubmitting(false)
    }
  }

  function handleReset() {
    setAnswers({})
    setStep(0)
    setResult(null)
    setSubmitError("")
    setView("intro")
  }

  return (
    <div className="py-6 px-4 md:py-8 md:px-8">
      {view === "intro" && (
        <IntroView userEmail={userEmail} onStart={() => setView("quiz")} />
      )}
      {view === "quiz" && (
        <>
          {submitError && (
            <p className="max-w-xl mx-auto font-sans text-xs text-red-500 mb-4">{submitError}</p>
          )}
          <QuizView
            step={step}
            answers={answers}
            onAnswer={handleAnswer}
            onBack={handleBack}
            onNext={handleNext}
            submitting={submitting}
          />
        </>
      )}
      {view === "results" && result && (
        <ResultsView result={result} answers={answers} onReset={handleReset} />
      )}
    </div>
  )
}
