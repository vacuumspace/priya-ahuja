"use client"

import { useState } from "react"
import type { Template } from "@/lib/templates-data"
import TemplateCardAuth from "./TemplateCardAuth"

type Props = {
  products: Template[]
  purchaseMap: Record<string, string>
  isAuthenticated: boolean
  userEmail?: string
}

export default function TemplatesGrid({ products, purchaseMap, isAuthenticated, userEmail }: Props) {
  const allTags = ["all", ...Array.from(new Set(products.map((p) => p.tag)))]
  const [active, setActive] = useState("all")
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
            <TemplateCardAuth
              key={product.slug}
              product={product}
              isAuthenticated={isAuthenticated}
              purchaseToken={purchaseMap[product.slug]}
              userEmail={userEmail}
            />
          ))}
        </div>
      </div>
    </>
  )
}
