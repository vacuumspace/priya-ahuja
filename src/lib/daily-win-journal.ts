// The "100 days" daily-win journal is one shared challenge window for every
// user (not a per-user rolling start), so a founder who joins on day 10 can
// still backfill days 1-9 instead of getting a shorter personal challenge.
// Day 1 = 23 Sept, day 100 = 31 Dec.
export const CHALLENGE_START_DATE = "2026-09-23"
export const CHALLENGE_DAYS = 100
export const MAX_POINTS_PER_ENTRY = 3
export const MAX_POINT_LENGTH = 180

// Pure calendar-date arithmetic - parsed as UTC midnight (not IST midnight)
// so the UTC date read back by toISOString() matches the input date exactly.
// Using "+05:30" here would read back one day short, since IST midnight is
// 18:30 UTC the previous day.
export function addDays(dateStr: string, days: number): string {
  const d = new Date(`${dateStr}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

export const CHALLENGE_END_DATE = addDays(CHALLENGE_START_DATE, CHALLENGE_DAYS - 1)

export function todayIST(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" })
}

// 1-indexed day number for a date within the challenge, or null if outside it.
export function dayNumberForDate(dateStr: string): number | null {
  if (dateStr < CHALLENGE_START_DATE || dateStr > CHALLENGE_END_DATE) return null
  const start = new Date(`${CHALLENGE_START_DATE}T00:00:00+05:30`).getTime()
  const date = new Date(`${dateStr}T00:00:00+05:30`).getTime()
  return Math.round((date - start) / 86400000) + 1
}

export function allChallengeDates(): string[] {
  return Array.from({ length: CHALLENGE_DAYS }, (_, i) => addDays(CHALLENGE_START_DATE, i))
}

// A day can be filled (fresh or backfilled) once it's within the challenge
// window and isn't in the future - the challenge never gets ahead of "today".
export function isFillable(dateStr: string): boolean {
  return dateStr >= CHALLENGE_START_DATE && dateStr <= CHALLENGE_END_DATE && dateStr <= todayIST()
}

// Clamps to today (and to CHALLENGE_START_DATE, if today is still before the
// challenge starts) even when no date is given - a missing date used to
// short-circuit straight to today, skipping the start-date floor below.
export function clampWallDate(dateStr: string | undefined): string {
  const today = todayIST()
  const candidate = dateStr && /^\d{4}-\d{2}-\d{2}$/.test(dateStr) ? dateStr : today
  if (candidate < CHALLENGE_START_DATE) return CHALLENGE_START_DATE
  if (candidate > today) return today
  return candidate
}
