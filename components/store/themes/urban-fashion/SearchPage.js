'use client'

import { useState, useMemo, useRef } from 'react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/helpers'
import { useTenant } from '@/contexts/TenantContext'

const SORT_OPTIONS = [
  { value: 'relevant',    label: 'Paling Relevan' },
  { value: 'price-asc',  label: 'Harga: Terendah' },
  { value: 'price-desc', label: 'Harga: Tertinggi' },
  { value: 'name-asc',   label: 'Nama: A – Z' },
  { value: 'name-desc',  label: 'Nama: Z – A' },
]

const PER_PAGE = 12

function ProductCard({ product, slug }) {
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
            <span className="text-[10px] tracking-widest uppercase px-2 py-1" style={{ background: 'var(--color-surface)', color: 'var(--color-text)' }}>Habis</span>
          </div>
        )}
      </div>
      <div className="pt-3 pb-5 px-0.5">
        <p className="text-sm leading-snug mb-1 group-hover:opacity-60 transition-opacity" style={{ color: 'var(--color-text)' }}>{product.title}</p>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{price}</p>
      </div>
    </Link>
  )
}

function SortPanel({ open, onClose, sortBy, onSortChange, showInStock, onStockToggle }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-xl" style={{ background: 'var(--color-surface)' }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <h3 className="text-sm font-semibold tracking-widest uppercase" style={{ color: 'var(--color-text)' }}>Filter &amp; Sort</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:opacity-60 transition-opacity" style={{ color: 'var(--color-text-muted)' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-5 py-4 space-y-5">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: 'var(--color-text-muted)' }}>Urutan</p>
            <div className="space-y-1">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onSortChange(opt.value)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-opacity hover:opacity-70"
                  style={{ color: 'var(--color-text)' }}
                >
                  <span className={sortBy === opt.value ? 'font-semibold' : ''}>{opt.label}</span>
                  {sortBy === opt.value && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--color-primary)' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
          <div className="pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: 'var(--color-text-muted)' }}>Filter</p>
            <button
              onClick={onStockToggle}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm hover:opacity-70 transition-opacity"
              style={{ color: 'var(--color-text)' }}
            >
              <span className={showInStock ? 'font-semibold' : ''}>Stok Tersedia</span>
              <div
                className="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors"
                style={showInStock
                  ? { background: 'var(--color-primary)', borderColor: 'var(--color-primary)' }
                  : { borderColor: 'var(--color-border)' }}
              >
                {showInStock && (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--color-primary-fg)' }}>
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
    <div className="flex items-center justify-center gap-1 py-10">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="px-4 py-2 text-xs tracking-widest uppercase hover:opacity-60 disabled:opacity-30 transition-opacity"
        style={{ color: 'var(--color-text)' }}
      >
        ← Prev
      </button>
      {getPages().map((p, i) =>
        p === '...' ? (
          <span key={`d${i}`} className="px-2" style={{ color: 'var(--color-text-muted)' }}>…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className="w-9 h-9 text-sm font-medium transition-all"
            style={p === page
              ? { background: 'var(--color-primary)', color: 'var(--color-primary-fg)' }
              : { color: 'var(--color-text)' }}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        className="px-4 py-2 text-xs tracking-widest uppercase hover:opacity-60 disabled:opacity-30 transition-opacity"
        style={{ color: 'var(--color-text)' }}
      >
        Next →
      </button>
    </div>
  )
}

export default function UrbanFashionSearchPage({ products, loading, query, onSearch }) {
  const { slug } = useTenant()
  const [inputVal, setInputVal] = useState(query)
  const [sortBy, setSortBy] = useState('relevant')
  const [showInStock, setShowInStock] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const [page, setPage] = useState(1)
  const inputRef = useRef(null)

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
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="h-10 w-full max-w-md rounded mb-8 animate-pulse" style={{ background: 'var(--color-surface)' }} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
          {[...Array(8)].map((_, i) => <div key={i} className="aspect-[3/4] animate-pulse" style={{ background: 'var(--color-surface)' }} />)}
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Search header */}
      <div style={{ borderBottom: '1px solid var(--color-border)' }}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <nav className="flex items-center gap-2 text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>
            <Link href={`/${slug}`} className="hover:opacity-100 transition-opacity">Home</Link>
            <span>/</span>
            <span style={{ color: 'var(--color-text)' }}>Pencarian</span>
          </nav>
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-3 max-w-xl">
            <div className="flex-1 flex items-center gap-2 pb-1" style={{ borderBottom: '2px solid var(--color-text)' }}>
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--color-text-muted)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="search"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Cari produk..."
                className="flex-1 text-base bg-transparent outline-none"
                style={{ color: 'var(--color-text)' }}
              />
            </div>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs tracking-widest uppercase font-semibold transition-opacity hover:opacity-80"
              style={{ background: 'var(--color-primary)', color: 'var(--color-primary-fg)' }}
            >
              Cari
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Filter bar */}
        <div className="flex items-center justify-between py-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <button
            onClick={() => setPanelOpen(true)}
            className="flex items-center gap-2 text-xs tracking-widest uppercase hover:opacity-60 transition-opacity"
            style={{ color: 'var(--color-text)' }}
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
          <p className="text-xs tracking-wide" style={{ color: 'var(--color-text-muted)' }}>
            {query ? (
              <>{filtered.length} hasil untuk &ldquo;<span className="font-medium" style={{ color: 'var(--color-text)' }}>{query}</span>&rdquo;</>
            ) : (
              'Masukkan kata kunci pencarian'
            )}
          </p>
        </div>

        {!query && (
          <div className="py-24 text-center">
            <p className="text-sm tracking-widest uppercase" style={{ color: 'var(--color-text-muted)' }}>Ketikkan kata kunci di atas untuk mencari produk</p>
          </div>
        )}

        {query && filtered.length === 0 && (
          <div className="py-24 text-center space-y-3">
            <p className="text-sm tracking-widest uppercase" style={{ color: 'var(--color-text-muted)' }}>Tidak ada produk ditemukan</p>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Coba kata kunci lain atau{' '}
              <Link href={`/${slug}/collections`} className="underline" style={{ color: 'var(--color-primary)' }}>
                jelajahi koleksi
              </Link>
            </p>
            {showInStock && (
              <button
                onClick={() => handleFilterChange('stock', false)}
                className="text-xs tracking-widest uppercase"
                style={{ color: 'var(--color-primary)', borderBottom: '1px solid var(--color-primary)' }}
              >
                Hapus filter stok
              </button>
            )}
          </div>
        )}

        {paginated.length > 0 && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 pt-4">
              {paginated.map((product) => (
                <ProductCard key={product.id} product={product} slug={slug} />
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
