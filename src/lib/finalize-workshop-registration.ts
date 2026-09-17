import { db } from "@/lib/db"
import { workshopRegistrations, workshops } from "@/lib/db/schema"
import { eq, and, isNull } from "drizzle-orm"
import { createCalendarEvent, addAttendeeToCalendarEvent, WORKSHOP_REMINDERS } from "@/lib/google-calendar"
import { sendWorkshopRegistrationConfirmation, sendAdminWorkshopNotification } from "@/lib/mailer"
import { formatWorkshopTimeRange, formatWorkshopCalendarDescription } from "@/lib/workshop-time"
import { grantWorkshopPitchDeckUnlock } from "@/lib/workshop-perks"

type Workshop = typeof workshops.$inferSelect
type Registration = typeof workshopRegistrations.$inferSelect

function formatDateLabel(date: string) {
  // Without an explicit timeZone this renders in the server's local time
  // (UTC on Vercel), which rolls a midnight-IST date back a day - this label
  // goes straight into the confirmation email, so it must be right there too.
  return new Date(`${date}T00:00:00+05:30`).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata",
  })
}

// Runs every post-confirmation side effect for a confirmed workshop
// registration - pitch-deck perk grant, adding the registrant to the
// workshop's one shared calendar event (creating that event on first-ever
// registration if it somehow doesn't exist yet), and confirmation emails.
// Shared by the client verify-payment path, the webhook safety net, and the
// admin no-payment bypass, so all three stay in sync.
export async function finalizeWorkshopRegistration(
  registration: Registration,
  workshop: Workshop,
  { sendEmail = true }: { sendEmail?: boolean } = {}
): Promise<{ meetLink: string | null }> {
  try {
    await grantWorkshopPitchDeckUnlock(workshop.slug, registration.userId, registration.id)
  } catch (e) {
    console.error("grantWorkshopPitchDeckUnlock failed:", e)
  }

  let meetLink: string | null = workshop.meetLink
  let eventId = workshop.googleCalendarEventId

  if (!eventId) {
    // Lazy-create the workshop's shared event if it doesn't have one yet
    // (normally created up front when the workshop itself is created).
    // The update is conditional on the column still being null so two
    // concurrent first-registrations can't both "win" - whoever's update
    // lands first is used; the loser's own freshly-created event is
    // discarded in favor of the winner's (left as harmless, attendee-less
    // debris on the calendar rather than adding more coordination for a rare race).
    try {
      const cal = await createCalendarEvent({
        summary: workshop.title,
        description: formatWorkshopCalendarDescription(workshop.slug),
        date: workshop.date,
        startTime: workshop.startTime,
        endTime: workshop.endTime,
        reminders: WORKSHOP_REMINDERS,
      })
      const claimed = await db
        .update(workshops)
        .set({ googleCalendarEventId: cal.eventId, meetLink: cal.meetLink })
        .where(and(eq(workshops.id, workshop.id), isNull(workshops.googleCalendarEventId)))
        .returning({ googleCalendarEventId: workshops.googleCalendarEventId, meetLink: workshops.meetLink })

      if (claimed.length > 0) {
        eventId = claimed[0].googleCalendarEventId
        meetLink = claimed[0].meetLink
      } else {
        const [current] = await db
          .select({ googleCalendarEventId: workshops.googleCalendarEventId, meetLink: workshops.meetLink })
          .from(workshops)
          .where(eq(workshops.id, workshop.id))
          .limit(1)
        eventId = current?.googleCalendarEventId ?? null
        meetLink = current?.meetLink ?? null
      }
    } catch (err) {
      console.error("Workshop calendar event creation failed:", err)
    }
  }

  if (eventId && !registration.calendarInviteSent) {
    try {
      const result = await addAttendeeToCalendarEvent({
        eventId,
        attendeeEmail: registration.userEmail,
        attendeeName: registration.userName,
      })
      meetLink = result.meetLink ?? meetLink
      await db
        .update(workshopRegistrations)
        .set({ calendarInviteSent: true })
        .where(eq(workshopRegistrations.id, registration.id))
    } catch (err) {
      console.error("Adding attendee to workshop calendar event failed:", err)
    }
  }

  if (sendEmail && !registration.confirmationEmailSent) {
    const claimed = await db
      .update(workshopRegistrations)
      .set({ confirmationEmailSent: true })
      .where(and(eq(workshopRegistrations.id, registration.id), eq(workshopRegistrations.confirmationEmailSent, false)))
      .returning({ id: workshopRegistrations.id })

    if (claimed.length > 0) {
      const dateLabel = formatDateLabel(workshop.date)
      const timeLabel = `${formatWorkshopTimeRange(workshop.startTime, workshop.endTime)} IST`

      sendWorkshopRegistrationConfirmation({
        to: registration.userEmail,
        name: registration.userName,
        workshopTitle: workshop.title,
        date: dateLabel,
        time: timeLabel,
      }).catch((e) => console.error("[mailer] sendWorkshopRegistrationConfirmation failed:", e))

      sendAdminWorkshopNotification({
        workshopTitle: workshop.title,
        userName: registration.userName,
        userEmail: registration.userEmail,
        date: dateLabel,
        time: timeLabel,
      }).catch((e) => console.error("[mailer] sendAdminWorkshopNotification failed:", e))
    }
  }

  return { meetLink }
}
