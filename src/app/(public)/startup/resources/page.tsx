import type { Metadata } from "next"
import { Suspense } from "react"
import { resources } from "@/lib/resources-data"
import { ResourcesClient } from "./ResourcesClient"

export const metadata: Metadata = {
  title: "Startup Credits & Resources for Founders",
  description: "40+ free tools, credits, and deals curated for Indian founders — AWS ($200k), Google Cloud ($350k), OpenAI, Anthropic, HubSpot, Notion, and more. One place, no hunting.",
  keywords: ["startup credits India", "AWS startup credits", "Google Cloud startup program", "free tools for startups", "startup deals India", "founder resources India"],
  alternates: { canonical: "https://priyaahuja.in/startup/resources" },
  openGraph: {
    title: "Startup Credits & Resources for Founders | Priya Ahuja",
    description: "40+ free tools, credits, and deals for Indian founders — AWS, Google Cloud, OpenAI, HubSpot, and more.",
    url: "https://priyaahuja.in/startup/resources",
  },
}

type Props = { searchParams: Promise<{ category?: string }> }

export default async function StartupResourcesPage({ searchParams }: Props) {
  const { category } = await searchParams
  const activeCategory = category ?? "All"

  return (
    <div className="min-h-screen bg-cream overflow-x-hidden">
      <div className="flex justify-between items-center px-4 md:px-10 py-4 text-[13px] text-ink/50 font-sans border-b border-border">
        <span>startup · resources & credits</span>
        <span>{resources.length} tools</span>
      </div>

      <div className="px-4 md:px-10 pt-12 pb-8">
        <p className="font-sans text-xs text-ink/40 uppercase tracking-wide mb-2">Startup</p>
        <h1 className="font-heading text-3xl md:text-5xl font-800 text-ink mb-4">
          resources &amp; credits.
        </h1>
        <p className="font-sans text-sm text-ink/60 max-w-md leading-relaxed">
          tools, credits, and deals curated for founders — from cloud infrastructure to AI models. sign in to see full details and apply links.
        </p>
      </div>

      <Suspense>
        <ResourcesClient activeCategory={activeCategory} />
      </Suspense>
    </div>
  )
}
