// Rules for the personalised gift card. Pure (no server imports) so the popup,
// the edit form and the API routes all validate the same way.

export const CARD_NAME_MAX = 40
export const CARD_MESSAGE_MAX = 160
export const CARD_MESSAGE_MAX_LINES = 3

// The card image can only draw English letters, so names and the message are
// limited to them (plus everyday punctuation) instead of showing empty boxes.
const NAME_RE = /^[A-Za-z][A-Za-z .'-]*$/
const MESSAGE_RE = /^[A-Za-z0-9 .,!?'"’“”:;()&@#%+\-/\n]*$/

export const CARD_ENGLISH_HINT = "English letters only, so the card shows correctly"
export const CARD_MESSAGE_HINT = `${CARD_ENGLISH_HINT}. Press enter for a new line (up to ${CARD_MESSAGE_MAX_LINES}).`

// Trim and collapse runs of spaces/newlines into single spaces.
export function tidy(value: unknown): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : ""
}

// Like tidy, but keeps line breaks: each line is trimmed and squashed, and empty
// lines are dropped. Enter in the message box becomes a new line on the card.
export function tidyMessage(value: unknown): string {
  if (typeof value !== "string") return ""
  return value
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n")
}

export function validateCardName(value: string, label: string): string | null {
  if (!value) return `Enter ${label}`
  if (value.length > CARD_NAME_MAX) return `${label} can be up to ${CARD_NAME_MAX} characters`
  if (!NAME_RE.test(value)) return `${label}: ${CARD_ENGLISH_HINT}`
  return null
}

export function validateCardMessage(value: string): string | null {
  if (!value) return null
  if (value.length > CARD_MESSAGE_MAX) return `The message can be up to ${CARD_MESSAGE_MAX} characters`
  if (value.split("\n").length > CARD_MESSAGE_MAX_LINES) return `The message can be up to ${CARD_MESSAGE_MAX_LINES} lines`
  if (!MESSAGE_RE.test(value)) return `The message: ${CARD_ENGLISH_HINT}`
  return null
}

// A short fingerprint of what is printed on the card. It goes on the card's
// image URL, so an edited card gets a new address and browsers, WhatsApp and
// email clients fetch the new image instead of showing a cached old one.
export function cardVersion(card: { recipientName?: string | null; message?: string | null; purchaserName?: string | null }): string {
  const text = `${card.recipientName ?? ""}|${card.message ?? ""}|${card.purchaserName ?? ""}`
  let hash = 5381
  for (let i = 0; i < text.length; i++) hash = ((hash << 5) + hash + text.charCodeAt(i)) | 0
  return (hash >>> 0).toString(36)
}

// The line in the middle of the card until the buyer changes it. It is filled
// into the form, and used on the card whenever the line is left empty.
export const DEFAULT_CARD_LINE = "This is a sign to start something of your own."

// Printed very quietly at the foot of every card.
export const CARD_SITE = "www.priyaahuja.in"

// Type sizes (in card-image pixels, on a 1200 x 630 canvas) that shrink for
// long names and messages so nothing overflows. Shared by the real card image
// and the on-page preview so they always match.
export function nameFontSize(name: string): number {
  if (name.length > 26) return 34
  if (name.length > 18) return 40
  if (name.length > 12) return 48
  return 56
}

export function messageFontSize(message: string): number {
  const lines = message.split("\n")
  const longest = Math.max(...lines.map((l) => l.length))
  if (lines.length >= 3 || longest > 110) return 26
  if (lines.length === 2 || longest > 70) return 30
  return 34
}
