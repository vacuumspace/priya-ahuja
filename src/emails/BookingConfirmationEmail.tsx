import {
  Html, Head, Body, Container, Section, Text, Heading, Link, Hr, Preview,
} from "@react-email/components"

export type BookingConfirmationEmailProps = {
  name: string
  serviceName: string
  date: string
  time: string
  meetLink?: string
  // editable fields from site_settings
  subject?: string
  intro?: string
  footer?: string
}

export default function BookingConfirmationEmail({
  name = "there",
  serviceName = "Strategy Call",
  date = "12 June 2026",
  time = "10:00 IST",
  meetLink,
  intro = "Your session is booked and confirmed!",
  footer = "Questions? Reply to this email or reach out on LinkedIn.\n\n— Priya Ahuja",
}: BookingConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Booking Confirmed: {serviceName}</Preview>
      <Body style={{ backgroundColor: "#FEF9E7", fontFamily: "Inter, sans-serif", margin: 0, padding: "40px 0" }}>
        <Container style={{ maxWidth: 560, margin: "0 auto", backgroundColor: "#FEF9E7", borderRadius: 16, padding: "32px 40px" }}>
          <Heading style={{ fontSize: 26, fontWeight: 800, color: "#2D2D2D", margin: "0 0 8px" }}>
            Booking Confirmed 🎉
          </Heading>
          <Text style={{ color: "#555", fontSize: 15, margin: "0 0 28px", lineHeight: "1.6" }}>
            Hi {name}, {intro}
          </Text>

          <Section style={{ backgroundColor: "#FFFDF5", borderRadius: 10, padding: "20px 24px", marginBottom: 28, border: "1px solid #F0E8D0" }}>
            <Text style={{ margin: "0 0 10px", color: "#2D2D2D", fontSize: 14 }}>
              <strong>Service:</strong> {serviceName}
            </Text>
            <Text style={{ margin: "0 0 10px", color: "#2D2D2D", fontSize: 14 }}>
              <strong>Date:</strong> {date}
            </Text>
            <Text style={{ margin: meetLink ? "0 0 10px" : "0", color: "#2D2D2D", fontSize: 14 }}>
              <strong>Time:</strong> {time}
            </Text>
            {meetLink && (
              <Text style={{ margin: 0, color: "#2D2D2D", fontSize: 14 }}>
                <strong>Meet Link:</strong>{" "}
                <Link href={meetLink} style={{ color: "#FFA07A" }}>{meetLink}</Link>
              </Text>
            )}
          </Section>

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
