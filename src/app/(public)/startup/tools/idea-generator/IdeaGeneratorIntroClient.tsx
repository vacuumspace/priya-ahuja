"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { loadRazorpay } from "@/lib/load-razorpay"
import { ArrowRight, CheckCircle, MessageCircleQuestion, Search, FileText, ChevronDown, ChevronUp, X } from "lucide-react"
import SampleReportBanner from "@/components/SampleReportBanner"
import SignInOptions from "@/components/SignInOptions"
import { trackCta } from "@/lib/analytics"

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any
  }
}

// Hand-written example, not generated from the real pipeline - so the
// question set behind it can never be reverse-engineered from a sample.
// Matches the depth of the real report field-for-field.
const SAMPLE_IDEA = {
  title: "AI companion pendant for elderly parents living alone",
  oneLiner: "A voice-first pendant that quietly listens through the day and sends NRI children a warm, honest digest of how their aging parent's day actually went.",
  whyThisFitsYou: "Two years building voice-AI features at a consumer app means direct, hands-on experience with the exact speech-recognition and ambient-audio tech this needs - not a cold technical start. Personally managing a parent's care from another country for over a year means an intimate, painful understanding of the actual gap: not a lack of love, but a lack of visibility into ordinary days. That combination - the technical ability to build ambient AI and the lived urgency of the problem - is what turns this from a nice idea into something built with real conviction.",
  theProblem: "Adult children living away from aging parents get a phone call a day at best, and most parents underreport how they're really doing to avoid worrying their kids. The gap isn't dramatic emergencies, which are visible - it's the slow, invisible drift of mood, appetite, and activity that nobody notices until it becomes a crisis. This quietly eats at NRI families constantly, but there's no ambient way to know without turning a parent's home into a surveillance state, which most families reject outright.",
  targetCustomer: "An NRI professional in their 30s-50s with a parent aged 65+ living alone or with limited daily support back home. They already send money for care and have tried and abandoned intrusive camera-based solutions their parent resented. They're willing to pay a real monthly premium for genuine peace of mind, not just a checkbox feature.",
  marketEvidence: "India's NRI population sending remittances specifically earmarked for eldercare has grown steadily, and elderly-alone households in urban India are rising as more adult children move abroad or to other cities for work. Ambient voice-AI hardware has only become viable in the last two years as on-device speech processing got cheap and accurate enough to run without constant cloud dependence, which is exactly why this wasn't buildable affordably before now.",
  marketSize: "Even a conservative slice of urban NRI households with an elderly parent living alone - realistically in the low millions globally - at a modest monthly subscription supports a durable, healthy business without needing anywhere near the whole addressable population.",
  competitorLandscape: "Existing options split into two unsatisfying extremes: consumer camera-based elder-monitoring systems that parents resent as surveillance, and expensive human-staffed caregiving services that are hard to scale and trust remotely. Nothing occupies the ambient, dignity-preserving middle ground this fills.",
  keyCompetitors: ["Camera-based home monitoring brands - functional but parents resent the surveillance feel and often unplug them", "Human caregiver placement services - trustworthy but expensive, hard to verify remotely, and don't scale"],
  differentiation: "The wedge is dignity: no camera, no constant video feed, just a warm daily digest built from ambient listening - designed to feel like care, not surveillance, which is precisely what makes elderly parents willing to actually keep it on.",
  businessModel: "Sell the pendant hardware near cost to remove the adoption barrier, and make the real margin on a monthly subscription for the AI digest and family app - similar to how connected fitness hardware monetizes on the ongoing service, not the device.",
  mvp: "A single hardware prototype with one feature only: ambient listening that produces one daily text digest, sent to the child over WhatsApp. No app, no dashboard, no mood-scoring algorithm yet - just enough to test whether the digest itself, however roughly generated, changes behavior and earns trust. Everything else (a polished app, multiple family members, health integrations) waits until this core loop is proven.",
  gtmPlan: [
    { phase: "days 1-30", steps: ["Build a working pendant prototype with a single core feature: the daily digest", "Recruit 10 NRI families personally for a paid pilot"] },
    { phase: "days 31-60", steps: ["Refine the digest based on real pilot feedback on tone and false alerts", "Start word-of-mouth referrals through NRI community WhatsApp and Facebook groups"] },
    { phase: "days 61-90", steps: ["Formalize pricing and the subscription flow", "Identify one manufacturing partner for a small first production batch"] },
  ],
  capitalNeeded: "₹15-25 lakh - split between hardware prototyping/tooling and the first small manufacturing run",
  timeToFirstRevenue: "90-120 days, gated by getting the first pilot pendants into real homes and iterating on trust",
  biggestRisk: "If the ambient listening ever feels invasive or the digest gets a parent's day wrong, trust breaks immediately and is very hard to win back with either the parent or the paying child.",
  riskMitigation: "Launch with the parent, not just the child, as a co-decision-maker on what's shared - full transparency into exactly what the pendant does and doesn't record builds the trust needed to keep it on.",
  firstValidationStep: "Build a rough prototype, place it in one real household for two weeks, and see whether the parent keeps it on unprompted and whether the child genuinely changes behavior based on the digest.",
}

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ")
}

