const IN_APP_UA_PATTERN =
  /Instagram|LinkedIn|FBAN|FBAV|TikTok|BytedanceWebview|Twitter|Snapchat|Pinterest|MicroMessenger|Line\//

export function isInAppBrowser(): boolean {
  if (typeof navigator === 'undefined') return false
  return IN_APP_UA_PATTERN.test(navigator.userAgent)
}

export function isAndroid(): boolean {
  if (typeof navigator === 'undefined') return false
  return /Android/.test(navigator.userAgent)
}

export type InAppSource =
  | 'instagram'
  | 'linkedin'
  | 'facebook'
  | 'tiktok'
  | 'twitter'
  | 'snapchat'
  | 'pinterest'
  | 'wechat'
  | 'line'
  | 'other'

export function getInAppSource(): InAppSource {
  if (typeof navigator === 'undefined') return 'other'
  const ua = navigator.userAgent
  if (/Instagram/.test(ua)) return 'instagram'
  if (/LinkedIn/.test(ua)) return 'linkedin'
  if (/FBAN|FBAV/.test(ua)) return 'facebook'
  if (/TikTok|BytedanceWebview/.test(ua)) return 'tiktok'
  if (/Twitter/.test(ua)) return 'twitter'
  if (/Snapchat/.test(ua)) return 'snapchat'
  if (/Pinterest/.test(ua)) return 'pinterest'
  if (/MicroMessenger/.test(ua)) return 'wechat'
  if (/Line\//.test(ua)) return 'line'
  return 'other'
}

export function getAndroidIntentUrl(url: string): string {
  const stripped = url.replace(/^https?:\/\//, '')
  const fallback = encodeURIComponent(url)
  // No package= means Android hands this to the user's actual default
  // browser (Chrome, Samsung Internet, Firefox, etc.) instead of forcing
  // Chrome specifically, which fails when Chrome isn't installed.
  return `intent://${stripped}#Intent;scheme=https;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;S.browser_fallback_url=${fallback};end`
}
