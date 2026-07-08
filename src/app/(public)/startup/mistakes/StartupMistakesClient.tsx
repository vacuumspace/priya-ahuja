"use client"

import { useMemo, useState } from "react"
import { X, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import SignInOptions from "@/components/SignInOptions"
import { MISTAKE_INDUSTRIES, MISTAKE_TOPICS, MISTAKE_TITLE_MAX_LEN, MISTAKE_BODY_MAX_LEN } from "@/lib/startup-mistakes-data"

type Mistake = {
  id: string
  userName: string
  title: string
  body: string
  industry: string
  topic: string
  publishedAt: string
}

type Props = {
  mistakes: Mistake[]
  isAuthenticated: boolean
}

export default function StartupMistakesClient({ mistakes, isAuthenticated }: Props) {
  const [showSignIn, setShowSignIn] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [industryFilter, setIndustryFilter] = useState("all")
  const [topicFilter, setTopicFilter] = useState("all")
  const [page, setPage] = useState(1)

  const PAGE_SIZE = 10

  const filtered = useMemo(() => {
    return mistakes.filter((m) => {
      if (industryFilter !== "all" && m.industry !== industryFilter) return false
      if (topicFilter !== "all" && m.topic !== topicFilter) return false
      return true
    })
  }, [mistakes, industryFilter, topicFilter])

  const industryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const m of mistakes) counts[m.industry] = (counts[m.industry] || 0) + 1
    return counts
  }, [mistakes])

  const topicCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const m of mistakes) counts[m.topic] = (counts[m.topic] || 0) + 1
    return counts
  }, [mistakes])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function updateIndustryFilter(value: string) {
    setIndustryFilter(value)
    setPage(1)
  }

  function updateTopicFilter(value: string) {
    setTopicFilter(value)
    setPage(1)
  }

  return (
    <div className="min-h-screen bg-cream w-full max-w-full overflow-x-hidden">
      <div className="flex justify-between items-center px-4 md:px-10 py-4 text-[13px] text-ink/50 font-sans border-b border-border">
        <span>startup · mistakes</span>
        <span>{mistakes.length} shared</span>
      </div>

      <div className="px-4 md:px-10 pt-12 pb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <p className="font-sans text-xs text-ink/40 uppercase tracking-wide mb-2">Startup</p>
          <h1 className="font-heading text-3xl md:text-5xl font-800 text-ink mb-4">
            real mistakes made
            <br />
            & shared by founders
          </h1>
          <p className="font-sans text-sm text-ink/60 max-w-md leading-relaxed">
            real mistakes, shared by real founders: fundraising, product, co-founder splits, validation, and more. every post is reviewed before it goes live.
          </p>
        </div>

        <button
          onClick={() => (isAuthenticated ? setShowForm(true) : setShowSignIn(true))}
          className="flex-shrink-0 inline-flex items-center gap-2 bg-ink text-cream font-sans font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-ink/80 transition-colors whitespace-nowrap"
        >
          <Plus size={16} />
          share your mistake
        </button>
      </div>

      {/* Filters */}
      <div className="px-4 md:px-10 pb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <select
            value={industryFilter}
            onChange={(e) => updateIndustryFilter(e.target.value)}
            className="text-xs font-sans bg-card border border-border rounded-lg px-3 py-2 text-ink focus:outline-none"
          >
            <option value="all">all industries ({mistakes.length})</option>
            {MISTAKE_INDUSTRIES.map((i) => (
              <option key={i} value={i}>{i} ({industryCounts[i] || 0})</option>
            ))}
          </select>
          <select
            value={topicFilter}
            onChange={(e) => updateTopicFilter(e.target.value)}
            className="text-xs font-sans bg-card border border-border rounded-lg px-3 py-2 text-ink focus:outline-none"
          >
            <option value="all">all topics ({mistakes.length})</option>
            {MISTAKE_TOPICS.map((t) => (
              <option key={t} value={t}>{t} ({topicCounts[t] || 0})</option>
            ))}
          </select>
        </div>

        {pageCount > 1 && (
          <Pager currentPage={currentPage} pageCount={pageCount} setPage={setPage} className="w-auto gap-4" />
        )}
      </div>

      <div className="px-4 md:px-10 pb-16">
        {filtered.length === 0 ? (
          <p className="font-sans text-sm text-ink/40">no mistakes shared here yet, be the first.</p>
        ) : (
          <>
            <div className="divide-y divide-border">
              {paginated.map((m) => (
                <div key={m.id} className="py-5 first:pt-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-[11px] text-ink/40 font-sans">{m.industry}</span>
                    <span className="text-ink/20">·</span>
                    <span className="text-[11px] text-peach-dark font-sans">{m.topic}</span>
                  </div>
                  <h2 className="font-heading text-base font-700 text-ink mb-1">{m.title}</h2>
                  <p className="font-sans text-sm text-ink/60 leading-relaxed whitespace-pre-wrap mb-1.5">{m.body}</p>
                  <p className="font-sans text-xs text-ink/40">by {m.userName}</p>
                </div>
              ))}
            </div>

            {pageCount > 1 && (
              <Pager currentPage={currentPage} pageCount={pageCount} setPage={setPage} className="justify-center pt-6" />
            )}
          </>
        )}
      </div>

      {/* Sign-in modal */}
      {showSignIn && (
        <div
          className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowSignIn(false) }}
        >
          <div className="bg-cream rounded-2xl w-full max-w-sm shadow-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-heading text-xl font-700 text-ink">sign in to continue</h3>
                <p className="font-sans text-xs text-ink/40 mt-0.5">share your startup mistake</p>
              </div>
              <button onClick={() => setShowSignIn(false)} className="text-ink/40 hover:text-ink transition-colors">
                <X size={18} />
              </button>
            </div>
            <p className="font-sans text-sm text-ink/60 mb-5 leading-relaxed">
              sign in to share your mistake with the founder community.
            </p>
            <SignInOptions
              callbackUrl={typeof window !== "undefined" ? window.location.href : "/startup/mistakes"}
              compact
            />
          </div>
        </div>
      )}

      {/* Submission form modal */}
      {showForm && (
        <MistakeFormModal onClose={() => setShowForm(false)} />
      )}
    </div>
  )
}

