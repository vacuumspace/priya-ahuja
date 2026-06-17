"use client"

import Image from "next/image"
import Link from "next/link"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
import { useSession } from "next-auth/react"

const LinkedInIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
)

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
)

const testimonials = [
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
]

export default function HomePage() {
  const [idx, setIdx] = useState(0)
  const { data: session } = useSession()

  const prev = () => setIdx((i) => (i - 1 + testimonials.length) % testimonials.length)
  const next = () => setIdx((i) => (i + 1) % testimonials.length)

  const t = testimonials[idx]

  return (
    <div className="min-h-screen bg-cream max-w-2xl mx-auto px-5 md:px-10 py-8 md:py-20">

      {/* ── Top bar: profile left, CTA right ── */}
      <div className="flex items-start justify-between mb-12">
        {/* Profile */}
        <div className="flex items-center gap-4">
          <div className="relative w-[84px] h-[84px] rounded-full overflow-hidden border-2 border-peach-dark/30 flex-shrink-0">
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
            <p className="font-sans text-xs text-ink/40 mt-0.5">business educator</p>
            <p className="font-sans text-xs text-ink/40 mt-0.5">bangalore, india</p>
            {/* Social icons — TEMP hidden */}
            {false && <div className="flex gap-2.5 mt-1.5">
              <a href="https://www.linkedin.com/in/ca-priya-harwani/" target="_blank" rel="noopener noreferrer" className="text-ink/35 hover:text-ink transition-colors" aria-label="LinkedIn">
                <LinkedInIcon />
              </a>
              <a href="https://www.instagram.com/pitchtopriya" target="_blank" rel="noopener noreferrer" className="text-ink/35 hover:text-ink transition-colors" aria-label="Instagram">
                <InstagramIcon />
              </a>
            </div>}
          </div>
        </div>

        {/* CTA top-right — TEMP hidden */}
        {false && <Link
          href="/connect"
          className="inline-flex items-center text-xs font-sans font-semibold bg-peach-dark text-ink px-3.5 py-2 rounded-lg hover:bg-peach-dark/80 transition-colors flex-shrink-0"
        >
          connect
        </Link>}
      </div>

      {/* ── Continue where you left off (signed-in only) ── */}
      {session?.user && (
        <div className="mb-10 bg-peach/20 border border-peach-dark/15 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
          <div>
            <p className="font-sans text-xs font-semibold text-ink/70">
              welcome back{session.user.name ? `, ${session.user.name.split(" ")[0]}` : ""}
            </p>
            <p className="font-sans text-[11px] text-ink/40 mt-0.5">pick up where you left off</p>
          </div>
          <Link
            href="/my-sessions"
            className="text-[11px] font-sans font-semibold text-peach-dark hover:underline whitespace-nowrap flex-shrink-0"
          >
            my activity →
          </Link>
        </div>
      )}

      {/* ── Hero ── */}
      <div className="mb-14">
        <h1 className="font-heading text-[clamp(2.4rem,6vw,3.6rem)] font-800 text-ink leading-[0.95] tracking-tight mb-6">
          for the founder&apos;s<br />dream.
        </h1>
        <p className="font-sans text-sm text-ink/55 leading-relaxed mb-6">
          you're building something real. i help you to build to win with confidence - with actionable learnings and resources.
        </p>
        {/* TEMP: courses CTA replacing connect button */}
        <Link
          href="/courses"
          className="inline-flex items-center bg-peach-dark text-ink text-xs font-sans font-semibold px-5 py-2.5 rounded-lg hover:bg-peach-dark/80 transition-colors"
        >
          explore courses →
        </Link>
        {/* Original connect button — hidden temporarily
        <Link href="/connect" ...>connect</Link>
        */}
      </div>

      {/* ── Courses intro ── TEMP */}
      <div className="mb-14">
        <p className="text-[10px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-5">what we offer</p>
        <div className="space-y-3 font-sans text-sm text-ink/60 leading-relaxed mb-6">
          <p>
            practical business courses designed for founders, operators, and anyone building something of their own. no fluff, no theory for its own sake — every lesson is something you can act on.
          </p>
          <p>
            from business model design and go-to-market strategy to finance, sales, and team building — the full toolkit for running a real business.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { title: "self-paced", body: "learn on your schedule, at your own speed. lifetime access included." },
            { title: "practical first", body: "every module is built around what you can apply immediately." },
            { title: "founder-relevant", body: "topics chosen for the real challenges of building a business." },
          ].map((m) => (
            <div key={m.title} className="bg-peach/20 border border-peach-dark/15 rounded-xl px-4 py-4">
              <p className="font-sans text-[11px] font-semibold text-ink/80 mb-1">{m.title}</p>
              <p className="font-sans text-[11px] text-ink/45 leading-snug">{m.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Achievements ── TEMP hidden */}
      {false && <div className="mb-14">
        <p className="text-[10px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-5">achievements</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { value: "200+", label: "founders advised", sub: "across fintech, saas, consumer-tech & d2c" },
            { value: "₹200cr+", label: "fundraise guided", sub: "across pre-seed to pre-series A & series A rounds" },
            { value: "5.0★", label: "avg. session rating", sub: "from 50+ independent reviews" },
            { value: "3 yrs", label: "inside startup investment", sub: "investment, strategy, m&a at groww, india's #1 retail investment app" },
            { value: "12+", label: "sectors covered", sub: "fintech, edtech, healthtech, b2b, d2c, social platforms & more" },
            { value: "0%", label: "confusion", sub: "with all actionable insights and advice" },
          ].map((s) => (
            <div key={s.label} className="bg-peach/20 border border-peach-dark/15 rounded-xl px-4 py-4">
              <p className="font-heading text-2xl font-800 text-ink leading-none">{s.value}</p>
              <p className="font-sans text-[11px] font-semibold text-ink/70 mt-1.5">{s.label}</p>
              <p className="font-sans text-[10px] text-ink/35 mt-0.5 leading-snug">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>}

      {/* ── Testimonials (slider) ── TEMP hidden */}
      {false && <div className="mb-14">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <p className="text-[10px] font-sans text-ink/30 uppercase tracking-[0.18em]">what founders say</p>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => <Star key={i} size={9} fill="#FFA07A" className="text-peach-dark" />)}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={prev} aria-label="Previous" className="p-1 rounded-md text-ink/30 hover:text-ink hover:bg-peach/40 transition-colors">
              <ChevronLeft size={16} />
            </button>
            <span className="font-sans text-[10px] text-ink/30 tabular-nums w-8 text-center">{idx + 1}/{testimonials.length}</span>
            <button onClick={next} aria-label="Next" className="p-1 rounded-md text-ink/30 hover:text-ink hover:bg-peach/40 transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <div className="pl-4 border-l-2 border-peach-dark/30 min-h-[80px]">
          <p className="font-sans text-sm text-ink/60 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
          <p className="font-sans text-[10px] text-ink/35 mt-2">{t.name} · {t.role}</p>
        </div>
        <div className="flex gap-1 mt-4">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`h-1 rounded-full transition-all ${i === idx ? "w-5 bg-peach-dark/60" : "w-1.5 bg-peach-dark/20"}`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>}

      {/* ── CTA ── TEMP hidden */}
      {false && <div className="bg-ink rounded-2xl px-6 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-14">
        <div>
          <p className="font-heading text-lg font-700 text-cream">want to get unstuck?</p>
          <p className="font-sans text-xs text-cream/45 mt-1">one session can reframe months of confusion.</p>
        </div>
        <Link
          href="/connect"
          className="inline-flex items-center bg-peach-dark text-ink text-xs font-sans font-semibold px-4 py-2.5 rounded-lg hover:bg-peach-dark/80 transition-colors flex-shrink-0"
        >
          connect
        </Link>
      </div>}

      {/* ── About ── TEMP hidden */}
      {false && <div className="mb-14">
        <p className="text-[10px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-5">about</p>
        <div className="space-y-3 font-sans text-sm text-ink/60 leading-relaxed">
          <p>
            i work at groww ventures, the vc and strategic investment arm of groww — india&apos;s #1
            retail investment platform. day to day, that means fintech investments, m&amp;a, and
            working closely with startups at the intersection of capital and strategy.
          </p>
          <p>
            after years of evaluating hundreds of companies, i&apos;ve learned what the best founders
            have in common — and more importantly, what holds the rest back. it&apos;s rarely the
            idea. it&apos;s the story, the model, or the moment.
          </p>
          <p>
            that&apos;s what pitch to priya is about. working with early-stage founders one-on-one —
            on fundraising, startup strategy, business model, product direction, positioning. the full
            picture, not just the pitch.
          </p>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {["startup strategy", "fundraising", "business model", "go-to-market", "idea brainstorming"].map((tag) => (
            <span key={tag} className="text-[11px] font-sans bg-peach/50 text-ink/50 px-3 py-1 rounded-full border border-peach-dark/15">
              {tag}
            </span>
          ))}
        </div>
      </div>}

      {/* ── Mission ── TEMP hidden */}
      {/* ── Mission ── TEMP hidden */}
      {false && <div className="mb-14">
        <p className="text-[10px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-5">mission</p>
        <div className="space-y-4">
          <p className="font-heading text-xl font-700 text-ink leading-snug">
            more than 95% startup fail. i am here to reverse it.
          </p>
          <p className="font-sans text-sm text-ink/55 leading-relaxed">
            unfortunately i've also seen more than 95% of startups failed. no founder starts out thinking they'll be in that 95%. but the numbers are real, and the path is hard. and trust me shutting down a startup, which was founder's dream, is the worst thing. beyond that - loss of confidence, money and time.
          </p>
          <p className="font-sans text-sm text-ink/55 leading-relaxed">
            biggest reason behind a startup failure is all the small small mistakes that founders make in the early days, when they are still figuring things out. and most of these mistakes were avoidable if founders had the right resources with them.
          </p>
          <p className="font-sans text-sm text-ink/55 leading-relaxed">
            the mission is simple: i want to see more than 95% of founders to win and make their dream come true, with whatever best advice or resources i can provide.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {[
              { title: "honest over comfortable", body: "feedback that sharpens you, not validation that stalls you." },
              { title: "action over frameworks", body: "leave every session with something you can do today." },
              { title: "founder-first", body: "the goal is your growth, not dependency on advice." },
            ].map((m) => (
              <div key={m.title} className="bg-peach/20 border border-peach-dark/15 rounded-xl px-4 py-4">
                <p className="font-sans text-[11px] font-semibold text-ink/80 mb-1">{m.title}</p>
                <p className="font-sans text-[11px] text-ink/45 leading-snug">{m.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>}

      {/* ── Dream: 10k founders ── TEMP hidden */}
      {false && <div className="mb-14">
        <p className="text-[10px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-5">north star</p>
        <p className="font-heading text-xl font-700 text-ink leading-snug mb-3">
          help 10,000 founders to win.
        </p>
        <div className="bg-peach/20 border border-peach-dark/15 rounded-xl px-5 py-5">
          <p className="font-sans text-[10px] text-ink/30 mb-1">progress</p>
          <div className="relative w-full bg-peach-dark/15 rounded-full h-2.5 overflow-visible mb-2 mt-6">
            <div className="h-full bg-peach-dark rounded-full relative" style={{ width: "2.5%" }}>
              <span className="absolute -top-5 left-0 font-sans text-[10px] font-semibold text-peach-dark whitespace-nowrap">2.5%</span>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="font-sans text-[11px] text-ink/40">0</span>
            <span className="font-sans text-[11px] text-ink/40">10,000</span>
          </div>
        </div>
      </div>}

      {/* ── Footer nav ── TEMP hidden */}
      {false && <div className="border-t border-peach-dark/15 pt-6 pb-2">
        <p className="text-[10px] font-sans text-ink/30 uppercase tracking-[0.18em] mb-5">explore more</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            {
              heading: "startup",
              href: "/startup",
              links: [
                { label: "100 startup ideas", href: "/startup/ideas" },
                { label: "idea score", href: "/startup/tools/idea-score" },
                { label: "templates", href: "/startup/templates" },
                { label: "blog", href: "/startup/blog" },
              ],
            },
            {
              heading: "fundraise",
              href: "/fundraise",
              links: [
                { label: "fundability score", href: "/fundraise/tools/fundability-score" },
                { label: "angel investors", href: "/fundraise/angel-investors" },
                { label: "templates", href: "/fundraise/templates" },
                { label: "blog", href: "/fundraise/blog" },
              ],
            },
            {
              heading: "connect",
              href: "/connect",
              links: [
                { label: "book a session", href: "/connect" },
                { label: "my activity", href: "/my-sessions" },
              ],
            },
            {
              heading: "services",
              href: null,
              links: [
                { label: "tech product dev", href: "/services/tech" },
                { label: "branding", href: "/services/branding" },
                { label: "finance", href: "/services/accounting" },
                { label: "legal compliance", href: "/services/incorporation" },
              ],
            },
          ].map((col) => (
            <div key={col.heading}>
              {col.href ? (
                <Link href={col.href} className="font-sans text-[11px] font-semibold text-ink/50 hover:text-ink/80 transition-colors uppercase tracking-wide mb-2.5 block">
                  {col.heading}
                </Link>
              ) : (
                <p className="font-sans text-[11px] font-semibold text-ink/50 uppercase tracking-wide mb-2.5">{col.heading}</p>
              )}
              <div className="flex flex-col gap-1.5">
                {col.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="font-sans text-[11px] text-ink/30 hover:text-ink/60 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>}

    </div>
  )
}
