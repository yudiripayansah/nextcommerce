'use client'

import { useState, useMemo, useRef } from 'react'
import Link from 'next/link'
import { useTenant } from '@/contexts/TenantContext'
import { formatCurrency } from '@/lib/helpers'
import ProductCard from './ProductCard'

const SORT_OPTIONS = [
  { value: 'relevant',    label: 'Paling Relevan', emoji: '✨' },
  { value: 'price-asc',  label: 'Harga: Terendah', emoji: '💸' },
  { value: 'price-desc', label: 'Harga: Tertinggi', emoji: '💎' },
  { value: 'name-asc',   label: 'Nama: A – Z', emoji: '🔤' },
  { value: 'name-desc',  label: 'Nama: Z – A', emoji: '🔡' },
]

const PER_PAGE = 12

function SortPanel({ open, onClose, sortBy, onSortChange, showInStock, onStockToggle }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        className="relative bg-white w-full sm:max-w-sm overflow-hidden shadow-2xl"
        style={{ borderRadius: 'var(--tm-radius-lg) var(--tm-radius-lg) 0 0', borderTopLeftRadius: 'var(--tm-radius-lg)', borderTopRightRadius: 'var(--tm-radius-lg)' }}
      >
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ background: 'var(--color-surface)', borderBottom: '2px dashed #e5e7eb' }}
        >
          <h3 className="text-base font-extrabold" style={{ color: 'var(--color-primary)' }}>
            🔧 Filter &amp; Urutkan
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center transition-colors"
            style={{ borderRadius: 'var(--tm-radius-pill)', background: '#fee2e2' }}
          >
            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Urutan</p>
            <div className="space-y-1">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onSortChange(opt.value)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all"
                  style={
                    sortBy === opt.value
                      ? { background: 'var(--color-primary)', color: 'var(--color-primary-fg)', borderRadius: 'var(--tm-radius)' }
                      : { borderRadius: 'var(--tm-radius)', color: 'var(--color-text)' }
                  }
                >
                  <span>{opt.emoji}</span>
                  <span>{opt.label}</span>
                  {sortBy === opt.value && (
                    <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div style={{ borderTop: '2px dashed #e5e7eb', paddingTop: '1rem' }}>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Filter Stok</p>
            <button
              onClick={onStockToggle}
              className="w-full flex items-center gap-3 px-3 py-3 text-sm font-semibold transition-all"
              style={{
                background: showInStock ? 'var(--color-primary)' : 'var(--color-surface)',
                color: showInStock ? 'var(--color-primary-fg)' : 'var(--color-text)',
                borderRadius: 'var(--tm-radius)',
              }}
            >
              <span>📦</span>
              <span>Stok Tersedia Saja</span>
              {showInStock && (
                <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="px-5 pb-6">
          <button
            onClick={onClose}
            className="w-full py-3 text-sm font-extrabold transition-opacity hover:opacity-90"
            style={{ background: 'var(--color-primary)', color: 'var(--color-primary-fg)', borderRadius: 'var(--tm-radius-pill)' }}
          >
            Terapkan ✓
          </button>
        </div>
      </div>
    </div>
  )
}

function SearchPagination({ page, total, perPage, onChange }) {
  const totalPages = Math.ceil(total / perPage)
  if (totalPages <= 1) return null

  function getPages() {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages = [1]
    if (page > 4) pages.push('...')
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i)
    if (page < totalPages - 3) pages.push('...')
    pages.push(totalPages)
    return pages
  }

  return (
    <div className="flex items-center justify-center gap-2 py-10 flex-wrap">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="px-4 py-2 text-sm font-bold disabled:opacity-30 transition-all"
        style={{ borderRadius: 'var(--tm-radius-pill)', background: 'var(--color-surface)', color: 'var(--color-text)' }}
      >
        ← Prev
      </button>
      {getPages().map((p, i) =>
        p === '...' ? (
          <span key={`d${i}`} className="px-2 text-gray-400 font-bold">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className="w-10 h-10 text-sm font-extrabold transition-all"
            style={
              p === page
                ? { background: 'var(--color-primary)', color: 'var(--color-primary-fg)', borderRadius: 'var(--tm-radius-pill)' }
                : { background: 'var(--color-surface)', color: 'var(--color-text)', borderRadius: 'var(--tm-radius-pill)' }
            }
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        className="px-4 py-2 text-sm font-bold disabled:opacity-30 transition-all"
        style={{ borderRadius: 'var(--tm-radius-pill)', background: 'var(--color-surface)', color: 'var(--color-text)' }}
      >
        Next →
      </button>
    </div>
  )
}

export default function HappyHobbySearchPage({ products, loading, query, onSearch }) {
  const { slug } = useTenant()
  const [inputVal, setInputVal] = useState(query)
  const [sortBy, setSortBy] = useState('relevant')
  const [showInStock, setShowInStock] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    let result = showInStock ? products.filter(p => (p.totalStock || 0) > 0) : [...products]
    switch (sortBy) {
      case 'price-asc':  result.sort((a, b) => (a.minPrice || 0) - (b.minPrice || 0)); break
      case 'price-desc': result.sort((a, b) => (b.minPrice || 0) - (a.minPrice || 0)); break
      case 'name-asc':   result.sort((a, b) => a.title.localeCompare(b.title)); break
      case 'name-desc':  result.sort((a, b) => b.title.localeCompare(a.title)); break
    }
    return result
  }, [products, showInStock, sortBy])

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const safePage = Math.min(page, Math.max(1, totalPages))
  const paginated = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)
  const activeFiltersCount = (showInStock ? 1 : 0) + (sortBy !== 'relevant' ? 1 : 0)

  function handleFilterChange(key, val) {
    if (key === 'sort') setSortBy(val)
    if (key === 'stock') setShowInStock(val)
    setPage(1)
  }

  function handleSearchSubmit(e) {
    e.preventDefault()
    setPage(1)
    onSearch(inputVal)
  }

  if (loading) {
    return (
      <div style={{ background: 'var(--color-bg)' }}>
        <div style={{ background: 'var(--color-surface)' }} className="py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="h-12 w-full max-w-md bg-gray-200 animate-pulse" style={{ borderRadius: 'var(--tm-radius-pill)' }} />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse" style={{ borderRadius: 'var(--tm-radius-lg)', overflow: 'hidden', background: '#fff' }}>
                <div className="aspect-[3/4] bg-gray-100" />
                <div className="p-3">
                  <div className="h-3.5 bg-gray-100 rounded mb-2 w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--color-bg)' }}>
      {/* Search hero */}
      <div style={{ background: 'var(--color-surface)' }} className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center gap-2 text-xs text-gray-400 mb-4">
            <Link href={`/${slug}`} className="hover:text-gray-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="font-bold" style={{ color: 'var(--color-primary)' }}>Pencarian</span>
          </nav>
          <h1 className="text-2xl font-extrabold mb-4" style={{ color: 'var(--color-text)' }}>
            🔍 Cari Produk
          </h1>
          <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-xl">
            <div
              className="flex-1 flex items-center gap-2 bg-white px-4 py-2.5"
              style={{ borderRadius: 'var(--tm-radius-pill)', border: '2px solid var(--color-primary)', boxShadow: 'var(--tm-card-shadow)' }}
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--color-primary)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="search"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Cari produk favoritmu..."
                className="flex-1 text-sm bg-transparent outline-none placeholder-gray-400 font-medium"
                style={{ color: 'var(--color-text)' }}
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-extrabold transition-opacity hover:opacity-90 flex-shrink-0"
              style={{ background: 'var(--color-primary)', color: 'var(--color-primary-fg)', borderRadius: 'var(--tm-radius-pill)' }}
            >
              Cari!
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Filter bar */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setPanelOpen(true)}
            className="flex items-center gap-2 text-sm font-bold px-4 py-2 transition-all"
            style={{
              background: activeFiltersCount > 0 ? 'var(--color-primary)' : 'var(--color-surface)',
              color: activeFiltersCount > 0 ? 'var(--color-primary-fg)' : 'var(--color-text)',
              borderRadius: 'var(--tm-radius-pill)',
              boxShadow: 'var(--tm-card-shadow)',
            }}
          >
            🔧 Filter &amp; Sort
            {activeFiltersCount > 0 && (
              <span className="bg-white text-xs font-extrabold w-5 h-5 rounded-full flex items-center justify-center" style={{ color: 'var(--color-primary)' }}>
                {activeFiltersCount}
              </span>
            )}
          </button>
          <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
            {query ? (
              <>{filtered.length} hasil untuk &ldquo;<span className="font-extrabold" style={{ color: 'var(--color-primary)' }}>{query}</span>&rdquo;</>
            ) : (
              <span className="text-gray-400">Ketik kata kunci untuk mencari</span>
            )}
          </p>
        </div>

        {/* Empty states */}
        {!query && (
          <div className="py-24 text-center">
            <p className="text-6xl mb-4">🔍</p>
            <p className="text-gray-500 font-medium">Ketikkan kata kunci untuk mencari produk</p>
          </div>
        )}

        {query && filtered.length === 0 && (
          <div className="py-20 text-center space-y-3">
            <p className="text-6xl mb-4">😅</p>
            <p className="font-extrabold text-lg" style={{ color: 'var(--color-text)' }}>Produk tidak ditemukan</p>
            <p className="text-sm text-gray-500">
              Coba kata kunci lain atau{' '}
              <Link href={`/${slug}/collections`} className="font-bold" style={{ color: 'var(--color-primary)' }}>
                jelajahi semua koleksi →
              </Link>
            </p>
            {showInStock && (
              <button
                onClick={() => handleFilterChange('stock', false)}
                className="text-sm font-bold px-4 py-2 mt-2"
                style={{ color: 'var(--color-primary-fg)', background: 'var(--color-primary)', borderRadius: 'var(--tm-radius-pill)' }}
              >
                Hapus filter stok
              </button>
            )}
          </div>
        )}

        {paginated.length > 0 && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {paginated.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <SearchPagination
              page={safePage}
              total={filtered.length}
              perPage={PER_PAGE}
              onChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            />
          </>
        )}
      </div>

      <SortPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        sortBy={sortBy}
        onSortChange={(v) => handleFilterChange('sort', v)}
        showInStock={showInStock}
        onStockToggle={() => handleFilterChange('stock', !showInStock)}
      />
    </div>
  )
}
