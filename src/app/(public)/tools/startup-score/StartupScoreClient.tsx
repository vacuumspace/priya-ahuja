"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
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

function IntroView({ userEmail, onStart, price = 49900 }: { userEmail: string | null; onStart: () => void; price?: number }) {
  const isSignedIn = !!userEmail

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
          <span className="font-sans text-sm font-bold text-ink">₹{(price / 100).toLocaleString("en-IN")}</span>
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

        <button
          onClick={isSignedIn ? onStart : () => signIn("google", { callbackUrl: "/fundraise/tools/fundability-score" })}
          className="inline-flex items-center gap-2 bg-ink text-cream font-sans text-sm font-semibold px-6 py-3 rounded-xl hover:bg-ink/80 transition-colors"
        >
          Start
        </button>
      </div>

      {isSignedIn && (
        <p className="text-[10px] font-sans text-ink/30 text-center">
          signed in as {userEmail}
        </p>
      )}

      <SampleFundScorecard userEmail={userEmail} />
    </div>
  )
}

// ── Sample Scorecard ──────────────────────────────────────────────────────────

const SAMPLE_FUND_SCORE = 62
const SAMPLE_FUND_PILLARS = [
  {
    title: "problem definition", earned: 9, max: 12,
    comments: [
      { q: "how well-defined is the problem you're solving?", answer: "clear pain point · i can describe who has it and what it costs them", level: "mid", note: "good articulation, but investors want evidence. back this with interviews or data." },
      { q: "how often does your target customer face this problem?", answer: "daily or weekly · constant friction", level: "good", note: "high frequency = high urgency. this is a strong signal." },
    ],
  },
  {
    title: "market opportunity", earned: 8, max: 12,
    comments: [
      { q: "what is your estimated TAM?", answer: "$100M – $1B · focused but sizeable", level: "mid", note: "size is plausible but you need a sourced, bottom-up number. investors will probe this." },
      { q: "is the market growing?", answer: "stable growth · growing but slowly", level: "mid", note: "flat markets are harder to fundraise in. identify the tailwind or sub-segment growing faster." },
    ],
  },
  {
    title: "solution & product", earned: 8, max: 12,
    comments: [
      { q: "how differentiated is your solution?", answer: "meaningfully different · clear improvement over status quo", level: "good", note: "good. make sure you can demo the difference in under 2 minutes." },
    ],
  },
  {
    title: "competitive advantage", earned: 6, max: 10,
    comments: [
      { q: "what is your primary defensibility?", answer: "price · cheaper than alternatives", level: "low", note: "price is not a moat. any funded competitor can undercut you. identify a structural barrier." },
      { q: "do you have network effects?", answer: "no · not applicable to my model", level: "low", note: "not every startup needs network effects, but you need something. data lock-in? switching costs? brand?" },
    ],
  },
  {
    title: "founder & team", earned: 8, max: 12,
    comments: [
      { q: "can you answer 'why you?' compellingly?", answer: "adjacent credibility · worked in a related area", level: "mid", note: "proximity helps but a direct answer is stronger. what do you know that nobody else in the room knows?" },
    ],
  },
  {
    title: "customer validation", earned: 7, max: 12,
    comments: [
      { q: "how many paying or LOI customers do you have?", answer: "none yet · still validating", level: "low", note: "pre-revenue is fine at pre-seed, but you need at least 5–10 signed LOIs or paid pilots." },
      { q: "have you done customer interviews?", answer: "yes · 5–10 interviews done", level: "mid", note: "good start. aim for 20+ and look for the pattern in what they say, not what you want to hear." },
    ],
  },
  {
    title: "business model", earned: 7, max: 12,
    comments: [
      { q: "how clear is your revenue model?", answer: "defined · subscription or transaction fee", level: "good", note: "clear model. now work out your pricing tiers and what triggers an upgrade." },
      { q: "do you have a unit economics hypothesis?", answer: "rough estimate · CAC and LTV are ballpark figures", level: "mid", note: "ballpark is better than nothing, but be ready for an investor to ask for your assumptions." },
    ],
  },
  {
    title: "go-to-market", earned: 5, max: 10,
    comments: [
      { q: "what is your primary acquisition channel?", answer: "word of mouth and content", level: "low", note: "that's not a channel, it's a hope. name your first 10 customers and the exact path to reach them." },
      { q: "do you have a launch plan?", answer: "vague · thinking through it", level: "low", note: "you need a named sequence: who, how, when. even a 30-day plan is better than a vague strategy." },
    ],
  },
  {
    title: "team & execution", earned: 4, max: 8,
    comments: [
      { q: "does your team cover the core skills needed?", answer: "partial · missing key technical or commercial skill", level: "low", note: "gaps are fine if you can name them and have a plan. investors will ask who's filling the hole." },
    ],
  },
]
const SAMPLE_FUND_RECS = [
  "your TAM/SAM/SOM numbers are estimates with no sourcing — investors will ask for methodology. build a bottom-up view.",
  "competitive moat is thin. price is not a defensible advantage. identify one structural barrier (network effect, data, switching cost) you can build toward.",
  "go-to-market is 'word of mouth and content'. that's not a channel, it's a hope. name your first 10 customers and how you'll reach them.",
]

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

function fundPillarColor(pct: number) {
  if (pct >= 75) return "bg-green-400"
  if (pct >= 50) return "bg-peach-dark"
  if (pct >= 25) return "bg-amber-400"
  return "bg-red-400"
}

