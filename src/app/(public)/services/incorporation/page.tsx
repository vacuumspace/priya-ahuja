"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { CheckCircle, Loader2, Building2, FileCheck, ClipboardList, ShieldCheck, Users, BookOpen } from "lucide-react"
import { trackCta } from "@/lib/analytics"
import { CustomSelect } from "@/components/CustomSelect"

const offerings = [
  {
    icon: Building2,
    title: "Company Incorporation",
    points: [
      "Private Limited Company (Pvt Ltd)",
      "LLP (Limited Liability Partnership)",
      "One Person Company (OPC)",
      "Partnership Firm & Proprietorship",
      "GST, PF & ESI Registration",
    ],
  },
  {
    icon: ClipboardList,
    title: "Annual Compliance (MCA Filings)",
    points: [
      "MGT-7 / MGT-7A — Annual Return",
      "AOC-4 — Financial Statements filing",
      "MGT-14 — Resolutions & agreements",
      "DIR-3 KYC — Director KYC annual update",
      "INC-20A — Business commencement declaration",
    ],
  },
  {
    icon: FileCheck,
    title: "Event-Based MCA Filings",
    points: [
      "SH-7 — Change in authorised capital",
      "PAS-3 — Allotment of shares",
      "DIR-12 — Director appointments & resignations",
      "INC-28 — Order filings",
      "CHG-1 / CHG-4 — Charge creation & satisfaction",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Statutory Audit",
    points: [
      "Annual statutory audit under Companies Act",
      "Audit report preparation (CARO)",
      "Director's report & board resolutions",
      "Secretarial audit (applicable companies)",
      "Internal audit support",
    ],
  },
  {
    icon: Users,
    title: "Company Secretary Services",
    points: [
      "Board & AGM meeting support",
      "Maintenance of statutory registers",
      "Share transfer & transmission",
      "Drafting of resolutions & minutes",
      "Registered office compliance",
    ],
  },
  {
    icon: BookOpen,
    title: "Other Registrations & Filings",
    points: [
      "MSME / Udyam registration",
      "FSSAI, IEC, NSIC registrations",
      "Trademark & IP filing support",
      "Labour law registrations",
      "ROC search reports",
    ],
  },
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
  const [serviceType, setServiceType] = useState("")
  const [projectDescription, setProjectDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    trackCta("inquiry-incorporation", "/services/incorporation")
    setError("")
    setLoading(true)
    const fullDescription = serviceType
      ? `Service Required: ${serviceType}\n\n${projectDescription}`
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
    <div className="min-h-screen bg-cream max-w-2xl mx-auto px-4 md:px-10 py-10 md:py-20">

      {/* Hero */}
      <div className="mb-14">
        <p className="text-[12px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-4">services · legal compliance</p>
        <h1 className="font-heading text-[clamp(2rem,5vw,3rem)] font-800 text-ink leading-[0.95] tracking-tight mb-5">
          stay compliant,<br />stay protected.
        </h1>
        <p className="font-sans text-sm text-ink/55 leading-relaxed">
          from company incorporation to annual MCA filings and statutory audits — end-to-end legal compliance handled so you never miss a deadline.
        </p>
        <div className="inline-flex items-center gap-2 mt-4 bg-peach/40 border border-peach-dark/25 rounded-full px-4 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-peach-dark/60 flex-shrink-0" />
          <p className="font-sans text-xs text-ink/60">annual package starting from <span className="font-semibold text-ink">₹9,999/-</span></p>
        </div>
      </div>

      {/* Offerings */}
      <div className="mb-14">
        <p className="text-[12px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-5">what we cover</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {offerings.map((o) => (
            <div key={o.title} className="bg-peach/20 border border-peach-dark/15 rounded-xl px-5 py-4">
              <div className="flex items-center gap-2.5 mb-2">
                <o.icon size={15} className="text-peach-dark flex-shrink-0" />
                <p className="font-sans text-sm font-semibold text-ink">{o.title}</p>
              </div>
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

      {/* Inquiry form */}
      <div>
        <p className="text-[12px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-5">get started</p>
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
              <label className="text-[12px] font-sans text-ink/50 uppercase tracking-wide block mb-1.5">Service Required</label>
              <CustomSelect
                value={serviceType}
                onChange={setServiceType}
                placeholder="select (optional)"
                options={[
                  { value: "Company Incorporation", label: "Company Incorporation" },
                  { value: "Annual MCA Compliance", label: "Annual MCA Compliance" },
                  { value: "Statutory Audit", label: "Statutory Audit" },
                  { value: "CS Services", label: "Company Secretary Services" },
                  { value: "Other Registration", label: "Other Registration / Filing" },
                ]}
              />
            </div>

            <div>
              <label className="text-[12px] font-sans text-ink/50 uppercase tracking-wide block mb-1.5">Tell us about your requirement *</label>
              <textarea
                required
                rows={4}
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="briefly describe what you need — company type, current compliance status, any upcoming deadlines, etc."
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
