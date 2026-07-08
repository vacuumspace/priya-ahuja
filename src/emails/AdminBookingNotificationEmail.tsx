import {
  Html, Head, Body, Container, Section, Text, Heading, Link, Hr, Preview, Button,
} from "@react-email/components"

export type AdminBookingNotificationEmailProps = {
  serviceName: string
  userName: string
  userEmail: string
  date?: string
  time?: string
  serviceType?: "call" | "dm" | "report"
  message?: string
  appUrl?: string
  intro?: string
  type?: "new" | "reschedule"
  previousDate?: string
  previousTime?: string
}

export default function AdminBookingNotificationEmail({
  serviceName = "Strategy Call",
  userName = "Rahul Kumar",
  userEmail = "rahul@example.com",
  date,
  time,
  serviceType = "call",
  message,
  appUrl = "https://priyaahuja.com",
  intro,
  type = "new",
  previousDate,
  previousTime,
}: AdminBookingNotificationEmailProps) {
  const isReschedule = type === "reschedule"
  const isAsync = serviceType === "report" || serviceType === "dm"
  const defaultIntro = isReschedule
    ? "A client has rescheduled an existing booking."
    : isAsync
    ? "A new async review request has been received. Check My Activity to message the client."
    : "A new booking has been received."

  return (
    <Html>
      <Head />
      <Preview>{isReschedule ? `Rescheduled: ${serviceName} - ${userName}` : `New Booking: ${serviceName} from ${userName}`}</Preview>
      <Body style={{ backgroundColor: "#f8f8f8", fontFamily: "Inter, sans-serif", margin: 0, padding: "40px 0" }}>
        <Container style={{ maxWidth: 560, margin: "0 auto", backgroundColor: "#ffffff", borderRadius: 12, padding: "32px 40px", border: "1px solid #e8e8e8" }}>
          <Heading style={{ fontSize: 22, fontWeight: 800, color: "#2D2D2D", margin: "0 0 6px" }}>
            {isReschedule ? "Booking Rescheduled" : "New Booking Received"}
          </Heading>
          <Text style={{ color: "#777", fontSize: 14, margin: "0 0 28px" }}>{intro ?? defaultIntro}</Text>

          <Section style={{ backgroundColor: "#fafafa", borderRadius: 8, padding: "16px 20px", marginBottom: 24, border: "1px solid #efefef" }}>
            <Text style={{ margin: "0 0 8px", color: "#2D2D2D", fontSize: 14 }}>
              <strong>Service:</strong> {serviceName}
            </Text>
            <Text style={{ margin: "0 0 8px", color: "#2D2D2D", fontSize: 14 }}>
              <strong>Client:</strong> {userName} ({userEmail})
            </Text>
            {isReschedule && previousDate && previousTime && (
              <Text style={{ margin: "0 0 8px", color: "#999", fontSize: 14 }}>
                <strong>Was:</strong> {previousDate} at {previousTime}
              </Text>
            )}
            {isAsync ? (
              <Text style={{ margin: message ? "0 0 8px" : "0", color: "#2D2D2D", fontSize: 14 }}>
                <strong>Delivery:</strong> Personal review (no AI) - respond within 5–7 days via email
              </Text>
            ) : date && time ? (
              <Text style={{ margin: message ? "0 0 8px" : "0", color: isReschedule ? "#FFA07A" : "#2D2D2D", fontSize: 14, fontWeight: isReschedule ? 700 : 400 }}>
                <strong>{isReschedule ? "Now:" : "Date:"}</strong> {date} at {time}
              </Text>
            ) : null}
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
