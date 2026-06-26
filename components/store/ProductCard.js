'use client'

import { useTheme } from '@/contexts/ThemeContext'
import UrbanFashionProductCard from './themes/urban-fashion/ProductCard'
import HappyHobbyProductCard from './themes/happy-hobby/ProductCard'

export default function ProductCard({ product }) {
  const ctx = useTheme()
  if (ctx?.template === 'happy-hobby') return <HappyHobbyProductCard product={product} />
  return <UrbanFashionProductCard product={product} />
}
