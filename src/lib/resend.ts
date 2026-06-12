import { Resend } from "resend"
import { render } from "@react-email/components"
import { db } from "@/lib/db"
import { siteSettings } from "@/lib/db/schema"
import { inArray } from "drizzle-orm"
import BookingConfirmationEmail from "@/emails/BookingConfirmationEmail"
import AdminBookingNotificationEmail from "@/emails/AdminBookingNotificationEmail"
import BookingCancellationEmail from "@/emails/BookingCancellationEmail"
import DownloadLinkEmail from "@/emails/DownloadLinkEmail"
import FeedbackRequestEmail from "@/emails/FeedbackRequestEmail"

export const resend = new Resend(process.env.RESEND_API_KEY || "re_000000000000000000000000000000000000")

async function getEmailSettings(keys: string[]): Promise<Record<string, string>> {
  const rows = await db.select().from(siteSettings).where(inArray(siteSettings.key, keys))
  return Object.fromEntries(rows.map((r) => [r.key, r.value]))
}

export async function sendBookingConfirmation({
  to,
  name,
  serviceName,
  date,
  time,
  meetLink,
}: {
  to: string
  name: string
  serviceName: string
  date: string
  time: string
  meetLink?: string
}) {
  const s = await getEmailSettings([
    "email_confirmation_subject",
    "email_confirmation_intro",
    "email_confirmation_footer",
  ])

  const html = await render(
    BookingConfirmationEmail({
      name,
      serviceName,
      date,
      time,
      meetLink,
      intro: s.email_confirmation_intro,
      footer: s.email_confirmation_footer,
    })
  )

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to,
    subject: s.email_confirmation_subject || `Booking Confirmed: ${serviceName}`,
    html,
  })
}

export async function sendAdminBookingNotification({
  serviceName,
  userName,
  userEmail,
  date,
  time,
  message,
}: {
  serviceName: string
  userName: string
  userEmail: string
  date: string
  time: string
  message?: string
}) {
  const s = await getEmailSettings(["email_admin_subject", "email_admin_intro"])

  const html = await render(
    AdminBookingNotificationEmail({
      serviceName,
      userName,
      userEmail,
      date,
      time,
      message,
      appUrl: process.env.NEXT_PUBLIC_APP_URL,
      intro: s.email_admin_intro,
    })
  )

  const adminEmails = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim())
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: adminEmails,
    subject: s.email_admin_subject || `New Booking: ${serviceName}`,
    html,
  })
}

export async function sendBookingCancellation({
  to,
  name,
  serviceName,
  isAdmin,
}: {
  to: string | string[]
  name: string
  serviceName: string
  isAdmin?: boolean
}) {
  const s = await getEmailSettings([
    "email_cancellation_subject",
    "email_cancellation_body",
    "email_cancellation_footer",
  ])

  const html = await render(
    BookingCancellationEmail({
      name,
      serviceName,
      isAdmin,
      appUrl: process.env.NEXT_PUBLIC_APP_URL,
      body: s.email_cancellation_body,
      footer: s.email_cancellation_footer,
    })
  )

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to,
    subject: s.email_cancellation_subject || `Booking Cancelled: ${serviceName}`,
    html,
  })
}

export async function sendDownloadLink({
  to,
  name,
  productName,
  downloadUrl,
}: {
  to: string
  name: string
  productName: string
  downloadUrl: string
}) {
  const s = await getEmailSettings([
    "email_download_subject",
    "email_download_intro",
    "email_download_footer",
  ])

  const html = await render(
    DownloadLinkEmail({
      name,
      productName,
      downloadUrl,
      intro: s.email_download_intro,
      footer: s.email_download_footer,
    })
  )

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to,
    subject: s.email_download_subject || `Your Download: ${productName}`,
    html,
  })
}

export async function sendFeedbackRequest({
  to,
  name,
  serviceName,
  bookingId,
}: {
  to: string
  name: string
  serviceName: string
  bookingId: string
}) {
  const feedbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/my-sessions/feedback/${bookingId}`
  const html = await render(FeedbackRequestEmail({ name, serviceName, feedbackUrl }))

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to,
    subject: `How was your ${serviceName}? Share your feedback`,
    html,
  })
}
