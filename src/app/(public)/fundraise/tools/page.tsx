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

      </div>
    </div>
  )
}
