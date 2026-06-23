'use client'

import { useEffect, useState } from 'react'
import { isInAppBrowser, isAndroid, getAndroidIntentUrl } from '@/lib/inAppBrowser'

export function OpenInBrowserBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!isInAppBrowser()) return

    if (isAndroid()) {
      window.location.href = getAndroidIntentUrl(window.location.href)
      return
    }

    // iOS: can't auto-redirect, show banner instead
    setShow(true)
  }, [])

  if (!show) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm text-white px-4 py-3 text-center text-sm">
      <p className="font-medium">
        For the best experience, open in Safari —{' '}
        <span className="text-gray-300">tap <strong>···</strong> → <strong>Open in Safari</strong></span>
      </p>
    </div>
  )
}
