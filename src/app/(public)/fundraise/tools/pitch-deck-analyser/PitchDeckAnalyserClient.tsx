"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, FileUp, FileText, X, Loader2, CheckCircle, Download } from "lucide-react"
import SignInOptions from "@/components/SignInOptions"
import SampleReportBanner from "@/components/SampleReportBanner"
import PitchDeckReportView from "@/components/pitch-deck/PitchDeckReportView"
import { loadRazorpay } from "@/lib/load-razorpay"
import { trackCta } from "@/lib/analytics"
import { MAX_DECK_SIZE_BYTES, SAMPLE_DECK_REPORT, type PitchDeckReport } from "@/lib/pitch-deck-report"

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any
  }
}

const TOOL_PATH = "/fundraise/tools/pitch-deck-analyser"

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ")
}

function formatPrice(paise: number) {
  return `₹${(paise / 100).toLocaleString("en-IN")}`
}

// ── Intro ─────────────────────────────────────────────────────────────────────

const WHAT_YOU_GET = [
  { title: "score out of 100", desc: "calibrated to how a VC reads a cold deck - not a feel-good number" },
  { title: "20-section audit", desc: "problem, niche, moat, why now, unit economics, the ask - what's strong, what's weak, what's missing entirely" },
  { title: "story & narrative check", desc: "does your deck build a story, or just list slides?" },
  { title: "silent deal-killers", desc: "the red flags investors never tell you about - they just don't reply" },
  { title: "story rewrites", desc: "your weakest lines rewritten investor-ready, using your own facts" },
  { title: "investor question prep", desc: "the questions your deck fails to answer - before you're in the room" },
]

