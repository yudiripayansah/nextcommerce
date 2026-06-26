'use client'

import { createContext, useContext, useEffect, useLayoutEffect, useState } from 'react'
import { useSettings } from '@/contexts/SettingsContext'
import { DEFAULT_PRESET, applyThemeVars, applyTemplate, parseStoredTheme } from '@/lib/theme'

const ThemeContext = createContext(null)

function readLocalTheme() {
  try {
    const raw = localStorage.getItem('store_theme')
    if (raw) return parseStoredTheme(JSON.parse(raw))
  } catch {}
  return null
}

export function ThemeProvider({ children }) {
  const [template, setTemplate] = useState('urban-fashion')
  const [colors, setColors] = useState(DEFAULT_PRESET.colors)
  // false = hide store shell until correct theme is applied (prevents Urban Fashion flash)
  const [ready, setReady] = useState(false)
  const settings = useSettings()

  // Runs synchronously before first browser paint.
  // Reads localStorage and applies the stored theme immediately.
  // Sets ready=true so the store shell becomes visible only after correct theme is set.
  useLayoutEffect(() => {
    const local = readLocalTheme()
    if (local) {
      setTemplate(local.template)
      setColors(local.colors)
      applyThemeVars(local.colors)
      applyTemplate(local.template)
    }
    setReady(true)
  }, [])

  // Sync from Firestore via SettingsContext — no separate getSettings() fetch needed.
  // When settings arrive, apply them and update localStorage for next visit.
  useEffect(() => {
    if (!settings) return
    const { template: t, colors: c } = parseStoredTheme(settings.theme)
    setTemplate(t)
    setColors(c)
    applyThemeVars(c)
    applyTemplate(t)
    try { localStorage.setItem('store_theme', JSON.stringify({ template: t, ...c })) } catch {}
  }, [settings])

  function setTheme({ template: t, colors: c }) {
    setTemplate(t)
    setColors(c)
    applyThemeVars(c)
    applyTemplate(t)
    try { localStorage.setItem('store_theme', JSON.stringify({ template: t, ...c })) } catch {}
  }

  return (
    <ThemeContext.Provider value={{ template, colors, setTheme }}>
      {/* Hide store shell until useLayoutEffect has resolved the correct theme.
          This prevents the server-rendered Urban Fashion HTML from being visible
          before React applies the localStorage theme. */}
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
