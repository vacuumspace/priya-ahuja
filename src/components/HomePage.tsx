import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Star } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-cream max-w-2xl mx-auto px-6 md:px-10 py-14 md:py-20">

      {/* ── Header row ── */}
      <div className="flex items-start justify-between mb-14">
        <div>
          <p className="font-heading text-base font-700 text-ink">Priya Ahuja</p>
          <p className="font-sans text-xs text-ink/40 mt-0.5">corp dev · groww</p>
        </div>
        <Link
          href="/consult"
          className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold bg-peach-dark text-ink px-3.5 py-2 rounded-lg hover:bg-peach-dark/80 transition-colors group mt-0.5"
        >
          consult with Priya
          <ArrowUpRight size={11} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      {/* ── Hero ── */}
      <div className="mb-14">
        {/* Photo inline with first line */}
        <div className="flex items-start gap-5 mb-6">
          <div className="relative w-[88px] h-[108px] rounded-xl overflow-hidden flex-shrink-0 mt-1 border border-peach-dark/20">
            <Image
              src="/priyadp.jpeg"
              alt="Priya Ahuja"
              fill
              className="object-cover object-top"
              priority
            />
          </div>
          <h1 className="font-heading text-[clamp(2.4rem,6vw,3.6rem)] font-800 text-ink leading-[0.95] tracking-tight">
            the founder&apos;s<br />edge.
          </h1>
        </div>
        <p className="font-sans text-sm text-ink/55 leading-relaxed max-w-sm">
          clarity when it counts — strategy, fundraising, and conviction for early-stage founders, from someone inside the deal flow.
        </p>
      </div>

      {/* ── Stats ── */}
      <div className="flex gap-8 bg-peach/25 border border-peach-dark/15 rounded-xl px-6 py-5 mb-14">
        {[
          { value: "50+", label: "founders" },
          { value: "5.0★", label: "rating" },
          { value: "₹100cr+", label: "capital" },
        ].map((s) => (
          <div key={s.label}>
            <p className="font-heading text-xl font-700 text-ink">{s.value}</p>
            <p className="font-sans text-[10px] text-ink/40 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── About ── */}
      <div className="mb-14">
        <p className="text-[10px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-5">about</p>
        <div className="space-y-3 font-sans text-sm text-ink/60 leading-relaxed">
          <p>
            i&apos;m part of the corporate development team at groww — india&apos;s largest retail
            investment platform. my work keeps me close to early-stage companies: how they think,
            how they stumble, and how the good ones keep moving.
          </p>
          <p>
            i work with founders across positioning, business model clarity, go-to-market,
            first hires, and fundraising prep. the problems are rarely one-dimensional.
          </p>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {["startup strategy", "fundraising", "business model", "go-to-market", "corp dev"].map((tag) => (
            <span key={tag} className="text-[11px] font-sans bg-peach/50 text-ink/50 px-3 py-1 rounded-full border border-peach-dark/15">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* ── Testimonials ── */}
      <div className="mb-14">
        <div className="flex items-center gap-2 mb-6">
          <p className="text-[10px] font-sans text-ink/30 uppercase tracking-[0.18em]">what founders say</p>
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => <Star key={i} size={9} fill="#FFA07A" className="text-peach-dark" />)}
          </div>
        </div>
        <div className="space-y-6">
          {[
            {
              name: "ankit sharma",
              role: "founder, fintech",
              text: "Priya helped me get clear on what we were actually building. that clarity changed how we raised.",
            },
            {
              name: "neha gupta",
              role: "co-founder, b2b saas",
              text: "i came in thinking i needed pitch help. we reworked my go-to-market entirely. practical and no-nonsense.",
            },
            {
              name: "rohit mehta",
              role: "founder, edtech",
              text: "one session with Priya was worth three months of advice from well-meaning people who hadn't actually raised. she cuts straight to what matters.",
            },
            {
              name: "divya nair",
              role: "co-founder, healthtech",
              text: "she helped us see our unit economics from an investor's lens — not just as a model on a spreadsheet. we fixed the story before it became a red flag.",
            },
            {
              name: "karan bhatia",
              role: "founder, logistics",
              text: "i was stuck on whether to raise or extend runway. Priya walked me through the tradeoffs in a way that made the decision obvious. clear thinking, no agenda.",
            },
            {
              name: "simran oberoi",
              role: "founder, consumer brand",
              text: "i'd been stalling on the fundraise for weeks. after talking to Priya i had a plan i actually believed in. the follow-through from there was mine — but the clarity was hers.",
            },
          ].map((t) => (
            <div key={t.name} className="pl-4 border-l-2 border-peach-dark/30">
              <p className="font-sans text-sm text-ink/60 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
              <p className="font-sans text-[10px] text-ink/35 mt-2">{t.name} · {t.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="bg-ink rounded-2xl px-7 py-7 flex items-center justify-between gap-4">
        <div>
          <p className="font-heading text-lg font-700 text-cream">ready to get unstuck?</p>
          <p className="font-sans text-xs text-cream/45 mt-1">one session can reframe months of confusion.</p>
        </div>
        <Link
          href="/consult"
          className="inline-flex items-center gap-1.5 bg-peach-dark text-ink text-xs font-sans font-semibold px-4 py-2.5 rounded-lg hover:bg-peach-dark/80 transition-colors group flex-shrink-0"
        >
          consult now
          <ArrowUpRight size={11} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

    </div>
  )
}
