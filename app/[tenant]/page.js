'use client'

import { useEffect, useState } from 'react'
import { useTenant } from '@/contexts/TenantContext'
import { useTheme } from '@/contexts/ThemeContext'
import { getProducts } from '@/services/products'
import { getCollections } from '@/services/collections'
import UrbanFashionHomePage from '@/components/store/themes/urban-fashion/HomePage'
import HappyHobbyHomePage from '@/components/store/themes/happy-hobby/HomePage'

export default function HomePage() {
  const [products, setProducts] = useState([])
  const [collections, setCollections] = useState([])
  const { tenant } = useTenant() || {}
  const { template } = useTheme() || {}

  useEffect(() => {
    if (!tenant?.id) return
    getProducts(tenant.id, { status: 'active', pageLimit: 8 }).then(setProducts).catch(() => {})
    getCollections(tenant.id, { status: 'active' }).then(setCollections).catch(() => {})
  }, [tenant?.id])

  if (template === 'happy-hobby') {
    return <HappyHobbyHomePage products={products} collections={collections} />
  }
  return <UrbanFashionHomePage products={products} collections={collections} />
}
