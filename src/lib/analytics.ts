// Returns a stable random session ID stored in localStorage
function getSessionId(): string {
  if (typeof window === "undefined") return ""
  let id = localStorage.getItem("_asid")
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36)
    localStorage.setItem("_asid", id)
  }
  return id
}

function send(payload: Record<string, string>) {
  // fire-and-forget, never throw
  fetch("/api/analytics/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, sessionId: getSessionId() }),
  }).catch(() => {})
}

export function trackPageView(page: string) {
  send({ type: "pageview", page })
}

export function trackCta(ctaId: string, page?: string) {
  send({ type: "cta_click", ctaId, page: page ?? (typeof window !== "undefined" ? window.location.pathname : "") })
}
