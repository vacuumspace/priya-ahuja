import type { Metadata } from "next"
import Link from "next/link"
import { Cpu, ShoppingBag } from "lucide-react"
import ServicesPromo from "@/components/ServicesPromo"

export const metadata: Metadata = {
  title: "Startup Ideas for Indian Founders 2026 - Tech & D2C",
  description: "200 non-obvious, high-potential startup ideas curated for Indian founders - 100 tech ideas and 100 D2C brand ideas, each with the real problem, market opportunity, and why now.",
  keywords: ["startup ideas India 2026", "tech startup ideas India", "D2C startup ideas India", "startup ideas for Indian founders", "new business ideas India", "startup opportunities India"],
  alternates: { canonical: "https://priyaahuja.in/startup/ideas" },
  openGraph: {
    title: "Startup Ideas for Indian Founders 2026 | Priya Ahuja",
    description: "200 non-obvious, high-potential startup ideas for Indian founders - 100 tech + 100 D2C, each with the real problem, market opportunity, and why now.",
    url: "https://priyaahuja.in/startup/ideas",
  },
}

const lists = [
  {
    slug: "tech",
    title: "100 Tech Startup Ideas",
    description: "Non-obvious, high-potential tech ideas for Indian founders - platforms, AI, and digital infrastructure plays. Each with the real problem, market opportunity, business model, and why now.",
    icon: Cpu,
    badge: "100 ideas · 2026",
    href: "/startup/ideas/tech",
  },
  {
    slug: "d2c",
    title: "100 D2C Startup Ideas",
    description: "Non-obvious, high-potential consumer brand ideas for Indian founders - food, beauty, home, fashion, pets, and underserved niches. Each with the real problem, market opportunity, business model, and why now.",
    icon: ShoppingBag,
    badge: "100 ideas · 2026",
    href: "/startup/ideas/d2c",
  },
]

export default function StartupIdeasHubPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="flex justify-between items-center px-4 md:px-10 py-4 text-[13px] text-ink/50 font-sans border-b border-border">
        <span>startup · ideas 2026</span>
        <span>200 ideas for Indian founders</span>
      </div>

      <div className="px-4 md:px-10 pt-12 pb-8">
        <p className="font-sans text-xs text-ink/40 uppercase tracking-wide mb-2">Startup</p>
        <h1 className="font-heading text-3xl md:text-5xl font-800 text-ink mb-4">
          startup ideas
          <br />
          for 2026
        </h1>
        <p className="font-sans text-sm text-ink/60 max-w-md leading-relaxed">
          Curated, non-obvious, and high potential ideas for Indian founders - each with the real problem,
          market opportunity, and why now. Pick your lane: tech or consumer brands.
        </p>
      </div>

      <div className="px-4 md:px-10 pb-16">
        <div className="grid grid-cols-1 gap-4">
          {lists.map((list) => (
            <Link key={list.slug} href={list.href}>
              <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 hover:border-peach-dark/40 hover:shadow-sm transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-peach/50 flex items-center justify-center flex-shrink-0">
                    <list.icon size={18} className="text-peach-dark" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <h2 className="font-heading text-lg font-700 text-ink">{list.title}</h2>
                    </div>
                    <p className="font-sans text-base text-ink/60 leading-relaxed mb-3">{list.description}</p>
                    <div className="flex items-center gap-2">
                      <span className="inline-block text-[12px] px-2 py-0.5 rounded font-sans font-medium bg-amber-50 text-amber-700">
                        content
                      </span>
                      <span className="text-[12px] font-sans text-ink/40">{list.badge}</span>
                    </div>
                  </div>
                  <span className="font-sans text-ink/30 text-lg flex-shrink-0 mt-1">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10">
          <ServicesPromo
            heading="found an idea? we can help you build it."
            services={[
              {
                title: "tech product development",
                description: "design and build your product end to end - MVPs for tech startups, custom websites and storefronts for d2c brands.",
                href: "/services/tech",
                cta: "explore tech development",
              },
              {
                title: "branding",
                description: "naming, brand story, logo, and identity - a clear narrative and visual language that make people trust and remember you.",
                href: "/services/branding",
                cta: "explore branding",
              },
            ]}
          />
        </div>
      </div>
    </div>
  )
}
