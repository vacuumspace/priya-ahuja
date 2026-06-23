export function isInAppBrowser(): boolean {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  return /Instagram|LinkedIn|FBAN|FBAV/.test(ua)
}

export function isAndroid(): boolean {
  if (typeof navigator === 'undefined') return false
  return /Android/.test(navigator.userAgent)
}

export function getAndroidIntentUrl(url: string): string {
  const stripped = url.replace(/^https?:\/\//, '')
  return `intent://${stripped}#Intent;scheme=https;package=com.android.chrome;end`
}
