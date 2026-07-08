"use client"

import Link from "next/link"
import { HeartPulse } from "lucide-react"

const tools = [
  {
    slug: "wellbeing-score",
    title: "Founder Wellbeing Scorecard",
    description: "Burnout doesn't announce itself - it creeps up through sleep debt, isolation, and a slowly fusing sense of identity with the company. This free scorecard scores you across sleep & energy, stress & coping, relationships & support, purpose & identity, and financial anxiety, with concrete things to work on. No payment, no clinical claims - just an honest read.",
    tag: "self-assessment",
    icon: HeartPulse,
    href: "/wellbeing/tools/wellbeing-score",
  },
]

export default function WellbeingToolsPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="flex justify-between items-center px-4 md:px-10 py-4 text-[13px] text-ink/50 font-sans border-b border-border">
        <span>wellbeing · tools</span>
        <span>{tools.length} live</span>
      </div>

      <div className="px-4 md:px-10 pt-12 pb-8">
        <p className="font-sans text-xs text-ink/40 uppercase tracking-wide mb-2">Wellbeing</p>
        <h1 className="font-heading text-3xl md:text-5xl font-800 text-ink mb-4">
          tools for
          <br />
          staying whole
        </h1>
        <p className="font-sans text-sm text-ink/60 max-w-md leading-relaxed">
          free, no-signup-required tools to check in on yourself - not just the business.
        </p>
      </div>

      <div className="px-4 md:px-10 pb-16">
        <div className="grid grid-cols-1 gap-4">
          {tools.map((tool) => (
            <Link key={tool.slug} href={tool.href}>
              <div className="bg-card border border-border rounded-2xl p-6 transition-all hover:border-peach-dark/40 hover:shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-peach/50 flex items-center justify-center flex-shrink-0">
                    <tool.icon size={18} className="text-peach-dark" />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-heading text-lg font-700 text-ink mb-2">{tool.title}</h2>
                    <p className="font-sans text-sm text-ink/60 leading-relaxed">{tool.description}</p>
                    <span className="inline-block mt-2 text-[12px] bg-amber-tag text-ink/60 px-2 py-0.5 rounded font-sans">
                      {tool.tag}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
