"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { CheckCircle, Loader2, LogIn, Presentation, Banknote, Compass, Rocket, SearchCheck, Handshake } from "lucide-react"
import { trackCta } from "@/lib/analytics"
import SignInOptions from "@/components/SignInOptions"

const MAX_WORDS = 100

const areas = [
  {
    icon: Presentation,
    title: "Pitch Deck Preparation",
    desc: "Your story, structured the way investors actually read decks - narrative, flow, numbers, and design direction. Built with you slide by slide until it's ready to send.",
  },
  {
    icon: Banknote,
    title: "Fundraise Readiness",
    desc: "Everything that needs to be in place before you go out to raise - financial model, valuation story, data room, investor list, and prep for the questions that will come.",
  },
  {
    icon: Rocket,
    title: "Startup Launch (0 → 1)",
    desc: "From idea to first paying customers - positioning, MVP scope, pricing, early distribution, and the sequence of what to do (and skip) in your first months.",
  },
  {
    icon: Compass,
    title: "Short / Long Term Startup Consultancy",
    desc: "A sounding board on retainer - growth, hiring, GTM, and the decisions that don't fit in a single call. Weekly or fortnightly involvement, shaped around your stage.",
  },
  {
    icon: SearchCheck,
    title: "Due Diligence",
    desc: "For founders preparing for it or investors running it - business, financial, and deal diligence handled end to end, with clear red flags and fixes.",
  },
]

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length
}

export function ConsultancyEnquiryClient() {
  const { data: session, status } = useSession()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [website, setWebsite] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [prefilled, setPrefilled] = useState(false)

  // prefill name/email from the session during render once it arrives
  if (session?.user && !prefilled) {
    setPrefilled(true)
    if (session.user.name && !name) setName(session.user.name)
    if (session.user.email && !email) setEmail(session.user.email)
  }

  useEffect(() => {
    if (!session) return
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data.profile?.phone) setPhone((v) => v || data.profile.phone)
        if (data.profile?.website) setWebsite((v) => v || data.profile.website)
      })
      .catch(() => {})
  }, [session])

  const words = countWords(message)

  function handleMessageChange(value: string) {
    if (countWords(value) <= MAX_WORDS) {
      setMessage(value)
    } else {
      // allow trimming back down, but don't accept text beyond the limit
      setMessage(value.trim().split(/\s+/).slice(0, MAX_WORDS).join(" "))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    trackCta("inquiry-consultancy", "/services/consultancy")
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/service-inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "consultancy", name, email, phone, website, projectDescription: message }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Failed to submit")
      }
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const inputCls =
    "w-full text-sm font-sans bg-peach/10 border border-peach-dark/20 rounded-xl px-3 py-2.5 text-ink placeholder-ink/30 focus:outline-none focus:border-peach-dark/50 transition-colors"

  return (
    <div className="min-h-screen bg-cream max-w-2xl mx-auto px-4 md:px-10 py-10 md:py-20">

      {/* Hero */}
      <div className="mb-14">
        <p className="text-[12px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-4">services · long term & task based consultancy</p>
        <h1 className="font-heading text-[clamp(2rem,5vw,3rem)] font-800 text-ink leading-[0.95] tracking-tight mb-5">
          for the work a<br />single call can&apos;t do.
        </h1>
        <p className="font-sans text-sm text-ink/55 leading-relaxed">
          some problems get solved in sixty minutes. building an investor-ready deck, getting
          fundraise-ready, or taking a startup from zero to launch doesn&apos;t. this is hands-on,
          continuous involvement - we work together over weeks or months, with clear
          deliverables and someone in your corner the whole way.
        </p>
      </div>

      {/* Areas */}
      <div className="mb-14">
        <p className="text-[12px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-5">what this covers</p>
        <div className="space-y-4">
          {areas.map((a) => (
            <div key={a.title} className="bg-peach/20 border border-peach-dark/15 rounded-xl px-5 py-5">
              <div className="flex items-center gap-2.5 mb-2">
                <a.icon size={16} className="text-peach-dark flex-shrink-0" />
                <p className="font-sans text-sm font-semibold text-ink">{a.title}</p>
              </div>
              <p className="font-sans text-xs text-ink/55 leading-relaxed">{a.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-start gap-2.5 bg-peach/10 border border-peach-dark/10 rounded-xl px-5 py-4">
          <Handshake size={16} className="text-peach-dark flex-shrink-0 mt-0.5" />
          <p className="font-sans text-xs text-ink/55 leading-relaxed">
            something else that needs continuous involvement? tell me about it below - the scope,
            pace, and pricing are shaped around what you actually need.
          </p>
        </div>
      </div>

      {/* Enquiry form */}
      <div>
        <p className="text-[12px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-5">enquire</p>
        {status === "loading" ? (
          <p className="text-xs font-sans text-ink/40 py-4 text-center">Loading…</p>
        ) : status === "unauthenticated" ? (
          <div className="bg-peach/20 border border-peach-dark/20 rounded-2xl p-6 text-center">
            <LogIn size={32} className="text-peach-dark mx-auto mb-3" />
            <p className="font-heading text-base font-700 text-ink mb-1">sign in to enquire</p>
            <p className="font-sans text-sm text-ink/60 leading-relaxed mb-4">
              a free account is required to send your enquiry.
            </p>
            <SignInOptions callbackUrl={typeof window !== "undefined" ? window.location.href : "/services/consultancy"} />
          </div>
        ) : success ? (
          <div className="bg-peach/20 border border-peach-dark/20 rounded-2xl p-8 text-center">
            <CheckCircle size={36} className="text-peach-dark mx-auto mb-3" />
            <p className="font-heading text-lg font-700 text-ink mb-1">enquiry sent!</p>
            <p className="font-sans text-sm text-ink/50">
              thank you for reaching out. expect a response within 1–2 business days.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[12px] font-sans text-ink/50 uppercase tracking-wide block mb-1.5">Name *</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="your name"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="text-[12px] font-sans text-ink/50 uppercase tracking-wide block mb-1.5">Email *</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className={inputCls}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[12px] font-sans text-ink/50 uppercase tracking-wide block mb-1.5">Phone *</label>
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="text-[12px] font-sans text-ink/50 uppercase tracking-wide block mb-1.5">Website</label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://yourstartup.com"
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[12px] font-sans text-ink/50 uppercase tracking-wide">Message *</label>
                <span className={`text-[11px] font-sans ${words >= MAX_WORDS ? "text-red-500" : "text-ink/30"}`}>
                  {words}/{MAX_WORDS} words
                </span>
              </div>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => handleMessageChange(e.target.value)}
                placeholder="what do you need help with? a line on your startup, the kind of involvement you're looking for, and any timelines."
                className={`${inputCls} resize-none`}
              />
            </div>

            {error && <p className="text-xs font-sans text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ink text-cream font-sans font-semibold text-sm py-3 rounded-xl hover:bg-ink/80 disabled:opacity-40 transition-colors"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={14} className="animate-spin" />
                  sending…
                </span>
              ) : (
                "send enquiry"
              )}
            </button>
            <p className="text-[12px] text-ink/30 text-center font-sans">i respond within 1–2 business days</p>
          </form>
        )}
      </div>

    </div>
  )
}
