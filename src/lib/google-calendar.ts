import { google } from "googleapis"

function getCalendarClient() {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/calendar"],
    // Impersonate the Workspace account so attendees + Meet links work
    subject: process.env.GOOGLE_CALENDAR_ID,
  })
  return google.calendar({ version: "v3", auth })
}

type ReminderOverride = { method: "email" | "popup"; minutes: number }

const DEFAULT_REMINDERS: ReminderOverride[] = [
  { method: "popup", minutes: 1440 }, // 24h
  { method: "popup", minutes: 60 },   // 1h
  { method: "popup", minutes: 10 },   // 10min
]

export const WORKSHOP_REMINDERS: ReminderOverride[] = [
  { method: "popup", minutes: 1440 }, // 24h before
  { method: "popup", minutes: 60 },   // 1h before
  { method: "popup", minutes: 10 },   // 10min before
]

export async function createCalendarEvent({
  summary,
  description,
  date,
  startTime,
  endTime,
  attendeeEmail,
  attendeeName,
  reminders = DEFAULT_REMINDERS,
}: {
  summary: string
  description?: string
  date: string        // YYYY-MM-DD
  startTime: string   // HH:MM
  endTime: string     // HH:MM
  // Optional so a shared event (e.g. a workshop) can be created up front with
  // no one on it yet, and attendees added one at a time later via
  // addAttendeeToCalendarEvent as people register.
  attendeeEmail?: string
  attendeeName?: string
  reminders?: ReminderOverride[]
}): Promise<{ eventId: string; meetLink: string | null }> {
  const calendar = getCalendarClient()
  const calendarId = process.env.GOOGLE_CALENDAR_ID!

  const startISO = `${date}T${startTime}:00+05:30`
  const endISO = `${date}T${endTime}:00+05:30`

  const res = await calendar.events.insert({
    calendarId,
    conferenceDataVersion: 1,
    sendUpdates: "all",
    requestBody: {
      summary,
      description,
      start: { dateTime: startISO, timeZone: "Asia/Kolkata" },
      end:   { dateTime: endISO,   timeZone: "Asia/Kolkata" },
      attendees: attendeeEmail ? [{ email: attendeeEmail, displayName: attendeeName }] : [],
      // Attendees on a shared event (workshops) must not see who else is
      // registered - irrelevant for a 1-attendee booking, harmless to set.
      guestsCanSeeOtherGuests: false,
      // Google defaults this to true, which lets any guest forward the invite
      // and have the forwardee accept straight onto the guest list, bypassing payment.
      guestsCanInviteOthers: false,
      conferenceData: {
        createRequest: {
          requestId: `booking-${Date.now()}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
      reminders: {
        useDefault: false,
        overrides: reminders,
      },
    },
  })

  const event = res.data
  const meetLink =
    event.conferenceData?.entryPoints?.find((e) => e.entryPointType === "video")?.uri ?? null

  return { eventId: event.id!, meetLink }
}

// Adds one more attendee to an existing shared event (a workshop) without
// disturbing anyone already on it. Idempotent - re-adding the same email is
// a no-op. sendUpdates:"all" means every existing attendee gets a routine
// "event updated" notification when someone new joins; there's no Calendar
// API option to notify only the new attendee on an update.
export async function addAttendeeToCalendarEvent({
  eventId,
  attendeeEmail,
  attendeeName,
}: {
  eventId: string
  attendeeEmail: string
  attendeeName: string
}): Promise<{ meetLink: string | null }> {
  const calendar = getCalendarClient()
  const calendarId = process.env.GOOGLE_CALENDAR_ID!

  const existing = await calendar.events.get({ calendarId, eventId })
  const attendees = existing.data.attendees ?? []

  const meetLinkFromExisting =
    existing.data.conferenceData?.entryPoints?.find((e) => e.entryPointType === "video")?.uri ?? null

  if (attendees.some((a) => a.email?.toLowerCase() === attendeeEmail.toLowerCase())) {
    return { meetLink: meetLinkFromExisting }
  }

  const res = await calendar.events.patch({
    calendarId,
    eventId,
    sendUpdates: "all",
    requestBody: {
      attendees: [...attendees, { email: attendeeEmail, displayName: attendeeName }],
      // Also locks down events created before this flag was set on creation.
      guestsCanInviteOthers: false,
    },
  })

  const meetLink =
    res.data.conferenceData?.entryPoints?.find((e) => e.entryPointType === "video")?.uri ?? meetLinkFromExisting

  return { meetLink }
}

export async function updateCalendarEvent({
  eventId,
  date,
  startTime,
  endTime,
  summary,
  description,
}: {
  eventId: string
  date: string
  startTime: string
  endTime: string
  summary?: string
  description?: string
}): Promise<{ meetLink: string | null }> {
  const calendar = getCalendarClient()
  const calendarId = process.env.GOOGLE_CALENDAR_ID!

  const startISO = `${date}T${startTime}:00+05:30`
  const endISO = `${date}T${endTime}:00+05:30`

  const res = await calendar.events.patch({
    calendarId,
    eventId,
    conferenceDataVersion: 1,
    sendUpdates: "all",
    requestBody: {
      start: { dateTime: startISO, timeZone: "Asia/Kolkata" },
      end:   { dateTime: endISO,   timeZone: "Asia/Kolkata" },
      ...(summary !== undefined ? { summary } : {}),
      ...(description !== undefined ? { description } : {}),
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

// Returns busy windows from Google Calendar for the given date range (IST)
export async function getCalendarBusySlots(
  startDate: string, // YYYY-MM-DD
  endDate: string,   // YYYY-MM-DD (exclusive)
): Promise<{ startMin: number; endMin: number; date: string }[]> {
  const calendar = getCalendarClient()
  const calendarId = process.env.GOOGLE_CALENDAR_ID!

  const res = await calendar.freebusy.query({
    requestBody: {
      timeMin: `${startDate}T00:00:00+05:30`,
      timeMax: `${endDate}T00:00:00+05:30`,
      timeZone: "Asia/Kolkata",
      items: [{ id: calendarId }],
    },
  })

  const busy = res.data.calendars?.[calendarId]?.busy ?? []
  const result: { startMin: number; endMin: number; date: string }[] = []

  for (const period of busy) {
    if (!period.start || !period.end) continue

    // Convert UTC ISO strings to IST HH:MM
    const startIST = new Date(new Date(period.start).getTime() + 5.5 * 60 * 60 * 1000)
    const endIST   = new Date(new Date(period.end).getTime()   + 5.5 * 60 * 60 * 1000)

    const date = startIST.toISOString().slice(0, 10)
    const startMin = startIST.getUTCHours() * 60 + startIST.getUTCMinutes()
    const endMin   = endIST.getUTCHours()   * 60 + endIST.getUTCMinutes()

    // A single busy period may span midnight - split across dates if needed
    if (startIST.toISOString().slice(0, 10) === endIST.toISOString().slice(0, 10)) {
      result.push({ date, startMin, endMin })
    } else {
      // spans midnight: cap at end of first day and start of second
      result.push({ date, startMin, endMin: 24 * 60 })
      const nextDate = endIST.toISOString().slice(0, 10)
      result.push({ date: nextDate, startMin: 0, endMin: endIST.getUTCHours() * 60 + endIST.getUTCMinutes() })
    }
  }

  return result
}
