import { Resend } from "resend"

export const resend = new Resend(process.env.RESEND_API_KEY)

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
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to,
    subject: `Booking Confirmed: ${serviceName}`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; background: #FEF9E7; padding: 32px; border-radius: 12px;">
        <h1 style="font-size: 24px; color: #2D2D2D; margin-bottom: 8px;">Booking Confirmed 🎉</h1>
        <p style="color: #555; margin-bottom: 24px;">Hi ${name}, your session is booked!</p>
        <div style="background: #FFFDF5; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
          <p style="margin: 0 0 8px; color: #2D2D2D;"><strong>Service:</strong> ${serviceName}</p>
          <p style="margin: 0 0 8px; color: #2D2D2D;"><strong>Date:</strong> ${date}</p>
          <p style="margin: 0; color: #2D2D2D;"><strong>Time:</strong> ${time} IST</p>
          ${meetLink ? `<p style="margin: 8px 0 0; color: #2D2D2D;"><strong>Meet Link:</strong> <a href="${meetLink}" style="color: #FFA07A;">${meetLink}</a></p>` : ""}
        </div>
        <p style="color: #555; font-size: 14px;">Questions? Reply to this email or reach out on LinkedIn.</p>
        <p style="color: #555; font-size: 14px; margin-top: 24px;">- Priya Ahuja</p>
      </div>
    `,
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
  const adminEmails = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim())
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: adminEmails,
    subject: `New Booking: ${serviceName}`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2>New Booking Received</h2>
        <p><strong>Service:</strong> ${serviceName}</p>
        <p><strong>From:</strong> ${userName} (${userEmail})</p>
        <p><strong>Date:</strong> ${date} at ${time} IST</p>
        ${message ? `<p><strong>Message:</strong> ${message}</p>` : ""}
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/bookings" style="background: #FFA07A; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; display: inline-block; margin-top: 16px;">View in Dashboard</a>
      </div>
    `,
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
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to,
    subject: `Your Download: ${productName}`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; background: #FEF9E7; padding: 32px; border-radius: 12px;">
        <h1 style="font-size: 24px; color: #2D2D2D;">Your purchase is ready!</h1>
        <p style="color: #555;">Hi ${name}, thank you for purchasing <strong>${productName}</strong>.</p>
        <a href="${downloadUrl}" style="background: #FFA07A; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; display: inline-block; margin: 24px 0; font-weight: 600;">Download Now</a>
        <p style="color: #999; font-size: 12px;">This link expires in 48 hours.</p>
        <p style="color: #555; font-size: 14px; margin-top: 24px;">- Priya Ahuja</p>
      </div>
    `,
  })
}
