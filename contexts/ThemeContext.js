'use client'

import { createContext, useContext, useEffect, useLayoutEffect, useState } from 'react'
import { useSettings } from '@/contexts/SettingsContext'
import { useTenant } from '@/contexts/TenantContext'
import { DEFAULT_PRESET, applyThemeVars, applyTemplate, parseStoredTheme } from '@/lib/theme'

const ThemeContext = createContext(null)

function getStorageKey(slug) {
  return slug ? `store_theme_${slug}` : 'store_theme'
}

function readLocalTheme(slug) {
  try {
    const raw = localStorage.getItem(getStorageKey(slug))
    if (raw) return parseStoredTheme(JSON.parse(raw))
  } catch {}
  return null
}

export function ThemeProvider({ children }) {
  // Init from what the inline script already set on <html> to avoid hydration flash
  const [template, setTemplate] = useState(() => {
    if (typeof window === 'undefined') return 'urban-fashion'
    return document.documentElement.getAttribute('data-template') || 'urban-fashion'
  })
  const [colors, setColors] = useState(DEFAULT_PRESET.colors)
  const [ready, setReady] = useState(false)
  const settings = useSettings()
  const { tenant } = useTenant() || {}
  const slug = tenant?.slug

  useLayoutEffect(() => {
    // Skip when slug is unknown — inline script already handled the initial render.
    // Reading the no-slug key here would pick up stale data from a different tenant.
    if (!slug) {
      setReady(true)
      return
    }
    const local = readLocalTheme(slug)
    if (local) {
      setTemplate(local.template)
      setColors(local.colors)
      applyThemeVars(local.colors)
      applyTemplate(local.template)
    }
    setReady(true)
  }, [slug])

  useEffect(() => {
    if (!settings) return
    const { template: t, colors: c } = parseStoredTheme(settings.theme)
    setTemplate(t)
    setColors(c)
    applyThemeVars(c)
    applyTemplate(t)
    try { localStorage.setItem(getStorageKey(slug), JSON.stringify({ template: t, ...c })) } catch {}
  }, [settings, slug])

  function setTheme({ template: t, colors: c }) {
    setTemplate(t)
    setColors(c)
    applyThemeVars(c)
    applyTemplate(t)
    try { localStorage.setItem(getStorageKey(slug), JSON.stringify({ template: t, ...c })) } catch {}
  }

  return (
    <ThemeContext.Provider value={{ template, colors, setTheme }}>
      {!ready && (
        <style dangerouslySetInnerHTML={{ __html: '#store-shell{visibility:hidden}' }} />
      )}
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
