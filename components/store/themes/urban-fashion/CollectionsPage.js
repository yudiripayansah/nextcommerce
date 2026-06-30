'use client'

import Link from 'next/link'
import { useTenant } from '@/contexts/TenantContext'

export default function UrbanFashionCollectionsPage({ collections, loading }) {
  const { slug } = useTenant()
  return (
    <div>
      <div className="max-w-7xl mx-auto px-4">
        <nav className="flex items-center gap-2 py-4 text-xs" style={{ color: 'var(--color-text-muted)' }}>
          <Link href={`/${slug}`} className="hover:opacity-100 transition-opacity">Home</Link>
          <span>/</span>
          <span className="font-medium uppercase tracking-wider" style={{ color: 'var(--color-text)' }}>Koleksi</span>
        </nav>

        <h1
          className="text-2xl md:text-3xl font-bold tracking-wider uppercase pb-5"
          style={{ color: 'var(--color-text)', borderBottom: '1px solid var(--color-border)' }}
        >
          Semua Koleksi
        </h1>

        <p className="text-xs tracking-wide py-3" style={{ color: 'var(--color-text-muted)' }}>
          {loading ? '' : `${collections.length} koleksi`}
        </p>
      </div>

      {loading ? (
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[3/4] animate-pulse" style={{ background: 'var(--color-surface)' }} />
            ))}
          </div>
        </div>
      ) : collections.length === 0 ? (
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <p className="text-sm tracking-widest uppercase" style={{ color: 'var(--color-text-muted)' }}>Belum ada koleksi tersedia</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10">
            {collections.map((col) => (
              <Link
                key={col.id}
                href={`/${slug}/collections/${col.handle}`}
                className="group block"
              >
                <div className="relative overflow-hidden aspect-[3/4]" style={{ background: 'var(--color-surface)' }}>
                  {col.image ? (
                    <img
                      src={col.image}
                      alt={col.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--color-border)' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="pt-3 pb-5 px-0.5">
                  <p
                    className="text-sm font-medium uppercase tracking-wider leading-snug group-hover:opacity-60 transition-opacity"
                    style={{ color: 'var(--color-text)' }}
                  >
                    {col.title}
                  </p>
                  {col.description && (
                    <p className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--color-text-muted)' }}>{col.description}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="pb-16" />
    </div>
  )
}
