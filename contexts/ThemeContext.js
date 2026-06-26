'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { getSettings } from '@/services/settings'
import { DEFAULT_THEME, applyThemeVars } from '@/lib/theme'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(DEFAULT_THEME.colors)

  useEffect(() => {
    async function load() {
      try {
        const settings = await getSettings()
        const colors = settings?.theme || DEFAULT_THEME.colors
        setThemeState(colors)
        applyThemeVars(colors)
        try { localStorage.setItem('store_theme', JSON.stringify(colors)) } catch {}
      } catch {
        applyThemeVars(DEFAULT_THEME.colors)
      }
    }
    load()
  }, [])

  function setTheme(colors) {
    setThemeState(colors)
    applyThemeVars(colors)
    try { localStorage.setItem('store_theme', JSON.stringify(colors)) } catch {}
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
