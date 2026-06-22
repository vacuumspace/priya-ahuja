import { NextRequest, NextResponse } from "next/server"
import { auth, isAdmin } from "@/lib/auth"
import { render } from "@react-email/components"
import BookingConfirmationEmail from "@/emails/BookingConfirmationEmail"
import AdminBookingNotificationEmail from "@/emails/AdminBookingNotificationEmail"
import BookingCancellationEmail from "@/emails/BookingCancellationEmail"
import DownloadLinkEmail from "@/emails/DownloadLinkEmail"

const SAMPLE = {
  name: "Rahul Kumar",
  serviceName: "Fundraising Strategy Call",
  date: "15 June 2026",
  time: "11:00 IST",
  meetLink: "https://meet.google.com/abc-defg-hij",
  userName: "Rahul Kumar",
  userEmail: "rahul@example.com",
  productName: "Fundraising Deck Template",
  downloadUrl: "https://priyaahuja.com/download/sample",
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "https://priyaahuja.com",
  message: "Looking forward to discussing our Series A strategy.",
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || !isAdmin(session.user?.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { template, fields } = await req.json()

  let html = ""
  if (template === "confirmation") {
    html = await render(BookingConfirmationEmail({
      ...SAMPLE,
      subject: fields.email_confirmation_subject,
      intro: fields.email_confirmation_intro,
      footer: fields.email_confirmation_footer,
    }))
  } else if (template === "admin") {
    html = await render(AdminBookingNotificationEmail({
      ...SAMPLE,
      intro: fields.email_admin_intro,
    }))
  } else if (template === "cancellation") {
    html = await render(BookingCancellationEmail({
      ...SAMPLE,
      subject: fields.email_cancellation_subject,
      body: fields.email_cancellation_body,
      footer: fields.email_cancellation_footer,
    }))
  } else if (template === "download") {
    html = await render(DownloadLinkEmail({
      ...SAMPLE,
      subject: fields.email_download_subject,
      intro: fields.email_download_intro,
      footer: fields.email_download_footer,
    }))
  } else {
    return NextResponse.json({ error: "Unknown template" }, { status: 400 })
  }

  return new NextResponse(html, { headers: { "Content-Type": "text/html" } })
}
