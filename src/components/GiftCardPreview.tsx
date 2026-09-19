import { CARD_SITE, DEFAULT_CARD_LINE, nameFontSize, messageFontSize } from "@/lib/gift-card"

// A live, on-page picture of the gift card while it is being written. Same
// layout and proportions as the real card image (generated after purchase by
// /api/courses/gift/card/[token]) - every size below is that image's pixel size
// on its 1200 x 630 canvas, scaled to the width this renders at.
const PEACH = "#E8875A"
const CREAM = "#EFE9E1"
const MUTED = "#8e867d"

// 1200 design pixels = 100% of the card's width.
const u = (px: number) => `${((px / 1200) * 100).toFixed(3)}cqw`

export function GiftCardPreview({
  recipientName,
  fromName,
  message,
  courseTitle,
}: {
  recipientName: string
  fromName: string
  message: string
  courseTitle: string
}) {
  const recipient = recipientName || "their name"
  const line = message || DEFAULT_CARD_LINE

  return (
    <div style={{ containerType: "inline-size" }} className="w-full">
      <div
        aria-label="Gift card preview"
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "1200 / 630",
          overflow: "hidden",
          borderRadius: u(28),
          background: "linear-gradient(160deg, #18130f 0%, #111113 65%)",
          color: CREAM,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: `${u(72)} ${u(80)} ${u(64)}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline" }}>
          <span style={{ fontSize: u(32), color: MUTED, marginRight: u(20) }}>For</span>
          <span
            style={{
              fontSize: u(nameFontSize(recipient)),
              fontWeight: 800,
              lineHeight: 1.1,
              paddingBottom: u(6),
              borderBottom: `${u(3)} solid ${PEACH}`,
              color: recipientName ? CREAM : "rgba(239,233,225,0.3)",
              maxWidth: u(900),
              overflowWrap: "anywhere",
            }}
          >
            {recipient}
          </span>
        </div>

        <span style={{ display: "block", textAlign: "center", fontSize: u(messageFontSize(line)), lineHeight: 1.4, color: PEACH, maxWidth: u(880), alignSelf: "center", overflowWrap: "anywhere", whiteSpace: "pre-line" }}>{line}</span>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ display: "flex", flexDirection: "column", maxWidth: u(720) }}>
            <span style={{ fontSize: u(16), letterSpacing: u(5), color: MUTED, marginBottom: u(10) }}>THE COURSE</span>
            <span style={{ fontSize: u(36), fontWeight: 800, lineHeight: 1.15 }}>{courseTitle}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", maxWidth: u(380) }}>
            <span style={{ fontSize: u(20), color: MUTED, marginBottom: u(8) }}>From,</span>
            <span style={{ fontSize: u(36), fontWeight: 700, textAlign: "right", overflowWrap: "anywhere" }}>{fromName || "you"}</span>
          </div>
        </div>
        <span
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: u(24),
            textAlign: "center",
            fontSize: u(15),
            letterSpacing: u(3),
            color: "rgba(142,134,125,0.55)",
          }}
        >
          {CARD_SITE}
        </span>
      </div>
    </div>
  )
}