// A collapsible subsection within an idea card - default collapsed so the
// card doesn't dump a wall of text; matches the real report's cards.
function Section({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-border/60 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 text-left hover:bg-peach/10 transition-colors"
      >
        <span className="text-[11px] font-sans text-ink/40 uppercase tracking-wide">{label}</span>
        {open ? <ChevronUp size={13} className="text-ink/30 flex-shrink-0" /> : <ChevronDown size={13} className="text-ink/30 flex-shrink-0" />}
      </button>
      {open && <div className="px-3.5 pb-3">{children}</div>}
    </div>
  )
}

function SampleReport() {
  return (
    <SampleReportBanner description="how one of your five ideas will look - example data, not yours">
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="bg-[#2D2D2D] px-6 py-4">
          <p className="text-[12px] font-sans text-[#FEF9E7]/40 uppercase tracking-[0.18em]">idea 1 of 5</p>
        </div>
        <div className="px-6 py-5 space-y-2.5">
          <div className="mb-2">
            <h3 className="font-heading text-lg font-bold text-ink lowercase mb-1">{SAMPLE_IDEA.title}</h3>
            <p className="font-sans text-sm text-ink/60 leading-relaxed">{SAMPLE_IDEA.oneLiner}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 pb-2">
            <div>
              <p className="text-[11px] font-sans text-ink/30 uppercase tracking-wide">capital needed</p>
              <p className="font-sans text-sm font-semibold text-ink">{SAMPLE_IDEA.capitalNeeded}</p>
            </div>
            <div>
              <p className="text-[11px] font-sans text-ink/30 uppercase tracking-wide">time to first revenue</p>
              <p className="font-sans text-sm font-semibold text-ink">{SAMPLE_IDEA.timeToFirstRevenue}</p>
            </div>
          </div>

          {[
            ["why this fits you", SAMPLE_IDEA.whyThisFitsYou],
            ["the problem", SAMPLE_IDEA.theProblem],
            ["target customer", SAMPLE_IDEA.targetCustomer],
            ["market evidence", SAMPLE_IDEA.marketEvidence],
            ["market size", SAMPLE_IDEA.marketSize],
            ["competitor landscape", SAMPLE_IDEA.competitorLandscape],
          ].map(([label, text]) => (
            <Section key={label} label={label}>
              <p className="font-sans text-[13px] text-ink/70 leading-relaxed">{text}</p>
            </Section>
          ))}

          <Section label="who else is in this space">
            <ul className="space-y-1">
              {SAMPLE_IDEA.keyCompetitors.map((c, i) => (
                <li key={i} className="font-sans text-[13px] text-ink/70 leading-relaxed flex gap-2">
                  <span className="text-peach-dark/60 flex-shrink-0">•</span>
                  {c}
                </li>
              ))}
            </ul>
          </Section>

          {[
            ["differentiation", SAMPLE_IDEA.differentiation],
            ["business model", SAMPLE_IDEA.businessModel],
            ["mvp - what to build first", SAMPLE_IDEA.mvp],
          ].map(([label, text]) => (
            <Section key={label} label={label}>
              <p className="font-sans text-[13px] text-ink/70 leading-relaxed">{text}</p>
            </Section>
          ))}

          <Section label="go-to-market plan">
            <div className="space-y-3">
              {SAMPLE_IDEA.gtmPlan.map((phase, pi) => (
                <div key={pi} className="bg-cream/50 border border-border/60 rounded-xl px-4 py-3">
                  <p className="font-sans text-[12px] font-semibold text-ink/60 uppercase tracking-wide mb-1.5">{phase.phase}</p>
                  <ul className="space-y-1">
                    {phase.steps.map((step, i) => (
                      <li key={i} className="font-sans text-[13px] text-ink/70 leading-relaxed flex gap-2">
                        <span className="text-peach-dark/60 font-bold flex-shrink-0">{i + 1}.</span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>

          <Section label="biggest risk">
            <div className="space-y-2">
              <p className="font-sans text-[13px] text-ink/70 leading-relaxed">{SAMPLE_IDEA.biggestRisk}</p>
              <div>
                <p className="text-[11px] font-sans text-ink/30 uppercase tracking-wide mb-0.5">how to mitigate it</p>
                <p className="font-sans text-[13px] text-ink/70 leading-relaxed">{SAMPLE_IDEA.riskMitigation}</p>
              </div>
            </div>
          </Section>

          <Section label="test this first">
            <p className="font-sans text-[13px] text-ink/70 leading-relaxed">{SAMPLE_IDEA.firstValidationStep}</p>
          </Section>
        </div>
      </div>
    </SampleReportBanner>
  )
}

export default function IdeaGeneratorIntroClient({
  userEmail,
  userName,
  price,
  resumeId,
  existingReportId,
  hasPaidUnlock,
}: {
  userEmail: string | null
  userName: string
  price: number
  resumeId: string | null
  existingReportId: string | null
  hasPaidUnlock: boolean
}) {
  const router = useRouter()
  const isSignedIn = !!userEmail
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showSignIn, setShowSignIn] = useState(false)

  async function goToWizard() {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/tools/idea-generator/start", { method: "POST" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Something went wrong")
      router.push(`/startup/tools/idea-generator/${data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setLoading(false)
    }
  }

  async function handlePay() {
    trackCta("idea-generator-unlock", "/startup/tools/idea-generator")
    setLoading(true)
    setError("")
    try {
      const orderRes = await fetch("/api/tools/idea-generator/unlock-order", { method: "POST" })
      const orderData = await orderRes.json()
      if (!orderRes.ok) throw new Error(orderData.error || "Failed to create order")

      await loadRazorpay()
      const rzp = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: "INR",
        name: "Priya Ahuja",
        description: "Personalised Startup Idea Generator",
        order_id: orderData.orderId,
        handler: async (response: {
          razorpay_order_id: string
          razorpay_payment_id: string
          razorpay_signature: string
        }) => {
          try {
            await fetch("/api/tools/verify-unlock", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            })
          } catch {
            // webhook will confirm it server-side
          }
          goToWizard()
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

  if (resumeId) {
    router.replace(`/startup/tools/idea-generator/${resumeId}`)
    return null
  }
  if (existingReportId) {
    router.replace(`/startup/tools/idea-generator/${existingReportId}`)
    return null
  }

  const startButton = (className?: string) => (
    <button
      onClick={
        !isSignedIn
          ? () => setShowSignIn(true)
          : hasPaidUnlock
          ? goToWizard
          : handlePay
      }
      disabled={loading}
      className={cn(
        "w-full inline-flex items-center justify-center gap-2 bg-ink text-cream font-sans text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-ink/80 transition-colors shadow-md disabled:opacity-60",
        className
      )}
    >
      {loading ? "please wait..." : "Get personalised startup ideas"}
      <ArrowRight size={18} />
    </button>
  )

  return (
    <div className="min-h-screen bg-cream py-8 px-4 md:py-10 md:px-8">
      <div className="max-w-xl mx-auto space-y-5">
        <div className="bg-card border border-border rounded-2xl p-5 sm:p-8">
          <h1 className="font-heading text-3xl font-bold text-ink mb-3 lowercase">
            personalised startup idea generator
          </h1>
          <div className="grid sm:grid-cols-3 gap-3 mb-5">
            {[
              { icon: MessageCircleQuestion, title: "answer honestly", text: "share your inputs on our questions. don't rush, spend 30-60 minutes, don't use AI." },
              { icon: Search, title: "we go deep", text: "it takes around 45-60 minutes for us to find personalised ideas for you." },
              { icon: FileText, title: "get 5 ideas", text: "niche, non-obvious, overlooked, unique - only for you." },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="bg-cream/60 border border-border rounded-xl p-4">
                <span className="w-9 h-9 rounded-xl bg-peach-dark/15 flex items-center justify-center mb-3">
                  <Icon size={16} className="text-peach-dark" />
                </span>
                <h3 className="font-heading text-sm font-bold text-ink lowercase mb-1">{title}</h3>
                <p className="font-sans text-[12.5px] text-ink/55 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>

          <p className="font-sans text-[11px] text-ink/30 uppercase tracking-wide mb-2">each idea comes with</p>
          <div className="grid grid-cols-2 gap-2 mb-5">
            {[
              "why it fits your background",
              "the problem, sized and specific",
              "market evidence, not guesses",
              "named competitors & the gap",
              "how it actually makes money",
              "the MVP - what to build first",
              "a 30/60/90-day plan",
              "the biggest risk, and the fix",
              "the cheapest way to test it",
            ].map((point) => (
              <div key={point} className="flex items-center gap-2 bg-cream/60 border border-border/60 rounded-lg px-3 py-2">
                <span className="w-1.5 h-1.5 rounded-full bg-peach-dark flex-shrink-0" />
                <span className="font-sans text-[12.5px] text-ink/60 leading-snug">{point}</span>
              </div>
            ))}
          </div>

          {hasPaidUnlock ? (
            <div className="inline-flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5 mb-3">
              <CheckCircle size={13} className="text-green-700" />
              <span className="font-sans text-xs text-green-800">payment received - continue to your questions</span>
            </div>
          ) : (
            <p className="font-sans text-xs text-ink/40 mb-3 text-center">
              <span className="font-semibold text-ink/60">₹{(price / 100).toLocaleString("en-IN")}</span> · 5 personalised ideas
            </p>
          )}

          {startButton("mb-2")}
          {error && <p className="font-sans text-xs text-red-600 mt-2">{error}</p>}
        </div>

        {isSignedIn && (
          <p className="text-[12px] font-sans text-ink/30 text-center">signed in as {userEmail}</p>
        )}

        <SampleReport />
      </div>

      {showSignIn && (
        <div
          className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowSignIn(false) }}
        >
          <div className="bg-cream rounded-2xl w-full max-w-sm shadow-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-heading text-xl font-700 text-ink">sign in to continue</h3>
              <button onClick={() => setShowSignIn(false)} className="text-ink/40 hover:text-ink transition-colors">
                <X size={18} />
              </button>
            </div>
            <p className="font-sans text-sm text-ink/60 mb-5 leading-relaxed">
              sign in to pay and start your personalised startup ideas report.
            </p>
            <SignInOptions callbackUrl="/startup/tools/idea-generator" compact />
          </div>
        </div>
      )}
    </div>
  )
}
