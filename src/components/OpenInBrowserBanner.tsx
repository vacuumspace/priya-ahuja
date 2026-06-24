'use client'

import { useEffect, useState } from 'react'
import { isInAppBrowser, isAndroid, getAndroidIntentUrl, getInAppSource } from '@/lib/inAppBrowser'

const DISMISSED_KEY = 'open-in-browser-dismissed'

const iosInstructions: Record<ReturnType<typeof getInAppSource>, string> = {
  instagram: 'Tap ··· → Open in Safari',
  linkedin: 'Tap ··· → Open in external browser',
  other: 'Tap the menu → Open in Safari',
}

export function OpenInBrowserBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!isInAppBrowser()) return
    if (sessionStorage.getItem(DISMISSED_KEY)) return

    if (isAndroid()) {
      window.location.href = getAndroidIntentUrl(window.location.href)
      return
    }

    // iOS: can't auto-redirect, show banner instead
    setShow(true)
  }, [])

  if (!show) return null

  const source = getInAppSource()
  const instruction = iosInstructions[source]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm text-white px-4 py-3 text-sm flex items-center justify-between gap-3">
      <p className="font-medium">
        For the best experience —{' '}
        <span className="text-gray-300">{instruction}</span>
      </p>
      <button
        onClick={() => {
          sessionStorage.setItem(DISMISSED_KEY, '1')
          setShow(false)
        }}
        aria-label="Dismiss"
        className="shrink-0 text-gray-400 hover:text-white transition-colors text-lg leading-none"
      >
        ✕
      </button>
    </div>
  )
}
