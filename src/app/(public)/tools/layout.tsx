import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Startup & Fundraise Tools",
  description: "Free calculators and tools for Indian founders - startup idea score, dilution calculator, runway calculator, and fundraise size estimator. Do the maths before you pitch.",
  keywords: ["startup tools India", "dilution calculator", "runway calculator", "fundraise size estimator", "startup idea score", "founder tools free"],
  alternates: { canonical: "https://priyaahuja.in/tools" },
  openGraph: {
    title: "Startup & Fundraise Tools | Priya Ahuja",
    description: "Free calculators and tools for Indian founders - idea score, dilution, runway, and fundraise size estimator.",
    url: "https://priyaahuja.in/tools",
  },
}

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
