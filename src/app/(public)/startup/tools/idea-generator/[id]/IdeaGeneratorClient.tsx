"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowLeft, ArrowRight, Sparkles, RefreshCw, ChevronDown, ChevronUp } from "lucide-react"
import { IDEA_GEN_QUESTIONS, type GenQuestion } from "@/lib/idea-generator-questions"
import type { GeneratedIdea, IdeaGenReportData } from "@/lib/idea-generator"

type Mode = "answering" | "processing" | "ready" | "failed"

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ")
}

// ── Wizard ────────────────────────────────────────────────────────────────

function QuestionInput({
  question,
  value,
  onChange,
}: {
  question: GenQuestion
  value: string | string[] | undefined
  onChange: (v: string | string[]) => void
}) {
  if (question.type === "textarea") {
    return (
      <textarea
        autoFocus
        rows={4}
        value={(value as string) ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={question.placeholder}
        className="w-full font-sans text-sm text-ink bg-card border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-peach-dark/50 resize-none"
      />
    )
  }
  if (question.type === "text") {
    return (
      <input
        autoFocus
        type="text"
        value={(value as string) ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={question.placeholder}
        className="w-full font-sans text-sm text-ink bg-card border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-peach-dark/50"
      />
    )
  }
  if (question.type === "select") {
    return (
      <div className="space-y-2">
        {question.options?.map((opt) => (
          <div
            key={opt}
            onClick={() => onChange(opt)}
            className={cn(
              "cursor-pointer rounded-xl border px-4 py-2.5 transition-all select-none font-sans text-sm",
              value === opt
                ? "bg-peach/30 border-peach-dark ring-1 ring-peach-dark/40 text-ink font-semibold"
                : "bg-card border-border hover:border-peach-dark/40 hover:bg-peach/10 text-ink/80"
            )}
          >
            {opt}
          </div>
        ))}
      </div>
    )
  }
  // multiselect
  const selected = Array.isArray(value) ? value : []
  return (
    <div className="space-y-2">
      {question.options?.map((opt) => {
        const isOn = selected.includes(opt)
        return (
          <div
            key={opt}
            onClick={() => onChange(isOn ? selected.filter((o) => o !== opt) : [...selected, opt])}
            className={cn(
              "cursor-pointer rounded-xl border px-4 py-2.5 transition-all select-none font-sans text-sm",
              isOn
                ? "bg-peach/30 border-peach-dark ring-1 ring-peach-dark/40 text-ink font-semibold"
                : "bg-card border-border hover:border-peach-dark/40 hover:bg-peach/10 text-ink/80"
            )}
          >
            {opt}
          </div>
        )
      })}
    </div>
  )
}

function Wizard({
  id,
  initialStep,
  initialAnswers,
  onSubmitted,
}: {
  id: string
  initialStep: number
  initialAnswers: Record<string, string | string[]>
  onSubmitted: () => void
}) {
  const [step, setStep] = useState(Math.min(initialStep, IDEA_GEN_QUESTIONS.length - 1))
  const [answers, setAnswers] = useState<Record<string, string | string[]>>(initialAnswers)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const question = IDEA_GEN_QUESTIONS[step]
  const value = answers[question.id]
  const hasValue = Array.isArray(value) ? value.length > 0 : !!(value && value.trim?.() !== "")
  const canAdvance = question.optional || hasValue
  const isLast = step === IDEA_GEN_QUESTIONS.length - 1

  async function saveAnswer(nextStep: number) {
    setSaving(true)
    try {
      await fetch(`/api/tools/idea-generator/${id}/answer`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: question.id, value: value ?? "", step: nextStep }),
      })
    } finally {
      setSaving(false)
    }
  }

  async function handleNext() {
    if (!canAdvance) return
    if (isLast) {
      await saveAnswer(step)
      setSaving(true)
      setError("")
      try {
        const res = await fetch(`/api/tools/idea-generator/${id}/submit`, { method: "POST" })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Something went wrong")
        onSubmitted()
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong")
        setSaving(false)
      }
      return
    }
    const nextStep = step + 1
    await saveAnswer(nextStep)
    setStep(nextStep)
  }

  function handleBack() {
    if (step === 0) return
    setStep(step - 1)
  }

  const totalAnswered = IDEA_GEN_QUESTIONS.filter((q) => {
    const v = answers[q.id]
    return Array.isArray(v) ? v.length > 0 : !!(v && (v as string).trim?.() !== "")
  }).length

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <p key={step} className="text-[12px] font-sans text-ink/40 animate-in fade-in duration-300">
            question {step + 1} of {IDEA_GEN_QUESTIONS.length}
          </p>
          <p className="text-[12px] font-sans text-ink/30">{totalAnswered} answered</p>
        </div>
        <div className="w-full bg-border rounded-full h-1.5">
          <div
            className="bg-peach-dark rounded-full h-1.5 transition-all duration-500"
            style={{ width: `${((step + 1) / IDEA_GEN_QUESTIONS.length) * 100}%` }}
          />
        </div>
      </div>

      <div key={step} className="animate-in fade-in duration-300 bg-card border border-border rounded-2xl p-5 sm:p-7">
        <p className="font-sans text-base font-semibold text-ink mb-1 leading-relaxed">
          {question.prompt}
          {question.optional && <span className="text-ink/30 font-normal text-sm"> (optional)</span>}
        </p>
        {question.helper && <p className="font-sans text-xs text-ink/45 mb-4 leading-relaxed">{question.helper}</p>}
        <div className={question.helper ? "" : "mt-4"}>
          <QuestionInput question={question} value={value} onChange={(v) => setAnswers((prev) => ({ ...prev, [question.id]: v }))} />
        </div>
      </div>

      {error && <p className="font-sans text-xs text-red-600 mt-3">{error}</p>}

      <div className="flex items-center justify-between mt-6">
        <button
          onClick={handleBack}
          disabled={step === 0 || saving}
          className="inline-flex items-center gap-1.5 text-sm font-sans text-ink/50 hover:text-ink transition-colors disabled:opacity-30"
        >
          <ArrowLeft size={14} /> back
        </button>

        <button
          onClick={handleNext}
          disabled={!canAdvance || saving}
          className={cn(
            "inline-flex items-center gap-2 font-sans text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors",
            canAdvance && !saving ? "bg-ink text-cream hover:bg-ink/80" : "bg-ink/20 text-ink/40 cursor-not-allowed"
          )}
        >
          {saving ? "saving..." : isLast ? "submit - lock in my answers" : "next"}
          {!saving && <ArrowRight size={14} />}
        </button>
      </div>
    </div>
  )
}

