export function isInAppBrowser(): boolean {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  return /Instagram|LinkedIn|FBAN|FBAV/.test(ua)
}

export function isAndroid(): boolean {
  if (typeof navigator === 'undefined') return false
  return /Android/.test(navigator.userAgent)
}

export function getInAppSource(): 'instagram' | 'linkedin' | 'other' {
  if (typeof navigator === 'undefined') return 'other'
  const ua = navigator.userAgent
  if (/Instagram/.test(ua)) return 'instagram'
  if (/LinkedIn/.test(ua)) return 'linkedin'
  return 'other'
}

export function getAndroidIntentUrl(url: string): string {
  const stripped = url.replace(/^https?:\/\//, '')
  const fallback = encodeURIComponent(url)
  return `intent://${stripped}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${fallback};end`
}
