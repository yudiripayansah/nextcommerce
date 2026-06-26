'use client'

import { useEffect, useState } from 'react'
import { getCollections } from '@/services/collections'
import { useTheme } from '@/contexts/ThemeContext'
import UrbanFashionCollectionsPage from '@/components/store/themes/urban-fashion/CollectionsPage'
import HappyHobbyCollectionsPage from '@/components/store/themes/happy-hobby/CollectionsPage'

export default function CollectionsPage() {
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)
  const { template } = useTheme() || {}

  useEffect(() => {
    getCollections({ status: 'active' }).then(setCollections).finally(() => setLoading(false))
  }, [])

  if (template === 'happy-hobby') {
    return <HappyHobbyCollectionsPage collections={collections} loading={loading} />
  }
  return <UrbanFashionCollectionsPage collections={collections} loading={loading} />
}
