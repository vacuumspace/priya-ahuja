import { google } from "googleapis"

function getCalendarClient() {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/calendar"],
  })
  return google.calendar({ version: "v3", auth })
}

export async function createCalendarEvent({
  summary,
  description,
  date,
  startTime,
  endTime,
  attendeeEmail,
  attendeeName,
}: {
  summary: string
  description?: string
  date: string        // YYYY-MM-DD
  startTime: string   // HH:MM
  endTime: string     // HH:MM
  attendeeEmail: string
  attendeeName: string
}): Promise<{ eventId: string; meetLink: string | null }> {
  const calendar = getCalendarClient()
  const calendarId = process.env.GOOGLE_CALENDAR_ID!

  const startISO = `${date}T${startTime}:00+05:30`
  const endISO = `${date}T${endTime}:00+05:30`

  const fullDescription = [
    `Client: ${attendeeName} (${attendeeEmail})`,
    description,
  ].filter(Boolean).join("\n\n")

  const res = await calendar.events.insert({
    calendarId,
    requestBody: {
      summary,
      description: fullDescription,
      start: { dateTime: startISO, timeZone: "Asia/Kolkata" },
      end:   { dateTime: endISO,   timeZone: "Asia/Kolkata" },
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 60 },
          { method: "popup", minutes: 15 },
        ],
      },
    },
  })

  return { eventId: res.data.id!, meetLink: null }
}

export async function updateCalendarEvent({
  eventId,
  date,
  startTime,
  endTime,
}: {
  eventId: string
  date: string
  startTime: string
  endTime: string
}): Promise<{ meetLink: string | null }> {
  const calendar = getCalendarClient()
  const calendarId = process.env.GOOGLE_CALENDAR_ID!

  const startISO = `${date}T${startTime}:00+05:30`
  const endISO = `${date}T${endTime}:00+05:30`

  const res = await calendar.events.patch({
    calendarId,
    eventId,
    conferenceDataVersion: 1,
    requestBody: {
      start: { dateTime: startISO, timeZone: "Asia/Kolkata" },
      end:   { dateTime: endISO,   timeZone: "Asia/Kolkata" },
    },
  })

  const meetLink =
    res.data.conferenceData?.entryPoints?.find((e) => e.entryPointType === "video")?.uri ?? null

  return { meetLink }
}

export async function deleteCalendarEvent(eventId: string): Promise<void> {
  const calendar = getCalendarClient()
  await calendar.events.delete({
    calendarId: process.env.GOOGLE_CALENDAR_ID!,
    eventId,
  })
}
