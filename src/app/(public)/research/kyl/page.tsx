import type { Metadata } from "next"
import KYLResearchClient from "./KYLResearchClient"

export const metadata: Metadata = {
  title: "Know Your Land (KYL) — India Land Market Research | Priya Ahuja",
  description:
    "Bottom-up sizing of India's land transaction market across individual buyers, developers, brokers, and banks. Data from IGRS portals, RERA, NHB, Knight Frank, JLL, and Colliers — FY2024-25.",
  keywords: [
    "India land market size",
    "plot transactions India",
    "land registration data India",
    "IGRS data",
    "land market research India",
    "KYL know your land",
  ],
  alternates: { canonical: "https://priyaahuja.in/research/kyl" },
  openGraph: {
    title: "Know Your Land (KYL) — India Land Market Research",
    description:
      "Bottom-up sizing of India's land transaction market — individual buyers, developers, brokers, and banks. FY2024-25 data from IGRS, RERA, NHB, and top consultancies.",
    url: "https://priyaahuja.in/research/kyl",
  },
}

export default function KYLResearchPage() {
  return <KYLResearchClient />
}
