'use client'

import { useState, useEffect } from 'react'
import { useSettings } from '@/contexts/SettingsContext'

const SESSION_KEY = 'nc_pwa_dismissed'

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [visible, setVisible] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const settings = useSettings()

  useEffect(() => {
    // Already installed (standalone mode) → skip
    if (window.matchMedia('(display-mode: standalone)').matches) return
    // Dismissed this session → skip
    if (sessionStorage.getItem(SESSION_KEY)) return

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !('MSStream' in window)
    setIsIOS(ios)

    if (ios) {
      // iOS has no beforeinstallprompt — show manual instructions after delay
      const t = setTimeout(() => setVisible(true), 4000)
      return () => clearTimeout(t)
    }

    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      const t = setTimeout(() => setVisible(true), 3000)
      return () => clearTimeout(t)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  function dismiss() {
    sessionStorage.setItem(SESSION_KEY, '1')
    setVisible(false)
  }

  async function handleInstall() {
    if (!deferredPrompt) { dismiss(); return }
    deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setDeferredPrompt(null)
    dismiss()
  }

  if (!visible) return null

  const storeName = settings?.storeName || 'Toko'
  const initial = storeName.charAt(0).toUpperCase()

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-6 md:max-w-sm animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-bold text-lg"
              style={{ background: 'var(--color-primary)', color: 'var(--color-primary-fg)' }}
            >
              {initial}
            </div>
            <div className="flex-1 min-w-0 pr-2">
              <p className="font-semibold text-gray-900 text-sm leading-tight">{storeName}</p>
              {isIOS ? (
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Tap{' '}
                  <svg className="inline w-3.5 h-3.5 text-blue-500 align-middle" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 5l-1.42 1.42-1.59-1.59V16h-1.98V4.83L9.42 6.42 8 5l4-4 4 4zm4 5v11c0 1.1-.9 2-2 2H6c-1.11 0-2-.9-2-2V10c0-1.11.89-2 2-2h3v2H6v11h12V10h-3V8h3c1.1 0 2 .89 2 2z"/>
                  </svg>
                  {' '}lalu pilih{' '}
                  <span className="font-medium text-gray-800">Add to Home Screen</span>{' '}
                  untuk install.
                </p>
              ) : (
                <p className="text-xs text-gray-500 mt-1">
                  Install toko ini di home screen kamu
                </p>
              )}
            </div>
            <button
              onClick={dismiss}
              className="text-gray-400 hover:text-gray-600 -mt-1 -mr-1 p-1 shrink-0"
              aria-label="Tutup"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {!isIOS && deferredPrompt && (
          <div className="flex border-t border-gray-100">
            <button
              onClick={dismiss}
              className="flex-1 py-3 text-sm text-gray-600 font-medium hover:bg-gray-50 transition-colors"
            >
              Nanti saja
            </button>
            <div className="w-px bg-gray-100" />
            <button
              onClick={handleInstall}
              className="flex-1 py-3 text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ color: 'var(--color-primary)' }}
            >
              Install
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
