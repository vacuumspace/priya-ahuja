"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { CheckCircle, Loader2, BarChart2, FileSpreadsheet, Receipt, BookOpen, CreditCard, ShieldCheck } from "lucide-react"
import { trackCta } from "@/lib/analytics"

const offerings = [
  {
    icon: BarChart2,
    title: "Bookkeeping & Accounts",
    points: ["Monthly bookkeeping", "P&L and balance sheet preparation", "Ledger maintenance", "Vendor and customer reconciliation"],
  },
  {
    icon: Receipt,
    title: "GST Filing & Compliance",
    points: ["GST registration", "Monthly/quarterly GSTR filing", "GST reconciliation", "Input tax credit (ITC) management"],
  },
  {
    icon: FileSpreadsheet,
    title: "TDS & Tax Returns",
    points: ["TDS computation and filing", "Advance tax calculation", "Income tax return filing (company & founders)", "Tax planning advisory"],
  },
  {
    icon: BookOpen,
    title: "Financial Reporting",
    points: ["Monthly MIS reports", "Investor-ready financials", "Cash flow statements", "Audit support"],
  },
  {
    icon: CreditCard,
    title: "Payroll & PF/ESI",
    points: ["Monthly payroll processing", "PF and ESI filing", "Professional tax compliance", "Form 16 generation"],
  },
  {
    icon: ShieldCheck,
    title: "Statutory Audit Support",
    points: ["Annual audit assistance", "ROC filings", "Director's report preparation", "Company Secretary support"],
  },
]

export default function AccountingPage() {
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
  const [projectDescription, setProjectDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    trackCta("inquiry-accounting", "/services/accounting")
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/service-inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "accounting", name, email, phone, projectDescription }),
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
        <p className="text-[10px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-4">services · finance</p>
        <h1 className="font-heading text-[clamp(2rem,5vw,3rem)] font-800 text-ink leading-[0.95] tracking-tight mb-5">
          accounting that<br />works for startups.
        </h1>
        <p className="font-sans text-sm text-ink/55 leading-relaxed">
          end-to-end accounting, GST, TDS, payroll, and audit support — handled by a team that understands the compliance needs of early-stage Indian companies.
        </p>
        <div className="inline-flex items-center gap-2 mt-4 bg-peach/40 border border-peach-dark/25 rounded-full px-4 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-peach-dark/60 flex-shrink-0" />
          <p className="font-sans text-xs text-ink/60">annual package starting from <span className="font-semibold text-ink">₹9,999/-</span></p>
        </div>
      </div>

      {/* Offerings */}
      <div className="mb-14">
        <p className="text-[10px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-5">what we handle</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {offerings.map((o) => (
            <div key={o.title} className="bg-peach/20 border border-peach-dark/15 rounded-xl px-5 py-4">
              <div className="flex items-center gap-2.5 mb-2">
                <o.icon size={15} className="text-peach-dark flex-shrink-0" />
                <p className="font-sans text-sm font-semibold text-ink">{o.title}</p>
              </div>
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
              <label className="text-[10px] font-sans text-ink/50 uppercase tracking-wide block mb-1.5">Tell us about your business *</label>
              <textarea
                required
                rows={4}
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="what does your company do, how many employees, what accounting help do you currently need (GST, payroll, bookkeeping, audit)?"
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
