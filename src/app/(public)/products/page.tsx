"use client"

import { useState } from "react"
import { ArrowRight, FileText, Download } from "lucide-react"

const products = [
  {
    slug: "investor-outreach-templates",
    title: "Investor Outreach Templates",
    description: "Cold email templates, follow-up sequences, and LinkedIn messages that have actually gotten replies from Indian VCs.",
    price: "₹499",
    tag: "templates",
    topic: "fundraise",
    icon: FileText,
    comingSoon: false,
  },
  {
    slug: "fundraising-checklist",
    title: "Pre-Fundraise Readiness Checklist",
    description: "A 40-point checklist covering everything from financial model hygiene to cap table structure, before you talk to a single investor.",
    price: "₹299",
    tag: "checklist",
    topic: "fundraise",
    icon: FileText,
    comingSoon: false,
  },
  {
    slug: "pitch-deck-teardown",
    title: "Pitch Deck Teardown: What Works",
    description: "A detailed guide with real before/after examples of pitch decks, annotated with what changed and why.",
    price: "₹799",
    tag: "guide",
    topic: "fundraise",
    icon: FileText,
    comingSoon: true,
  },
]

const allTags = ["all", ...Array.from(new Set(products.map((p) => p.tag)))]

export default function ProductsPage() {
  const [active, setActive] = useState("all")
  const filtered = active === "all" ? products : products.filter((p) => p.tag === active)

  return (
    <div className="min-h-screen bg-cream">
      <div className="flex justify-between items-center px-4 md:px-10 py-4 text-[11px] text-ink/50 font-sans border-b border-border">
        <span>digital downloads</span>
        <span>{products.filter((p) => !p.comingSoon).length} available</span>
      </div>

      <div className="px-4 md:px-10 pt-12 pb-8">
        <h1 className="font-heading text-3xl md:text-5xl font-800 text-ink mb-4">
          practical tools,
          <br />
          not fluff
        </h1>
        <p className="font-sans text-sm text-ink/60 max-w-md leading-relaxed">
          templates, checklists, and guides you can use immediately, built from real deal experience.
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
          {filtered.map((product) => (
            <div
              key={product.slug}
              className={`bg-card border rounded-2xl p-6 transition-all ${
                product.comingSoon
                  ? "border-border opacity-60"
                  : "border-border hover:border-peach-dark/40 hover:shadow-sm"
              }`}
            >
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <product.icon size={14} className="text-peach-dark" />
                    <span className="text-[10px] bg-amber-tag text-ink/60 px-2 py-0.5 rounded font-sans">
                      {product.tag}
                    </span>
                    {product.comingSoon && (
                      <span className="text-[10px] bg-ink/10 text-ink/50 px-2 py-0.5 rounded font-sans">
                        coming soon
                      </span>
                    )}
                  </div>
                  <h2 className="font-heading text-xl font-700 text-ink mb-2">{product.title}</h2>
                  <p className="font-sans text-sm text-ink/60 leading-relaxed max-w-lg">{product.description}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-sans font-700 text-ink text-lg mb-3">{product.price}</p>
                  {!product.comingSoon && (
                    <button className="inline-flex items-center gap-1.5 bg-ink text-cream text-xs font-sans font-semibold px-4 py-2 rounded-lg hover:bg-ink/80 transition-colors">
                      <Download size={11} />
                      buy now
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center py-8 border-t border-border">
          <p className="font-sans text-sm text-ink/40">
            want something specific? i take requests.
          </p>
          <a
            href="mailto:hello@priyaahuja.com"
            className="inline-flex items-center gap-1.5 text-sm font-sans font-semibold text-peach-dark hover:underline mt-2"
          >
            drop me a note <ArrowRight size={13} />
          </a>
        </div>
      </div>
    </div>
  )
}
