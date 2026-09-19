import { ImageResponse } from "next/og"
import { db } from "@/lib/db"
import { courseGifts } from "@/lib/db/schema"
import { eq, inArray, and } from "drizzle-orm"
import { getCourse } from "@/lib/courses-data"
import { CARD_SITE, DEFAULT_CARD_LINE, nameFontSize, messageFontSize } from "@/lib/gift-card"

const WIDTH = 1200
const HEIGHT = 630

const PEACH = "#E8875A"
const CREAM = "#EFE9E1"
const MUTED = "#8e867d"

// The personalised gift card as a PNG. Deliberately minimal: who it is for at
// the top left, the buyer's one line in the middle (a default until they change it), the course bottom left,
// who it is from bottom right. The on-page preview (components/GiftCardPreview) uses the same
// layout and sizes. Anyone holding the gift token can see it - it shows exactly
// what the gift link's own page shows.
export async function GET(req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params

  const [gift] = await db
    .select()
    .from(courseGifts)
    .where(and(eq(courseGifts.token, token), inArray(courseGifts.status, ["paid", "redeemed"])))
    .limit(1)
  const course = gift ? getCourse(gift.courseSlug) : undefined
  if (!gift || !course) return new Response("Not found", { status: 404 })

  const recipient = gift.recipientName || "you"
  const message = gift.message?.trim() || DEFAULT_CARD_LINE
  const download = new URL(req.url).searchParams.get("download") === "1"

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px 64px",
          background: "linear-gradient(160deg, #18130f 0%, #111113 65%)",
          color: CREAM,
        }}
      >
        {/* top left: who it is for, on one line */}
        <div style={{ display: "flex", alignItems: "baseline" }}>
          <div style={{ display: "flex", fontSize: 32, color: MUTED, marginRight: 20 }}>For</div>
          <div
            style={{
              display: "flex",
              fontSize: nameFontSize(recipient),
              fontWeight: 800,
              lineHeight: 1.1,
              paddingBottom: 6,
              borderBottom: `3px solid ${PEACH}`,
              maxWidth: 900,
            }}
          >
            {recipient}
          </div>
        </div>

        {/* middle: the buyer's one line, or the default */}
        <div style={{ display: "flex", justifyContent: "center", textAlign: "center", fontSize: messageFontSize(message), lineHeight: 1.4, color: PEACH, maxWidth: 880, alignSelf: "center", whiteSpace: "pre-line", wordBreak: "break-word" }}>
          {message}
        </div>

        {/* bottom: the course on the left, who it is from on the right */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ display: "flex", flexDirection: "column", maxWidth: 720 }}>
            <div style={{ display: "flex", fontSize: 16, letterSpacing: 5, color: MUTED, marginBottom: 10 }}>THE COURSE</div>
            <div style={{ display: "flex", fontSize: 36, fontWeight: 800, lineHeight: 1.15 }}>{course.title}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", maxWidth: 380 }}>
            <div style={{ display: "flex", fontSize: 20, color: MUTED, marginBottom: 8 }}>From,</div>
            <div style={{ display: "flex", fontSize: 36, fontWeight: 700, textAlign: "right" }}>{gift.purchaserName}</div>
          </div>
        </div>

        {/* the site, very quietly, at the foot of the card */}
        <div style={{ display: "flex", position: "absolute", left: 0, right: 0, bottom: 24, justifyContent: "center", fontSize: 15, letterSpacing: 3, color: "rgba(142,134,125,0.55)" }}>
          {CARD_SITE}
        </div>
      </div>
    ),
    {
      width: WIDTH,
      height: HEIGHT,
      headers: {
        "Cache-Control": "public, max-age=3600",
        ...(download ? { "Content-Disposition": 'attachment; filename="gift-card.png"' } : {}),
      },
    },
  )
}
