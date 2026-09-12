import nodemailer from "nodemailer"
import { render } from "@react-email/components"
import { db } from "@/lib/db"
import { siteSettings } from "@/lib/db/schema"
import { inArray } from "drizzle-orm"
import BookingConfirmationEmail from "@/emails/BookingConfirmationEmail"
import AdminBookingNotificationEmail from "@/emails/AdminBookingNotificationEmail"
import BookingCancellationEmail from "@/emails/BookingCancellationEmail"
import DownloadLinkEmail from "@/emails/DownloadLinkEmail"
import FeedbackRequestEmail from "@/emails/FeedbackRequestEmail"
import PurchaseWelcomeEmail from "@/emails/PurchaseWelcomeEmail"

const FROM_EMAIL = process.env.EMAIL_USER!
const FROM_NAME = process.env.MAIL_FROM_NAME ?? "Priya Ahuja"

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

async function sendMail({ to, subject, html }: { to: string | string[]; subject: string; html: string }) {
  await transporter.sendMail({
    from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
    replyTo: FROM_EMAIL,
    to,
    subject,
    html,
  })
}

async function getEmailSettings(keys: string[]): Promise<Record<string, string>> {
  const rows = await db.select().from(siteSettings).where(inArray(siteSettings.key, keys))
  return Object.fromEntries(rows.map((r) => [r.key, r.value]))
}

export async function sendBookingConfirmation({
  to,
  name,
  serviceName,
  serviceType = "call",
  date,
  time,
  meetLink,
}: {
  to: string
  name: string
  serviceName: string
  serviceType?: "call" | "dm" | "report"
  date?: string
  time?: string
  meetLink?: string
}) {
  const s = await getEmailSettings([
    "email_confirmation_subject",
    "email_confirmation_intro",
    "email_confirmation_footer",
  ])

  const isAsync = serviceType === "report" || serviceType === "dm"
  const defaultSubject = isAsync
    ? `payment received - your ${serviceName} review is on the way`
    : `see you soon, ${name.split(" ")[0]} - ${serviceName} is confirmed`

  const html = await render(
    BookingConfirmationEmail({
      name,
      serviceName,
      serviceType,
      date,
      time,
      meetLink,
      intro: s.email_confirmation_intro,
      footer: s.email_confirmation_footer,
    })
  )

  await sendMail({
    to,
    subject: s.email_confirmation_subject || defaultSubject,
    html,
  })
}

export async function sendAdminBookingNotification({
  serviceName,
  serviceType = "call",
  userName,
  userEmail,
  date,
  time,
  message,
  type = "new",
  previousDate,
  previousTime,
}: {
  serviceName: string
  serviceType?: "call" | "dm" | "report"
  userName: string
  userEmail: string
  date?: string
  time?: string
  message?: string
  type?: "new" | "reschedule"
  previousDate?: string
  previousTime?: string
}) {
  const s = await getEmailSettings(["email_admin_subject", "email_admin_intro"])

  const isAsync = serviceType === "report" || serviceType === "dm"
  const html = await render(
    AdminBookingNotificationEmail({
      serviceName,
      serviceType,
      userName,
      userEmail,
      date,
      time,
      message,
      appUrl: process.env.NEXT_PUBLIC_APP_URL,
      intro: s.email_admin_intro,
      type,
      previousDate,
      previousTime,
    })
  )

  const adminEmails = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim())
  const subject = type === "reschedule"
    ? `Rescheduled: ${serviceName} - ${userName}`
    : isAsync
    ? `New Review Request: ${serviceName} from ${userName}`
    : (s.email_admin_subject || `New Booking: ${serviceName}`)

  await sendMail({
    to: adminEmails,
    subject,
    html,
  })
}

export async function sendRescheduleConfirmation({
  to,
  name,
  serviceName,
  serviceType = "call",
  date,
  time,
  meetLink,
}: {
  to: string
  name: string
  serviceName: string
  serviceType?: "call" | "dm" | "report"
  date: string
  time: string
  meetLink?: string
}) {
  const s = await getEmailSettings(["email_confirmation_footer"])

  const html = await render(
    BookingConfirmationEmail({
      name,
      serviceName,
      serviceType,
      date,
      time,
      meetLink,
      heading: "Session Rescheduled 📅",
      intro: "Your session has been rescheduled. Here are your updated details.",
      footer: s.email_confirmation_footer,
    })
  )

  await sendMail({
    to,
    subject: `your ${serviceName} has been rescheduled, ${name.split(" ")[0]}`,
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

  await sendMail({
    to,
    subject: s.email_cancellation_subject || `Booking Cancelled: ${serviceName}`,
    html,
  })
}

export async function sendAccessLink({
  to,
  name,
  productName,
  accessUrl,
}: {
  to: string
  name: string
  productName: string
  accessUrl: string
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
      accessUrl,
      intro: s.email_download_intro,
      footer: s.email_download_footer,
    })
  )

  await sendMail({
    to,
    subject: s.email_download_subject || `Your Access: ${productName}`,
    html,
  })
}

