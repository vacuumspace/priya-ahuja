"use client"

import { useState } from "react"
import { Eye, X, ChevronDown, ChevronUp, CheckCircle, Loader2, Download } from "lucide-react"

type Section = { heading: string; body: string }

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

type Props = {
  slug: string
  title: string
  token: string
}

export default function ViewTemplateButton({ slug, title, token }: Props) {
  const [open, setOpen] = useState(false)
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [openSection, setOpenSection] = useState<number | null>(0)

  async function handleView() {
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`/api/products/access?token=${encodeURIComponent(token)}&slug=${slug}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Could not load content")
      setSections(data.sections)
      setOpen(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load content")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex items-center gap-3 mt-1 flex-shrink-0">
        <button
          onClick={handleView}
          disabled={loading}
          className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold text-peach-dark hover:underline disabled:opacity-50"
        >
          {loading ? <Loader2 size={11} className="animate-spin" /> : <Eye size={11} />}
          view
        </button>
        <a
          href={`/api/products/download?token=${encodeURIComponent(token)}&slug=${slug}`}
          download
          className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold text-ink/50 hover:text-ink transition-colors"
        >
          <Download size={11} />
          .doc
        </a>
      </div>

      {error && <p className="text-[10px] font-sans text-red-500 mt-1">{error}</p>}

      {open && sections.length > 0 && (
        <div
          className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false) }}
        >
          <div className="bg-cream rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  <div>
                    <h3 className="font-heading text-xl font-700 text-ink">{title}</h3>
                    <p className="font-sans text-xs text-ink/40 mt-0.5">{sections.length} sections</p>
                  </div>
                </div>
                <button onClick={() => setOpen(false)} className="text-ink/40 hover:text-ink transition-colors">
                  <X size={18} />
                </button>
              </div>
              <div className="border-t border-border mt-4 pt-4 space-y-2">
                {sections.map((section, i) => (
                  <div key={i} className="border border-border rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenSection(openSection === i ? null : i)}
                      className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-ink/5 transition-colors"
                    >
                      <span className="font-sans font-semibold text-sm text-ink">{section.heading}</span>
                      {openSection === i ? <ChevronUp size={14} className="text-ink/40 flex-shrink-0" /> : <ChevronDown size={14} className="text-ink/40 flex-shrink-0" />}
                    </button>
                    {openSection === i && (
                      <div className="px-4 pb-4 border-t border-border" dangerouslySetInnerHTML={{ __html: renderBody(section.body) }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
