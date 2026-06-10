"use client"

import { useState } from "react"
import Script from "next/script"
import { ArrowRight, ArrowLeft, RotateCcw, CheckCircle, Lock } from "lucide-react"
import {
  PILLARS,
  QUESTIONS,
  SCORE_BANDS,
  getScoreBand,
  getTopRecommendations,
  type Answers,
  type OptionValue,
} from "@/lib/startup-score-data"

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any
  }
}

type ResultData = {
  id: string
  totalScore: number
  pillarScores: Record<number, { earned: number; max: number }>
  scoreBand: string
  isPaid: boolean
}

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ")
}

// ── Intro ────────────────────────────────────────────────────────────────────

function IntroView({ userEmail, onStart }: { userEmail: string; onStart: () => void }) {
  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-card border border-border rounded-2xl p-8">
        <p className="text-[10px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-5">
          free tool · signed in as {userEmail}
        </p>
        <h1 className="font-heading text-3xl font-bold text-ink mb-3 lowercase">
          score your startup idea
        </h1>
        <p className="font-sans text-sm text-ink/60 leading-relaxed mb-6">
          answer 11 questions across 5 pillars and get a 0–100 fundability score. unlock the full
          pillar breakdown and fix recommendations for ₹99.
        </p>

        <div className="flex flex-wrap gap-2 mb-8">
          {PILLARS.map((p) => (
            <span
              key={p.index}
              className="text-[11px] font-sans bg-peach/40 text-ink/70 px-3 py-1 rounded-full"
            >
              {p.title}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4 text-[11px] font-sans text-ink/40 mb-8">
          <span>11 questions</span>
          <span>·</span>
          <span>~3 minutes</span>
          <span>·</span>
          <span>score free · full analysis ₹99</span>
        </div>

        <button
          onClick={onStart}
          className="inline-flex items-center gap-2 bg-ink text-cream font-sans text-sm font-semibold px-6 py-3 rounded-xl hover:bg-ink/80 transition-colors"
        >
          start scoring <ArrowRight size={14} />
        </button>
      </div>
    </div>
  )
}

// ── Option Card ───────────────────────────────────────────────────────────────

function OptionCard({
  label,
  sublabel,
  selected,
  onClick,
}: {
  label: string
  sublabel?: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-xl border px-4 py-3.5 transition-all duration-150 select-none",
        selected
          ? "bg-peach/30 border-peach-dark ring-1 ring-peach-dark/40"
          : "bg-card border-border hover:border-peach-dark/40 hover:bg-peach/10"
      )}
    >
      <p className="font-sans font-semibold text-[13px] text-ink">{label}</p>
      {sublabel && (
        <p className="font-sans text-[11px] text-ink/50 mt-0.5 leading-relaxed">{sublabel}</p>
      )}
    </div>
  )
}

// ── Quiz ──────────────────────────────────────────────────────────────────────

function QuizView({
  step,
  answers,
  saving,
  onAnswer,
  onBack,
  onNext,
}: {
  step: number
  answers: Answers
  saving: boolean
  onAnswer: (qId: number, val: OptionValue) => void
  onBack: () => void
  onNext: () => void
}) {
  const pillar = PILLARS[step]
  const questions = pillar.questionIds.map((id) => QUESTIONS.find((q) => q.id === id)!)
  const allAnswered = pillar.questionIds.every((id) => answers[id] !== undefined)
  const isLast = step === PILLARS.length - 1

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <p className="text-[10px] font-sans text-ink/40 mb-2">
          step {step + 1} of {PILLARS.length} · {pillar.title}
        </p>
        <div className="w-full bg-border rounded-full h-1.5">
          <div
            className="bg-peach-dark rounded-full h-1.5 transition-all duration-500"
            style={{ width: `${((step + 1) / PILLARS.length) * 100}%` }}
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
                  sublabel={opt.sublabel}
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
          disabled={!allAnswered || saving}
          className={cn(
            "inline-flex items-center gap-2 font-sans text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors",
            allAnswered && !saving
              ? "bg-ink text-cream hover:bg-ink/80"
              : "bg-ink/20 text-ink/40 cursor-not-allowed"
          )}
        >
          {saving ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-cream/40 border-t-cream rounded-full animate-spin" />
              saving…
            </>
          ) : isLast ? (
            <>see my score <ArrowRight size={14} /></>
          ) : (
            <>next <ArrowRight size={14} /></>
          )}
        </button>
      </div>
    </div>
  )
}

