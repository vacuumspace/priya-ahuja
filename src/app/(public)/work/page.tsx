import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "work | priya ahuja",
  robots: { index: false, follow: false },
}

const strategyAreas = [
  { label: "business model", desc: "Who pays, how much, why it holds up as you scale" },
  { label: "positioning", desc: "What you are, who you're for, and how you're different from everything else in the market" },
  { label: "go-to-market", desc: "Where to start, what to focus on, and how to build early traction without spreading thin" },
  { label: "product direction", desc: "What to build next, what to cut, grounded in actual customer and market reality" },
  { label: "hiring and team", desc: "First hires, equity conversations, how to structure the team as things get more complex" },
  { label: "co-founder dynamics", desc: "Role clarity, decision-making, and the hard conversations that most people avoid too long" },
  { label: "operations", desc: "Building the foundations that let the business run without everything depending on the founder" },
  { label: "growth", desc: "Identifying what's actually working and building around that, not just running more experiments" },
]

const fundraiseAreas = [
  { label: "funding readiness", desc: "Data room, due diligence prep, cap table cleanup, so when an investor says yes, you're not scrambling" },
  { label: "investor targeting", desc: "A focused list of the right angels and VCs, not a spray-and-pray approach" },
  { label: "investor narrative", desc: "The story that connects your insight, your market, and your ask in a way that actually lands" },
  { label: "deck", desc: "Structure, content, and what investors at your stage are really looking for" },
  { label: "pitch prep", desc: "Live sessions to sharpen delivery and get ready for the hard questions" },
  { label: "process", desc: "How to sequence conversations, build momentum, and keep control of the round" },
  { label: "terms", desc: "What to push back on, what to let go, and how to read a term sheet without a lawyer in the room" },
]

const highlights = [
  { title: "honest over comfortable", desc: "feedback that sharpens you, not validation that stalls you." },
  { title: "action over frameworks", desc: "leave every session with something you can do today." },
  { title: "founder-first", desc: "the goal is your growth, not dependency on advice." },
  { title: "strategy before fundraising", desc: "a fundable business comes before a fundable deck." },
  { title: "depth over breadth", desc: "fewer things done well beats more things done fast." },
  { title: "in it for the long game", desc: "there for the wins, the setbacks, and everything in between." },
]

const approach = [
  {
    phase: "01 / understand first",
    body: "i don't come in with a framework. i spend the first session just listening: what you're building, where you are, what you've tried. most founders already know what's wrong; they just need someone to help them name it.",
  },
  {
    phase: "02 / strategy before anything else",
    body: "a lot of early-stage problems look like execution problems but are actually clarity problems. before working on growth, GTM, or fundraising, i want to make sure the fundamentals are solid: what the business actually is, who it's for, and whether the model holds up. everything else builds on that.",
  },
  {
    phase: "03 / context over playbooks",
    body: "whether it's a strategy question or a fundraising question, the answer is always specific to your situation. your stage, your sector, your team, your market. i don't hand out the same advice to every founder. the work is in figuring out what's true for you.",
  },
  {
    phase: "04 / honest, not comfortable",
    body: "if something isn't working, i'll say so. if the business isn't ready to raise, i'll tell you that too. the goal is to give you an accurate picture, not a flattering one. founders usually find that more useful.",
  },
  {
    phase: "05 / on your side",
    body: "whether we're working on strategy or a fundraise, i'm working for you. that sometimes means telling you to slow down, revisit an assumption, or walk away from a deal that doesn't make sense. short-term discomfort over long-term regret.",
  },
  {
    phase: "06 / how we actually work together",
    body: "most engagements start with a few focused sessions to understand where things stand, then move into regular working sessions, usually weekly or fortnightly depending on what's needed. some founders want help with one specific problem; others want someone in their corner for the full journey. both work.",
  },
  {
    phase: "07 / long game",
    body: "good advisory shows up at the right moment, which is often not when you're actively fundraising or in a crisis. i try to stay useful across the journey: hiring calls, product direction, co-founder dynamics, team decisions. the stuff that actually determines whether a company makes it.",
  },
  {
    phase: "08 / terms",
    body: "i work on a retainer basis as an advisor or consultant, starting from Rs. 1 lakh per month. the structure depends on the scope and how involved the engagement needs to be.",
  },
  {
    phase: "09 / on equity",
    body: "i generally don't take equity, and i actively advise founders against giving it away early. at the pre-seed and seed stage, equity is your most valuable asset and you should be very deliberate about who gets it. if we've worked together for a while and the founder genuinely feels i've earned a stake, i'm open to that conversation then. but it's never something i ask for upfront.",
  },
]

