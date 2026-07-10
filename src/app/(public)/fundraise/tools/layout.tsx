import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Fundraise Tools for Indian Startups",
  description: "Fundraising tools for Indian founders - startup fundability score across 9 investor criteria and an AI pitch deck analyser. Know where you stand before you walk into any investor room.",
  keywords: ["fundraise tools India", "fundability score", "investor readiness tool India", "pitch readiness India", "startup fundraise calculator", "pitch deck analyser India", "pitch deck review AI"],
  alternates: { canonical: "https://priyaahuja.in/fundraise/tools" },
  openGraph: {
    title: "Fundraise Tools for Indian Startups | Priya Ahuja",
    description: "Startup fundability score and AI pitch deck analyser - know where you stand before you walk into any investor room.",
    url: "https://priyaahuja.in/fundraise/tools",
  },
}

export default function FundraiseToolsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
