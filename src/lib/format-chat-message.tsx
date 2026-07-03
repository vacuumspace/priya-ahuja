import { Fragment, type ReactNode } from "react"

type Marker = { start: number; len: number; closeIdx: number }

function findMarker(text: string): Marker | null {
  for (let i = 0; i < text.length; i++) {
    if (text[i] !== "*") continue
    let runLen = 1
    while (text[i + runLen] === "*") runLen++
    const maxLen = Math.min(runLen, 3)
    for (let len = maxLen; len >= 1; len--) {
      const marker = "*".repeat(len)
      const closeIdx = text.indexOf(marker, i + len)
      if (closeIdx !== -1 && closeIdx > i + len) {
        return { start: i, len, closeIdx }
      }
    }
    // no valid closing marker found starting at this run; skip past it
    i += runLen - 1
  }
  return null
}

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  if (!text) return []
  const marker = findMarker(text)
  if (!marker) return [<Fragment key={`${keyPrefix}-t`}>{text}</Fragment>]

  const before = text.slice(0, marker.start)
  const inner = text.slice(marker.start + marker.len, marker.closeIdx)
  const after = text.slice(marker.closeIdx + marker.len)

  const innerNodes = renderInline(inner, `${keyPrefix}-in`)
  let wrapped: ReactNode
  if (marker.len === 3) {
    wrapped = (
      <strong key={`${keyPrefix}-b`}>
        <em>{innerNodes}</em>
      </strong>
    )
  } else if (marker.len === 2) {
    wrapped = <strong key={`${keyPrefix}-b`}>{innerNodes}</strong>
  } else {
    wrapped = <em key={`${keyPrefix}-i`}>{innerNodes}</em>
  }

  return [
    ...(before ? [<Fragment key={`${keyPrefix}-be`}>{before}</Fragment>] : []),
    wrapped,
    ...renderInline(after, `${keyPrefix}-af`),
  ]
}

export function FormattedMessage({ content }: { content: string }) {
  const lines = content.split("\n")
  const blocks: ReactNode[] = []
  let bulletBuffer: string[] = []

  function flushBullets(key: string) {
    if (bulletBuffer.length === 0) return
    blocks.push(
      <ul key={key} className="list-disc pl-4 space-y-0.5">
        {bulletBuffer.map((item, idx) => (
          <li key={idx}>{renderInline(item, `${key}-li${idx}`)}</li>
        ))}
      </ul>
    )
    bulletBuffer = []
  }

  lines.forEach((line, idx) => {
    const bulletMatch = line.trim().match(/^[*-]\s+(.+)/)
    if (bulletMatch) {
      bulletBuffer.push(bulletMatch[1])
      return
    }
    flushBullets(`ul-${idx}`)
    if (line.trim().length > 0) {
      blocks.push(<p key={`p-${idx}`}>{renderInline(line, `p-${idx}`)}</p>)
    }
  })
  flushBullets("ul-end")

  return <div className="space-y-1.5">{blocks}</div>
}
