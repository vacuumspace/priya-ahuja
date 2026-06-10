"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Calculator, FileSearch, TrendingUp, Lightbulb } from "lucide-react"

const tools = [
  {
    slug: "startup-score",
    title: "Startup Idea Score",
    description: "Answer 11 questions across 5 pillars and get a 0–100 fundability score. Full pillar breakdown and fix recommendations for ₹99.",
    tag: "ideation",
    topic: "startup",
    icon: Lightbulb,
    available: true,
  },
  {
    slug: "dilution-calculator",
    title: "Dilution Calculator",
    description: "See how a funding round affects your ownership, model out the option pool shuffle, pro-rata, and secondary sales.",
    tag: "cap table",
    topic: "fundraise",
    icon: Calculator,
    available: false,
  },
  {
    slug: "runway-calculator",
    title: "Runway Calculator",
    description: "Input your burn rate and cash on hand to see how much runway you have, and when to start your next raise.",
    tag: "financial",
    topic: "startup",
    icon: TrendingUp,
    available: false,
  },
  {
    slug: "fundraise-size-estimator",
    title: "Fundraise Size Estimator",
    description: "Figure out how much to raise based on milestones, burn multiples, and target ownership benchmarks for Indian VCs.",
    tag: "fundraising",
    topic: "fundraise",
    icon: FileSearch,
    available: false,
  },
]

const allTags = ["all", ...Array.from(new Set(tools.map((t) => t.tag)))]

export default function ToolsPage() {
  const [active, setActive] = useState("all")
  const filtered = active === "all" ? tools : tools.filter((t) => t.tag === active)

  return (
    <div className="min-h-screen bg-cream">
      <div className="flex justify-between items-center px-4 md:px-10 py-4 text-[11px] text-ink/50 font-sans border-b border-border">
        <span>free to use</span>
        <span>{tools.filter((t) => t.available).length} live · {tools.filter((t) => !t.available).length} coming soon</span>
      </div>

      <div className="px-4 md:px-10 pt-12 pb-8">
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
              className={`text-[11px] font-sans px-3 py-1.5 rounded-full border transition-all ${
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
          {filtered.map((tool) => {
            const cardContent = (
              <div className={`bg-card border border-border rounded-2xl p-6 transition-all ${
                tool.available
                  ? "hover:border-peach-dark/40 hover:shadow-sm"
                  : "opacity-70"
              }`}>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-peach/50 flex items-center justify-center flex-shrink-0">
                    <tool.icon size={18} className="text-peach-dark" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="font-heading text-lg font-700 text-ink">{tool.title}</h2>
                      {!tool.available && (
                        <span className="text-[10px] bg-ink/10 text-ink/50 px-2 py-0.5 rounded font-sans">
                          coming soon
                        </span>
                      )}
                    </div>
                    <p className="font-sans text-sm text-ink/60 leading-relaxed">{tool.description}</p>
                    <span className="inline-block mt-2 text-[10px] bg-amber-tag text-ink/60 px-2 py-0.5 rounded font-sans">
                      {tool.tag}
                    </span>
                  </div>
                </div>
              </div>
            )

            return tool.available ? (
              <Link key={tool.slug} href={`/tools/${tool.slug}`}>
                {cardContent}
              </Link>
            ) : (
              <div key={tool.slug}>{cardContent}</div>
            )
          })}
        </div>

        <div className="mt-10 bg-peach/30 border border-peach-dark/20 rounded-2xl p-6">
          <p className="font-heading text-lg font-700 text-ink mb-1">want to be notified?</p>
          <p className="font-sans text-sm text-ink/60 mb-4">
            i&apos;ll drop a note when more tools go live. no spam, just the tool launch.
          </p>
          <a
            href="mailto:hello@priyaahuja.com?subject=Notify me when tools are live"
            className="inline-flex items-center gap-2 bg-ink text-cream text-xs font-sans font-semibold px-4 py-2.5 rounded-lg hover:bg-ink/80 transition-colors"
          >
            notify me <ArrowRight size={12} />
          </a>
        </div>
      </div>
    </div>
  )
}
