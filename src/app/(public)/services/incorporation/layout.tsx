import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Company Incorporation & MCA Compliance",
  description: "Company incorporation, annual MCA filings, statutory audits, and company secretary services for Indian startups. Annual packages starting from ₹9,999.",
  keywords: ["company incorporation India", "Pvt Ltd registration", "MCA compliance startups", "startup legal compliance India"],
  alternates: { canonical: "https://priyaahuja.in/services/incorporation" },
  openGraph: {
    title: "Company Incorporation & MCA Compliance | Priya Ahuja",
    description: "Company incorporation, annual MCA filings, statutory audits, and company secretary services for Indian startups.",
    url: "https://priyaahuja.in/services/incorporation",
  },
}

export default function IncorporationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
