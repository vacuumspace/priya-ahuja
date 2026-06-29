"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { CheckCircle, Loader2, Smartphone, Globe, Code2, Layers, Zap, Shield, Sparkles } from "lucide-react"
import { trackCta } from "@/lib/analytics"
import { CustomSelect } from "@/components/CustomSelect"

const offerings = [
  {
    icon: Sparkles,
    title: "AI Native Products",
    desc: "Products built with AI at the core — not bolted on. LLM-powered features, intelligent automation, and agent workflows that actually ship.",
    points: ["LLM integration & prompt engineering", "AI agents & automation pipelines", "RAG systems & knowledge bases", "AI-first UX design"],
    highlight: true,
  },
  {
    icon: Smartphone,
    title: "Mobile Apps",
    desc: "Native and cross-platform apps for iOS and Android. Built for performance, designed for users.",
    points: ["React Native / Flutter", "App Store & Play Store launch", "Push notifications & analytics", "Offline-first architecture"],
  },
  {
    icon: Globe,
    title: "Websites",
    desc: "Fast, conversion-focused websites — from landing pages to full-stack web platforms.",
    points: ["Next.js / React", "SEO & Core Web Vitals optimised", "CMS integration", "Custom dashboards & portals"],
  },
  {
    icon: Code2,
    title: "Software & Internal Tools",
    desc: "Custom software built for your ops — CRMs, ERPs, automation pipelines, and internal dashboards.",
    points: ["Admin panels & workflows", "API integrations", "Data pipelines & reporting", "SaaS product development"],
  },
]

const whyUs = [
  { icon: Zap, label: "Fast delivery", desc: "MVP in weeks, not months" },
  { icon: Layers, label: "Full-stack", desc: "Design, dev, and deployment under one roof" },
  { icon: Shield, label: "Founder-first", desc: "We understand the startup context, not just the spec" },
]

const BUDGET_OPTIONS = [
  "Under ₹1L",
  "₹1L – ₹5L",
  "₹5L – ₹15L",
  "₹15L – ₹30L",
  "₹30L+",
]

export default function TechPage() {
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
    trackCta("inquiry-tech", "/services/tech")
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/service-inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "tech", name, email, phone, budget, projectDescription }),
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
    <div className="min-h-screen bg-cream max-w-2xl mx-auto px-4 md:px-10 py-10 md:py-20">

      {/* Hero */}
      <div className="mb-14">
        <p className="text-[12px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-4">services · tech product development</p>
        <h1 className="font-heading text-[clamp(2rem,5vw,3rem)] font-800 text-ink leading-[0.95] tracking-tight mb-5">
          build what<br />you&apos;re imagining.
        </h1>
        <p className="font-sans text-sm text-ink/55 leading-relaxed">
          from idea to shipped product — mobile apps, websites, and custom software built with the speed and clarity that early-stage companies need.
        </p>
      </div>

      {/* Offerings */}
      <div className="mb-14">
        <p className="text-[12px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-5">what we build</p>
        <div className="space-y-4">
          {offerings.map((o) => (
            <div key={o.title} className={`border rounded-xl px-5 py-5 ${"highlight" in o && o.highlight ? "bg-peach/30 border-peach-dark/30" : "bg-peach/20 border-peach-dark/15"}`}>
              <div className="flex items-center gap-2.5 mb-2">
                <o.icon size={16} className="text-peach-dark flex-shrink-0" />
                <p className="font-sans text-sm font-semibold text-ink">{o.title}</p>

              </div>
              <p className="font-sans text-xs text-ink/55 leading-relaxed mb-3">{o.desc}</p>
              <ul className="space-y-1">
                {o.points.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-[13px] font-sans text-ink/50">
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
        <p className="text-[12px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-5">why work with us</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {whyUs.map((w) => (
            <div key={w.label} className="bg-peach/10 border border-peach-dark/10 rounded-xl px-4 py-4 text-center">
              <w.icon size={18} className="text-peach-dark mx-auto mb-2" />
              <p className="font-sans text-xs font-semibold text-ink mb-1">{w.label}</p>
              <p className="font-sans text-[12px] text-ink/40 leading-snug">{w.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Inquiry form */}
      <div>
        <p className="text-[12px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-5">get in touch</p>
        {success ? (
          <div className="bg-peach/20 border border-peach-dark/20 rounded-2xl p-8 text-center">
            <CheckCircle size={36} className="text-peach-dark mx-auto mb-3" />
            <p className="font-heading text-lg font-700 text-ink mb-1">we&apos;ll be in touch!</p>
            <p className="font-sans text-sm text-ink/50">your inquiry has been received. expect a response within 1–2 business days.</p>
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
                  className="w-full text-sm font-sans bg-peach/10 border border-peach-dark/20 rounded-xl px-3 py-2.5 text-ink placeholder-ink/30 focus:outline-none focus:border-peach-dark/50 transition-colors"
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
                  className="w-full text-sm font-sans bg-peach/10 border border-peach-dark/20 rounded-xl px-3 py-2.5 text-ink placeholder-ink/30 focus:outline-none focus:border-peach-dark/50 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[12px] font-sans text-ink/50 uppercase tracking-wide block mb-1.5">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full text-sm font-sans bg-peach/10 border border-peach-dark/20 rounded-xl px-3 py-2.5 text-ink placeholder-ink/30 focus:outline-none focus:border-peach-dark/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-[12px] font-sans text-ink/50 uppercase tracking-wide block mb-1.5">Budget</label>
                <CustomSelect
                  value={budget}
                  onChange={setBudget}
                  placeholder="select range"
                  options={BUDGET_OPTIONS.map((b) => ({ value: b, label: b }))}
                />
              </div>
            </div>

            <div>
              <label className="text-[12px] font-sans text-ink/50 uppercase tracking-wide block mb-1.5">Project Description *</label>
              <textarea
                required
                rows={4}
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="tell us what you're building — what problem it solves, who uses it, and where you are right now (idea, wireframe, existing product)."
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
            <p className="text-[12px] text-ink/30 text-center font-sans">we respond within 2-3 business days</p>
          </form>
        )}
      </div>

    </div>
  )
}
