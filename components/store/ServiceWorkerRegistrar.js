'use client'

import { useEffect } from 'react'

export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js', { scope: '/' })
        .catch((err) => console.warn('[SW register]', err))
    }
  }, [])
  return null
}
