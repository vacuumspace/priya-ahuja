import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Star } from "lucide-react"

const LinkedInIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
)

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
)

export default function HomePage() {
  return (
    <div className="min-h-screen bg-cream max-w-2xl mx-auto px-6 md:px-10 py-14 md:py-20">

      {/* ── Top bar: profile left, CTA right ── */}
      <div className="flex items-start justify-between mb-12">
        {/* Profile */}
        <div className="flex items-center gap-4">
          <div className="relative w-[72px] h-[72px] rounded-full overflow-hidden border-2 border-peach-dark/30 flex-shrink-0">
            <Image
              src="/priyadp.jpeg"
              alt="Priya Ahuja"
              fill
              className="object-cover object-top"
              priority
            />
          </div>
          <div>
            <p className="font-heading text-base font-700 text-ink">Priya Ahuja</p>
            <p className="font-sans text-xs text-ink/40 mt-0.5">corp dev · groww</p>
            <div className="flex gap-2.5 mt-2">
              <a href="https://www.linkedin.com/in/ca-priya-harwani/" target="_blank" rel="noopener noreferrer" className="text-ink/35 hover:text-ink transition-colors" aria-label="LinkedIn">
                <LinkedInIcon />
              </a>
              <a href="https://www.instagram.com/pitchtopriya" target="_blank" rel="noopener noreferrer" className="text-ink/35 hover:text-ink transition-colors" aria-label="Instagram">
                <InstagramIcon />
              </a>
            </div>
          </div>
        </div>

        {/* CTA top-right */}
        <Link
          href="/consult"
          className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold bg-peach-dark text-ink px-3.5 py-2 rounded-lg hover:bg-peach-dark/80 transition-colors group flex-shrink-0"
        >
          consult with Priya
          <ArrowUpRight size={11} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      {/* ── Hero ── */}
      <div className="mb-14">
        <h1 className="font-heading text-[clamp(2.4rem,6vw,3.6rem)] font-800 text-ink leading-[0.95] tracking-tight mb-6">
          the founder&apos;s<br />edge.
        </h1>
        <p className="font-sans text-sm text-ink/55 leading-relaxed">
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
