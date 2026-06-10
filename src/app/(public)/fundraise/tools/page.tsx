import { ArrowRight } from "lucide-react"

export default function FundraiseToolsPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="flex justify-between items-center px-4 md:px-10 py-4 text-[11px] text-ink/50 font-sans border-b border-border">
        <span>fundraise · tools</span>
        <span>coming soon</span>
      </div>

      <div className="px-4 md:px-10 pt-12 pb-8">
        <p className="font-sans text-xs text-ink/40 uppercase tracking-wide mb-2">Fundraise</p>
        <h1 className="font-heading text-3xl md:text-5xl font-800 text-ink mb-4">
          do the maths
          <br />
          before you pitch
        </h1>
        <p className="font-sans text-sm text-ink/60 max-w-md leading-relaxed">
          calculators and estimators for the numbers that matter most in fundraising.
        </p>
      </div>

      <div className="px-4 md:px-10 pb-16">
        <div className="bg-card border border-border rounded-2xl px-6 py-12 text-center">
          <p className="font-sans text-sm text-ink/40 mb-1">no tools yet</p>
          <p className="font-sans text-xs text-ink/30">fundraise tools are coming — get notified when they launch.</p>
        </div>

        <div className="mt-6 bg-peach/30 border border-peach-dark/20 rounded-2xl p-6">
          <p className="font-heading text-lg font-700 text-ink mb-1">get notified</p>
          <p className="font-sans text-sm text-ink/60 mb-4">
            i&apos;ll drop a note when tools go live. no spam, just the launch.
          </p>
          <a
            href="mailto:hello@priyaahuja.com?subject=Notify me when fundraise tools are live"
            className="inline-flex items-center gap-2 bg-ink text-cream text-xs font-sans font-semibold px-4 py-2.5 rounded-lg hover:bg-ink/80 transition-colors"
          >
            notify me <ArrowRight size={12} />
          </a>
        </div>
      </div>
    </div>
  )
}
