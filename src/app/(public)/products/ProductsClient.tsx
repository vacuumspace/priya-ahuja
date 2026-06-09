"use client"

import { useState } from "react"
import { ArrowRight, FileText, Download } from "lucide-react"

export type PublicProduct = {
  slug: string
  title: string
  description: string
  price: string
  tag: string
  comingSoon: boolean
}

const allTagsFrom = (products: PublicProduct[]) =>
  ["all", ...Array.from(new Set(products.map((p) => p.tag)))]

export function ProductsClient({ products }: { products: PublicProduct[] }) {
  const [active, setActive] = useState("all")
  const allTags = allTagsFrom(products)
  const filtered = active === "all" ? products : products.filter((p) => p.tag === active)

  return (
    <>
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
                    <FileText size={14} className="text-peach-dark" />
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
    </>
  )
}