// ── Paywall section ───────────────────────────────────────────────────────────

function PaywallSection({
  scoreId,
  userEmail,
  userName,
  onUnlocked,
}: {
  scoreId: string
  userEmail: string
  userName: string
  onUnlocked: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleUnlock() {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/tools/startup-score/unlock-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scoreId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to create order")

      const rzp = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: "INR",
        name: "Priya Ahuja",
        description: "Startup Score — Full Analysis",
        order_id: data.orderId,
        handler: async (response: {
          razorpay_order_id: string
          razorpay_payment_id: string
          razorpay_signature: string
        }) => {
          const verifyRes = await fetch("/api/tools/startup-score/unlock-verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              scoreId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          })
          if (verifyRes.ok) {
            onUnlocked()
          } else {
            setError("Payment received but verification failed. Email hello@priyaahuja.com with your payment ID.")
          }
        },
        prefill: { name: userName, email: userEmail },
        theme: { color: "#2D2D2D" },
      })
      rzp.open()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border border-border rounded-2xl p-6 text-center bg-card">
      <div className="w-10 h-10 rounded-full bg-ink/5 flex items-center justify-center mx-auto mb-4">
        <Lock size={16} className="text-ink/40" />
      </div>
      <p className="font-heading text-base font-bold text-ink lowercase mb-1">
        unlock full analysis
      </p>
      <p className="font-sans text-xs text-ink/50 mb-5 max-w-xs mx-auto">
        pillar breakdown, top fixes, and personalised recommendations — one-time ₹99
      </p>
      {error && (
        <p className="font-sans text-xs text-red-500 mb-3">{error}</p>
      )}
      <button
        onClick={handleUnlock}
        disabled={loading}
        className={cn(
          "inline-flex items-center gap-2 font-sans text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors",
          loading ? "bg-ink/20 text-ink/40 cursor-not-allowed" : "bg-ink text-cream hover:bg-ink/80"
        )}
      >
        {loading ? (
          <>
            <span className="w-3.5 h-3.5 border-2 border-cream/40 border-t-cream rounded-full animate-spin" />
            opening payment…
          </>
        ) : (
          <>unlock for ₹99 <ArrowRight size={14} /></>
        )}
      </button>
    </div>
  )
}

// ── Results ───────────────────────────────────────────────────────────────────

