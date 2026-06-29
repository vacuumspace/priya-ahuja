"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { loadRazorpay } from "@/lib/load-razorpay"
import Link from "next/link"
import { ArrowLeft, RotateCcw, CheckCircle } from "lucide-react"
import SignInOptions from "@/components/SignInOptions"
import { trackCta } from "@/lib/analytics"
import {
  IDEA_PILLARS,
  IDEA_QUESTIONS,
  computeIdeaTotal,
  computeIdeaPillarScores,
  getIdeaTopRecommendations,
  type Answers,
  type OptionValue,
} from "@/lib/startup-idea-score-data"

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

// ── Sample Scorecard ──────────────────────────────────────────────────────────

const SAMPLE_IDEA_SCORE = 68
const SAMPLE_IDEA_PILLARS = [
  {
    title: "problem clarity", earned: 9, max: 12,
    comments: [
      { q: "can you describe the problem in one sentence?", answer: "yes, crisp and clear", level: "good", note: "strong start — problem articulation is a core founder skill." },
      { q: "how often does your target customer face this problem?", answer: "occasionally · a few times a week", level: "mid", note: "weekly friction is real but not urgent. understand what triggers the pain." },
      { q: "what do people currently do about this problem?", answer: "manual workarounds · spreadsheets, WhatsApp, jugaad", level: "mid", note: "workarounds validate the problem exists. can you quantify what they cost?" },
    ],
  },
  {
    title: "founder-market fit", earned: 8, max: 12,
    comments: [
      { q: "have you personally experienced this problem?", answer: "adjacent experience · worked in the space", level: "mid", note: "proximity helps but lived experience is stronger. document your specific edge clearly." },
      { q: "why are you the right person to build this?", answer: "general relevance · skills useful but not specific", level: "low", note: "this is the question investors will ask first. you need a sharper answer than 'my skills apply'." },
    ],
  },
  {
    title: "demand signals", earned: 7, max: 10,
    comments: [
      { q: "have you talked to at least 10 potential customers?", answer: "somewhat · 3–5 conversations", level: "mid", note: "keep going. 10 conversations is a floor, not a ceiling. look for patterns, not consensus." },
    ],
  },
  {
    title: "customer understanding", earned: 7, max: 12,
    comments: [
      { q: "can you name your first 10 target customers?", answer: "not yet · still defining the persona", level: "low", note: "if you can't name them, you don't know them yet. this is the most important thing to fix." },
    ],
  },
  {
    title: "solution clarity", earned: 8, max: 10,
    comments: [
      { q: "can you describe what you're building in 2 sentences?", answer: "yes, clearly", level: "good", note: "good. keep that clarity as the product evolves." },
    ],
  },
  {
    title: "business basics", earned: 6, max: 10,
    comments: [
      { q: "do you have a rough sense of what you'd charge?", answer: "somewhat · thinking about it", level: "mid", note: "pricing uncertainty at this stage is fine, but you should have a hypothesis. what would make someone pay?" },
      { q: "can the unit economics ever work?", answer: "unclear · haven't modelled it", level: "low", note: "do a back-of-napkin: what's your CAC estimate and how many times can a customer pay you?" },
    ],
  },
  {
    title: "execution readiness", earned: 8, max: 12,
    comments: [
      { q: "do you know your first 90 days?", answer: "yes, have a rough plan", level: "good", note: "good. write it down and pressure-test each milestone." },
    ],
  },
  {
    title: "build mindset", earned: 8, max: 10,
    comments: [
      { q: "are you willing to kill the idea if the data says no?", answer: "yes, data over ego", level: "good", note: "this is the right mindset. most founders don't actually act on it — keep checking yourself." },
    ],
  },
  {
    title: "risk awareness", earned: 7, max: 12,
    comments: [
      { q: "what's the biggest risk to this idea?", answer: "identified it but no mitigation plan", level: "mid", note: "naming the risk is the first step. now build a plan to reduce or route around it." },
    ],
  },
]
const SAMPLE_IDEA_RECS = [
  "your customer definition is vague — you need a named persona with a specific trigger moment, not a demographic bracket.",
  "you haven't validated demand beyond personal belief. find 3 people already paying for a workaround and talk to them.",
  "unit economics are hand-wavy. even a rough back-of-napkin CAC vs LTV estimate would sharpen your thinking.",
]

function ideaPillarColor(pct: number) {
  if (pct >= 75) return "bg-green-400"
  if (pct >= 50) return "bg-peach-dark"
  if (pct >= 25) return "bg-amber-400"
  return "bg-red-400"
}

