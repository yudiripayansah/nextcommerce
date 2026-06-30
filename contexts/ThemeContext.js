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
  // Always start with the same stable value on server and client to avoid hydration mismatch.
  // useLayoutEffect will apply the correct theme from localStorage before first paint.
  const [template, setTemplate] = useState('urban-fashion')
  const [colors, setColors] = useState(DEFAULT_PRESET.colors)
  const [ready, setReady] = useState(false)
  const settings = useSettings()
  const { tenant } = useTenant() || {}
  const slug = tenant?.slug

  useLayoutEffect(() => {
    try {
      const local = slug ? readLocalTheme(slug) : null
      if (local) {
        setTemplate(local.template)
        setColors(local.colors)
        applyThemeVars(local.colors)
        applyTemplate(local.template)
      }
    } catch {}
    setReady(true)
  }, [slug])

  // Safety fallback: if useLayoutEffect never fires (edge case), show content after 800ms
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 800)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!settings) return
    try {
      const { template: t, colors: c } = parseStoredTheme(settings.theme)
      setTemplate(t)
      setColors(c)
      applyThemeVars(c)
      applyTemplate(t)
      localStorage.setItem(getStorageKey(slug), JSON.stringify({ template: t, ...c }))
    } catch {}
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
