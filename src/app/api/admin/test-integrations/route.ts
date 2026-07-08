import { NextResponse } from "next/server"
import { auth, isAdmin } from "@/lib/auth"
import nodemailer from "nodemailer"
import { createCalendarEvent, deleteCalendarEvent } from "@/lib/google-calendar"

export async function GET() {
  const session = await auth()
  if (!session || !isAdmin(session.user?.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const results: Record<string, { ok: boolean; detail: string }> = {}

  // Test SMTP - actually send a mail to admin
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
    await transporter.sendMail({
      from: `"Priya Ahuja" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "Integration test - SMTP working",
      html: "<p>This is a test email sent from /api/admin/test-integrations.</p>",
    })
    results.smtp = { ok: true, detail: `Test email sent to ${process.env.EMAIL_USER}` }
  } catch (err: unknown) {
    results.smtp = { ok: false, detail: String(err) }
  }

  // Test Google Calendar - actually create an event and check for Meet link, then delete it
  try {
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000)
    const date = tomorrow.toISOString().slice(0, 10)
    const { eventId, meetLink } = await createCalendarEvent({
      summary: "Integration Test - delete me",
      date,
      startTime: "10:00",
      endTime: "10:30",
      attendeeEmail: process.env.EMAIL_USER!,
      attendeeName: "Integration Test",
    })
    await deleteCalendarEvent(eventId)
    results.googleCalendar = {
      ok: true,
      detail: meetLink
        ? `Event created + deleted. Meet link generated: ${meetLink}`
        : "Event created + deleted BUT no Meet link returned - Google Meet may not be enabled for this Workspace account",
    }
  } catch (err: unknown) {
    results.googleCalendar = { ok: false, detail: String(err) }
  }

  return NextResponse.json(results)
}
