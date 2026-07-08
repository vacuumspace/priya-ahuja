import {
  Html, Head, Body, Container, Text, Heading, Link, Hr, Preview, Section,
} from "@react-email/components"

export type PurchaseWelcomeEmailProps = {
  name: string
  productSlug: string
  productName: string
  appUrl?: string
}

const content: Record<string, {
  subject: string
  headline: string
  body: string
  steps: string[]
  ctaLabel: string
  ctaPath: string
}> = {
  "angel-investor-list": {
    subject: "Your Angel Investor List - how to make the most of it",
    headline: "You have 900+ investors. Here's where to start.",
    body: "Most founders blast the entire list with cold emails. That rarely works. Here's a smarter approach:",
    steps: [
      "Filter by state or city first. A warm intro from a local angel is 10x more effective than a cold email.",
      "Cross-reference their LinkedIn to see what sectors they've actually invested in, not just what they say they do.",
      "Lead with a 3-line email: the problem, your traction number, and one ask (a 20-min call).",
      "Track responses in a simple spreadsheet. Know who's active vs who's gone quiet.",
    ],
    ctaLabel: "Open your investor list",
    ctaPath: "/fundraise/investor-list/angel-investors",
  },
  "early-stage-vc-list": {
    subject: "Your Early Stage VC List - how to use it well",
    headline: "1,000+ VC firms and 26,000+ team contacts. Here's where to start.",
    body: "Most founders pitch every VC they find. The ones who raise are more targeted. Here's how to approach this:",
    steps: [
      "Start with the team contacts sheet, not the firms sheet. Find the associate or analyst who covers your sector first.",
      "Check the firm's recent portfolio on LinkedIn before reaching out. Pitch to investors who've already backed similar companies.",
      "Keep your first email to 4 lines: what you do, the problem, one traction metric, and a specific ask.",
      "Track who you've contacted and when. Follow up once after 7 days if no reply.",
    ],
    ctaLabel: "Open your VC list",
    ctaPath: "/fundraise/investor-list/early-stage-vc",
  },
  "family-offices-list": {
    subject: "Your Family Office List - how to approach them",
    headline: "160+ family offices. Here's how to reach them right.",
    body: "Family offices get far fewer cold emails than VCs. That's your advantage. Here's how to use it:",
    steps: [
      "Lead with sector fit. Family offices often have strong preferences tied to the family's background or existing business.",
      "Use the team contacts sheet to find investment managers or CIOs directly. They're more reachable than the principals.",
      "Mention your revenue or traction upfront. Family offices care more about fundamentals than vision-only pitches.",
      "Response times are slower than VCs. Follow up after 10 days and be patient.",
    ],
    ctaLabel: "Open your family office list",
    ctaPath: "/fundraise/investor-list/family-offices",
  },
  "incubators-list": {
    subject: "Your Incubator and Accelerator List - how to apply well",
    headline: "230+ programs. Here's how to pick the right ones.",
    body: "Applying to every program wastes time. Here's how to shortlist and approach them strategically:",
    steps: [
      "Filter by sector first. Most programs have a strong domain focus even if they don't advertise it.",
      "Check their current and past cohorts on LinkedIn. If they haven't backed anyone in your space, they probably won't.",
      "Use the team contacts sheet to reach out to program managers directly before applying. It gives you a real edge.",
      "Apply to 5 to 8 well-matched programs rather than spraying 30 generic applications.",
    ],
    ctaLabel: "Open your incubator list",
    ctaPath: "/fundraise/investor-list/incubators",
  },
  "startup-ideas-2026": {
    subject: "Your 100 startup ideas - what to do next",
    headline: "100 ideas. Now what?",
    body: "The ideas in this list are starting points, not blueprints. Here's how to actually use them:",
    steps: [
      "Don't judge an idea from the title alone - read the full problem statement and 'why now' for each one.",
      "Shortlist 3 ideas that sit at the intersection of a problem you care about and something you have an edge on.",
      "For each shortlisted idea, spend 1 hour finding 5 potential customers before building anything.",
      "If you want to pressure-test your shortlist, book a brainstorming session - we can work through it together.",
    ],
    ctaLabel: "Browse all 100 ideas",
    ctaPath: "/startup/ideas",
  },
  "startup-idea-score": {
    subject: "Your idea score is ready - here's what to do with it",
    headline: "Your idea score is in. Now act on it.",
    body: "A score is only useful if you do something with it. Here's how to use your results:",
    steps: [
      "Look at your 3 lowest-scoring segments first - those are your highest-risk areas before you build.",
      "Don't try to fix everything at once. Pick one weak area and spend a focused week on it.",
      "Score below 60 in 'problem clarity' or 'demand signals'? Talk to 5 potential customers this week before writing a line of code.",
      "Retake the score after 4 weeks to track how your thinking has evolved.",
    ],
    ctaLabel: "View your full score",
    ctaPath: "/my-activity?tab=tools",
  },
  "startup-score": {
    subject: "Your fundability score is ready - here's what to do with it",
    headline: "Your fundability score is in.",
    body: "Most founders take the score and move on. The ones who raise use it as a fix list. Here's how:",
    steps: [
      "Low on 'traction signals'? Investors want proof of demand, not just a hypothesis - get 3 paying customers before pitching.",
      "Low on 'team strength'? Consider an advisor with domain cred, or a co-founder with a complementary skill set.",
      "Low on 'business model clarity'? Work through your unit economics from first principles - not estimates.",
      "Retake after 6–8 weeks once you've worked on your weak areas.",
    ],
    ctaLabel: "View your full score",
    ctaPath: "/my-activity?tab=tools",
  },
  default: {
    subject: "You're all set - here's how to get the most out of your purchase",
    headline: "You're in. Here's what to do next.",
    body: "Quick tips to make the most of what you just bought:",
    steps: [
      "Access your purchase anytime from your activity dashboard.",
      "If you get stuck or want a second opinion, book a 1-on-1 session - that's what they're for.",
    ],
    ctaLabel: "View your activity",
    ctaPath: "/my-activity",
  },
}

