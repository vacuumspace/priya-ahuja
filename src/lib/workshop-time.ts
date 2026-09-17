// Formats a "HH:MM" (24h, IST) time into a 12h label, e.g. "3:00" + "PM".
function to12h(time: string): { label: string; period: "AM" | "PM" } {
  const [hStr, m] = time.split(":")
  const h24 = parseInt(hStr, 10)
  const period: "AM" | "PM" = h24 >= 12 ? "PM" : "AM"
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12
  return { label: `${h12}:${m}`, period }
}

// "15:00", "16:00" -> "3:00 - 4:00 PM"; "11:30", "13:00" -> "11:30 AM - 1:00 PM"
export function formatWorkshopTimeRange(startTime: string, endTime: string): string {
  const start = to12h(startTime)
  const end = to12h(endTime)
  if (start.period === end.period) {
    return `${start.label} - ${end.label} ${end.period}`
  }
  return `${start.label} ${start.period} - ${end.label} ${end.period}`
}

export function formatWorkshopPrice(paise: number): string {
  return `₹${(paise / 100).toLocaleString("en-IN")}`
}

// The calendar event's description is deliberately just this - not the
// workshop's own (often long) content description. Hardcoded to the
// production domain (matching the canonical URLs elsewhere on these pages) -
// NEXT_PUBLIC_APP_URL is environment-dependent (localhost in dev) and this
// value gets written into a real, shared Google Calendar event, not served
// per-request, so it must never resolve to anything but the real domain.
export function formatWorkshopCalendarDescription(slug: string): string {
  return `Workshop detail link: https://priyaahuja.in/school/workshops/${slug}`
}
