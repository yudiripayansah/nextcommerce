'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { getTenantBySlug } from '@/services/tenants'

const TenantContext = createContext(null)

export function TenantProvider({ slug, children }) {
  const [tenant, setTenant] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    getTenantBySlug(slug)
      .then(setTenant)
      .finally(() => setLoading(false))
  }, [slug])

  return (
    <TenantContext.Provider value={{ tenant, loading, slug }}>
      {children}
    </TenantContext.Provider>
  )
}

export function useTenant() {
  return useContext(TenantContext)
}