function SampleFundScorecard({ userEmail }: { userEmail: string | null }) {
  const isSignedIn = !!userEmail
  const [showSignIn, setShowSignIn] = useState(false)
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null)
  const band = getScoreBand(SAMPLE_FUND_SCORE)
  const deg = (SAMPLE_FUND_SCORE / 100) * 360

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <p className="text-[10px] font-sans text-ink/40 uppercase tracking-[0.15em]">sample report</p>
        <span className="text-[10px] font-sans text-ink/30 bg-ink/5 px-2 py-0.5 rounded-full">example only</span>
      </div>

      <div className={cn("relative", !isSignedIn && "select-none")}>
        <div className={cn(!isSignedIn && "blur-sm pointer-events-none")}>
          {/* Score + band */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden mb-4">
            <div className="bg-ink px-6 py-4">
              <p className="text-[10px] font-sans text-cream/40 uppercase tracking-[0.18em]">startup fundability score</p>
            </div>
            <div className="px-6 py-6 flex items-center gap-6">
              <div className="relative w-28 h-28 flex-shrink-0">
                <div className="w-full h-full rounded-full" style={{ background: `conic-gradient(#FFA07A ${deg}deg, #E8DFC8 ${deg}deg)` }} />
                <div className="absolute inset-2.5 rounded-full bg-card flex items-center justify-center flex-col">
                  <span className="font-heading text-2xl font-bold text-ink leading-none">{SAMPLE_FUND_SCORE}</span>
                  <span className="font-sans text-[9px] text-ink/35">/ 100</span>
                </div>
              </div>
              <div className="flex-1">
                <span className={`font-sans text-xs font-semibold uppercase tracking-wide ${band.color}`}>{band.label}</span>
                <p className="font-sans text-[11px] text-ink/60 mt-2 leading-relaxed">{band.directional}</p>
              </div>
            </div>
            <div className="px-6 pb-5">
              <div className="relative w-full h-2 bg-border rounded-full">
                <div className="h-2 bg-peach-dark rounded-full" style={{ width: `${SAMPLE_FUND_SCORE}%` }} />
                <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-ink border-2 border-cream shadow" style={{ left: `calc(${SAMPLE_FUND_SCORE}% - 6px)` }} />
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-[9px] font-sans text-ink/30">0 · pre-validation</span>
                <span className="text-[9px] font-sans text-ink/30">100 · investor-ready</span>
              </div>
            </div>
          </div>

          {/* Segment breakdown with expandable comments */}
          <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 mb-4">
            <p className="text-[10px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-4">segment breakdown · tap to see your answers</p>
            <div className="space-y-2">
              {SAMPLE_FUND_PILLARS.map((p, i) => {
                const pct = Math.round((p.earned / p.max) * 100)
                const isOpen = expandedIdx === i
                return (
                  <div key={i} className="border border-border rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setExpandedIdx(isOpen ? null : i)}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-peach/10 transition-colors text-left"
                    >
                      <span className={`flex-shrink-0 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full text-white ${fundPillarColor(pct)}`}>
                        {p.earned}/{p.max}
                      </span>
                      <div className="flex-1 h-1.5 bg-border rounded-full">
                        <div className={`h-1.5 rounded-full ${fundPillarColor(pct)}`} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs font-sans font-semibold text-ink/70 w-36 text-left">{p.title}</span>
                      {isOpen ? <span className="text-ink/30 text-xs flex-shrink-0">▲</span> : <span className="text-ink/30 text-xs flex-shrink-0">▼</span>}
                    </button>
                    {isOpen && (
                      <div className="border-t border-border divide-y divide-border/60 bg-cream/50">
                        {p.comments.map((c, j) => (
                          <div key={j} className="px-4 py-3">
                            <p className="font-sans text-[11px] text-ink/60 leading-snug mb-1.5">{c.q}</p>
                            <div className={`inline-flex items-center gap-1.5 text-[11px] font-sans font-semibold px-2.5 py-1 rounded-lg mb-1.5 ${
                              c.level === "good" ? "bg-green-100 text-green-700" : c.level === "low" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-700"
                            }`}>
                              {c.answer}
                            </div>
                            <p className="font-sans text-[10px] text-ink/45 leading-relaxed border-l-2 border-peach-dark/30 pl-2">{c.note}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-card border border-border rounded-2xl p-4 sm:p-6">
            <p className="text-[10px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-4">top areas to strengthen</p>
            <div className="space-y-3">
              {SAMPLE_FUND_RECS.map((rec, i) => (
                <div key={i} className="flex gap-3 bg-peach/15 border border-peach-dark/15 rounded-xl p-4">
                  <span className="font-heading text-lg font-bold text-peach-dark/60 w-5 flex-shrink-0 mt-0.5">{i + 1}</span>
                  <p className="font-sans text-sm text-ink/70 leading-relaxed">{rec}</p>
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
                <SignInOptions callbackUrl="/fundraise/tools/fundability-score" compact googleLabel="sign in to preview" />
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
  price = 49900,
}: {
  answers: Answers
  userEmail: string
  userName: string
  onPaid: (result: ResultData) => void
  onBack: () => void
  price?: number
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
            `unlock full score — ₹${(price / 100).toLocaleString("en-IN")}`
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

export default function StartupScoreClient({ userEmail, userName, isAdmin = false, price = 49900 }: { userEmail: string | null; userName: string; isAdmin?: boolean; price?: number }) {
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
          <IntroView userEmail={userEmail} onStart={() => setView("quiz")} price={price} />
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
            price={price}
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
