'use client'

import Link from 'next/link'
import { formatCurrency } from '@/lib/helpers'
import { useTenant } from '@/contexts/TenantContext'

export default function ProductCard({ product }) {
  const { slug } = useTenant()
  const price =
    product.minPrice === product.maxPrice
      ? formatCurrency(product.minPrice)
      : `${formatCurrency(product.minPrice)} – ${formatCurrency(product.maxPrice)}`

  return (
    <Link href={`/${slug}/products/${product.handle}`} className="group block">
      <div className="relative overflow-hidden aspect-[3/4]" style={{ background: 'var(--color-surface)' }}>
        {product.featuredImage ? (
          <img
            src={product.featuredImage}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--color-border)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {product.totalStock === 0 && (
          <div className="absolute top-3 left-3">
            <span
              className="text-[10px] tracking-widest uppercase px-2 py-1"
              style={{ background: 'var(--color-surface)', color: 'var(--color-text)' }}
            >
              Habis
            </span>
          </div>
        )}
      </div>
      <div className="mt-3 space-y-1">
        <p className="text-xs tracking-wider uppercase group-hover:opacity-60 transition-opacity" style={{ color: 'var(--color-text-muted)' }}>
          {product.collectionTitle || ''}
        </p>
        <p className="text-sm leading-snug group-hover:opacity-60 transition-opacity" style={{ color: 'var(--color-text)' }}>
          {product.title}
        </p>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{price}</p>
      </div>
    </Link>
  )
}
