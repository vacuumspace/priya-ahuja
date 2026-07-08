import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tech Product Development for Startups",
  description: "AI-native products, mobile apps, websites, and internal tools built for early-stage companies - MVP in weeks, not months.",
  keywords: ["startup tech development", "MVP development India", "AI product development", "startup app development"],
  alternates: { canonical: "https://priyaahuja.in/services/tech" },
  openGraph: {
    title: "Tech Product Development for Startups | Priya Ahuja",
    description: "AI-native products, mobile apps, websites, and internal tools built for early-stage companies.",
    url: "https://priyaahuja.in/services/tech",
  },
}

export default function TechLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
