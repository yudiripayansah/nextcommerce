'use client'

import { useEffect } from 'react'
import { useSettings } from '@/contexts/SettingsContext'

export default function FaviconSync() {
  const settings = useSettings()

  useEffect(() => {
    if (!settings?.favicon) return
    let link = document.querySelector("link[rel~='icon']")
    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      document.head.appendChild(link)
    }
    link.href = settings.favicon
  }, [settings?.favicon])

  return null
}
