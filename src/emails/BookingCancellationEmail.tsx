import {
  Html, Head, Body, Container, Text, Heading, Link, Hr, Preview,
} from "@react-email/components"

export type BookingCancellationEmailProps = {
  name: string
  serviceName: string
  isAdmin?: boolean
  appUrl?: string
  // editable
  subject?: string
  body?: string
  footer?: string
}

export default function BookingCancellationEmail({
  name = "there",
  serviceName = "Strategy Call",
  isAdmin = false,
  appUrl = "https://priyaahuja.com",
  body = "The booking has been cancelled.",
  footer = "— Priya Ahuja",
}: BookingCancellationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Booking Cancelled: {serviceName}</Preview>
      <Body style={{ backgroundColor: "#FEF9E7", fontFamily: "Inter, sans-serif", margin: 0, padding: "40px 0" }}>
        <Container style={{ maxWidth: 560, margin: "0 auto", backgroundColor: "#FEF9E7", borderRadius: 16, padding: "32px 40px" }}>
          <Heading style={{ fontSize: 26, fontWeight: 800, color: "#2D2D2D", margin: "0 0 8px" }}>
            Booking Cancelled
          </Heading>
          <Text style={{ color: "#555", fontSize: 15, margin: "0 0 16px", lineHeight: "1.6" }}>
            Hi {name}, {body.replace("{serviceName}", serviceName)}
          </Text>

          <Hr style={{ borderColor: "#F0E8D0", margin: "20px 0" }} />

          {isAdmin ? (
            <Link href={`${appUrl}/admin/bookings`} style={{ color: "#FFA07A", fontSize: 14 }}>
              View in dashboard →
            </Link>
          ) : (
            <Link href={`${appUrl}/connect`} style={{ color: "#FFA07A", fontSize: 14 }}>
              Rebook a session →
            </Link>
          )}

          <Text style={{ color: "#555", fontSize: 13, margin: "24px 0 0", lineHeight: "1.6" }}>
            {footer}
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
