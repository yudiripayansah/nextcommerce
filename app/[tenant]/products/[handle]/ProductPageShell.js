'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useTenant } from '@/contexts/TenantContext'
import { getProductByHandle } from '@/services/products'
import ProductDetailClient from './ProductDetailClient'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function ProductPageShell() {
  const { handle } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const { tenant } = useTenant() || {}

  useEffect(() => {
    if (!tenant?.id) return
    getProductByHandle(tenant.id, handle).then(setProduct).finally(() => setLoading(false))
  }, [tenant?.id, handle])

  if (loading) return <LoadingSpinner className="py-24" />

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <p style={{ color: 'var(--color-text-muted)' }}>Produk tidak ditemukan.</p>
      </div>
    )
  }

  return <ProductDetailClient product={product} />
}
