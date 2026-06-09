import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Star } from "lucide-react"

const stats = [
  { value: "50+", label: "founders helped" },
  { value: "5★", label: "average rating" },
  { value: "₹100cr+", label: "capital advised" },
  { value: "Groww", label: "corp dev team" },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <section className="px-4 md:px-10 pt-10 md:pt-16 pb-12">
        <div className="max-w-3xl">
          <h1 className="font-heading text-4xl md:text-6xl font-800 text-ink leading-[1.05] mb-6">
            the founder&apos;s edge,<br />
            clarity when it counts
          </h1>
          <p className="text-base font-sans text-ink/70 leading-relaxed max-w-xl mb-8">
            building a startup means making hard calls with incomplete information,
            every single day. whether you&apos;re figuring out your model, your team,
            your raise, or your next move — i&apos;ve been close enough to early-stage
            companies to know what actually moves the needle.
          </p>
          <div className="flex gap-3">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 bg-ink text-cream text-sm font-sans font-semibold px-6 py-3 rounded-xl hover:bg-ink/80 transition-colors"
            >
              consult with Priya <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-4 md:px-10 py-8 border-y border-border">
        <div className="flex gap-8 md:gap-12 flex-wrap">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-heading text-3xl font-700 text-ink">{s.value}</p>
              <p className="text-xs font-sans text-ink/50 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About Priya */}
      <section className="px-4 md:px-10 py-10 md:py-16 border-b border-border">
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start">
          {/* Image */}
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="w-64 h-80 rounded-2xl border-2 border-peach-dark/20 overflow-hidden relative">
                <Image
                  src="/priyadp.jpeg"
                  alt="Priya Ahuja"
                  fill
                  className="object-cover object-top"
                  priority
                />
              </div>
              {/* floating badge */}
              <div className="absolute -bottom-4 -right-4 bg-ink text-cream text-[11px] font-sans font-semibold px-4 py-2 rounded-xl shadow-lg">
                groww · corp dev
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="flex-1 max-w-xl">
            <p className="text-[11px] font-sans text-ink/40 uppercase tracking-widest mb-4">
              about Priya
            </p>
            <h2 className="font-heading text-3xl md:text-4xl font-800 text-ink leading-tight mb-6">
              i&apos;ve seen what<br />works for founders,<br />and what doesn&apos;t.
            </h2>
            <div className="space-y-4 font-sans text-sm text-ink/70 leading-relaxed">
              <p>
                i&apos;m Priya Ahuja, part of the corporate development team at groww,
                india&apos;s largest retail investment platform. my work puts me close
                to early-stage companies — how they think, how they stumble, and how
                the good ones keep moving forward.
              </p>
              <p>
                i work with founders across the messy middle: figuring out positioning,
                business model clarity, go-to-market, hiring their first team, or
                preparing for a raise. the problems are rarely one-dimensional.
              </p>
              <p>
                i started advising founders on the side because i kept seeing the same
                fixable mistakes, and because i genuinely love helping people build
                with conviction.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {["startup strategy", "fundraising", "business model", "go-to-market", "corp dev"].map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] font-sans bg-peach/50 text-ink/60 px-3 py-1.5 rounded-lg"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 md:px-10 py-10 md:py-12 border-b border-border">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading text-2xl md:text-3xl font-700 text-ink">the results speak<br />for themselves</h2>
          <div className="text-right">
            <p className="font-heading text-4xl font-700 text-ink">5.0</p>
            <div className="flex gap-0.5 justify-end mt-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} fill="#FFA07A" className="text-peach-dark" />
              ))}
            </div>
            <p className="text-[11px] text-ink/40 font-sans mt-1">from topmate</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div key={t.name} className="bg-card border border-border rounded-xl p-5">
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={11} fill="#FFA07A" className="text-peach-dark" />
                ))}
              </div>
              <p className="font-sans text-sm text-ink/70 leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-peach flex items-center justify-center">
                  <span className="text-[10px] font-heading font-700 text-ink">
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

    </div>
  )
}