// ── Progress ─────────────────────────────────────────────────────────────

function ProgressView({
  progressPct,
  stageLabel,
}: {
  progressPct: number
  stageLabel: string
}) {
  return (
    <div className="max-w-xl mx-auto text-center py-10">
      <div className="w-14 h-14 rounded-2xl bg-peach/40 flex items-center justify-center mx-auto mb-6">
        <Sparkles size={24} className="text-peach-dark" />
      </div>
      <h1 className="font-heading text-2xl font-bold text-ink mb-2 lowercase">researching your report</h1>
      <p key={stageLabel} className="font-sans text-sm text-ink/55 mb-8 animate-in fade-in duration-500">{stageLabel}</p>

      <div className="w-full bg-border rounded-full h-3 mb-2">
        <div
          className="bg-peach-dark rounded-full h-3 transition-all duration-1000 ease-linear"
          style={{ width: `${progressPct}%` }}
        />
      </div>
      <p className="font-sans text-xs text-ink/40">{progressPct}%</p>

      <p className="font-sans text-xs text-ink/35 mt-8 leading-relaxed">
        this takes 45-60 minutes - we&apos;re actually researching your market and competitors, not showing a spinner. you can close this tab and come back anytime; your report will be waiting.
      </p>
    </div>
  )
}

// ── Report ───────────────────────────────────────────────────────────────

