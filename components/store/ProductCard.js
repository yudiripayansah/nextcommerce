import Link from 'next/link'
import { formatCurrency } from '@/lib/helpers'

export default function ProductCard({ product }) {
  const price =
    product.minPrice === product.maxPrice
      ? formatCurrency(product.minPrice)
      : `${formatCurrency(product.minPrice)} - ${formatCurrency(product.maxPrice)}`

  return (
    <Link href={`/products/${product.handle}`} className="group block">
      <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
        {product.featuredImage ? (
          <img
            src={product.featuredImage}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>
      <div className="mt-3">
        <p className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.title}
        </p>
        <p className="text-sm font-semibold text-gray-700 mt-1">{price}</p>
        {product.totalStock === 0 && (
          <p className="text-xs text-red-500 mt-0.5">Stok habis</p>
        )}
      </div>
    </Link>
  )
}