export default function WorkPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Breadcrumb bar */}
      <div className="flex justify-between items-center px-4 md:px-10 py-4 text-[11px] text-ink/50 font-sans border-b border-border">
        <span>work & advisory</span>
      </div>

      {/* Anchor nav */}
      <div className="sticky top-0 z-10 bg-cream/95 backdrop-blur-sm border-b border-border px-4 md:px-10 py-3 flex gap-5 overflow-x-auto scrollbar-none">
        {[
          { label: "experience", href: "#experience" },
          { label: "startup strategy", href: "#strategy" },
          { label: "fundraising", href: "#fundraising" },
          { label: "how i work", href: "#how-i-work" },
          { label: "principles", href: "#highlights" },
        ].map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="font-sans text-[11px] text-ink/50 hover:text-ink whitespace-nowrap transition-colors"
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Hero */}
      <div className="px-4 md:px-10 pt-12 pb-10 border-b border-border">
        <h1 className="font-heading text-3xl md:text-5xl font-800 text-ink mb-5 leading-tight">
          what i do
          <br />
          and how i do it
        </h1>
        <p className="font-sans text-sm text-ink/60 max-w-lg leading-relaxed">
          i work with early-stage founders across two things: building the right business, and getting it funded.
          sometimes both at once. here is what that actually looks like.
        </p>
      </div>

      {/* Experience */}
      <div id="experience" className="px-4 md:px-10 pt-10 pb-12 border-b border-border">
        <p className="font-sans text-[10px] text-ink/40 uppercase tracking-widest mb-6">experience</p>
        <div className="flex flex-col gap-8 max-w-2xl">

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-6 h-0.5 bg-peach-dark" />
              <p className="font-sans text-[10px] text-ink/40 uppercase tracking-wider">at scale, inside a platform</p>
            </div>
            <p className="font-sans text-sm text-ink/70 leading-relaxed">
              i'm part of the investment and strategy function at one of india's largest consumer fintech platforms, working across
              more than $120 million deployed into fintech startups. the portfolio spans both B2B and B2C: a wealth management platform,
              a financial data analytics company, and account aggregator infrastructure. beyond the deals themselves, i'm embedded
              in internal business strategy, product direction, and investor relations for the platform. i'm currently supporting
              the platform's own $55 million raise from global investors for a strategic business partnership.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-6 h-0.5 bg-peach-dark" />
              <p className="font-sans text-[10px] text-ink/40 uppercase tracking-wider">portfolio company depth</p>
            </div>
            <p className="font-sans text-sm text-ink/70 leading-relaxed">
              for companies within that portfolio, the work doesn't stop at the check. i sit closely with founding teams across
              the hard stuff: figuring out what the business actually is and who it's really for, finding the right go-to-market
              angle when the obvious one isn't working, making product decisions when resources are tight, and navigating the
              early revenue conversations that shape whether a model holds up. when things are unclear, i help the founder get
              clear. when things are moving, i help them move faster without breaking what's working. hiring, co-founder
              dynamics, investor updates, follow-on fundraising. all of it comes up, and all of it is fair game.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-6 h-0.5 bg-peach-dark" />
              <p className="font-sans text-[10px] text-ink/40 uppercase tracking-wider">on the ground with founders</p>
            </div>
            <p className="font-sans text-sm text-ink/70 leading-relaxed">
              outside of the platform, i actively advise founders building across very different spaces: a social gaming platform
              built for women, a startup solving export financing, and a company working in women's healthcare. all three are funded
              and currently at the pre-seed to seed stage. i also work with student founders from IIT Bombay across domains, helping
              them sharpen their ideas and navigate grants and early institutional support. the contexts are different.
              the fundamentals are always the same.
            </p>
          </div>

        </div>
      </div>

      {/* Startup Strategy */}
      <div id="strategy" className="px-4 md:px-10 pt-8 md:pt-10 pb-10 md:pb-12 border-b border-border">
        <div className="flex flex-col gap-1 mb-5">
          <p className="font-sans text-[10px] text-ink/40 uppercase tracking-widest">startup strategy</p>
          <p className="font-sans text-sm text-ink/60 max-w-lg mt-1 leading-relaxed">
            early-stage companies are figuring out too many things at once. i work across all the functions that matter
            at this stage, wherever the founder is most stuck.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {strategyAreas.map((item) => (
            <div key={item.label} className="border border-border rounded-xl p-4 bg-cream-light">
              <p className="font-heading text-sm font-700 text-ink mb-1">{item.label}</p>
              <p className="font-sans text-xs text-ink/55 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Fundraising */}
      <div id="fundraising" className="px-4 md:px-10 pt-8 md:pt-10 pb-10 md:pb-12 border-b border-border">
        <div className="flex flex-col gap-1 mb-5">
          <p className="font-sans text-[10px] text-ink/40 uppercase tracking-widest">fundraising</p>
          <p className="font-sans text-sm text-ink/60 max-w-lg mt-1 leading-relaxed">
            focused on early-stage rounds, from the first angel check to seed. the work starts with getting ready
            to raise, not just the raise itself. a lot of founders show up underprepared and lose momentum early.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {fundraiseAreas.map((item) => (
            <div key={item.label} className="border border-border rounded-xl p-4 bg-cream-light">
              <p className="font-heading text-sm font-700 text-ink mb-1">{item.label}</p>
              <p className="font-sans text-xs text-ink/55 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <p className="font-sans text-sm text-ink/60 max-w-lg mb-4 leading-relaxed">
            this is what a realistic fundraising timeline looks like. most founders underestimate how long it takes. 9 to 12 months is the safer assumption.
          </p>
          <div className="flex flex-col sm:flex-row sm:gap-0 rounded-2xl bg-peach/20 border border-peach-dark/20 overflow-hidden">
            <div className="flex-1 sm:pr-6 px-5 py-5 sm:px-6 sm:py-6">
              <div className="w-8 h-0.5 bg-peach-dark mb-3" />
              <p className="font-sans text-[10px] text-ink/40 uppercase tracking-wider mb-1.5">months 0 to 3</p>
              <p className="font-heading text-base font-700 text-ink mb-1.5">get fundable</p>
              <p className="font-sans text-xs text-ink/60 leading-relaxed">cleaning the mess, getting clarity on what you're building, growth strategy, GTM, positioning, business model, unit economics</p>
            </div>
            <div className="w-px bg-peach-dark/20 hidden sm:block flex-shrink-0" />
            <div className="h-px bg-peach-dark/20 sm:hidden mx-5" />
            <div className="flex-1 sm:px-6 px-5 py-5 sm:py-6">
              <div className="w-8 h-0.5 bg-peach-dark mb-3" />
              <p className="font-sans text-[10px] text-ink/40 uppercase tracking-wider mb-1.5">months 3 to 6</p>
              <p className="font-heading text-base font-700 text-ink mb-1.5">build the groundwork</p>
              <p className="font-sans text-xs text-ink/60 leading-relaxed">narrative, deck, data room, warm investor relationships before you need them</p>
            </div>
            <div className="w-px bg-peach-dark/20 hidden sm:block flex-shrink-0" />
            <div className="h-px bg-peach-dark/20 sm:hidden mx-5" />
            <div className="flex-1 sm:pl-6 px-5 py-5 sm:py-6">
              <div className="w-8 h-0.5 bg-peach-dark mb-3" />
              <p className="font-sans text-[10px] text-ink/40 uppercase tracking-wider mb-1.5">months 6 to 9</p>
              <p className="font-heading text-base font-700 text-ink mb-1.5">raise</p>
              <p className="font-sans text-xs text-ink/60 leading-relaxed">outreach, pitch, diligence, term sheet, close</p>
            </div>
          </div>
        </div>
      </div>

      {/* How I work */}
      <div id="how-i-work" className="px-4 md:px-10 pt-8 md:pt-10 pb-10 md:pb-12 border-b border-border">
        <p className="font-sans text-[10px] text-ink/40 uppercase tracking-widest mb-6">how i work</p>
        <div className="flex flex-col gap-5 max-w-2xl">
          {approach.map((a) => (
            <div key={a.phase} className="flex flex-col gap-1.5">
              <p className="font-sans text-[11px] text-ink/40 uppercase tracking-wider">{a.phase}</p>
              <p className="font-sans text-sm text-ink/75 leading-relaxed">{a.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Highlights */}
      <div id="highlights" className="px-4 md:px-10 pt-8 md:pt-10 pb-10 md:pb-12 border-b border-border">
        <p className="font-sans text-[10px] text-ink/40 uppercase tracking-widest mb-6">principles</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {highlights.map((h) => (
            <div key={h.title} className="rounded-2xl bg-peach/30 px-5 py-4 flex flex-col gap-1.5">
              <p className="font-heading text-sm font-700 text-ink">{h.title}</p>
              <p className="font-sans text-xs text-ink/55 leading-relaxed">{h.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer note */}
      <div className="px-4 md:px-10 pt-8 md:pt-10 pb-14 md:pb-16">
        <div className="border border-peach-dark/30 rounded-2xl bg-peach/20 p-5 md:p-6 max-w-lg">
          <p className="font-heading text-base font-700 text-ink mb-2">let's connect</p>
          <p className="font-sans text-sm text-ink/65 leading-relaxed">
            if you&apos;ve read through this and feel like we&apos;re on the same page, i&apos;d love to hear from you.
            whether you want to explore working together, discuss an arrangement, or just talk through where
            you are right now, drop me a mail. i&apos;m open to figuring out what works for both sides and
            making it a genuinely win-win partnership.
          </p>
          <a
            href="mailto:hi@priyaahuja.in"
            className="inline-block mt-4 font-sans text-sm text-ink/70 underline underline-offset-2 hover:text-ink transition-colors"
          >
            hi@priyaahuja.in
          </a>
        </div>
      </div>
    </div>
  )
}
