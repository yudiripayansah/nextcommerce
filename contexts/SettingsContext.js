'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { getSettings } from '@/services/settings'

const SettingsContext = createContext(null)

export function SettingsProvider({ tenantId, children }) {
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    if (!tenantId) return
    getSettings(tenantId).then(setSettings).catch(() => {})
  }, [tenantId])

  return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  return useContext(SettingsContext)
}