export default function PurchaseWelcomeEmail({
  name = "there",
  productSlug = "default",
  productName = "your purchase",
  appUrl = "https://priyaahuja.com",
}: PurchaseWelcomeEmailProps) {
  const c = content[productSlug] ?? content.default

  return (
    <Html>
      <Head />
      <Preview>{c.subject}</Preview>
      <Body style={{ backgroundColor: "#FEF9E7", fontFamily: "Inter, sans-serif", margin: 0, padding: "40px 0" }}>
        <Container style={{ maxWidth: 560, margin: "0 auto", backgroundColor: "#FEF9E7", borderRadius: 16, padding: "32px 40px" }}>
          <Heading style={{ fontSize: 26, fontWeight: 800, color: "#2D2D2D", margin: "0 0 8px" }}>
            {c.headline}
          </Heading>
          <Text style={{ color: "#555", fontSize: 15, margin: "0 0 6px", lineHeight: "1.6" }}>
            Hi {name},
          </Text>
          <Text style={{ color: "#555", fontSize: 15, margin: "0 0 20px", lineHeight: "1.6" }}>
            {c.body}
          </Text>

          <Section style={{ backgroundColor: "#FFFDF5", borderRadius: 10, padding: "20px 24px", marginBottom: 24, border: "1px solid #F0E8D0" }}>
            {c.steps.map((step, i) => (
              <Text key={i} style={{ margin: "0 0 10px", color: "#2D2D2D", fontSize: 14, lineHeight: "1.65" }}>
                <strong>{i + 1}.</strong> {step}
              </Text>
            ))}
          </Section>

          <Link
            href={`${appUrl}${c.ctaPath}`}
            style={{ backgroundColor: "#FFA07A", color: "#ffffff", padding: "13px 28px", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: 14, display: "inline-block" }}
          >
            {c.ctaLabel}
          </Link>

          <Hr style={{ borderColor: "#F0E8D0", margin: "28px 0 20px" }} />
          <Text style={{ color: "#999", fontSize: 12, margin: 0, lineHeight: "1.6" }}>
            You received this because you purchased {productName}. Questions? Reply to this email.
          </Text>
          <Text style={{ color: "#555", fontSize: 13, margin: "6px 0 0" }}> - Priya Ahuja
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
