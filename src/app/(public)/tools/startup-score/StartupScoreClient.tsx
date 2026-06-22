"use client"

import { useState } from "react"
import { loadRazorpay } from "@/lib/load-razorpay"
import Link from "next/link"
import { ArrowLeft, RotateCcw, CheckCircle } from "lucide-react"
import SignInOptions from "@/components/SignInOptions"
import { trackCta } from "@/lib/analytics"
import {
  PILLARS,
  QUESTIONS,
  computeTotal,
  computePillarScores,
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
}

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ")
}

// ── Intro ─────────────────────────────────────────────────────────────────────

function IntroView({ userEmail, onStart }: { userEmail: string | null; onStart: () => void }) {
  const isSignedIn = !!userEmail
  const [showSignIn, setShowSignIn] = useState(false)

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <div className="bg-card border border-border rounded-2xl p-5 sm:p-8">
        <p className="text-[10px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-5">
          50 questions · 9 segments
        </p>
        <h1 className="font-heading text-3xl font-bold text-ink mb-3 lowercase">
          startup fundability score
        </h1>
        <p className="font-sans text-sm text-ink/60 leading-relaxed mb-5">
          this is not a "is my idea good?" test. it scores your startup on the exact criteria investors use when deciding whether to fund you — market size, traction signals, team strength, business model clarity, competitive defensibility, and more. answer 50 questions across 9 segments and get a 0–100 score with a full breakdown of where you stand and what to fix before you walk into a room.
        </p>
        <div className="inline-flex items-center gap-1.5 bg-peach/40 border border-peach-dark/30 rounded-lg px-3 py-1.5 mb-3">
          <span className="font-sans text-xs text-ink/50">full breakdown</span>
          <span className="font-sans text-sm font-bold text-ink">₹99</span>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-7">
          <p className="font-sans text-xs font-semibold text-amber-800 mb-0.5">one-time access</p>
          <p className="font-sans text-[11px] text-amber-700 leading-relaxed">
            this quiz can only be taken once. your answers and score are saved permanently to your account. take your time — once submitted, you cannot retake it.
          </p>
        </div>

        {/* Segment table */}
        <div className="rounded-xl border border-border overflow-hidden mb-8">
          <div className="grid grid-cols-2 text-[10px] font-sans text-ink/35 uppercase tracking-widest px-4 py-2 bg-peach/20 border-b border-border">
            <span>segment</span>
            <span className="text-right">questions</span>
          </div>
          {PILLARS.map((p) => (
            <div
              key={p.index}
              className="grid grid-cols-2 px-4 py-2.5 border-b border-border/50 last:border-0"
            >
              <span className="font-sans text-xs text-ink/70">{p.title}</span>
              <span className="font-sans text-xs text-ink/40 text-right">{p.questionIds.length}</span>
            </div>
          ))}
          <div className="grid grid-cols-2 px-4 py-2.5 bg-peach/10">
            <span className="font-sans text-xs font-semibold text-ink">total</span>
            <span className="font-sans text-xs font-semibold text-ink text-right">50</span>
          </div>
        </div>

        {isSignedIn ? (
          <button
            onClick={onStart}
            className="inline-flex items-center gap-2 bg-ink text-cream font-sans text-sm font-semibold px-6 py-3 rounded-xl hover:bg-ink/80 transition-colors"
          >
            Start
          </button>
        ) : showSignIn ? (
          <SignInOptions callbackUrl="/fundraise/tools/fundability-score" compact googleLabel="sign in to start" />
        ) : (
          <button
            onClick={() => setShowSignIn(true)}
            className="inline-flex items-center gap-2 bg-ink text-cream font-sans text-sm font-semibold px-6 py-3 rounded-xl hover:bg-ink/80 transition-colors"
          >
            Start
          </button>
        )}
      </div>

      {isSignedIn && (
        <p className="text-[10px] font-sans text-ink/30 text-center">
          signed in as {userEmail}
        </p>
      )}
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
        "cursor-pointer rounded-xl border px-3 py-2.5 transition-all duration-150 select-none",
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
  onAnswer,
  onBack,
  onNext,
}: {
  step: number
  answers: Answers
  onAnswer: (qId: number, val: OptionValue) => void
  onBack: () => void
  onNext: () => void
}) {
  const pillar = PILLARS[step]
  const questions = pillar.questionIds.map((id) => QUESTIONS.find((q) => q.id === id)!)
  const allAnswered = pillar.questionIds.every((id) => answers[id] !== undefined)
  const isLast = step === PILLARS.length - 1
  const totalAnswered = Object.keys(answers).length

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <p key={step} className="text-[10px] font-sans text-ink/40 animate-in fade-in duration-300">
            segment {step + 1} of {PILLARS.length} ·{" "}
            <span className="font-semibold text-ink/70 bg-peach/40 px-1 py-0.5 rounded animate-in fade-in duration-500">
              {pillar.title}
            </span>
          </p>
          <p className="text-[10px] font-sans text-ink/30">
            {totalAnswered} / 50 answered
          </p>
        </div>
        <div
          role="progressbar"
          aria-valuenow={Math.round(((step + 1) / PILLARS.length) * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Quiz progress: segment ${step + 1} of ${PILLARS.length}`}
          className="w-full bg-border rounded-full h-1.5"
        >
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
          disabled={!allAnswered}
          className={cn(
            "inline-flex items-center gap-2 font-sans text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors",
            allAnswered
              ? "bg-ink text-cream hover:bg-ink/80"
              : "bg-ink/20 text-ink/40 cursor-not-allowed"
          )}
        >
          {isLast ? "finish quiz" : "next"}
        </button>
      </div>
    </div>
  )
}

// ── Paywall View ──────────────────────────────────────────────────────────────

function PaywallView({
  answers,
  userEmail,
  userName,
  onPaid,
  onBack,
}: {
  answers: Answers
  userEmail: string
  userName: string
  onPaid: (result: ResultData) => void
  onBack: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handlePay() {
    trackCta("startup-score-unlock", "/fundraise/tools/fundability-score")
    setLoading(true)
    setError("")
    try {
      const orderRes = await fetch("/api/tools/startup-score/unlock-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      })
      const orderData = await orderRes.json()
      if (!orderRes.ok) throw new Error(orderData.error || "Failed to create order")

      await loadRazorpay()
      const rzp = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: "INR",
        name: "Priya Ahuja",
        description: "Startup Fundability Score — Full Analysis",
        order_id: orderData.orderId,
        handler: async (response: {
          razorpay_order_id: string
          razorpay_payment_id: string
          razorpay_signature: string
        }) => {
          const submitRes = await fetch("/api/tools/startup-score", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              answers,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          })
          const data = await submitRes.json()
          if (!submitRes.ok) {
            setError("Payment received but verification failed. Email hi@priyaahuja.in with your payment ID.")
            return
          }
          const pillarScores: Record<number, { earned: number; max: number }> = {}
          for (const [k, v] of Object.entries(data.pillarScores as Record<string, { earned: number; max: number }>)) {
            pillarScores[Number(k)] = v
          }
          onPaid({ id: data.id, totalScore: data.totalScore, pillarScores })
        },
        prefill: { name: userName, email: userEmail },
        theme: { color: "#2D2D2D" },
        modal: {
          ondismiss: () => setLoading(false),
        },
      })
      rzp.open()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setLoading(false)
    }
  }

  // Preview segment scores client-side (blurred) to give a sense of what's coming
  const previewPillarScores = computePillarScores(answers)
  const previewTotal = computeTotal(answers)

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <div className="bg-card border border-border rounded-2xl p-5 sm:p-8">
        <p className="text-[10px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-5">
          quiz complete · 50 / 50 answered
        </p>
        <h2 className="font-heading text-2xl font-bold text-ink lowercase mb-2">
          your startup fundability score is ready
        </h2>
        <p className="font-sans text-sm text-ink/55 leading-relaxed mb-7">
          unlock your full score — overall out of 100, all 9 segment breakdowns, and a prioritised list of exactly what to fix before you pitch to investors.
        </p>

        {/* Blurred score preview */}
        <div className="relative mb-7 select-none">
          <div className="blur-sm pointer-events-none">
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-28 h-28">
                <div
                  className="w-full h-full rounded-full"
                  style={{
                    background: `conic-gradient(#FFA07A ${(previewTotal / 100) * 360}deg, #E8DFC8 ${(previewTotal / 100) * 360}deg)`,
                  }}
                />
                <div className="absolute inset-3 rounded-full bg-card flex items-center justify-center">
                  <span className="font-heading text-2xl font-bold text-ink">{previewTotal}</span>
                </div>
              </div>
            </div>
            <div className="space-y-2.5">
              {PILLARS.slice(0, 3).map((pillar) => {
                const ps = previewPillarScores[pillar.index]
                const pct = ps ? (ps.earned / ps.max) * 100 : 0
                return (
                  <div key={pillar.index}>
                    <div className="flex justify-between text-[11px] font-sans text-ink/60 mb-1">
                      <span>{pillar.title}</span>
                      <span>{ps?.earned ?? 0}/{pillar.maxPoints}</span>
                    </div>
                    <div className="h-1.5 bg-border rounded-full">
                      <div className="h-1.5 bg-peach-dark rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
              <p className="text-[10px] font-sans text-ink/30 text-center pt-1">+ 6 more segments…</p>
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-cream/90 border border-border rounded-xl px-5 py-3 text-center shadow-sm">
              <p className="font-sans text-xs font-semibold text-ink">unlock to see your full score</p>
            </div>
          </div>
        </div>

        {error && <p className="font-sans text-xs text-red-500 mb-4">{error}</p>}

        <button
          onClick={handlePay}
          disabled={loading}
          className={cn(
            "w-full inline-flex items-center justify-center gap-2 font-sans text-sm font-semibold px-6 py-3 rounded-xl transition-colors",
            loading ? "bg-ink/20 text-ink/40 cursor-not-allowed" : "bg-ink text-cream hover:bg-ink/80"
          )}
        >
          {loading ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-cream/40 border-t-cream rounded-full animate-spin" />
              processing…
            </>
          ) : (
            "unlock full score — ₹99"
          )}
        </button>

        <p className="text-[10px] font-sans text-ink/30 text-center mt-3">
          one-time payment · instant results
        </p>
      </div>

      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-[11px] font-sans text-ink/35 hover:text-ink/60 transition-colors mx-auto"
      >
        <ArrowLeft size={11} /> go back and review answers
      </button>
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
  const recs = getTopRecommendations(answers, 3)
  const deg = (result.totalScore / 100) * 360

  return (
    <div className="max-w-xl mx-auto space-y-5">
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
            <span className="font-heading text-3xl font-bold text-ink leading-none">{result.totalScore}</span>
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
            const ps = result.pillarScores[pillar.index] ?? { earned: 0, max: pillar.maxPoints }
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

      {/* Brainstorming session upsell */}
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

      <div className="text-center pb-4">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 text-[11px] font-sans text-ink/35 hover:text-ink/60 transition-colors"
        >
          <RotateCcw size={11} /> take it again
        </button>
      </div>

      <div className="border-t border-border pt-5 pb-2">
        <p className="font-sans text-[10px] text-ink/30 leading-relaxed text-center max-w-md mx-auto">
          disclaimer: this score is for informational and self-reflection purposes only. it is not a guarantee of business success or failure. startup outcomes depend on many factors beyond what any quiz can measure. use this as one data point, not a definitive verdict.
        </p>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function StartupScoreClient({ userEmail, userName, isAdmin = false }: { userEmail: string | null; userName: string; isAdmin?: boolean }) {
  const [view, setView] = useState<"intro" | "quiz" | "paywall" | "results">("intro")
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [result, setResult] = useState<ResultData | null>(null)

  function handleAnswer(qId: number, val: OptionValue) {
    setAnswers((prev) => ({ ...prev, [qId]: val }))
  }

  function handleBack() {
    if (view === "paywall") { setView("quiz"); setStep(PILLARS.length - 1); return }
    if (step > 0) setStep((s) => s - 1)
    else setView("intro")
  }

  async function handleNext() {
    window.scrollTo({ top: 0, behavior: "smooth" })
    if (step < PILLARS.length - 1) {
      setStep((s) => s + 1)
    } else if (isAdmin) {
      const totalScore = computeTotal(answers)
      const pillarScores = computePillarScores(answers)
      setResult({ id: "admin", totalScore, pillarScores })
      setView("results")
    } else {
      setView("paywall")
    }
  }

  function handlePaid(r: ResultData) {
    setResult(r)
    setView("results")
  }

  function handleReset() {
    setAnswers({})
    setStep(0)
    setResult(null)
    setView("intro")
  }

  return (
    <div className="py-6 px-4 md:py-8 md:px-8">
        {view === "intro" && (
          <IntroView userEmail={userEmail} onStart={() => setView("quiz")} />
        )}
        {view === "quiz" && (
          <QuizView
            step={step}
            answers={answers}
            onAnswer={handleAnswer}
            onBack={handleBack}
            onNext={handleNext}
          />
        )}
        {view === "paywall" && userEmail && (
          <PaywallView
            answers={answers}
            userEmail={userEmail}
            userName={userName}
            onPaid={handlePaid}
            onBack={handleBack}
          />
        )}
        {view === "results" && result && (
          <ResultsView
            result={result}
            answers={answers}
            onReset={handleReset}
          />
        )}
      </div>
  )
}
