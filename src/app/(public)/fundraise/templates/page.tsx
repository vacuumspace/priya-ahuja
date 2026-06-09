"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"
import { getTemplatesByCategory } from "@/lib/templates-data"
import TemplateCard from "@/components/templates/TemplateCard"
import Script from "next/script"

const products = getTemplatesByCategory("fundraise")
const allTags = ["all", ...Array.from(new Set(products.map((p) => p.tag)))]

export default function FundraiseTemplatesPage() {
  const [active, setActive] = useState("all")
  const filtered = active === "all" ? products : products.filter((p) => p.tag === active)

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="min-h-screen bg-cream">
        <div className="flex justify-between items-center px-4 md:px-10 py-4 text-[11px] text-ink/50 font-sans border-b border-border">
          <span>fundraise · digital downloads</span>
          <span>{products.filter((p) => !p.comingSoon).length} available</span>
        </div>

        <div className="px-4 md:px-10 pt-12 pb-8">
          <p className="font-sans text-xs text-ink/40 uppercase tracking-wide mb-2">Fundraise</p>
          <h1 className="font-heading text-3xl md:text-5xl font-800 text-ink mb-4">
            practical tools,
            <br />
            not fluff
          </h1>
          <p className="font-sans text-sm text-ink/60 max-w-md leading-relaxed">
            templates, checklists, and guides you can use immediately, built from real deal experience.
          </p>
        </div>

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
              <TemplateCard key={product.slug} product={product} />
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
    </>
  )
}
