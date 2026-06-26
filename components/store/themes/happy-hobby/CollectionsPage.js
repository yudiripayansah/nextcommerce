'use client'

import Link from 'next/link'

export default function HappyHobbyCollectionsPage({ collections, loading }) {
  return (
    <div style={{ background: 'var(--color-bg)' }}>
      {/* Header */}
      <div style={{ background: 'var(--color-surface)' }} className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center gap-2 text-xs text-gray-400 mb-3">
            <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>Koleksi</span>
          </nav>
          <h1 className="text-3xl font-extrabold" style={{ color: 'var(--color-text)' }}>
            Semua Koleksi
          </h1>
          {!loading && (
            <p className="text-sm text-gray-500 mt-1">{collections.length} koleksi tersedia</p>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8 pb-16">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse" style={{ borderRadius: 'var(--tm-radius-lg)' }}>
                <div className="aspect-[3/4] bg-gray-100" style={{ borderRadius: 'var(--tm-radius-lg)' }} />
                <div className="p-3">
                  <div className="h-3.5 bg-gray-100 rounded mb-2 w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : collections.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-5xl mb-4">📦</p>
            <p className="text-gray-500">Belum ada koleksi tersedia.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {collections.map((col) => (
              <Link
                key={col.id}
                href={`/collections/${col.handle}`}
                className="group block"
                style={{ borderRadius: 'var(--tm-radius-lg)', overflow: 'hidden', background: '#fff', boxShadow: 'var(--tm-card-shadow)', transition: 'box-shadow 0.2s, transform 0.2s' }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = 'var(--tm-card-hover-shadow)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = 'var(--tm-card-shadow)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div className="relative aspect-[3/4] overflow-hidden" style={{ background: 'var(--color-surface)' }}>
                  {col.image ? (
                    <img
                      src={col.image}
                      alt={col.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
                  )}
                </div>
                <div className="p-4">
                  <p className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>{col.title}</p>
                  {col.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{col.description}</p>
                  )}
                  <span
                    className="inline-block mt-3 text-xs font-bold px-3 py-1"
                    style={{ background: 'var(--color-primary)', color: 'var(--color-primary-fg)', borderRadius: 'var(--tm-radius-pill)' }}
                  >
                    Lihat Produk →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
