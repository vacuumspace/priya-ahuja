import {
  Html, Head, Body, Container, Text, Heading, Link, Hr, Preview, Button,
} from "@react-email/components"

export type DownloadLinkEmailProps = {
  name: string
  productName: string
  downloadUrl: string
  // editable
  subject?: string
  intro?: string
  footer?: string
}

export default function DownloadLinkEmail({
  name = "there",
  productName = "Fundraising Deck Template",
  downloadUrl = "#",
  intro = "Thank you for your purchase! Your download is ready.",
  footer = "This link expires in 48 hours.\n\n— Priya Ahuja",
}: DownloadLinkEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your Download: {productName}</Preview>
      <Body style={{ backgroundColor: "#FEF9E7", fontFamily: "Inter, sans-serif", margin: 0, padding: "40px 0" }}>
        <Container style={{ maxWidth: 560, margin: "0 auto", backgroundColor: "#FEF9E7", borderRadius: 16, padding: "32px 40px" }}>
          <Heading style={{ fontSize: 26, fontWeight: 800, color: "#2D2D2D", margin: "0 0 8px" }}>
            Your purchase is ready!
          </Heading>
          <Text style={{ color: "#555", fontSize: 15, margin: "0 0 8px", lineHeight: "1.6" }}>
            Hi {name}, {intro}
          </Text>
          <Text style={{ color: "#555", fontSize: 15, margin: "0 0 28px" }}>
            <strong>{productName}</strong>
          </Text>

          <Button
            href={downloadUrl}
            style={{ backgroundColor: "#FFA07A", color: "#ffffff", padding: "14px 32px", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: 15, display: "inline-block" }}
          >
            Download Now
          </Button>

          <Hr style={{ borderColor: "#F0E8D0", margin: "28px 0 20px" }} />

          {footer.split("\n\n").map((para, i) => (
            <Text key={i} style={{ color: i === 0 ? "#999" : "#555", fontSize: 12 + (i > 0 ? 1 : 0), margin: "0 0 4px", lineHeight: "1.6" }}>
              {para}
            </Text>
          ))}
        </Container>
      </Body>
    </Html>
  )
}