function ResultsView({
  result,
  answers,
  userEmail,
  userName,
  onUnlocked,
  onReset,
}: {
  result: ResultData
  answers: Answers
  userEmail: string
  userName: string
  onUnlocked: () => void
  onReset: () => void
}) {
  const band = SCORE_BANDS.find((b) => b.label === result.scoreBand) ?? SCORE_BANDS[0]
  const recs = getTopRecommendations(answers, 3)
  const deg = (result.totalScore / 100) * 360

  return (
    <div className="max-w-xl mx-auto space-y-5">
      {/* Score card */}
      <div className="bg-card border border-border rounded-2xl p-8 text-center">
        <p className="text-[10px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-6">
          your startup score
        </p>

        <div className="relative w-36 h-36 mx-auto mb-5">
          <div
            className="w-full h-full rounded-full"
            style={{
              background: `conic-gradient(#FFA07A ${deg}deg, #E8DFC8 ${deg}deg)`,
            }}
          />
          <div className="absolute inset-3 rounded-full bg-card flex items-center justify-center">
            <span className="font-heading text-3xl font-bold text-ink">{result.totalScore}</span>
          </div>
        </div>

        <h2 className="font-heading text-2xl font-bold text-ink lowercase mb-1">{band.label}</h2>
        <p className="font-sans text-sm text-ink/50">{band.sublabel}</p>
      </div>

      {/* Pillar breakdown + recs — gated */}
      {result.isPaid ? (
        <>
          <div className="bg-card border border-border rounded-2xl p-6">
            <p className="text-[10px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-5">
              pillar breakdown
            </p>
            <div className="space-y-4">
              {PILLARS.map((pillar, i) => {
                const ps = result.pillarScores[pillar.index] ?? { earned: 0, max: pillar.maxPoints }
                const pct = (ps.earned / ps.max) * 100
                return (
                  <div key={pillar.index}>
                    <div className="flex justify-between text-[11px] font-sans text-ink/60 mb-1.5">
                      <span>{pillar.title}</span>
                      <span>{ps.earned}/{ps.max}</span>
                    </div>
                    <div className="h-2 bg-border rounded-full">
                      <div
                        className="h-2 bg-peach-dark rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, transitionDelay: `${i * 80}ms` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {recs.length > 0 ? (
            <div className="bg-card border border-border rounded-2xl p-6">
              <p className="text-[10px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-5">
                top {recs.length === 1 ? "fix" : `${recs.length} fixes`} before you pitch
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
                outstanding score — you've addressed every key area investors look for.
              </p>
            </div>
          )}
        </>
      ) : (
        <PaywallSection
          scoreId={result.id}
          userEmail={userEmail}
          userName={userName}
          onUnlocked={onUnlocked}
        />
      )}

      {/* CTA */}
      <div className="bg-peach/30 border border-peach-dark/20 rounded-2xl p-6 text-center">
        <p className="font-heading text-lg font-bold text-ink lowercase mb-1">
          ready to close the gaps?
        </p>
        <p className="font-sans text-xs text-ink/55 mb-5">
          book a session with priya to turn your score into a fundraising plan.
        </p>
        <a
          href="/connect"
          className="inline-flex items-center gap-2 bg-ink text-cream text-xs font-sans font-semibold px-5 py-2.5 rounded-xl hover:bg-ink/80 transition-colors"
        >
          book a session <ArrowRight size={12} />
        </a>
      </div>

      <div className="text-center pb-4">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 text-[11px] font-sans text-ink/35 hover:text-ink/60 transition-colors"
        >
          <RotateCcw size={11} /> take it again
        </button>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function StartupScoreClient({ userEmail, userName }: { userEmail: string; userName: string }) {
  const [view, setView] = useState<"intro" | "quiz" | "results">("intro")
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [result, setResult] = useState<ResultData | null>(null)
  const [saving, setSaving] = useState(false)

  function handleAnswer(qId: number, val: OptionValue) {
    setAnswers((prev) => ({ ...prev, [qId]: val }))
  }

  function handleBack() {
    if (step > 0) setStep((s) => s - 1)
    else setView("intro")
  }

  async function handleNext() {
    if (step < PILLARS.length - 1) {
      setStep((s) => s + 1)
      return
    }
    setSaving(true)
    try {
      const res = await fetch("/api/tools/startup-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      })
      const data = await res.json()
      const pillarScores: Record<number, { earned: number; max: number }> = {}
      for (const [k, v] of Object.entries(data.pillarScores as Record<string, { earned: number; max: number }>)) {
        pillarScores[Number(k)] = v
      }
      setResult({ id: data.id, totalScore: data.totalScore, pillarScores, scoreBand: data.scoreBand, isPaid: false })
      setView("results")
    } finally {
      setSaving(false)
    }
  }

  function handleUnlocked() {
    if (result) setResult({ ...result, isPaid: true })
  }

  function handleReset() {
    setAnswers({})
    setStep(0)
    setResult(null)
    setView("intro")
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="py-8 px-4 md:px-8">
        {view === "intro" && (
          <IntroView userEmail={userEmail} onStart={() => setView("quiz")} />
        )}
        {view === "quiz" && (
          <QuizView
            step={step}
            answers={answers}
            saving={saving}
            onAnswer={handleAnswer}
            onBack={handleBack}
            onNext={handleNext}
          />
        )}
        {view === "results" && result && (
          <ResultsView
            result={result}
            answers={answers}
            userEmail={userEmail}
            userName={userName}
            onUnlocked={handleUnlocked}
            onReset={handleReset}
          />
        )}
      </div>
    </>
  )
}
