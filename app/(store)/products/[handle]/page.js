'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import ProductDetailClient from './ProductDetailClient'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { getProductByHandle } from '@/services/products'

export default function ProductPage() {
  const { handle } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProductByHandle(handle).then(setProduct).finally(() => setLoading(false))
  }, [handle])

  if (loading) return <LoadingSpinner className="py-24" />

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-gray-500">Produk tidak ditemukan.</p>
      </div>
    )
  }

  return <ProductDetailClient product={product} />
}