export async function sendPurchaseWelcome({
  to,
  name,
  productSlug,
  productName,
}: {
  to: string
  name: string
  productSlug: string
  productName: string
}) {
  const html = await render(
    PurchaseWelcomeEmail({
      name,
      productSlug,
      productName,
      appUrl: process.env.NEXT_PUBLIC_APP_URL,
    })
  )
  const subjectMap: Record<string, string> = {
    "angel-investor-list":  "Your Angel Investor List - how to make the most of it",
    "early-stage-vc-list":  "Your Early Stage VC List - how to use it well",
    "family-offices-list":  "Your Family Office List - how to approach them",
    "incubators-list":      "Your Incubator and Accelerator List - how to apply well",
    "startup-ideas-2026":   "Your 100 startup ideas - what to do next",
    "pitch-deck-analyser":  "Your pitch deck analysis is ready - here's how to use it",
  }
  await sendMail({
    to,
    subject: subjectMap[productSlug] ?? `You're all set - ${productName}`,
    html,
  })
}

export async function sendMessageNotification({
  to,
  senderName,
  serviceName,
  messageBody,
  bookingId,
  recipientIsAdmin,
}: {
  to: string
  senderName: string
  serviceName: string
  messageBody: string
  bookingId: string
  recipientIsAdmin: boolean
}) {
  const dashboardUrl = recipientIsAdmin
    ? `${process.env.NEXT_PUBLIC_APP_URL}/admin/bookings`
    : `${process.env.NEXT_PUBLIC_APP_URL}/my-activity`

  const html = `
    <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#fff;border:1px solid #e8e8e8;border-radius:12px">
      <p style="font-size:16px;font-weight:700;color:#2D2D2D;margin:0 0 8px">New message ${recipientIsAdmin ? "from a client" : "from Priya"}</p>
      <p style="font-size:13px;color:#777;margin:0 0 20px">Re: <strong>${serviceName}</strong></p>
      <div style="background:#fafafa;border:1px solid #efefef;border-radius:8px;padding:16px 20px;margin-bottom:24px">
        <p style="font-size:13px;color:#555;margin:0 0 6px"><strong>${senderName}</strong> says:</p>
        <p style="font-size:14px;color:#2D2D2D;margin:0;line-height:1.6">${messageBody}</p>
      </div>
      <a href="${dashboardUrl}" style="display:inline-block;background:#FFA07A;color:#fff;padding:10px 22px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:600">
        ${recipientIsAdmin ? "View in Dashboard →" : "View my sessions →"}
      </a>
    </div>
  `

  await sendMail({
    to,
    subject: recipientIsAdmin
      ? `${senderName} sent a message - ${serviceName}`
      : `priya replied to your ${serviceName} message`,
    html,
  })
}

export async function sendSessionNotes({
  to,
  name,
  serviceName,
  notes,
  nextSteps,
  bookingId,
}: {
  to: string
  name: string
  serviceName: string
  notes: string
  nextSteps: string
  bookingId: string
}) {
  const firstName = name.split(" ")[0]
  const activityUrl = `${process.env.NEXT_PUBLIC_APP_URL}/my-activity`
  const html = `
    <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#fff;border:1px solid #e8e8e8;border-radius:12px">
      <p style="font-size:14px;color:#777;margin:0 0 20px">Hi ${firstName},</p>
      <p style="font-size:16px;font-weight:700;color:#2D2D2D;margin:0 0 8px">Session notes - ${serviceName}</p>
      <p style="font-size:13px;color:#777;margin:0 0 24px">Here's a quick summary from our session today.</p>

      <p style="font-size:12px;font-weight:700;color:#2D2D2D;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 8px">What we covered</p>
      <div style="background:#fafafa;border:1px solid #efefef;border-radius:8px;padding:16px 20px;margin-bottom:24px;font-size:13px;color:#555;line-height:1.7;white-space:pre-line">${notes}</div>

      <p style="font-size:12px;font-weight:700;color:#2D2D2D;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 8px">Next steps</p>
      <div style="background:#fff7f0;border:1px solid #FFA07A33;border-radius:8px;padding:16px 20px;margin-bottom:28px;font-size:13px;color:#555;line-height:1.7;white-space:pre-line">${nextSteps}</div>

      <p style="font-size:13px;color:#777;margin:0 0 24px">
        if you have questions or want to follow up on anything, reply to this email directly. you can also send a message through my activity.
      </p>
      <a href="${activityUrl}" style="display:inline-block;background:#1a1a1a;color:#fff;padding:10px 22px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:600">
        view my activity →
      </a>
      <p style="font-size:12px;color:#bbb;margin:24px 0 0">priya ahuja · priyaahuja.in</p>
    </div>
  `

  await sendMail({
    to,
    subject: `session notes - ${serviceName} · ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`,
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
  const feedbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/my-activity/feedback/${bookingId}`
  const html = await render(FeedbackRequestEmail({ name, serviceName, feedbackUrl }))

  await sendMail({
    to,
    subject: `${name.split(" ")[0]}, how was your ${serviceName}? leave a quick review`,
    html,
  })
}