function Pager({
  currentPage,
  pageCount,
  setPage,
  className = "",
}: {
  currentPage: number
  pageCount: number
  setPage: (updater: (p: number) => number) => void
  className?: string
}) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: "smooth" }) }}
        disabled={currentPage === 1}
        className="inline-flex items-center text-ink/40 hover:text-ink disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
        aria-label="previous page"
      >
        <ChevronLeft size={18} />
      </button>
      <span className="text-xs font-sans text-ink/30">
        {currentPage}/{pageCount}
      </span>
      <button
        onClick={() => { setPage((p) => Math.min(pageCount, p + 1)); window.scrollTo({ top: 0, behavior: "smooth" }) }}
        disabled={currentPage === pageCount}
        className="inline-flex items-center text-ink/40 hover:text-ink disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
        aria-label="next page"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  )
}

function MistakeFormModal({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [industry, setIndustry] = useState(MISTAKE_INDUSTRIES[0])
  const [topic, setTopic] = useState(MISTAKE_TOPICS[0])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !body.trim()) return
    setSubmitting(true)
    setError("")
    try {
      const res = await fetch("/api/startup-mistakes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, industry, topic }),
      })
      if (!res.ok) throw new Error("failed")
      setSubmitted(true)
    } catch {
      setError("something went wrong, try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-cream rounded-2xl w-full max-w-lg shadow-xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-heading text-xl font-700 text-ink">share your mistake</h3>
            <p className="font-sans text-xs text-ink/40 mt-0.5">reviewed by our team before it goes public</p>
          </div>
          <button onClick={onClose} className="text-ink/40 hover:text-ink transition-colors">
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div className="py-6 text-center">
            <p className="font-sans text-sm text-ink/70 mb-4">
              thanks for sharing. we&apos;ll review it and publish it once approved.
            </p>
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center bg-ink text-cream font-sans font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-ink/80 transition-colors"
            >
              done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="font-sans text-xs text-ink/50 mb-1 block">industry</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value as typeof industry)}
                  className="w-full text-sm font-sans bg-card border border-border rounded-lg px-3 py-2 text-ink focus:outline-none focus:border-peach-dark/50"
                >
                  {MISTAKE_INDUSTRIES.map((i) => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="font-sans text-xs text-ink/50 mb-1 block">topic</label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value as typeof topic)}
                  className="w-full text-sm font-sans bg-card border border-border rounded-lg px-3 py-2 text-ink focus:outline-none focus:border-peach-dark/50"
                >
                  {MISTAKE_TOPICS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-sans text-xs text-ink/50 block">title</label>
                <span className="font-sans text-[11px] text-ink/30">{title.length}/{MISTAKE_TITLE_MAX_LEN}</span>
              </div>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value.slice(0, MISTAKE_TITLE_MAX_LEN))}
                maxLength={MISTAKE_TITLE_MAX_LEN}
                placeholder="e.g. we raised too early and it killed our focus"
                className="w-full text-sm font-sans bg-card border border-border rounded-lg px-3 py-2 text-ink placeholder-ink/30 focus:outline-none focus:border-peach-dark/50"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-sans text-xs text-ink/50 block">what happened</label>
                <span className="font-sans text-[11px] text-ink/30">{body.length}/{MISTAKE_BODY_MAX_LEN}</span>
              </div>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value.slice(0, MISTAKE_BODY_MAX_LEN))}
                maxLength={MISTAKE_BODY_MAX_LEN}
                rows={6}
                placeholder="tell us what went wrong, and what you'd do differently. keep it short."
                className="w-full text-sm font-sans bg-card border border-border rounded-lg px-3 py-2 text-ink placeholder-ink/30 focus:outline-none focus:border-peach-dark/50 resize-none"
                required
              />
            </div>

            {error && <p className="font-sans text-xs text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center bg-ink text-cream font-sans font-semibold text-sm py-2.5 rounded-xl hover:bg-ink/80 transition-colors disabled:opacity-50"
            >
              {submitting ? "submitting..." : "submit for review"}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
