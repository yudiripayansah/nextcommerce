'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { searchProducts } from '@/services/products'
import { formatCurrency } from '@/lib/helpers'

function ProductCard({ product }) {
  const price =
    product.minPrice === product.maxPrice
      ? formatCurrency(product.minPrice)
      : `${formatCurrency(product.minPrice)} – ${formatCurrency(product.maxPrice)}`

  return (
    <Link href={`/products/${product.handle}`} className="group block">
      <div className="relative overflow-hidden bg-stone-100 aspect-[3/4]">
        {product.featuredImage ? (
          <img
            src={product.featuredImage}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {product.totalStock === 0 && (
          <div className="absolute top-3 left-3">
            <span className="bg-white text-black text-[10px] tracking-widest uppercase px-2 py-1">Habis</span>
          </div>
        )}
      </div>
      <div className="pt-3 pb-5 px-0.5">
        <p className="text-sm text-gray-900 leading-snug mb-1 group-hover:opacity-60 transition-opacity">{product.title}</p>
        <p className="text-sm text-gray-600">{price}</p>
      </div>
    </Link>
  )
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const q = searchParams.get('q') || ''

  const [inputValue, setInputValue] = useState(q)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const doSearch = useCallback(async (term) => {
    if (!term.trim()) return
    setLoading(true)
    setSearched(true)
    try {
      const data = await searchProducts(term.trim())
      setResults(data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    setInputValue(q)
    if (q) doSearch(q)
  }, [q, doSearch])

  function handleSubmit(e) {
    e.preventDefault()
    const term = inputValue.trim()
    if (!term) return
    router.push(`/search?q=${encodeURIComponent(term)}`)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Search header */}
      <div className="mb-8">
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-xl">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="search"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Cari produk..."
              autoFocus
              className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-transparent focus:ring-2 transition-all"
              style={{ '--tw-ring-color': 'var(--color-primary)' }}
            />
          </div>
          <button
            type="submit"
            className="px-5 py-3 rounded-xl text-sm font-medium transition-opacity hover:opacity-90 whitespace-nowrap"
            style={{ background: 'var(--color-primary)', color: 'var(--color-primary-fg)' }}
          >
            Cari
          </button>
        </form>
      </div>

      {/* Loading */}
      {loading && (
        <div>
          <div className="h-4 w-32 bg-gray-100 rounded mb-6 animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
            {[...Array(8)].map((_, i) => (
              <div key={i}>
                <div className="aspect-[3/4] bg-gray-100 animate-pulse rounded" />
                <div className="mt-3 h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
                <div className="mt-2 h-3 w-1/2 bg-gray-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {!loading && searched && (
        <>
          <p className="text-xs text-gray-400 tracking-widest uppercase mb-6">
            {results.length === 0
              ? `Tidak ada hasil untuk "${q}"`
              : `${results.length} hasil untuk "${q}"`}
          </p>

          {results.length === 0 ? (
            <div className="py-16 text-center">
              <svg className="w-12 h-12 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-gray-400 text-sm mb-2">Produk tidak ditemukan</p>
              <p className="text-gray-400 text-xs mb-6">Coba kata kunci yang berbeda</p>
              <Link
                href="/collections"
                className="text-xs tracking-widest uppercase border-b transition-opacity hover:opacity-60"
                style={{ color: 'var(--color-primary)', borderColor: 'var(--color-primary)' }}
              >
                Lihat Semua Produk
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Initial state — no query yet */}
      {!loading && !searched && !q && (
        <div className="py-16 text-center">
          <svg className="w-12 h-12 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-gray-400 text-sm">Ketik nama produk untuk mulai mencari</p>
        </div>
      )}

      <div className="pb-16" />
    </div>
  )
}
