import type { Metadata } from "next"
import { auth, isAdmin } from "@/lib/auth"
import { d2cStartupIdeas } from "@/lib/d2c-startup-ideas-data"
import StartupIdeasClient from "../StartupIdeasClient"

export const metadata: Metadata = {
  title: "100 D2C Startup Ideas for Indian Founders 2026",
  description: "100 non-obvious, high-potential D2C brand ideas curated for Indian founders - across food, beauty, home, fashion, pets, and more. Each with the real problem, market opportunity, and why now.",
  keywords: ["D2C startup ideas India 2026", "consumer brand ideas India", "D2C business ideas India", "startup ideas for Indian founders", "new D2C brands India", "direct to consumer India"],
  alternates: { canonical: "https://priyaahuja.in/startup/ideas/d2c" },
  openGraph: {
    title: "100 D2C Startup Ideas for Indian Founders 2026 | Priya Ahuja",
    description: "100 non-obvious, high-potential D2C brand ideas for Indian founders - each with the real problem, market opportunity, and why now.",
    url: "https://priyaahuja.in/startup/ideas/d2c",
  },
}

export default async function D2CStartupIdeasPage() {
  const session = await auth()
  const userEmail = session?.user?.email ?? null

  return (
    <StartupIdeasClient
      isPaid={isAdmin(userEmail)}
      isAuthenticated={!!userEmail}
      ideas={d2cStartupIdeas}
      userEmail={userEmail}
      userName={session?.user?.name ?? null}
      basePath="/startup/ideas/d2c"
      crumbLeft="startup · d2c ideas 2026"
      crumbRight="100 d2c ideas for Indian founders"
      headingLine1="100 d2c startup ideas"
      headingLine2="for 2026"
      description="Curated unique and out of the box d2c ideas for Indian founders, each with the real problem, market opportunity, and why now. Under tapped, non-obvious, and high potential ideas that you won't find elsewhere."
      signinNote="100 d2c startup ideas · free access"
      servicesHeading="ready to launch your d2c brand?"
      services={[
        {
          title: "tech development for d2c",
          description: "custom-built website and storefront - own your stack, no monthly Shopify expenses eating your margins.",
          href: "/services/tech",
          cta: "build your store",
        },
        {
          title: "branding",
          description: "brand story, packaging, logo, and identity - the narrative that makes customers pick you off a crowded shelf and come back.",
          href: "/services/branding",
          cta: "brand your product",
        },
      ]}
    />
  )
}
