import type { Metadata } from "next"
import Link from "next/link"
import { Users, FileText, Wrench, BookOpen, Database, Award, FileSearch } from "lucide-react"

export const metadata: Metadata = {
  title: "Fundraise Resources for Indian Startups",
  description: "Tools, data, and direct access to help Indian founders raise - fundability score, investor lists, grant programs, templates, and 1-on-1 fundraise sessions with Priya Ahuja.",
  keywords: ["fundraising resources India", "investor list India", "startup fundability score", "fundraise grants India", "pitch prep India", "pre-seed fundraising"],
  alternates: { canonical: "https://priyaahuja.in/fundraise" },
  openGraph: {
    title: "Fundraise Resources for Indian Startups | Priya Ahuja",
    description: "Tools, data, and direct access to help Indian founders raise - fundability score, investor lists, grant programs, templates, and 1-on-1 sessions.",
    url: "https://priyaahuja.in/fundraise",
  },
}

const sections = [
  {
    slug: "fundability-score",
    title: "Startup Fundability Score",
    description: "50 questions across 9 investor criteria - market size, traction signals, team strength, business model, defensibility, and more. Get a 0–100 score with a full breakdown and a prioritised fix list before you walk into any room.",
    tag: "tool",
    icon: Wrench,
    badge: "free quiz · ₹499 unlock",
    href: "/fundraise/tools/fundability-score",
  },
  {
    slug: "pitch-deck-analyser",
    title: "Pitch Deck Analyser",
    description: "Upload your deck PDF and get the read-through an investor gives it - score out of 100, a 20-section audit from problem to moat, your weakest lines rewritten, and the silent red flags VCs never tell you about.",
    tag: "tool",
    icon: FileSearch,
    badge: "AI analysis · ₹199",
    href: "/fundraise/tools/pitch-deck-analyser",
  },
  {
    slug: "angel-investors",
    title: "Investor List",
    star: true,
    description: "Curated investor contact lists for founders actively fundraising - angel investors, early stage VCs, family offices, and incubators. Buy once, access forever.",
    tag: "data",
    icon: Database,
    badge: "4 lists · from ₹999",
    href: "/fundraise/investor-list",
  },
  {
    slug: "grants",
    title: "Grant Resources",
    description: "DPIIT, Startup India, AIM, BIRAC, state schemes, accelerators, and international programs - curated and filtered by sector. Sign in to see eligibility and apply links.",
    tag: "grants",
    icon: Award,
    badge: "free · sign in for details",
    href: "/fundraise/grants",
  },
  {
    slug: "templates",
    title: "Fundraise Templates",
    description: "Pitch deck structures, investor outreach templates, term sheet explainers, and due diligence checklists - built from real fundraising conversations, not generic startup advice.",
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
  grants: "bg-green-50 text-green-700",
}

export default function FundraiseHubPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="flex justify-between items-center px-4 md:px-10 py-4 text-[13px] text-ink/50 font-sans border-b border-border">
        <span>fundraise</span>
        <span>{sections.length} resources</span>
      </div>

      <div className="px-4 md:px-10 pt-12 pb-8">
        <p className="font-sans text-xs text-ink/40 uppercase tracking-wide mb-2">Fundraise</p>
        <h1 className="font-heading text-3xl md:text-5xl font-800 text-ink mb-4">
          raise with clarity.
        </h1>
        <p className="font-sans text-base text-ink/60 max-w-md leading-relaxed">
          tools, data, and direct access to help you understand what investors want - and walk in prepared.
        </p>
      </div>

      <div className="px-4 md:px-10 pb-16">
        <div className="grid grid-cols-1 gap-4">
          {sections.map((section) => (
            <Link key={section.slug} href={section.href}>
              <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 hover:border-peach-dark/40 hover:shadow-sm transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-peach/50 flex items-center justify-center flex-shrink-0">
                    <section.icon size={18} className="text-peach-dark" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <h2 className="font-heading text-lg font-700 text-ink">
                        {section.title}
                        {"star" in section && section.star && (
                          <span className="ml-1.5 text-sm text-peach-dark dark:text-[#FEF9E7]">★</span>
                        )}
                      </h2>
                    </div>
                    <p className="font-sans text-base text-ink/60 leading-relaxed mb-3">{section.description}</p>
                    <div className="flex items-center gap-2">
                      <span className={`inline-block text-[12px] px-2 py-0.5 rounded font-sans font-medium ${tagColors[section.tag] ?? "bg-ink/10 text-ink/50"}`}>
                        {section.tag}
                      </span>
                      <span className="text-[12px] font-sans text-ink/40">{section.badge}</span>
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
