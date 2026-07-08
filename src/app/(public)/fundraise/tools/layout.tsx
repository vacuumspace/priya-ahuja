import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Fundraise Tools for Indian Startups",
  description: "Fundraising tools for Indian founders - startup fundability score across 9 investor criteria. Know your score before you walk into any investor room.",
  keywords: ["fundraise tools India", "fundability score", "investor readiness tool India", "pitch readiness India", "startup fundraise calculator"],
  alternates: { canonical: "https://priyaahuja.in/fundraise/tools" },
  openGraph: {
    title: "Fundraise Tools for Indian Startups | Priya Ahuja",
    description: "Startup fundability score across 9 investor criteria - know your score before you walk into any investor room.",
    url: "https://priyaahuja.in/fundraise/tools",
  },
}

export default function FundraiseToolsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
