'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useTenant } from '@/contexts/TenantContext'
import { useTheme } from '@/contexts/ThemeContext'
import { getCollectionByHandle } from '@/services/collections'
import { getProductsByCollection } from '@/services/products'
import UrbanFashionCollectionDetailPage from '@/components/store/themes/urban-fashion/CollectionDetailPage'
import HappyHobbyCollectionDetailPage from '@/components/store/themes/happy-hobby/CollectionDetailPage'

export default function CollectionPageShell() {
  const { handle } = useParams()
  const [collection, setCollection] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { tenant } = useTenant() || {}
  const { template } = useTheme() || {}

  useEffect(() => {
    if (!tenant?.id) return
    async function load() {
      const col = await getCollectionByHandle(tenant.id, handle)
      if (!col) { setLoading(false); return }
      setCollection(col)
      const prods = await getProductsByCollection(tenant.id, col.id)
      setProducts(prods)
      setLoading(false)
    }
    load()
  }, [tenant?.id, handle])

  if (template === 'happy-hobby') {
    return <HappyHobbyCollectionDetailPage collection={collection} products={products} loading={loading} />
  }
  return <UrbanFashionCollectionDetailPage collection={collection} products={products} loading={loading} />
}
