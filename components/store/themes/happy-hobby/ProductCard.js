import Link from 'next/link'
import { formatCurrency } from '@/lib/helpers'

export default function HappyHobbyProductCard({ product }) {
  const price =
    product.minPrice === product.maxPrice
      ? formatCurrency(product.minPrice)
      : `${formatCurrency(product.minPrice)} – ${formatCurrency(product.maxPrice)}`

  return (
    <Link href={`/products/${product.handle}`} className="group block" style={{ borderRadius: 'var(--tm-radius)', overflow: 'hidden', background: '#fff', boxShadow: 'var(--tm-card-shadow)', transition: 'box-shadow 0.2s' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--tm-card-hover-shadow)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--tm-card-shadow)'}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden" style={{ background: 'var(--color-surface)' }}>
        {product.featuredImage ? (
          <img
            src={product.featuredImage}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Badges */}
        {product.totalStock === 0 && (
          <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 text-white" style={{ background: '#ef4444', borderRadius: 'var(--tm-radius-pill)' }}>
            Habis
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-sm font-semibold leading-snug mb-1 group-hover:opacity-70 transition-opacity" style={{ color: 'var(--color-text)' }}>
          {product.title}
        </p>
        <p className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>
          {price}
        </p>
      </div>
    </Link>
  )
}
