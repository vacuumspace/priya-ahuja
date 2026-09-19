"use client"

import { useEffect, useState } from "react"
import { Check, Copy, Download, Share2 } from "lucide-react"

// Everything the buyer needs to hand a gift over: the card image and the link.
// Used in the gift popup, the buyer's my-activity list and the claim page.
export function GiftLinkActions({
  link,
  cardUrl,
  courseTitle,
  recipientName,
}: {
  link: string
  // Path of the card image (with its version), e.g. /api/courses/gift/card/abc?v=1x
  cardUrl: string
  courseTitle: string
  recipientName?: string
}) {
  const [copied, setCopied] = useState(false)
  const [canShare, setCanShare] = useState(false)
  const [sharing, setSharing] = useState(false)
  const message = `${recipientName ? `For ${recipientName}: ` : ""}I'm gifting you "${courseTitle}", to help you start up. Open this link to claim it:`

  // Share sheets (with a file) exist on phones; check after mount so the
  // server and browser render the same thing first.
  useEffect(() => {
    const t = setTimeout(() => setCanShare(typeof navigator.share === "function"), 0)
    return () => clearTimeout(t)
  }, [])

  async function shareCard() {
    setSharing(true)
    try {
      const blob = await (await fetch(cardUrl)).blob()
      const file = new File([blob], "gift-card.png", { type: "image/png" })
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text: `${message} ${link}` })
      } else {
        await navigator.share({ text: `${message} ${link}`, url: link })
      }
    } catch {
      // Cancelled the share sheet, or sharing isn't possible - nothing to do.
    } finally {
      setSharing(false)
    }
  }

  const secondary =
    "inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg border border-border hover:bg-ink/5 text-[13px] font-sans font-semibold text-ink transition-colors"

  return (
    <div className="flex flex-wrap items-center gap-2">
      <a
        href={`${cardUrl}${cardUrl.includes("?") ? "&" : "?"}download=1`}
        download="gift-card.png"
        className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-ink text-cream hover:bg-ink/80 text-[13px] font-sans font-semibold transition-colors"
      >
        <Download size={13} />
        download card
      </a>
      {canShare && (
        <button type="button" onClick={shareCard} disabled={sharing} className={secondary}>
          <Share2 size={13} />
          share card + link
        </button>
      )}
      <button
        type="button"
        onClick={() => {
          navigator.clipboard?.writeText(link).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 1800)
          }).catch(() => {})
        }}
        className={secondary}
      >
        {copied ? <Check size={13} /> : <Copy size={13} />}
        {copied ? "copied" : "copy link"}
      </button>
      <a
        href={`https://wa.me/?text=${encodeURIComponent(`${message} ${link}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={secondary}
      >
        whatsapp
      </a>
    </div>
  )
}
