import Link from "next/link"
import { Sparkles } from "lucide-react"

export function ConsultancyCta() {
  return (
    <div className="bg-peach/25 border border-peach-dark/25 rounded-2xl p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={15} className="text-peach-dark flex-shrink-0" />
            <p className="text-[12px] font-sans text-ink/40 uppercase tracking-widest">
              need more than a session?
            </p>
          </div>
          <h3 className="font-heading text-lg md:text-xl font-700 text-ink mb-2 normal-case">
            long term or specific task based consultancy
          </h3>
          <p className="font-sans text-sm text-ink/60 leading-relaxed max-w-xl">
            pitch deck preparation, fundraise readiness, startup launch (0 → 1),
            due diligence, short/long term startup consultancy &amp; more - deep,
            hands-on work that needs continuous involvement, not just one call.
          </p>
        </div>
        <div className="flex-shrink-0">
          <Link
            href="/services/consultancy"
            className="inline-flex items-center bg-peach-dark text-cream font-sans font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-peach-dark/85 transition-colors"
          >
            enquire
          </Link>
        </div>
      </div>
    </div>
  )
}
