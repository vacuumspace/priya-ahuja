"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { CheckCircle, Loader2, Palette, MessageSquare, FileText, Eye, TrendingUp, Users } from "lucide-react"

const offerings = [
  {
    icon: Palette,
    title: "Brand Identity & Visual Language",
    desc: "Logo, colour system, typography, and visual guidelines that hold up across every touchpoint.",
    points: ["Logo design & variations", "Colour palette & typography", "Brand style guide", "Iconography & illustration style"],
  },
  {
    icon: MessageSquare,
    title: "Messaging & Positioning",
    desc: "Clarity on who you are, who you're for, and why anyone should care — distilled into language that sticks.",
    points: ["Brand positioning statement", "Tagline & voice guidelines", "Website copy direction", "Investor & customer narrative"],
  },
  {
    icon: FileText,
    title: "Pitch Decks & Collateral",
    desc: "Decks that tell a story investors remember, and marketing materials that convert.",
    points: ["Investor pitch deck design", "One-pagers & tearsheets", "Sales decks", "Social media templates"],
  },
]

const whyUs = [
  { icon: Eye, label: "Founder-aware", desc: "Built for companies that need to look credible before they have a big team" },
  { icon: TrendingUp, label: "Conversion-led", desc: "Design that drives action, not just appreciation" },
  { icon: Users, label: "Narrative-first", desc: "We start with your story, not your logo" },
]

const BUDGET_OPTIONS = [
  "Under ₹50K",
  "₹50K – ₹1.5L",
  "₹1.5L – ₹5L",
  "₹5L – ₹10L",
  "₹10L+",
]

export default function BrandingPage() {
  const { data: session } = useSession()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  useEffect(() => {
    if (session?.user) {
      if (session.user.name) setName((v) => v || session.user!.name!)
      if (session.user.email) setEmail((v) => v || session.user!.email!)
    }
  }, [session])

  const [phone, setPhone] = useState("")

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data.profile?.phone) setPhone((v) => v || data.profile.phone)
      })
      .catch(() => {})
  }, [])
  const [budget, setBudget] = useState("")
  const [projectDescription, setProjectDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/service-inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "branding", name, email, phone, budget, projectDescription }),
      })
      if (!res.ok) throw new Error("Failed to submit")
      setSuccess(true)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream max-w-2xl mx-auto px-6 md:px-10 py-14 md:py-20">

      {/* Hero */}
      <div className="mb-14">
        <p className="text-[10px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-4">services · branding</p>
        <h1 className="font-heading text-[clamp(2rem,5vw,3rem)] font-800 text-ink leading-[0.95] tracking-tight mb-5">
          look like you<br />mean it.
        </h1>
        <p className="font-sans text-sm text-ink/55 leading-relaxed">
          brand identity, messaging, and collateral designed for founders who need to earn trust fast — with investors, customers, and hires.
        </p>
      </div>

      {/* Offerings */}
      <div className="mb-14">
        <p className="text-[10px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-5">what we offer</p>
        <div className="space-y-4">
          {offerings.map((o) => (
            <div key={o.title} className="bg-peach/20 border border-peach-dark/15 rounded-xl px-5 py-5">
              <div className="flex items-center gap-2.5 mb-2">
                <o.icon size={16} className="text-peach-dark flex-shrink-0" />
                <p className="font-sans text-sm font-semibold text-ink">{o.title}</p>
              </div>
              <p className="font-sans text-xs text-ink/55 leading-relaxed mb-3">{o.desc}</p>
              <ul className="space-y-1">
                {o.points.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-[11px] font-sans text-ink/50">
                    <span className="w-1 h-1 rounded-full bg-peach-dark/50 flex-shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Why us */}
      <div className="mb-14">
        <p className="text-[10px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-5">our approach</p>
        <div className="grid grid-cols-3 gap-3">
          {whyUs.map((w) => (
            <div key={w.label} className="bg-peach/10 border border-peach-dark/10 rounded-xl px-4 py-4 text-center">
              <w.icon size={18} className="text-peach-dark mx-auto mb-2" />
              <p className="font-sans text-xs font-semibold text-ink mb-1">{w.label}</p>
              <p className="font-sans text-[10px] text-ink/40 leading-snug">{w.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Inquiry form */}
      <div>
        <p className="text-[10px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-5">get in touch</p>
        {success ? (
          <div className="bg-peach/20 border border-peach-dark/20 rounded-2xl p-8 text-center">
            <CheckCircle size={36} className="text-peach-dark mx-auto mb-3" />
            <p className="font-heading text-lg font-700 text-ink mb-1">we&apos;ll be in touch!</p>
            <p className="font-sans text-sm text-ink/50">your inquiry has been received. expect a response within 1–2 business days.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-sans text-ink/50 uppercase tracking-wide block mb-1.5">Name *</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="your name"
                  className="w-full text-sm font-sans bg-peach/10 border border-peach-dark/20 rounded-xl px-3 py-2.5 text-ink placeholder-ink/30 focus:outline-none focus:border-peach-dark/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-[10px] font-sans text-ink/50 uppercase tracking-wide block mb-1.5">Email *</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full text-sm font-sans bg-peach/10 border border-peach-dark/20 rounded-xl px-3 py-2.5 text-ink placeholder-ink/30 focus:outline-none focus:border-peach-dark/50 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-sans text-ink/50 uppercase tracking-wide block mb-1.5">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full text-sm font-sans bg-peach/10 border border-peach-dark/20 rounded-xl px-3 py-2.5 text-ink placeholder-ink/30 focus:outline-none focus:border-peach-dark/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-[10px] font-sans text-ink/50 uppercase tracking-wide block mb-1.5">Budget</label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full text-sm font-sans bg-peach/10 border border-peach-dark/20 rounded-xl px-3 py-2.5 text-ink focus:outline-none focus:border-peach-dark/50 transition-colors"
                >
                  <option value="">select range</option>
                  {BUDGET_OPTIONS.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-sans text-ink/50 uppercase tracking-wide block mb-1.5">Project Description *</label>
              <textarea
                required
                rows={4}
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="tell us about your brand — what stage you're at, what you need help with, and who your audience is."
                className="w-full text-sm font-sans bg-peach/10 border border-peach-dark/20 rounded-xl px-3 py-2.5 text-ink placeholder-ink/30 focus:outline-none focus:border-peach-dark/50 transition-colors resize-none"
              />
            </div>

            {error && <p className="text-xs font-sans text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ink text-cream font-sans font-semibold text-sm py-3 rounded-xl hover:bg-ink/80 disabled:opacity-40 transition-colors"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2"><Loader2 size={14} className="animate-spin" />submitting…</span>
              ) : (
                "submit inquiry"
              )}
            </button>
            <p className="text-[10px] text-ink/30 text-center font-sans">we respond within 2-3 business days</p>
          </form>
        )}
      </div>

    </div>
  )
}
