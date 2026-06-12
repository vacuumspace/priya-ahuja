"use client"

import { useState } from "react"
import { CheckCircle, ChevronDown, ChevronUp } from "lucide-react"
import type { Template } from "@/lib/templates-data"

function renderBody(text: string) {
  const html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .split("\n")
    .map((line) => {
      if (line.startsWith("---")) return `<hr class="border-border my-4" />`
      if (line.match(/^\*\*(.+)\*\*$/)) return `<p class="font-semibold text-ink mt-4 mb-1">${line.replace(/\*\*/g, "")}</p>`
      const bold = line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      if (line.startsWith("- ") || line.match(/^\d+\./)) {
        return `<li class="ml-4 list-disc text-ink/80 leading-relaxed text-sm">${bold.replace(/^- /, "").replace(/^\d+\.\s*/, "")}</li>`
      }
      if (line.trim() === "") return `<div class="h-2"></div>`
      return `<p class="text-ink/80 leading-relaxed text-sm">${bold}</p>`
    })
    .join("")
  return html
}

export default function TemplateViewer({ template }: { template: Template }) {
  const [openSection, setOpenSection] = useState<number | null>(0)

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <CheckCircle size={16} className="text-green-600" />
        <span className="text-[10px] font-sans text-ink/40 uppercase tracking-[0.18em]">access confirmed</span>
      </div>
      <h1 className="font-heading text-[clamp(1.6rem,4vw,2.4rem)] font-800 text-ink leading-tight tracking-tight mb-1">
        {template.title}
      </h1>
      <p className="font-sans text-sm text-ink/50 mb-8">{template.sections.length} sections</p>

      <div className="space-y-2">
        {template.sections.map((section, i) => (
          <div key={i} className="border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => setOpenSection(openSection === i ? null : i)}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-ink/5 transition-colors"
            >
              <span className="font-sans font-semibold text-sm text-ink">{section.heading}</span>
              {openSection === i
                ? <ChevronUp size={14} className="text-ink/40 flex-shrink-0" />
                : <ChevronDown size={14} className="text-ink/40 flex-shrink-0" />}
            </button>
            {openSection === i && (
              <div
                className="px-4 pb-4 border-t border-border"
                dangerouslySetInnerHTML={{ __html: renderBody(section.body) }}
              />
            )}
          </div>
        ))}
      </div>

      <p className="font-sans text-[11px] text-ink/30 mt-6 text-center">
        Access this anytime from History → Templates in your account.
      </p>
    </div>
  )
}
