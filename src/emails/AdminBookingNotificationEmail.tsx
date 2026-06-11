import {
  Html, Head, Body, Container, Section, Text, Heading, Link, Hr, Preview, Button,
} from "@react-email/components"

export type AdminBookingNotificationEmailProps = {
  serviceName: string
  userName: string
  userEmail: string
  date: string
  time: string
  message?: string
  appUrl?: string
  // editable
  subject?: string
  intro?: string
}

export default function AdminBookingNotificationEmail({
  serviceName = "Strategy Call",
  userName = "Rahul Kumar",
  userEmail = "rahul@example.com",
  date = "12 June 2026",
  time = "10:00 IST",
  message,
  appUrl = "https://priyaahuja.com",
  intro = "A new booking has been received.",
}: AdminBookingNotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New Booking: {serviceName} from {userName}</Preview>
      <Body style={{ backgroundColor: "#f8f8f8", fontFamily: "Inter, sans-serif", margin: 0, padding: "40px 0" }}>
        <Container style={{ maxWidth: 560, margin: "0 auto", backgroundColor: "#ffffff", borderRadius: 12, padding: "32px 40px", border: "1px solid #e8e8e8" }}>
          <Heading style={{ fontSize: 22, fontWeight: 800, color: "#2D2D2D", margin: "0 0 6px" }}>
            New Booking Received
          </Heading>
          <Text style={{ color: "#777", fontSize: 14, margin: "0 0 28px" }}>{intro}</Text>

          <Section style={{ backgroundColor: "#fafafa", borderRadius: 8, padding: "16px 20px", marginBottom: 24, border: "1px solid #efefef" }}>
            <Text style={{ margin: "0 0 8px", color: "#2D2D2D", fontSize: 14 }}>
              <strong>Service:</strong> {serviceName}
            </Text>
            <Text style={{ margin: "0 0 8px", color: "#2D2D2D", fontSize: 14 }}>
              <strong>Client:</strong> {userName} ({userEmail})
            </Text>
            <Text style={{ margin: message ? "0 0 8px" : "0", color: "#2D2D2D", fontSize: 14 }}>
              <strong>Date:</strong> {date} at {time}
            </Text>
            {message && (
              <Text style={{ margin: 0, color: "#2D2D2D", fontSize: 14 }}>
                <strong>Message:</strong> {message}
              </Text>
            )}
          </Section>

          <Button
            href={`${appUrl}/admin/bookings`}
            style={{ backgroundColor: "#FFA07A", color: "#ffffff", padding: "12px 24px", borderRadius: 8, textDecoration: "none", fontWeight: 600, fontSize: 14, display: "inline-block" }}
          >
            View in Dashboard →
          </Button>
        </Container>
      </Body>
    </Html>
  )
}
