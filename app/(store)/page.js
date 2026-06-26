'use client'

import { useEffect, useState } from 'react'
import { getProducts } from '@/services/products'
import { getCollections } from '@/services/collections'
import { useTheme } from '@/contexts/ThemeContext'
import UrbanFashionHomePage from '@/components/store/themes/urban-fashion/HomePage'
import HappyHobbyHomePage from '@/components/store/themes/happy-hobby/HomePage'

export default function HomePage() {
  const [products, setProducts] = useState([])
  const [collections, setCollections] = useState([])
  const { template } = useTheme() || {}

  useEffect(() => {
    getProducts({ status: 'active', pageLimit: 8 }).then(setProducts).catch(() => {})
    getCollections({ status: 'active' }).then(setCollections).catch(() => {})
  }, [])

  if (template === 'happy-hobby') {
    return <HappyHobbyHomePage products={products} collections={collections} />
  }
  return <UrbanFashionHomePage products={products} collections={collections} />
}