function getIdeaScoreBand(score: number): { label: string; color: string; directional: string } {
  if (score >= 80) return {
    label: "strong foundation",
    color: "text-green-700",
    directional: "your idea has real legs. the fundamentals are solid — now focus on sharp customer definition and early validation. most ideas at this level succeed or stall on execution, not concept.",
  }
  if (score >= 65) return {
    label: "almost there",
    color: "text-blue-700",
    directional: "good signal, a few gaps. a couple of weak areas will hold you back if not addressed before you start building. fix your customer definition and unit economics hypothesis first.",
  }
  if (score >= 50) return {
    label: "building blocks in place",
    color: "text-amber-700",
    directional: "there's something here, but the gaps are meaningful. don't start building yet — spend 4–6 weeks on customer discovery and problem validation before writing a line of code.",
  }
  return {
    label: "needs more groundwork",
    color: "text-orange-700",
    directional: "the idea needs more grounding. focus on understanding the problem deeply before thinking about a solution. talk to 20 potential customers and listen more than you pitch.",
  }
}

function SampleIdeaScorecard({ userEmail }: { userEmail: string | null }) {
  const isSignedIn = !!userEmail
  const [showSignIn, setShowSignIn] = useState(false)
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null)
  const deg = (SAMPLE_IDEA_SCORE / 100) * 360
  const band = getIdeaScoreBand(SAMPLE_IDEA_SCORE)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <p className="text-[12px] font-sans text-ink/40 uppercase tracking-[0.15em]">sample report</p>
        <span className="text-[12px] font-sans text-ink/30 bg-ink/5 px-2 py-0.5 rounded-full">example only</span>
      </div>

      <div className={cn("relative", !isSignedIn && "select-none")}>
        <div className={cn(!isSignedIn && "blur-sm pointer-events-none")}>
          {/* Score + band */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden mb-4">
            <div className="bg-ink px-6 py-4">
              <p className="text-[12px] font-sans text-cream/40 uppercase tracking-[0.18em]">startup idea score</p>
            </div>
            <div className="px-6 py-6 flex items-center gap-6">
              <div className="relative w-28 h-28 flex-shrink-0">
                <div className="w-full h-full rounded-full" style={{ background: `conic-gradient(#FFA07A ${deg}deg, #E8DFC8 ${deg}deg)` }} />
                <div className="absolute inset-2.5 rounded-full bg-card flex items-center justify-center flex-col">
                  <span className="font-heading text-2xl font-bold text-ink leading-none">{SAMPLE_IDEA_SCORE}</span>
                  <span className="font-sans text-[9px] text-ink/35">/ 100</span>
                </div>
              </div>
              <div className="flex-1">
                <span className={`font-sans text-xs font-semibold uppercase tracking-wide ${band.color}`}>{band.label}</span>
                <p className="font-sans text-[13px] text-ink/60 mt-2 leading-relaxed">{band.directional}</p>
              </div>
            </div>
            <div className="px-6 pb-5">
              <div className="relative w-full h-2 bg-border rounded-full">
                <div className="h-2 bg-peach-dark rounded-full" style={{ width: `${SAMPLE_IDEA_SCORE}%` }} />
                <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-ink border-2 border-cream shadow" style={{ left: `calc(${SAMPLE_IDEA_SCORE}% - 6px)` }} />
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-[9px] font-sans text-ink/30">0 · needs work</span>
                <span className="text-[9px] font-sans text-ink/30">100 · strong foundation</span>
              </div>
            </div>
          </div>

          {/* Segment breakdown with expandable comments */}
          <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 mb-4">
            <p className="text-[12px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-4">segment breakdown · tap to see comments</p>
            <div className="space-y-2">
              {SAMPLE_IDEA_PILLARS.map((p, i) => {
                const pct = Math.round((p.earned / p.max) * 100)
                const isOpen = expandedIdx === i
                return (
                  <div key={i} className="border border-border rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setExpandedIdx(isOpen ? null : i)}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-peach/10 transition-colors text-left"
                    >
                      <span className={`flex-shrink-0 text-[12px] font-mono font-semibold px-2 py-0.5 rounded-full text-white ${ideaPillarColor(pct)}`}>
                        {p.earned}/{p.max}
                      </span>
                      <div className="flex-1 h-1.5 bg-border rounded-full">
                        <div className={`h-1.5 rounded-full ${ideaPillarColor(pct)}`} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs font-sans font-semibold text-ink/70 w-36 text-left">{p.title}</span>
                      {isOpen ? <span className="text-ink/30 text-xs flex-shrink-0">▲</span> : <span className="text-ink/30 text-xs flex-shrink-0">▼</span>}
                    </button>
                    {isOpen && (
                      <div className="border-t border-border divide-y divide-border/60 bg-cream/50">
                        {p.comments.map((c, j) => (
                          <div key={j} className="px-4 py-3">
                            <p className="font-sans text-[13px] text-ink/60 leading-snug mb-1.5">{c.q}</p>
                            <div className={`inline-flex items-center gap-1.5 text-[13px] font-sans font-semibold px-2.5 py-1 rounded-lg mb-1.5 ${
                              c.level === "good" ? "bg-green-100 text-green-700" : c.level === "low" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-700"
                            }`}>
                              {c.answer}
                            </div>
                            <p className="font-sans text-[12px] text-ink/45 leading-relaxed border-l-2 border-peach-dark/30 pl-2">{c.note}</p>
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
            <p className="text-[12px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-4">top things to fix before you build</p>
            <div className="space-y-3">
              {SAMPLE_IDEA_RECS.map((rec, i) => (
                <div key={i} className="flex gap-3 bg-peach/15 border border-peach-dark/15 rounded-xl p-4">
                  <span className="font-heading text-lg font-bold text-peach-dark/60 w-5 flex-shrink-0 mt-0.5">{i + 1}</span>
                  <p className="font-sans text-base text-ink/70 leading-relaxed">{rec}</p>
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
                <SignInOptions callbackUrl="/startup/tools/idea-score" compact googleLabel="sign in to preview" />
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

// ── Intro ─────────────────────────────────────────────────────────────────────

function IntroView({ userEmail, onStart, price = 49900 }: { userEmail: string | null; onStart: () => void; price?: number }) {
  const isSignedIn = !!userEmail

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <div className="bg-card border border-border rounded-2xl p-5 sm:p-8">
        <p className="text-[12px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-5">
          50 questions · 9 segments
        </p>
        <h1 className="font-heading text-3xl font-bold text-ink mb-3 lowercase">
          startup idea score
        </h1>
        <p className="font-sans text-sm text-ink/60 leading-relaxed mb-3">
          funding is a milestone, not the goal. this tool scores your idea on whether it's worth building — before you think about investors.
        </p>
        <p className="font-sans text-sm text-ink/60 leading-relaxed mb-5">
          50 questions across 9 segments: problem clarity, founder-market fit, demand signals, customer understanding, solution thinking, business basics, execution readiness, build mindset, and risk awareness. honest scoring. no fluff.
        </p>
        <div className="inline-flex items-center gap-1.5 bg-peach/40 border border-peach-dark/30 rounded-lg px-3 py-1.5 mb-3">
          <span className="font-sans text-xs text-ink/50">full breakdown</span>
          <span className="font-sans text-sm font-bold text-ink">₹{(price / 100).toLocaleString("en-IN")}</span>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-7">
          <p className="font-sans text-xs font-semibold text-amber-800 mb-0.5">one-time access</p>
          <p className="font-sans text-[13px] text-amber-700 leading-relaxed">
            this quiz can only be taken once. your answers and score are saved permanently to your account. take your time — once submitted, you cannot retake it.
          </p>
        </div>

        {/* Segment table */}
        <div className="rounded-xl border border-border overflow-hidden mb-8">
          <div className="grid grid-cols-2 text-[12px] font-sans text-ink/35 uppercase tracking-widest px-4 py-2 bg-peach/20 border-b border-border">
            <span>segment</span>
            <span className="text-right">questions</span>
          </div>
          {IDEA_PILLARS.map((p) => (
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
          onClick={isSignedIn ? onStart : () => signIn("google", { callbackUrl: "/startup/tools/idea-score" })}
          className="inline-flex items-center gap-2 bg-ink text-cream font-sans text-sm font-semibold px-6 py-3 rounded-xl hover:bg-ink/80 transition-colors"
        >
          Start
        </button>
      </div>

      {isSignedIn && (
        <p className="text-[12px] font-sans text-ink/30 text-center">
          signed in as {userEmail}
        </p>
      )}

      <SampleIdeaScorecard userEmail={userEmail} />
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
        <p className="font-sans text-[13px] text-ink/50 mt-0.5 leading-relaxed">{sublabel}</p>
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
  const pillar = IDEA_PILLARS[step]
  const questions = pillar.questionIds.map((id) => IDEA_QUESTIONS.find((q) => q.id === id)!)
  const allAnswered = pillar.questionIds.every((id) => answers[id] !== undefined)
  const isLast = step === IDEA_PILLARS.length - 1
  const totalAnswered = Object.keys(answers).length

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <p key={step} className="text-[12px] font-sans text-ink/40 animate-in fade-in duration-300">
            segment {step + 1} of {IDEA_PILLARS.length} ·{" "}
            <span className="font-semibold text-ink/70 bg-peach/40 px-1 py-0.5 rounded animate-in fade-in duration-500">
              {pillar.title}
            </span>
          </p>
          <p className="text-[12px] font-sans text-ink/30">
            {totalAnswered} / 50 answered
          </p>
        </div>
        <div
          role="progressbar"
          aria-valuenow={Math.round(((step + 1) / IDEA_PILLARS.length) * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Quiz progress: segment ${step + 1} of ${IDEA_PILLARS.length}`}
          className="w-full bg-border rounded-full h-1.5"
        >
          <div
            className="bg-peach-dark rounded-full h-1.5 transition-all duration-500"
            style={{ width: `${((step + 1) / IDEA_PILLARS.length) * 100}%` }}
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

// ── Paywall ───────────────────────────────────────────────────────────────────

type PaymentInfo = {
  razorpayOrderId: string
  razorpayPaymentId: string
  razorpaySignature: string
}

function PaywallView({
  userEmail,
  userName,
  onPaid,
  onBack,
  price = 49900,
}: {
  userEmail: string
  userName: string
  onPaid: (info: PaymentInfo) => void
  onBack: () => void
  price?: number
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handlePay() {
    trackCta("startup-idea-score-unlock", "/startup/tools/idea-score")
    setLoading(true)
    setError("")
    try {
      const orderRes = await fetch("/api/tools/startup-idea-score/unlock-order", {
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
        description: "Startup Idea Score — Full Analysis",
        order_id: orderData.orderId,
        handler: (response: {
          razorpay_order_id: string
          razorpay_payment_id: string
          razorpay_signature: string
        }) => {
          onPaid({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          })
        },
        prefill: { name: userName, email: userEmail },
        theme: { color: "#2D2D2D" },
        modal: { ondismiss: () => setLoading(false) },
      })
      rzp.open()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <div className="bg-card border border-border rounded-2xl p-5 sm:p-8">
        <p className="text-[12px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-5">
          one-time access
        </p>
        <h2 className="font-heading text-2xl font-bold text-ink lowercase mb-2">
          unlock your startup idea score
        </h2>
        <p className="font-sans text-sm text-ink/55 leading-relaxed mb-7">
          pay once to take the quiz and get your full score — overall out of 100, all segment breakdowns, and a prioritised list of what to fix before you commit to building.
        </p>

        <div className="inline-flex items-center gap-1.5 bg-peach/40 border border-peach-dark/30 rounded-lg px-3 py-1.5 mb-7">
          <span className="font-sans text-xs text-ink/50">full breakdown</span>
          <span className="font-sans text-sm font-bold text-ink">₹{(price / 100).toLocaleString("en-IN")}</span>
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
            `pay ₹${(price / 100).toLocaleString("en-IN")} & start quiz`
          )}
        </button>

        <p className="text-[12px] font-sans text-ink/30 text-center mt-3">
          one-time payment · instant access
        </p>
      </div>

      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-[13px] font-sans text-ink/35 hover:text-ink/60 transition-colors mx-auto"
      >
        <ArrowLeft size={11} /> back
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
  const recs = getIdeaTopRecommendations(answers, 3)
  const deg = (result.totalScore / 100) * 360

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <div className="bg-card border border-border rounded-2xl p-5 sm:p-8 text-center">
        <p className="text-[12px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-6">
          startup idea score
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
      </div>

      <div className="bg-card border border-border rounded-2xl p-4 sm:p-6">
        <p className="text-[12px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-5">
          segment breakdown
        </p>
        <div className="space-y-4">
          {IDEA_PILLARS.map((pillar, i) => {
            const ps = result.pillarScores[pillar.index] ?? { earned: 0, max: pillar.maxPoints }
            const pct = (ps.earned / ps.max) * 100
            return (
              <div key={pillar.index}>
                <div className="flex justify-between text-[13px] font-sans text-ink/60 mb-1.5">
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

      {recs.length > 0 ? (
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-6">
          <p className="text-[12px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-5">
            top things to work on before you build
          </p>
          <div className="space-y-3">
            {recs.map((rec, i) => (
              <div key={i} className="flex gap-3 bg-peach/15 border border-peach-dark/15 rounded-xl p-4">
                <span className="font-heading text-lg font-bold text-peach-dark/60 w-5 flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="font-sans text-base text-ink/70 leading-relaxed">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 bg-peach/20 border border-peach-dark/20 rounded-xl px-5 py-4">
          <CheckCircle size={16} className="text-peach-dark flex-shrink-0" />
          <p className="font-sans text-sm text-ink/70">
            exceptional foundation — you&apos;ve done the groundwork most founders skip.
          </p>
        </div>
      )}

      <div className="bg-peach/30 border border-peach-dark/20 rounded-2xl p-6">
        <p className="font-heading text-lg font-bold text-ink lowercase mb-1">
          want to go deeper?
        </p>
        <p className="font-sans text-sm text-ink/60 leading-relaxed mb-5">
          book a startup idea brainstorming session with priya — turn your score into a concrete 30-day plan.
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
          className="inline-flex items-center gap-1.5 text-[13px] font-sans text-ink/35 hover:text-ink/60 transition-colors"
        >
          <RotateCcw size={11} /> take it again
        </button>
      </div>

      <div className="border-t border-border pt-5 pb-2">
        <p className="font-sans text-[12px] text-ink/30 leading-relaxed text-center max-w-md mx-auto">
          disclaimer: this score is for self-reflection and planning purposes only. it is not a guarantee that your idea will succeed or fail. startup outcomes depend on many factors beyond any quiz. use this as a thinking tool, not a verdict.
        </p>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function StartupIdeaScoreClient({
  userEmail,
  userName,
  isAdmin = false,
  price = 49900,
}: {
  userEmail: string | null
  userName: string
  isAdmin?: boolean
  price?: number
}) {
  const [view, setView] = useState<"intro" | "paywall" | "quiz" | "results">("intro")
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [result, setResult] = useState<ResultData | null>(null)
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null)
  const [submitError, setSubmitError] = useState("")

  function handleAnswer(qId: number, val: OptionValue) {
    setAnswers((prev) => ({ ...prev, [qId]: val }))
  }

  function handleBack() {
    if (view === "quiz" && step === 0) { setView(isAdmin ? "intro" : "paywall"); return }
    if (view === "quiz" && step > 0) { setStep((s) => s - 1); return }
    if (view === "paywall") { setView("intro"); return }
  }

  async function handleNext() {
    window.scrollTo({ top: 0, behavior: "smooth" })
    if (step < IDEA_PILLARS.length - 1) {
      setStep((s) => s + 1)
      return
    }
    if (isAdmin) {
      const totalScore = computeIdeaTotal(answers)
      const pillarScores = computeIdeaPillarScores(answers)
      setResult({ id: "admin", totalScore, pillarScores })
      setView("results")
      return
    }
    if (!paymentInfo) return
    setSubmitError("")
    try {
      const submitRes = await fetch("/api/tools/startup-idea-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, ...paymentInfo }),
      })
      const data = await submitRes.json()
      if (!submitRes.ok) {
        setSubmitError(data.error || "Submission failed. Email hi@priyaahuja.in with your payment ID.")
        return
      }
      const pillarScores: Record<number, { earned: number; max: number }> = {}
      for (const [k, v] of Object.entries(data.pillarScores as Record<string, { earned: number; max: number }>)) {
        pillarScores[Number(k)] = v
      }
      setResult({ id: data.id, totalScore: data.totalScore, pillarScores })
      setView("results")
    } catch {
      setSubmitError("Something went wrong. Email hi@priyaahuja.in with your payment ID.")
    }
  }

  function handlePaid(info: PaymentInfo) {
    setPaymentInfo(info)
    setStep(0)
    setView("quiz")
  }

  function handleReset() {
    setAnswers({})
    setStep(0)
    setResult(null)
    setPaymentInfo(null)
    setSubmitError("")
    setView("intro")
  }

  return (
    <div className="py-6 px-4 md:py-8 md:px-8">
      {view === "intro" && (
        <IntroView userEmail={userEmail} onStart={() => isAdmin ? setView("quiz") : setView("paywall")} price={price} />
      )}
      {view === "paywall" && userEmail && (
        <PaywallView
          userEmail={userEmail}
          userName={userName}
          onPaid={handlePaid}
          onBack={handleBack}
          price={price}
        />
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
          />
        </>
      )}
      {view === "results" && result && (
        <ResultsView result={result} answers={answers} onReset={handleReset} />
      )}
    </div>
  )
}
