import {
  Html, Head, Body, Container, Section, Text, Heading, Hr, Preview,
} from "@react-email/components"

export type CourseEnrollmentEmailProps = {
  name: string
  courseTitle: string
  // "preregistered": ₹100 paid, balance due at launch. "enrolled": fully paid.
  kind: "preregistered" | "enrolled"
  launchLabel: string
  balanceLabel?: string
  giftCode?: string | null
  footer?: string
}

export default function CourseEnrollmentEmail({
  name = "there",
  courseTitle = "Course",
  kind,
  launchLabel,
  balanceLabel,
  giftCode,
  footer = "Questions? Reply to this email or reach out on LinkedIn.\n\n - Priya Ahuja",
}: CourseEnrollmentEmailProps) {
  const isPre = kind === "preregistered"
  return (
    <Html>
      <Head />
      <Preview>{isPre ? `You're pre-registered: ${courseTitle}` : `You're enrolled: ${courseTitle}`}</Preview>
      <Body style={{ backgroundColor: "#FEF9E7", fontFamily: "Inter, sans-serif", margin: 0, padding: "40px 0" }}>
        <Container style={{ maxWidth: 560, margin: "0 auto", backgroundColor: "#FEF9E7", borderRadius: 16, padding: "32px 40px" }}>
          <Heading style={{ fontSize: 26, fontWeight: 800, color: "#2D2D2D", margin: "0 0 8px" }}>
            {isPre ? "You're pre-registered! 🎓" : "You're in! 🎓"}
          </Heading>
          <Text style={{ color: "#555", fontSize: 15, margin: "0 0 28px", lineHeight: "1.6" }}>
            {isPre
              ? `Hi ${name}, your founder price for ${courseTitle} is locked. The course launches on ${launchLabel}.`
              : `Hi ${name}, you're enrolled in ${courseTitle}. Thank you for being one of the first founders in.`}
          </Text>

          <Section style={{ backgroundColor: "#FFFDF5", borderRadius: 10, padding: "20px 24px", marginBottom: 28, border: "1px solid #F0E8D0" }}>
            <Text style={{ margin: "0 0 10px", color: "#2D2D2D", fontSize: 14 }}>
              <strong>Course:</strong> {courseTitle}
            </Text>
            <Text style={{ margin: isPre || giftCode ? "0 0 10px" : 0, color: "#2D2D2D", fontSize: 14 }}>
              <strong>Launches:</strong> {launchLabel}
            </Text>
            {isPre && balanceLabel && (
              <Text style={{ margin: 0, color: "#2D2D2D", fontSize: 14 }}>
                <strong>Balance due at launch:</strong> {balanceLabel}
              </Text>
            )}
            {!isPre && giftCode && (
              <Text style={{ margin: 0, color: "#2D2D2D", fontSize: 14 }}>
                <strong>1:1 brainstorm:</strong> unlocked (code {giftCode.toLowerCase()})
              </Text>
            )}
          </Section>

          {isPre && (
            <Text style={{ color: "#555", fontSize: 14, margin: "0 0 20px", lineHeight: "1.6" }}>
              Your ₹100 is adjusted against the final price. Your free startup score and 1:1 brainstorm session come with your course access.
            </Text>
          )}
          {!isPre && giftCode && (
            <Text style={{ color: "#555", fontSize: 14, margin: "0 0 20px", lineHeight: "1.6" }}>
              Your free startup score is ready to use, and you can book your 30-minute Startup Idea Brainstorming session with Priya while signed in to this email. No payment is needed.
            </Text>
          )}

          <Hr style={{ borderColor: "#F0E8D0", margin: "0 0 20px" }} />

          {footer.split("\n\n").map((para, i) => (
            <Text key={i} style={{ color: "#555", fontSize: 13, margin: "0 0 6px", lineHeight: "1.6" }}>
              {para}
            </Text>
          ))}
        </Container>
      </Body>
    </Html>
  )
}
