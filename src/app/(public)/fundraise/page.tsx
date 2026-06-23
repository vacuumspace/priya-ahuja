import Link from "next/link"
import { Users, FileText, Wrench, BookOpen, Database } from "lucide-react"

const sections = [
  {
    slug: "fundability-score",
    title: "Startup Fundability Score",
    description: "50 questions across 9 investor criteria — market size, traction signals, team strength, business model, defensibility, and more. Get a 0–100 score with a full breakdown and a prioritised fix list before you walk into any room.",
    tag: "tool",
    icon: Wrench,
    badge: "free quiz · ₹499 unlock",
    href: "/fundraise/tools/fundability-score",
  },
  {
    slug: "angel-investors",
    title: "Angel Investor List",
    description: "900+ angel investors across India — verified active investors, not cold LinkedIn profiles. Name, city, LinkedIn, and direct email(s). Filter by state and country. One-time lifetime access.",
    tag: "data",
    icon: Database,
    badge: "900+ investors · ₹999",
    href: "/fundraise/angel-investors",
  },
  {
    slug: "templates",
    title: "Fundraise Templates",
    description: "Pitch deck structures, investor outreach templates, term sheet explainers, and due diligence checklists — built from real fundraising conversations, not generic startup advice.",
    tag: "downloads",
    icon: FileText,
    badge: "templates",
    href: "/fundraise/templates",
  },
  {
    slug: "blog",
    title: "Fundraise Blog",
    description: "How investors actually evaluate founders, what signals matter at pre-seed vs Series A, common pitch mistakes, and what to do when fundraising stalls.",
    tag: "reading",
    icon: BookOpen,
    badge: "articles",
    href: "/fundraise/blog",
  },
  {
    slug: "connect",
    title: "Fundraise Session with Priya",
    description: "Direct 1-on-1 with Priya to review your deck, sharpen your narrative, pressure-test your numbers, or work through investor objections. Book a fundability review, pitch prep, or strategy session.",
    tag: "session",
    icon: Users,
    badge: "book a session",
    href: "/connect",
  },
]

const tagColors: Record<string, string> = {
  tool: "bg-peach/50 text-peach-dark",
  data: "bg-amber-50 text-amber-700",
  downloads: "bg-mint/20 text-green-700",
  reading: "bg-blue-50 text-blue-600",
  session: "bg-ink/10 text-ink/60",
}

export default function FundraiseHubPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="flex justify-between items-center px-4 md:px-10 py-4 text-[11px] text-ink/50 font-sans border-b border-border">
        <span>fundraise</span>
        <span>{sections.length} resources</span>
      </div>

      <div className="px-4 md:px-10 pt-12 pb-8">
        <p className="font-sans text-xs text-ink/40 uppercase tracking-wide mb-2">Fundraise</p>
        <h1 className="font-heading text-3xl md:text-5xl font-800 text-ink mb-4">
          raise with clarity.
        </h1>
        <p className="font-sans text-sm text-ink/60 max-w-md leading-relaxed">
          tools, data, and direct access to help you understand what investors want — and walk in prepared.
        </p>
      </div>

      <div className="px-4 md:px-10 pb-16">
        <div className="grid grid-cols-1 gap-4">
          {sections.map((section) => (
            <Link key={section.slug} href={section.href}>
              <div className="bg-card border border-border rounded-2xl p-6 hover:border-peach-dark/40 hover:shadow-sm transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-peach/50 flex items-center justify-center flex-shrink-0">
                    <section.icon size={18} className="text-peach-dark" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <h2 className="font-heading text-lg font-700 text-ink">{section.title}</h2>
                    </div>
                    <p className="font-sans text-sm text-ink/60 leading-relaxed mb-3">{section.description}</p>
                    <div className="flex items-center gap-2">
                      <span className={`inline-block text-[10px] px-2 py-0.5 rounded font-sans font-medium ${tagColors[section.tag] ?? "bg-ink/10 text-ink/50"}`}>
                        {section.tag}
                      </span>
                      <span className="text-[10px] font-sans text-ink/40">{section.badge}</span>
                    </div>
                  </div>
                  <span className="font-sans text-ink/30 text-lg flex-shrink-0 mt-1">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
