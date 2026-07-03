import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Accounting, GST & Compliance for Startups",
  description: "End-to-end accounting, GST filing, TDS, payroll, and statutory audit support for early-stage Indian companies. Annual packages starting from ₹9,999.",
  keywords: ["startup accounting India", "GST filing startups", "payroll compliance India", "startup CA services"],
  alternates: { canonical: "https://priyaahuja.in/services/accounting" },
  openGraph: {
    title: "Accounting, GST & Compliance for Startups | Priya Ahuja",
    description: "End-to-end accounting, GST filing, TDS, payroll, and statutory audit support for early-stage Indian companies.",
    url: "https://priyaahuja.in/services/accounting",
  },
}

export default function AccountingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