// A collapsible subsection within an idea card - each section is
// independently collapsed by default so the card doesn't dump a wall of text.
function Section({ label, defaultOpen = false, children }: { label: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen)
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

function IdeaCard({ idea, index }: { idea: GeneratedIdea; index: number }) {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="bg-[#2D2D2D] px-6 py-4">
        <p className="text-[12px] font-sans text-[#FEF9E7]/40 uppercase tracking-[0.18em]">idea {index + 1} of 5</p>
      </div>
      <div className="px-6 py-5 space-y-2.5">
        <div className="mb-2">
          <h3 className="font-heading text-lg font-bold text-ink lowercase mb-1">{idea.title}</h3>
          <p className="font-sans text-sm text-ink/60 leading-relaxed">{idea.oneLiner}</p>
        </div>

        {[
          ["why this fits you", idea.whyThisFitsYou],
          ["the problem", idea.theProblem],
          ["target customer", idea.targetCustomer],
          ["market evidence", idea.marketEvidence],
          ["market size", idea.marketSize],
          ["competitor landscape", idea.competitorLandscape],
        ].map(([label, text]) => text && (
          <Section key={label} label={label}>
            <p className="font-sans text-[13px] text-ink/70 leading-relaxed">{text}</p>
          </Section>
        ))}

        {idea.keyCompetitors?.length > 0 && (
          <Section label="who else is in this space">
            <ul className="space-y-1">
              {idea.keyCompetitors.map((c, i) => (
                <li key={i} className="font-sans text-[13px] text-ink/70 leading-relaxed flex gap-2">
                  <span className="text-peach-dark/60 flex-shrink-0">•</span>
                  {c}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {[
          ["differentiation", idea.differentiation],
          ["business model", idea.businessModel],
        ].map(([label, text]) => text && (
          <Section key={label} label={label}>
            <p className="font-sans text-[13px] text-ink/70 leading-relaxed">{text}</p>
          </Section>
        ))}

        {idea.gtmPlan?.length > 0 && (
          <Section label="go-to-market plan">
            <div className="space-y-3">
              {idea.gtmPlan.map((phase, pi) => (
                <div key={pi} className="bg-cream/50 border border-border/60 rounded-xl px-4 py-3">
                  <p className="font-sans text-[12px] font-semibold text-ink/60 uppercase tracking-wide mb-1.5">{phase.phase}</p>
                  <ul className="space-y-1">
                    {phase.steps.map((s, i) => (
                      <li key={i} className="font-sans text-[13px] text-ink/70 leading-relaxed flex gap-2">
                        <span className="text-peach-dark/60 font-bold flex-shrink-0">{i + 1}.</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>
        )}

        <div className="grid grid-cols-2 gap-3 pt-3">
          <div>
            <p className="text-[11px] font-sans text-ink/30 uppercase tracking-wide">capital needed</p>
            <p className="font-sans text-sm font-semibold text-ink">{idea.capitalNeeded}</p>
          </div>
          <div>
            <p className="text-[11px] font-sans text-ink/30 uppercase tracking-wide">time to first revenue</p>
            <p className="font-sans text-sm font-semibold text-ink">{idea.timeToFirstRevenue}</p>
          </div>
        </div>

        {idea.biggestRisk && (
          <Section label="biggest risk">
            <div className="space-y-2">
              <p className="font-sans text-[13px] text-ink/70 leading-relaxed">{idea.biggestRisk}</p>
              {idea.riskMitigation && (
                <div>
                  <p className="text-[11px] font-sans text-ink/30 uppercase tracking-wide mb-0.5">how to mitigate it</p>
                  <p className="font-sans text-[13px] text-ink/70 leading-relaxed">{idea.riskMitigation}</p>
                </div>
              )}
            </div>
          </Section>
        )}
        {idea.firstValidationStep && (
          <Section label="test this first">
            <p className="font-sans text-[13px] text-ink/70 leading-relaxed">{idea.firstValidationStep}</p>
          </Section>
        )}
      </div>
    </div>
  )
}

function ReportView({ report }: { report: IdeaGenReportData }) {
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="text-center mb-2">
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-ink mb-2 lowercase">your report is ready</h1>
        <p className="font-sans text-sm text-ink/60 leading-relaxed max-w-lg mx-auto">{report.summary}</p>
      </div>
      {report.ideas.map((idea, i) => (
        <IdeaCard key={i} idea={idea} index={i} />
      ))}
    </div>
  )
}

// ── Root ─────────────────────────────────────────────────────────────────

export default function IdeaGeneratorClient({
  id,
  status,
  currentStep,
  answers,
}: {
  id: string
  status: string
  currentStep: number
  answers: Record<string, string | string[]>
}) {
  const [mode, setMode] = useState<Mode>(status === "answering" ? "answering" : status === "ready" ? "ready" : status === "failed" ? "failed" : "processing")
  const [progressPct, setProgressPct] = useState(0)
  const [stageLabel, setStageLabel] = useState("getting started...")
  const [report, setReport] = useState<IdeaGenReportData | null>(null)
  const [retrying, setRetrying] = useState(false)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (mode !== "processing") return

    async function poll() {
      try {
        const res = await fetch(`/api/tools/idea-generator/${id}/status`)
        const data = await res.json()
        if (data.status === "ready") {
          setReport(data.report)
          setMode("ready")
        } else if (data.status === "failed") {
          setMode("failed")
        } else {
          setProgressPct(data.progressPct ?? 0)
          if (data.stageLabel) setStageLabel(data.stageLabel)
        }
      } catch {
        // transient network error - keep polling
      }
    }

    poll()
    pollRef.current = setInterval(poll, 8000)
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [mode, id])

  async function handleRetry() {
    setRetrying(true)
    try {
      await fetch(`/api/tools/idea-generator/${id}/submit`, { method: "POST" })
      setMode("processing")
    } finally {
      setRetrying(false)
    }
  }

  if (mode === "answering") {
    return (
      <Wizard
        id={id}
        initialStep={currentStep}
        initialAnswers={answers}
        onSubmitted={() => setMode("processing")}
      />
    )
  }

  if (mode === "ready" && report) {
    return <ReportView report={report} />
  }

  if (mode === "failed") {
    return (
      <div className="max-w-md mx-auto text-center py-10">
        <h1 className="font-heading text-xl font-bold text-ink mb-2 lowercase">we hit a snag</h1>
        <p className="font-sans text-sm text-ink/55 mb-6 leading-relaxed">
          something went wrong while researching your report. your answers are safe - you can try again.
        </p>
        <button
          onClick={handleRetry}
          disabled={retrying}
          className="inline-flex items-center gap-2 bg-ink text-cream font-sans text-sm font-semibold px-6 py-3 rounded-xl hover:bg-ink/80 transition-colors disabled:opacity-60"
        >
          <RefreshCw size={14} className={retrying ? "animate-spin" : ""} />
          {retrying ? "retrying..." : "try again"}
        </button>
      </div>
    )
  }

  return <ProgressView progressPct={progressPct} stageLabel={stageLabel} />
}
