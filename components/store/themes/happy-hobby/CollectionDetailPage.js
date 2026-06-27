'use client'

import { useState } from 'react'
import Link from 'next/link'
import ProductCard from './ProductCard'
import { useTenant } from '@/contexts/TenantContext'

export default function HappyHobbyCollectionDetailPage({ collection, products, loading }) {
  const { slug } = useTenant()
  const [showInStock, setShowInStock] = useState(false)
  const filtered = showInStock ? products.filter(p => (p.totalStock || 0) > 0) : products

  if (loading) {
    return (
      <div style={{ background: 'var(--color-bg)' }}>
        <div style={{ background: 'var(--color-surface)' }} className="py-10">
          <div className="max-w-7xl mx-auto px-4">
            <div className="h-3 w-32 bg-gray-200 rounded-full mb-4 animate-pulse" />
            <div className="h-8 w-48 bg-gray-200 rounded-full animate-pulse" />
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

  if (!collection) {
    return (
      <div className="py-20 text-center" style={{ background: 'var(--color-bg)' }}>
        <p className="text-5xl mb-4">🔍</p>
        <p className="text-gray-500">Koleksi tidak ditemukan.</p>
        <Link
          href={`/${slug}/collections`}
          className="inline-block mt-4 text-sm font-bold"
          style={{ color: 'var(--color-primary)' }}
        >
          ← Semua Koleksi
        </Link>
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--color-bg)' }}>
      {collection.image && (
        <div className="relative w-full h-40 md:h-56 overflow-hidden">
          <img src={collection.image} alt={collection.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-0 flex items-center px-6 md:px-10">
            <h1 className="text-white text-2xl md:text-3xl font-extrabold">{collection.title}</h1>
          </div>
        </div>
      )}

      <div style={{ background: 'var(--color-surface)' }} className="py-7">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center gap-2 text-xs text-gray-400 mb-2">
            <Link href={`/${slug}`} className="hover:text-gray-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href={`/${slug}/collections`} className="hover:text-gray-600 transition-colors">Koleksi</Link>
            <span>/</span>
            <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>{collection.title}</span>
          </nav>
          {!collection.image && (
            <h1 className="text-3xl font-extrabold" style={{ color: 'var(--color-text)' }}>
              {collection.title}
            </h1>
          )}
          {collection.description && (
            <p className="text-sm text-gray-500 mt-1">{collection.description}</p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">{filtered.length} produk</p>
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <div
            onClick={() => setShowInStock(!showInStock)}
            className="w-5 h-5 flex items-center justify-center border-2 transition-colors cursor-pointer"
            style={{
              background: showInStock ? 'var(--color-primary)' : 'transparent',
              borderColor: showInStock ? 'var(--color-primary)' : '#d1d5db',
              borderRadius: 'var(--tm-radius-sm)',
            }}
          >
            {showInStock && (
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <span className="text-sm text-gray-600 font-medium">Tampilkan Stok Tersedia</span>
        </label>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-5xl mb-4">📦</p>
            <p className="text-gray-500 mb-3">
              {showInStock ? 'Tidak ada produk dengan stok tersedia.' : 'Belum ada produk.'}
            </p>
            {showInStock && (
              <button
                onClick={() => setShowInStock(false)}
                className="text-sm font-bold px-4 py-2"
                style={{ color: 'var(--color-primary)', borderRadius: 'var(--tm-radius-pill)' }}
              >
                Tampilkan Semua Produk
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
