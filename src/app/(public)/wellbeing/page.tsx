import type { Metadata } from "next"
import Link from "next/link"
import { BookOpen, HeartPulse } from "lucide-react"

export const metadata: Metadata = {
  title: "Founder Wellbeing",
  description: "Honest writing and a free self-assessment scorecard for founder burnout, loneliness, sleep, identity, and mental health - built for founders trying to build a company without losing themselves.",
  keywords: ["founder wellbeing", "founder burnout", "startup founder mental health", "founder wellbeing scorecard", "entrepreneur stress India"],
  alternates: { canonical: "https://priyaahuja.in/wellbeing" },
  openGraph: {
    title: "Founder Wellbeing | Priya Ahuja",
    description: "Honest writing and a free self-assessment scorecard for founder burnout, loneliness, sleep, identity, and mental health.",
    url: "https://priyaahuja.in/wellbeing",
  },
}

const sections = [
  {
    slug: "scorecard",
    title: "Founder Wellbeing Scorecard",
    description: "50 questions across 10 categories - sleep & energy, stress & coping, relationships & support, purpose & identity, financial anxiety, work-life boundaries, physical health, emotional regulation, leadership pressure, and future outlook. Get an honest score and concrete things to work on.",
    tag: "tool",
    icon: HeartPulse,
    badge: "free · no signup fee",
    href: "/wellbeing/tools/wellbeing-score",
  },
  {
    slug: "blog",
    title: "Wellbeing Blog",
    description: "Honest writing on founder burnout, loneliness, sleep, identity, and the parts of this job nobody warns you about.",
    tag: "reading",
    icon: BookOpen,
    badge: "articles",
    href: "/wellbeing/blog",
  },
]

const tagColors: Record<string, string> = {
  tool: "bg-peach/50 text-peach-dark",
  reading: "bg-blue-50 text-blue-600",
}

export default function WellbeingHubPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="flex justify-between items-center px-4 md:px-10 py-4 text-[13px] text-ink/50 font-sans border-b border-border">
        <span>wellbeing</span>
        <span>{sections.length} resources</span>
      </div>

      <div className="px-4 md:px-10 pt-12 pb-8">
        <p className="font-sans text-xs text-ink/40 uppercase tracking-wide mb-2">Wellbeing</p>
        <h1 className="font-heading text-3xl md:text-5xl font-800 text-ink mb-4">
          build the company
          <br />
          without losing yourself.
        </h1>
        <p className="font-sans text-base text-ink/60 max-w-md leading-relaxed">
          honest writing and a free scorecard for founders trying to build something real without burning out along the way.
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
