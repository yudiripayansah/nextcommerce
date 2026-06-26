'use client'

import { useEffect, useState } from 'react'
import { useTenant } from '@/contexts/TenantContext'
import { useTheme } from '@/contexts/ThemeContext'
import { getCollections } from '@/services/collections'
import UrbanFashionCollectionsPage from '@/components/store/themes/urban-fashion/CollectionsPage'
import HappyHobbyCollectionsPage from '@/components/store/themes/happy-hobby/CollectionsPage'

export default function CollectionsPage() {
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)
  const { tenant } = useTenant() || {}
  const { template } = useTheme() || {}

  useEffect(() => {
    if (!tenant?.id) return
    getCollections(tenant.id, { status: 'active' }).then(setCollections).finally(() => setLoading(false))
  }, [tenant?.id])

  if (template === 'happy-hobby') {
    return <HappyHobbyCollectionsPage collections={collections} loading={loading} />
  }
  return <UrbanFashionCollectionsPage collections={collections} loading={loading} />
}
