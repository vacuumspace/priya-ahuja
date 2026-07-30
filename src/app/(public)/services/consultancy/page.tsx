import type { Metadata } from "next"
import { ConsultancyEnquiryClient } from "./ConsultancyEnquiryClient"

export const metadata: Metadata = {
  title: "Long Term & Task Based Startup Consultancy",
  description:
    "Work with Priya Ahuja beyond a single session - pitch deck preparation, fundraise readiness, startup launch 0-1, due diligence, and ongoing startup consultancy with continuous involvement.",
  keywords: ["startup consultant India", "pitch deck preparation", "fundraise readiness", "startup launch consultant", "due diligence services", "long term startup advisory"],
  alternates: { canonical: "https://priyaahuja.in/services/consultancy" },
  openGraph: {
    title: "Long Term & Task Based Startup Consultancy | Priya Ahuja",
    description:
      "Pitch deck preparation, fundraise readiness, startup launch 0-1, due diligence, and ongoing startup consultancy - deep work with continuous involvement.",
    url: "https://priyaahuja.in/services/consultancy",
  },
}

export default function ConsultancyEnquiryPage() {
  return <ConsultancyEnquiryClient />
}
