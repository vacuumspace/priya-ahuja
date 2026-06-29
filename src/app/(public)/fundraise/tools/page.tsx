"use client"

import { useState } from "react"
import Link from "next/link"
import { Lightbulb } from "lucide-react"

const tools = [
  {
    slug: "fundability-score",
    title: "Startup Fundability Score",
    description: "Not a vibes check — a structured investor lens. 50 questions across 9 segments score your startup on market size, traction signals, team, business model, defensibility, and more. Get a 0–100 score with a full breakdown of where you stand and a prioritised fix list before you walk into any room.",
    tag: "ideation",
    icon: Lightbulb,
    href: "/fundraise/tools/fundability-score",
  },
]

const allTags = ["all", ...Array.from(new Set(tools.map((t) => t.tag)))]

export default function FundraiseToolsPage() {
  const [active, setActive] = useState("all")
  const filtered = active === "all" ? tools : tools.filter((t) => t.tag === active)

  return (
    <div className="min-h-screen bg-cream">
      <div className="flex justify-between items-center px-4 md:px-10 py-4 text-[13px] text-ink/50 font-sans border-b border-border">
        <span>fundraise · tools</span>
        <span>{tools.length} live</span>
      </div>

      <div className="px-4 md:px-10 pt-12 pb-8">
        <p className="font-sans text-xs text-ink/40 uppercase tracking-wide mb-2">Fundraise</p>
        <h1 className="font-heading text-3xl md:text-5xl font-800 text-ink mb-4">
          do the maths
          <br />
          before you pitch
        </h1>
        <p className="font-sans text-sm text-ink/60 max-w-md leading-relaxed">
          calculators and tools for the numbers that matter most in fundraising.
        </p>
      </div>

      {/* Category tabs */}
      <div className="px-4 md:px-10 pb-6">
        <div className="flex items-center gap-2 flex-wrap">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActive(tag)}
              className={`text-[13px] font-sans px-3 py-1.5 rounded-full border transition-all ${
                active === tag
                  ? "bg-ink text-cream border-ink"
                  : "bg-transparent text-ink/50 border-border hover:border-ink/30 hover:text-ink/70"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 md:px-10 pb-16">
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((tool) => (
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
