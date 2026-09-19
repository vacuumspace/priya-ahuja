import {
  Html, Head, Body, Container, Section, Text, Heading, Hr, Preview, Link, Img,
} from "@react-email/components"

export type CourseGiftEmailProps = {
  name: string
  courseTitle: string
  link: string
  cardUrl: string
  recipientName: string
  launchLabel: string
  footer?: string
}

export default function CourseGiftEmail({
  name = "there",
  courseTitle = "Course",
  link,
  cardUrl,
  recipientName = "them",
  launchLabel,
  footer = "Questions? Reply to this email or reach out on LinkedIn.\n\n - Priya Ahuja",
}: CourseGiftEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your gift link for {courseTitle}</Preview>
      <Body style={{ backgroundColor: "#FEF9E7", fontFamily: "Inter, sans-serif", margin: 0, padding: "40px 0" }}>
        <Container style={{ maxWidth: 560, margin: "0 auto", backgroundColor: "#FEF9E7", borderRadius: 16, padding: "32px 40px" }}>
          <Heading style={{ fontSize: 26, fontWeight: 800, color: "#2D2D2D", margin: "0 0 8px" }}>
            Your gift is ready 🎁
          </Heading>
          <Text style={{ color: "#555", fontSize: 15, margin: "0 0 24px", lineHeight: "1.6" }}>
            Hi {name}, thank you for gifting {courseTitle}. Here is the gift card and link for {recipientName}. Send them both, so it arrives as a proper gift.
          </Text>

          <Img src={cardUrl} alt={`Gift card for ${recipientName}`} width="480" style={{ width: "100%", maxWidth: 480, borderRadius: 12, margin: "0 0 20px" }} />
          <Text style={{ margin: "0 0 20px", fontSize: 13 }}>
            <Link href={`${cardUrl}?download=1`} style={{ color: "#B85A2E" }}>Download the card</Link>
          </Text>

          <Section style={{ backgroundColor: "#FFFDF5", borderRadius: 10, padding: "20px 24px", marginBottom: 24, border: "1px solid #F0E8D0" }}>
            <Text style={{ margin: "0 0 8px", color: "#2D2D2D", fontSize: 13 }}>
              <strong>Gift link</strong>
            </Text>
            <Link href={link} style={{ color: "#B85A2E", fontSize: 14, wordBreak: "break-all" }}>
              {link}
            </Link>
          </Section>

          <Text style={{ color: "#555", fontSize: 14, margin: "0 0 8px", lineHeight: "1.6" }}>
            When they open the link and sign in, they get full access to the course, including the free gifts. No pre-registration is needed. The link works once, for one person.
          </Text>
          <Text style={{ color: "#555", fontSize: 14, margin: "0 0 20px", lineHeight: "1.6" }}>
            The course launches on {launchLabel}.
          </Text>

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
