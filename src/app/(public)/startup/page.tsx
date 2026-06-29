import type { Metadata } from "next"
import Link from "next/link"
import { Lightbulb, FileText, Wrench, BookOpen, Users, Gift } from "lucide-react"

export const metadata: Metadata = {
  title: "Startup Resources for Indian Founders",
  description: "100 startup ideas, idea validation score, templates, resources & credits, and 1-on-1 sessions — everything you need to go from idea to traction as an Indian founder.",
  keywords: ["startup resources India", "startup ideas India", "idea validation tool", "startup templates", "founder tools India", "startup credits India"],
  alternates: { canonical: "https://priyaahuja.in/startup" },
  openGraph: {
    title: "Startup Resources for Indian Founders | Priya Ahuja",
    description: "100 startup ideas, idea validation score, templates, resources & credits, and 1-on-1 sessions for Indian founders.",
    url: "https://priyaahuja.in/startup",
  },
}

const sections = [
  {
    slug: "ideas",
    title: "100 Startup Ideas for 2026",
    description: "Non-obvious, high-potential startup ideas for Indian founders — each with the real problem, market opportunity, and why now. Curated, not crowd-sourced.",
    tag: "content",
    icon: Lightbulb,
    badge: "100 ideas",
    href: "/startup/ideas",
  },
  {
    slug: "idea-score",
    title: "Startup Idea Score",
    description: "50 questions across 9 segments — problem clarity, founder-market fit, demand signals, customer understanding, and more. Find out if your idea is worth building before you commit.",
    tag: "tool",
    icon: Wrench,
    badge: "free quiz · ₹499 unlock",
    href: "/startup/tools/idea-score",
  },
  {
    slug: "templates",
    title: "Startup Templates",
    description: "Frameworks, checklists, and guides built for the early-stage founder — not generic business advice repackaged. Download once, use across every pitch and planning cycle.",
    tag: "downloads",
    icon: FileText,
    badge: "templates",
    href: "/startup/templates",
  },
  {
    slug: "blog",
    title: "Startup Blog",
    description: "Honest takes on startup building — from idea validation to hiring your first 10, unit economics, and what investors actually look for in early-stage decks.",
    tag: "reading",
    icon: BookOpen,
    badge: "articles",
    href: "/startup/blog",
  },
  {
    slug: "resources",
    title: "Resources & Credits",
    description: "Tools, credits, and deals curated for founders — from cloud infrastructure to AI models. 40+ programs including AWS ($200k), Google Cloud ($350k), OpenAI, Anthropic, HubSpot, and more.",
    tag: "free",
    icon: Gift,
    badge: "40+ tools",
    href: "/startup/resources",
  },
  {
    slug: "connect",
    title: "1-on-1 Startup Sessions",
    description: "Book a direct session with Priya — idea brainstorming, go-to-market, first principles review of your business model, or a no-filter sanity check before your next big move.",
    tag: "session",
    icon: Users,
    badge: "book a session",
    href: "/connect",
  },
]

const tagColors: Record<string, string> = {
  content: "bg-amber-50 text-amber-700",
  tool: "bg-peach/50 text-peach-dark",
  downloads: "bg-mint/20 text-green-700",
  reading: "bg-blue-50 text-blue-600",
  session: "bg-ink/10 text-ink/60",
  free: "bg-mint/20 text-green-700",
}

export default function StartupHubPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="flex justify-between items-center px-4 md:px-10 py-4 text-[13px] text-ink/50 font-sans border-b border-border">
        <span>startup</span>
        <span>{sections.length} resources</span>
      </div>

      <div className="px-4 md:px-10 pt-12 pb-8">
        <p className="font-sans text-xs text-ink/40 uppercase tracking-wide mb-2">Startup</p>
        <h1 className="font-heading text-3xl md:text-5xl font-800 text-ink mb-4">
          build to win.
        </h1>
        <p className="font-sans text-base text-ink/60 max-w-md leading-relaxed">
          everything you need to go from idea to traction — tools, templates, curated content, and direct access to Priya.
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
                      <h2 className="font-heading text-lg font-700 text-ink">{section.title}</h2>
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
