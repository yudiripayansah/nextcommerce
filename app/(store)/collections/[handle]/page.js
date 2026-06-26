'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getCollectionByHandle } from '@/services/collections'
import { getProductsByCollection } from '@/services/products'
import { useTheme } from '@/contexts/ThemeContext'
import UrbanFashionCollectionDetailPage from '@/components/store/themes/urban-fashion/CollectionDetailPage'
import HappyHobbyCollectionDetailPage from '@/components/store/themes/happy-hobby/CollectionDetailPage'

export default function CollectionDetailPage() {
  const { handle } = useParams()
  const [collection, setCollection] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { template } = useTheme() || {}

  useEffect(() => {
    async function load() {
      const col = await getCollectionByHandle(handle)
      if (!col) { setLoading(false); return }
      setCollection(col)
      const prods = await getProductsByCollection(col.id)
      setProducts(prods)
      setLoading(false)
    }
    load()
  }, [handle])

  if (template === 'happy-hobby') {
    return (
      <HappyHobbyCollectionDetailPage
        collection={collection}
        products={products}
        loading={loading}
      />
    )
  }
  return (
    <UrbanFashionCollectionDetailPage
      collection={collection}
      products={products}
      loading={loading}
    />
  )
}
