import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Brand Identity & Pitch Deck Design for Startups",
  description: "Brand identity, messaging, and investor pitch decks designed for founders who need to earn trust fast — with investors, customers, and hires.",
  keywords: ["startup branding", "pitch deck design", "brand identity founders", "startup logo design India"],
  alternates: { canonical: "https://priyaahuja.in/services/branding" },
  openGraph: {
    title: "Brand Identity & Pitch Deck Design for Startups | Priya Ahuja",
    description: "Brand identity, messaging, and investor pitch decks designed for founders who need to earn trust fast.",
    url: "https://priyaahuja.in/services/branding",
  },
}

export default function BrandingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