function IntroView({ userEmail, onStart, price }: { userEmail: string | null; onStart: () => void; price: number }) {
  const isSignedIn = !!userEmail

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <div className="bg-card border border-border rounded-2xl p-5 sm:p-8">
        <p className="text-[12px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-5">
          upload pdf · AI analysis · detailed report
        </p>
        <h1 className="font-heading text-3xl font-bold text-ink mb-3 lowercase">
          pitch deck analyser
        </h1>
        <p className="font-sans text-sm text-ink/60 leading-relaxed mb-5">
          an investor spends under 3 minutes on your deck before deciding whether you get a meeting. this tool reads your deck the same way - then tells you what that read-through actually communicated, section by section, and exactly how to fix the story so it earns the meeting.
        </p>
        <div className="inline-flex items-center gap-1.5 bg-peach/40 border border-peach-dark/30 rounded-lg px-3 py-1.5 mb-7">
          <span className="font-sans text-xs text-ink/50">full report</span>
          <span className="font-sans text-sm font-bold text-ink">{formatPrice(price)}</span>
        </div>

        <button
          onClick={isSignedIn ? onStart : () => signIn("google", { callbackUrl: TOOL_PATH })}
          className="w-full inline-flex items-center justify-center gap-2 bg-ink text-cream font-sans text-base font-bold px-6 py-4 rounded-xl hover:bg-ink/80 transition-colors shadow-md mb-7"
        >
          {isSignedIn ? "analyse my deck" : "sign in to analyse your deck"}
          <ArrowRight size={18} />
        </button>

        <div className="rounded-xl border border-border overflow-hidden">
          <div className="text-[12px] font-sans text-ink/35 uppercase tracking-widest px-4 py-2 bg-peach/20 border-b border-border">
            what&apos;s in the report
          </div>
          {WHAT_YOU_GET.map((item) => (
            <div key={item.title} className="px-4 py-2.5 border-b border-border/50 last:border-0">
              <p className="font-sans text-xs font-semibold text-ink/75">{item.title}</p>
              <p className="font-sans text-xs text-ink/45 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <p className="font-sans text-[12px] text-ink/35 leading-relaxed mt-5">
          pdf format · max 4 MB · your deck is analysed to generate this report, then discarded - we store only the report, never the file.
        </p>
      </div>

      {isSignedIn && (
        <p className="text-[12px] font-sans text-ink/30 text-center">
          signed in as {userEmail}
        </p>
      )}

      <SampleDeckReport userEmail={userEmail} />
    </div>
  )
}

function SampleDeckReport({ userEmail }: { userEmail: string | null }) {
  const isSignedIn = !!userEmail
  const [showSignIn, setShowSignIn] = useState(false)

  return (
    <SampleReportBanner description="how your deck analysis will look - example data from a fictional startup, not your deck">
      <div className={cn("relative", !isSignedIn && "select-none")}>
        <div className={cn(!isSignedIn && "blur-sm pointer-events-none")}>
          <PitchDeckReportView report={SAMPLE_DECK_REPORT} fileName="kiranastack-seed-deck.pdf" />
        </div>

        {!isSignedIn && (
          <div className="absolute inset-0 flex items-start justify-center pt-6">
            <div className="bg-cream/95 border border-border rounded-2xl px-6 py-5 text-center shadow-sm max-w-xs mx-4">
              <p className="font-heading text-base font-bold text-ink lowercase mb-1">see a sample report</p>
              <p className="font-sans text-xs text-ink/55 leading-relaxed mb-4">sign in to preview what your deck analysis will look like.</p>
              {showSignIn ? (
                <SignInOptions callbackUrl={TOOL_PATH} compact googleLabel="sign in to preview" />
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
  price,
}: {
  userEmail: string
  userName: string
  onPaid: (info: PaymentInfo) => void
  onBack: () => void
  price: number
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handlePay() {
    trackCta("pitch-deck-analyser-unlock", TOOL_PATH)
    setLoading(true)
    setError("")
    try {
      const orderRes = await fetch("/api/tools/pitch-deck-analyser/unlock-order", {
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
        description: "Pitch Deck Analyser - Full Report",
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

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <div className="bg-card border border-border rounded-2xl p-5 sm:p-8">
        <p className="text-[12px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-5">
          one deck · one full report
        </p>
        <h2 className="font-heading text-2xl font-bold text-ink lowercase mb-2">
          unlock your pitch deck analysis
        </h2>
        <p className="font-sans text-sm text-ink/55 leading-relaxed mb-7">
          pay once to upload your deck and get the full report - overall score, 20-section audit, story rewrites, silent deal-killers, and the investor questions you&apos;re not ready for yet.
        </p>

        <div className="inline-flex items-center gap-1.5 bg-peach/40 border border-peach-dark/30 rounded-lg px-3 py-1.5 mb-7">
          <span className="font-sans text-xs text-ink/50">full report</span>
          <span className="font-sans text-sm font-bold text-ink">{formatPrice(price)}</span>
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
            `pay ${formatPrice(price)} & upload deck`
          )}
        </button>

        <p className="text-[12px] font-sans text-ink/30 text-center mt-3">
          one-time payment · report saved to your account
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

// ── Upload ────────────────────────────────────────────────────────────────────

function UploadView({
  onSubmit,
  error,
  onBack,
  isAdmin = false,
}: {
  onSubmit: (file: File) => void
  error: string
  onBack: () => void
  isAdmin?: boolean
}) {
  const [file, setFile] = useState<File | null>(null)
  const [localError, setLocalError] = useState("")
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const pickFile = useCallback((f: File | undefined) => {
    setLocalError("")
    if (!f) return
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
      setLocalError("pdf only - export your deck as a PDF and try again.")
      return
    }
    if (f.size > MAX_DECK_SIZE_BYTES) {
      setLocalError("that file is over 4 MB. compress the PDF first (investors prefer light decks in their inbox anyway).")
      return
    }
    setFile(f)
  }, [])

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <div className="bg-card border border-border rounded-2xl p-5 sm:p-8">
        <p className="text-[12px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-5">
          {isAdmin ? "admin test mode · no payment needed" : "payment confirmed · upload your deck"}
        </p>
        <h2 className="font-heading text-2xl font-bold text-ink lowercase mb-2">
          upload your pitch deck
        </h2>
        <p className="font-sans text-sm text-ink/55 leading-relaxed mb-6">
          upload the exact PDF you&apos;d send an investor - not a draft, not a script. the report is only as honest as the deck you give it.
        </p>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragging(false)
            pickFile(e.dataTransfer.files?.[0])
          }}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "cursor-pointer border-2 border-dashed rounded-2xl px-6 py-10 text-center transition-colors mb-4",
            dragging ? "border-peach-dark bg-peach/20" : "border-border hover:border-peach-dark/50 hover:bg-peach/10"
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={(e) => {
              pickFile(e.target.files?.[0])
              e.target.value = ""
            }}
          />
          {file ? (
            <div className="flex items-center justify-center gap-3">
              <FileText size={20} className="text-peach-dark flex-shrink-0" />
              <div className="text-left min-w-0">
                <p className="font-sans text-sm font-semibold text-ink truncate">{file.name}</p>
                <p className="font-sans text-xs text-ink/40">{(file.size / (1024 * 1024)).toFixed(1)} MB</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setFile(null) }}
                className="flex-shrink-0 p-1.5 rounded-full hover:bg-ink/5 text-ink/40 hover:text-ink/70 transition-colors"
                aria-label="Remove file"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <>
              <FileUp size={28} className="text-peach-dark/60 mx-auto mb-3" />
              <p className="font-sans text-sm font-semibold text-ink/70 mb-1">drop your deck here, or tap to choose</p>
              <p className="font-sans text-xs text-ink/40">pdf · max 4 MB</p>
            </>
          )}
        </div>

        {(localError || error) && (
          <p className="font-sans text-xs text-red-500 mb-4 leading-relaxed">{localError || error}</p>
        )}

        <button
          onClick={() => file && onSubmit(file)}
          disabled={!file}
          className={cn(
            "w-full inline-flex items-center justify-center gap-2 font-sans text-sm font-semibold px-6 py-3 rounded-xl transition-colors",
            file ? "bg-ink text-cream hover:bg-ink/80" : "bg-ink/20 text-ink/40 cursor-not-allowed"
          )}
        >
          analyse my deck
          <ArrowRight size={16} />
        </button>

        <p className="text-[12px] font-sans text-ink/30 text-center mt-3">
          takes about a minute · your file is never stored
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

// ── Analysing ─────────────────────────────────────────────────────────────────

const ANALYSING_STEPS = [
  "reading your deck the way a VC does - fast, looking for a reason to say no",
  "checking all 20 sections investors expect to find",
  "stress-testing the story arc - hook, tension, proof, ask",
  "probing niche, moat, and unit economics",
  "hunting for silent deal-killers",
  "rewriting your weakest lines",
  "writing your report",
]

function AnalysingView({ fileName }: { fileName: string }) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setElapsed((e) => e + 0.5), 500)
    return () => clearInterval(t)
  }, [])

  // fills fast at first, then eases toward 95% until the real response lands
  const progress = Math.min(95, Math.round(100 * (1 - Math.exp(-elapsed / 30))))
  const stepIdx = Math.min(ANALYSING_STEPS.length - 1, Math.floor(elapsed / 8))

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-10">
        <div className="text-center mb-6">
          <Loader2 size={32} className="text-peach-dark mx-auto mb-4 animate-spin" />
          <h2 className="font-heading text-xl font-bold text-ink lowercase break-words">analysing {fileName}</h2>
        </div>

        {/* Progress bar */}
        <div className="mb-7">
          <div className="flex justify-between items-baseline mb-1.5">
            <span className="font-sans text-[11px] text-ink/40 uppercase tracking-wide">analysis progress</span>
            <span className="font-mono text-xs font-semibold text-peach-dark">{progress}%</span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Deck analysis progress"
            className="w-full h-2 bg-border rounded-full overflow-hidden"
          >
            <div className="h-2 bg-peach-dark rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Step checklist */}
        <div className="space-y-2">
          {ANALYSING_STEPS.map((step, i) => {
            const done = i < stepIdx
            const current = i === stepIdx
            return (
              <div
                key={i}
                className={cn(
                  "flex items-start gap-2.5 rounded-xl px-3 py-2 transition-colors duration-500",
                  current && "bg-peach/40 border border-peach-dark/30",
                  !current && "border border-transparent"
                )}
              >
                <span className="flex-shrink-0 mt-0.5">
                  {done ? (
                    <CheckCircle size={14} className="text-green-600" />
                  ) : current ? (
                    <Loader2 size={14} className="text-peach-dark animate-spin" />
                  ) : (
                    <span className="block w-3.5 h-3.5 rounded-full border border-border" />
                  )}
                </span>
                <p
                  className={cn(
                    "font-sans text-[13px] leading-relaxed",
                    current ? "text-ink font-semibold" : done ? "text-ink/45" : "text-ink/30"
                  )}
                >
                  {step}{current && "…"}
                </p>
              </div>
            )
          })}
        </div>

        <p className="font-sans text-[12px] text-ink/30 mt-6 text-center">
          takes about a minute - keep this tab open.
        </p>
      </div>
    </div>
  )
}

// ── Results ───────────────────────────────────────────────────────────────────

function ResultsView({ report, fileName }: { report: PitchDeckReport; fileName: string }) {
  return (
    <div className="max-w-xl mx-auto space-y-5">
      <div className="flex items-center justify-between mb-1 print:hidden">
        <div className="inline-flex items-center gap-1.5 text-[13px] font-sans text-green-700">
          <CheckCircle size={13} />
          report saved to <Link href="/my-activity?tab=tools&sub=pitchdeck" className="underline hover:text-green-800">my activity</Link>
        </div>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 text-[13px] font-sans text-ink/40 hover:text-ink/70 transition-colors border border-border rounded-lg px-3 py-1.5"
        >
          <Download size={11} /> save as PDF
        </button>
      </div>

      <PitchDeckReportView report={report} fileName={fileName} />

      {/* Pitch review upsell */}
      <div className="bg-peach/30 border border-peach-dark/20 rounded-2xl p-6 print:hidden">
        <p className="font-heading text-lg font-bold text-ink lowercase mb-1">
          want a human on this?
        </p>
        <p className="font-sans text-sm text-ink/60 leading-relaxed mb-5">
          fix the deck with this report, then book a 1:1 pitch review with priya - practice the live delivery and pressure-test your answers to the investor questions above.
        </p>
        <Link
          href="/connect"
          className="inline-flex items-center gap-2 bg-ink text-cream text-xs font-sans font-semibold px-5 py-2.5 rounded-xl hover:bg-ink/80 transition-colors"
        >
          book a pitch review session
        </Link>
      </div>

      <div className="border-t border-border pt-5 pb-2">
        <p className="font-sans text-[12px] text-ink/30 leading-relaxed text-center max-w-md mx-auto">
          disclaimer: this AI-generated analysis is for informational purposes only and is not investment advice or a guarantee of fundraising outcomes. investors weigh many factors beyond the deck. use it as one honest data point, not a verdict.
        </p>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function PitchDeckAnalyserClient({
  userEmail,
  userName,
  isAdmin = false,
  price = 19900,
}: {
  userEmail: string | null
  userName: string
  isAdmin?: boolean
  price?: number
}) {
  const [view, setView] = useState<"intro" | "paywall" | "upload" | "analysing" | "results">("intro")
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null)
  const [report, setReport] = useState<PitchDeckReport | null>(null)
  const [fileName, setFileName] = useState("")
  const [submitError, setSubmitError] = useState("")

  function handleStart() {
    setView(isAdmin ? "upload" : "paywall")
  }

  function handlePaid(info: PaymentInfo) {
    setPaymentInfo(info)
    setSubmitError("")
    setView("upload")
  }

  async function handleSubmit(file: File) {
    if (!isAdmin && !paymentInfo) {
      setSubmitError("payment not found - go back and complete payment first.")
      return
    }
    setSubmitError("")
    setFileName(file.name)
    setView("analysing")
    window.scrollTo({ top: 0, behavior: "smooth" })

    try {
      const formData = new FormData()
      formData.append("file", file)
      if (paymentInfo) {
        formData.append("razorpayOrderId", paymentInfo.razorpayOrderId)
        formData.append("razorpayPaymentId", paymentInfo.razorpayPaymentId)
        formData.append("razorpaySignature", paymentInfo.razorpaySignature)
      }

      const res = await fetch("/api/tools/pitch-deck-analyser", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()

      if (!res.ok) {
        // payment stays valid on analysis failures - send them back to upload to retry
        setSubmitError(
          data.error ||
          `Something went wrong. Your payment is safe - try again, or email hi@priyaahuja.in${paymentInfo ? ` with payment ID ${paymentInfo.razorpayPaymentId}` : ""}.`
        )
        setView("upload")
        return
      }

      setReport(data.report)
      setView("results")
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch {
      setSubmitError(
        `Something went wrong. Your payment is safe - try again, or email hi@priyaahuja.in${paymentInfo ? ` with payment ID ${paymentInfo.razorpayPaymentId}` : ""}.`
      )
      setView("upload")
    }
  }

  return (
    <div className="py-6 px-4 md:py-8 md:px-8">
      {view === "intro" && (
        <IntroView userEmail={userEmail} onStart={handleStart} price={price} />
      )}
      {view === "paywall" && userEmail && (
        <PaywallView
          userEmail={userEmail}
          userName={userName}
          onPaid={handlePaid}
          onBack={() => setView("intro")}
          price={price}
        />
      )}
      {view === "upload" && (
        <UploadView
          onSubmit={handleSubmit}
          error={submitError}
          onBack={() => setView("intro")}
          isAdmin={isAdmin}
        />
      )}
      {view === "analysing" && <AnalysingView fileName={fileName} />}
      {view === "results" && report && (
        <ResultsView report={report} fileName={fileName} />
      )}
    </div>
  )
}
