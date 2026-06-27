'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/helpers'
import { useTenant } from '@/contexts/TenantContext'

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Terbaru' },
  { value: 'price-asc',  label: 'Harga: Terendah' },
  { value: 'price-desc', label: 'Harga: Tertinggi' },
  { value: 'name-asc',   label: 'Nama: A – Z' },
  { value: 'name-desc',  label: 'Nama: Z – A' },
]

function ProductGridCard({ product, slug }) {
  const price =
    product.minPrice === product.maxPrice
      ? formatCurrency(product.minPrice)
      : `${formatCurrency(product.minPrice)} – ${formatCurrency(product.maxPrice)}`

  return (
    <Link href={`/${slug}/products/${product.handle}`} className="group block">
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

function SortPanel({ open, onClose, sortBy, onSortChange, showInStock, onStockToggle }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold tracking-widest uppercase">Filter &amp; Sort</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-5 py-4 space-y-5">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3">Urutan</p>
            <div className="space-y-1">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onSortChange(opt.value)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-colors hover:bg-gray-50"
                >
                  <span className={sortBy === opt.value ? 'font-semibold' : 'text-gray-700'}>{opt.label}</span>
                  {sortBy === opt.value && (
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--color-primary)' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3">Filter</p>
            <button
              onClick={onStockToggle}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors"
            >
              <span className={showInStock ? 'font-semibold' : 'text-gray-700'}>Stok Tersedia</span>
              <div
                className="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors"
                style={showInStock
                  ? { background: 'var(--color-primary)', borderColor: 'var(--color-primary)' }
                  : { borderColor: '#d1d5db' }}
              >
                {showInStock && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </button>
          </div>
        </div>

        <div className="px-5 pb-6">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ background: 'var(--color-primary)', color: 'var(--color-primary-fg)' }}
          >
            Terapkan
          </button>
        </div>
      </div>
    </div>
  )
}

export default function UrbanFashionCollectionDetailPage({ collection, products, loading }) {
  const { slug } = useTenant()
  const [showInStock, setShowInStock] = useState(false)
  const [sortBy, setSortBy] = useState('newest')
  const [panelOpen, setPanelOpen] = useState(false)

  const filtered = useMemo(() => {
    let result = showInStock ? products.filter(p => (p.totalStock || 0) > 0) : [...products]
    switch (sortBy) {
      case 'price-asc':  result.sort((a, b) => (a.minPrice || 0) - (b.minPrice || 0)); break
      case 'price-desc': result.sort((a, b) => (b.minPrice || 0) - (a.minPrice || 0)); break
      case 'name-asc':   result.sort((a, b) => a.title.localeCompare(b.title)); break
      case 'name-desc':  result.sort((a, b) => b.title.localeCompare(a.title)); break
      default: break
    }
    return result
  }, [products, showInStock, sortBy])

  const activeFiltersCount = (showInStock ? 1 : 0) + (sortBy !== 'newest' ? 1 : 0)
  const activeSortLabel = SORT_OPTIONS.find(o => o.value === sortBy)?.label

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="h-3 w-40 bg-gray-100 rounded mb-6 animate-pulse" />
        <div className="h-8 w-56 bg-gray-100 rounded mb-8 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
          {[...Array(8)].map((_, i) => <div key={i} className="aspect-[3/4] bg-gray-100 animate-pulse" />)}
        </div>
      </div>
    )
  }

  if (!collection) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-400 text-sm tracking-widest uppercase">Koleksi tidak ditemukan</p>
      </div>
    )
  }

  return (
    <div>
      {collection.image && (
        <div className="relative w-full h-48 md:h-64 overflow-hidden">
          <img src={collection.image} alt={collection.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/30" />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4">
        <nav className="flex items-center gap-2 py-4 text-xs text-gray-400">
          <Link href={`/${slug}`} className="hover:text-black transition-colors">Home</Link>
          <span>/</span>
          <span className="text-black font-medium uppercase tracking-wider">{collection.title}</span>
        </nav>

        <h1 className="text-2xl md:text-3xl font-bold tracking-wider uppercase text-black pb-5 border-b border-gray-200">
          {collection.title}
        </h1>

        {collection.description && (
          <p className="text-sm text-gray-500 mt-3">{collection.description}</p>
        )}

        <div className="flex items-center justify-between py-4 border-b border-gray-200">
          <button
            onClick={() => setPanelOpen(true)}
            className="flex items-center gap-2 text-xs tracking-widest uppercase hover:opacity-60 transition-opacity"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            Filter &amp; Sort
            {activeFiltersCount > 0 && (
              <span
                className="w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center"
                style={{ background: 'var(--color-primary)', color: 'var(--color-primary-fg)' }}
              >
                {activeFiltersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setShowInStock(!showInStock)}
            className="flex items-center gap-2 text-xs tracking-widest uppercase cursor-pointer hover:opacity-60 transition-opacity"
          >
            <div
              className="w-4 h-4 border flex items-center justify-center transition-colors flex-shrink-0"
              style={showInStock
                ? { background: 'var(--color-primary)', borderColor: 'var(--color-primary)' }
                : { borderColor: '#9ca3af' }}
            >
              {showInStock && (
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            Tampilkan Stok Tersedia
          </button>
        </div>

        <div className="flex items-center justify-between py-3">
          <p className="text-xs text-gray-400 tracking-wide">{filtered.length} produk</p>
          {sortBy !== 'newest' && (
            <p className="text-xs text-gray-500">
              Diurutkan: <span className="font-medium">{activeSortLabel}</span>
            </p>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <p className="text-gray-400 text-sm tracking-widest uppercase">
            {showInStock ? 'Tidak ada produk dengan stok tersedia' : 'Belum ada produk'}
          </p>
          {showInStock && (
            <button
              onClick={() => setShowInStock(false)}
              className="mt-4 text-xs tracking-widest uppercase"
              style={{ color: 'var(--color-primary)', borderBottom: '1px solid var(--color-primary)' }}
            >
              Tampilkan Semua
            </button>
          )}
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
            {filtered.map((product) => (
              <ProductGridCard key={product.id} product={product} slug={slug} />
            ))}
          </div>
        </div>
      )}

      <div className="pb-16" />

      <SortPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        sortBy={sortBy}
        onSortChange={setSortBy}
        showInStock={showInStock}
        onStockToggle={() => setShowInStock(!showInStock)}
      />
    </div>
  )
}
