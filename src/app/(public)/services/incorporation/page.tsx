"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { CheckCircle, Loader2, Building2, FileCheck, Globe, Shield } from "lucide-react"

const ENTITY_TYPES = [
  { value: "Proprietorship", label: "Sole Proprietorship", desc: "Simplest form — no separate legal entity, ideal for freelancers and micro-businesses" },
  { value: "Partnership", label: "Partnership Firm", desc: "Two or more partners, governed by Partnership Act 1932" },
  { value: "LLP", label: "LLP (Limited Liability Partnership)", desc: "Combines partnership flexibility with limited liability — popular for professional services" },
  { value: "Pvt Ltd", label: "Private Limited Company", desc: "Separate legal entity, most investor-friendly structure for startups" },
  { value: "LLC", label: "LLC / OPC (One Person Company)", desc: "Single-owner structure with limited liability" },
  { value: "GST", label: "GST Registration", desc: "Required for businesses with turnover above ₹20L (₹10L in special states)" },
  { value: "PF", label: "PF / ESI Registration", desc: "Mandatory for businesses with 20+ employees" },
]

const process = [
  { icon: FileCheck, title: "Document Collection", desc: "We collect all required KYC and business documents from you" },
  { icon: Globe, title: "Filing & Application", desc: "We handle all government filings, MCA/ROC submissions, and portal applications" },
  { icon: Shield, title: "Approvals & Certificates", desc: "You receive incorporation certificate, PAN, TAN, and all required registrations" },
  { icon: Building2, title: "Post-Incorporation", desc: "Bank account opening support, GST linkage, and compliance calendar setup" },
]

export default function IncorporationPage() {
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
  const [entityType, setEntityType] = useState("")
  const [projectDescription, setProjectDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    const fullDescription = entityType
      ? `Entity Type: ${entityType}\n\n${projectDescription}`
      : projectDescription
    try {
      const res = await fetch("/api/service-inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "incorporation", name, email, phone, projectDescription: fullDescription }),
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
        <p className="text-[10px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-4">services · company registration</p>
        <h1 className="font-heading text-[clamp(2rem,5vw,3rem)] font-800 text-ink leading-[0.95] tracking-tight mb-5">
          register your<br />business right.
        </h1>
        <p className="font-sans text-sm text-ink/55 leading-relaxed">
          from sole proprietorship to private limited company, GST to PF — we handle end-to-end business registration and compliance so you can focus on building.
        </p>
      </div>

      {/* Entity types */}
      <div className="mb-14">
        <p className="text-[10px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-5">registration types we handle</p>
        <div className="space-y-2">
          {ENTITY_TYPES.map((et) => (
            <div key={et.value} className="bg-peach/20 border border-peach-dark/15 rounded-xl px-4 py-3">
              <p className="font-sans text-sm font-semibold text-ink">{et.label}</p>
              <p className="font-sans text-xs text-ink/50 mt-0.5">{et.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Process */}
      <div className="mb-14">
        <p className="text-[10px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-5">how it works</p>
        <div className="grid grid-cols-2 gap-3">
          {process.map((p, i) => (
            <div key={p.title} className="bg-peach/10 border border-peach-dark/10 rounded-xl px-4 py-4">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-mono text-ink/30">0{i + 1}</span>
                <p.icon size={14} className="text-peach-dark" />
                <p className="font-sans text-xs font-semibold text-ink">{p.title}</p>
              </div>
              <p className="font-sans text-[11px] text-ink/50 leading-snug">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Inquiry form */}
      <div>
        <p className="text-[10px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-5">get started</p>
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
              <label className="text-[10px] font-sans text-ink/50 uppercase tracking-wide block mb-1.5">Registration Type</label>
              <select
                value={entityType}
                onChange={(e) => setEntityType(e.target.value)}
                className="w-full text-sm font-sans bg-peach/10 border border-peach-dark/20 rounded-xl px-3 py-2.5 text-ink focus:outline-none focus:border-peach-dark/50 transition-colors"
              >
                <option value="">select type (optional)</option>
                {ENTITY_TYPES.map((et) => (
                  <option key={et.value} value={et.value}>{et.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-sans text-ink/50 uppercase tracking-wide block mb-1.5">Tell us about your business *</label>
              <textarea
                required
                rows={4}
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="what does your business do, where are you located, are you a new business or looking to convert an existing one?"
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
                "submit inquiry →"
              )}
            </button>
            <p className="text-[10px] text-ink/30 text-center font-sans">we respond within 1–2 business days</p>
          </form>
        )}
      </div>

    </div>
  )
}
