import {
  Html, Head, Body, Container, Section, Text, Heading, Link, Hr, Preview,
} from "@react-email/components"

export type FeedbackRequestEmailProps = {
  name: string
  serviceName: string
  feedbackUrl: string
}

export default function FeedbackRequestEmail({
  name = "there",
  serviceName = "Strategy Call",
  feedbackUrl = "#",
}: FeedbackRequestEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>How was your {serviceName}? Share your feedback</Preview>
      <Body style={{ backgroundColor: "#FEF9E7", fontFamily: "Inter, sans-serif", margin: 0, padding: "40px 0" }}>
        <Container style={{ maxWidth: 560, margin: "0 auto", backgroundColor: "#FEF9E7", borderRadius: 16, padding: "32px 40px" }}>
          <Heading style={{ fontSize: 26, fontWeight: 800, color: "#2D2D2D", margin: "0 0 8px" }}>
            how was the session?
          </Heading>
          <Text style={{ color: "#555", fontSize: 15, margin: "0 0 28px", lineHeight: "1.6" }}>
            Hi {name}, your <strong>{serviceName}</strong> is now complete. I&apos;d love to hear what you thought — it takes less than a minute.
          </Text>

          <Section style={{ textAlign: "center", marginBottom: 28 }}>
            <Link
              href={feedbackUrl}
              style={{
                backgroundColor: "#2D2D2D",
                color: "#FEF9E7",
                padding: "14px 32px",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 700,
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              leave feedback →
            </Link>
          </Section>

          <Hr style={{ borderColor: "#F0E8D0", margin: "0 0 20px" }} />
          <Text style={{ color: "#555", fontSize: 13, margin: 0, lineHeight: "1.6" }}>
            Questions? Just reply to this email.{"\n\n"}— Priya Ahuja
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
