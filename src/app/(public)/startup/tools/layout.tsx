import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Startup Tools for Indian Founders",
  description: "Tools for building a real startup - startup idea score to validate your concept before you commit. Focused on problem clarity, founder-market fit, and execution path.",
  keywords: ["startup idea score India", "startup validation tool", "idea testing India", "founder tools India", "startup tools free"],
  alternates: { canonical: "https://priyaahuja.in/startup/tools" },
  openGraph: {
    title: "Startup Tools for Indian Founders | Priya Ahuja",
    description: "Startup idea score and tools to validate your concept before committing - problem clarity, founder-market fit, and execution path.",
    url: "https://priyaahuja.in/startup/tools",
  },
}

export default function StartupToolsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
