import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Star } from "lucide-react"

const LinkedInIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
)

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
)

const stats = [
  { value: "50+", label: "founders" },
  { value: "5★", label: "rating" },
  { value: "₹100cr+", label: "capital" },
  { value: "Groww", label: "corp dev" },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-cream">

      {/* Hero — big type, asymmetric */}
      <section className="px-6 md:px-12 pt-14 md:pt-20 pb-0">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 md:gap-0">
          <h1 className="font-heading text-[clamp(2.8rem,8vw,6.5rem)] font-800 text-ink leading-[0.95] tracking-tight max-w-2xl">
            the founder&apos;s<br />edge.
          </h1>
          <div className="md:pb-3 max-w-[260px]">
            <p className="font-sans text-sm text-ink/55 leading-relaxed">
              clarity when it counts — strategy, fundraising, and conviction for early-stage founders.
            </p>
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 mt-5 text-sm font-sans font-semibold text-ink border-b border-ink/30 pb-0.5 hover:border-ink transition-colors group"
            >
              work with Priya
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Thin divider with stats inline */}
      <section className="mt-10 md:mt-14 border-t border-border px-6 md:px-12 pt-5 pb-6">
        <div className="flex gap-8 md:gap-14 flex-wrap">
          {stats.map((s) => (
            <div key={s.label} className="flex items-baseline gap-2">
              <span className="font-heading text-xl font-700 text-ink">{s.value}</span>
              <span className="text-[11px] font-sans text-ink/40 tracking-wide">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* About — image left, bio right, asymmetric margin */}
      <section className="px-6 md:px-12 mt-10 md:mt-16 pb-14 md:pb-20 border-b border-border">
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-10 md:gap-20 items-start">

          {/* Portrait */}
          <div className="self-start flex flex-col items-center gap-3">
            <div className="w-[220px] md:w-[260px] aspect-[3/4] rounded-2xl overflow-hidden relative">
              <Image
                src="/priyadp.jpeg"
                alt="Priya Ahuja"
                fill
                className="object-cover object-top"
                priority
              />
            </div>
            <div className="flex items-center gap-3">
              <a
                href="https://www.linkedin.com/in/ca-priya-harwani/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-ink/50 hover:text-ink transition-colors text-[11px] font-sans"
                aria-label="LinkedIn"
              >
                <LinkedInIcon />
                <span>linkedin</span>
              </a>
              <span className="text-ink/20 text-xs">·</span>
              <a
                href="https://www.instagram.com/pitchtopriya"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-ink/50 hover:text-ink transition-colors text-[11px] font-sans"
                aria-label="Instagram"
              >
                <InstagramIcon />
                <span>instagram</span>
              </a>
            </div>
          </div>

          {/* Bio */}
          <div className="pt-1 md:pt-8">
            <p className="text-[10px] font-sans text-ink/35 uppercase tracking-[0.15em] mb-5">about</p>
            <h2 className="font-heading text-3xl md:text-[2.6rem] font-800 text-ink leading-[1.05] mb-7">
              i&apos;ve seen what works<br className="hidden md:block" /> for founders,<br />and what doesn&apos;t.
            </h2>
            <div className="space-y-4 font-sans text-[0.9rem] text-ink/60 leading-relaxed max-w-lg">
              <p>
                i&apos;m Priya Ahuja, part of the corporate development team at groww —
                india&apos;s largest retail investment platform. my work keeps me close
                to early-stage companies: how they think, how they stumble, and how
                the good ones keep moving.
              </p>
              <p>
                i work with founders across the messy middle: positioning, business
                model clarity, go-to-market, first hires, or preparing for a raise.
                the problems are rarely one-dimensional.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {["startup strategy", "fundraising", "business model", "go-to-market", "corp dev"].map((tag) => (
                <span key={tag} className="text-[11px] font-sans bg-peach/40 text-ink/55 px-3 py-1.5 rounded-full border border-peach-dark/15">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials — horizontal strip */}
      <section className="px-6 md:px-12 py-12 md:py-16">
        <div className="flex items-baseline justify-between mb-10">
          <h2 className="font-heading text-2xl md:text-3xl font-700 text-ink">what founders say</h2>
          <div className="flex items-center gap-1.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={11} fill="#FFA07A" className="text-peach-dark" />
            ))}
            <span className="text-[11px] font-sans text-ink/35 ml-1">5.0 · topmate</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border rounded-2xl overflow-hidden border border-border">
          {[
            {
              name: "ankit sharma",
              role: "founder, fintech startup",
              text: "Priya helped me get clear on what we were actually building and who it was for. that clarity changed everything — including how we raised.",
            },
            {
              name: "neha gupta",
              role: "co-founder, b2b saas",
              text: "i came in thinking i needed pitch help. we ended up reworking my go-to-market entirely. incredibly practical and no-nonsense.",
            },
          ].map((t) => (
            <div key={t.name} className="bg-cream p-7 md:p-9">
              <p className="font-sans text-[0.9rem] text-ink/65 leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-peach flex items-center justify-center flex-shrink-0">
                  <span className="text-[11px] font-heading font-700 text-ink">
                    {t.name[0].toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-sans font-semibold text-ink">{t.name}</p>
                  <p className="text-[10px] font-sans text-ink/40">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA strip */}
      <section className="mx-6 md:mx-12 mb-14 rounded-2xl bg-ink text-cream px-8 md:px-12 py-10 md:py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h3 className="font-heading text-2xl md:text-3xl font-700 leading-tight">ready to get unstuck?</h3>
          <p className="font-sans text-sm text-cream/50 mt-2 max-w-sm">one session can reframe months of confusion.</p>
        </div>
        <Link
          href="/services"
          className="inline-flex items-center gap-2 bg-cream text-ink text-sm font-sans font-semibold px-6 py-3 rounded-xl hover:bg-peach transition-colors self-start md:self-auto flex-shrink-0 group"
        >
          book a session
          <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </section>

    </div>
  )
}
