"use client"

import { useState } from "react"
import Link from "next/link"
import { Lightbulb, TrendingUp } from "lucide-react"

const tools = [
  {
    slug: "startup-idea-score",
    title: "Startup Idea Score",
    description: "Funding is a milestone, not the goal. This score tells you whether your idea is worth building in the first place — before you think about investors. It tests problem clarity (is the pain real and frequent?), founder-market fit (why are you the right person?), demand signals (are people already doing something to solve this?), unit economics (can the numbers ever work?), and execution path (do you know your first 90 days?). Brutally honest. No fluff.",
    tag: "ideation",
    icon: Lightbulb,
    available: true,
    href: "/startup/tools/idea-score",
  },
  {
    slug: "runway-calculator",
    title: "Runway Calculator",
    description: "Input your burn rate and cash on hand to see how much runway you have, and when you need to hit your next milestone.",
    tag: "financial",
    icon: TrendingUp,
    available: false,
    href: null,
  },
]

const allTags = ["all", ...Array.from(new Set(tools.map((t) => t.tag)))]

export default function StartupToolsPage() {
  const [active, setActive] = useState("all")
  const filtered = active === "all" ? tools : tools.filter((t) => t.tag === active)

  return (
    <div className="min-h-screen bg-cream">
      <div className="flex justify-between items-center px-4 md:px-10 py-4 text-[11px] text-ink/50 font-sans border-b border-border">
        <span>startup · tools</span>
        <span>{tools.filter((t) => t.available).length} live · {tools.filter((t) => !t.available).length} coming soon</span>
      </div>

      <div className="px-4 md:px-10 pt-12 pb-8">
        <p className="font-sans text-xs text-ink/40 uppercase tracking-wide mb-2">Startup</p>
        <h1 className="font-heading text-3xl md:text-5xl font-800 text-ink mb-4">
          tools for
          <br />
          building smart
        </h1>
        <p className="font-sans text-sm text-ink/60 max-w-md leading-relaxed">
          tools focused on building a real business — not pitching one.
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

            return tool.available && tool.href ? (
              <Link key={tool.slug} href={tool.href}>{cardContent}</Link>
            ) : (
              <div key={tool.slug}>{cardContent}</div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
