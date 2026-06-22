import { NextResponse } from "next/server"
import { auth, isAdmin } from "@/lib/auth"
import nodemailer from "nodemailer"
import { google } from "googleapis"

export async function GET() {
  const session = await auth()
  if (!session || !isAdmin(session.user?.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const results: Record<string, { ok: boolean; detail: string }> = {}

  // Test SMTP
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })
    await transporter.verify()
    results.smtp = { ok: true, detail: `Connected as ${process.env.EMAIL_USER}` }
  } catch (err: unknown) {
    results.smtp = { ok: false, detail: String(err) }
  }

  // Test Google Calendar service account
  try {
    const auth2 = new google.auth.JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/calendar"],
      subject: process.env.GOOGLE_CALENDAR_ID,
    })
    const calendar = google.calendar({ version: "v3", auth: auth2 })
    const res = await calendar.calendarList.list({ maxResults: 1 })
    results.googleCalendar = {
      ok: true,
      detail: `Authenticated as ${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL}, impersonating ${process.env.GOOGLE_CALENDAR_ID}. Calendars visible: ${res.data.items?.length ?? 0}`,
    }
  } catch (err: unknown) {
    results.googleCalendar = {
      ok: false,
      detail: String(err),
    }
  }

  return NextResponse.json(results)
}
