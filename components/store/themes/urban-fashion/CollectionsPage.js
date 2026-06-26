'use client'

import Link from 'next/link'

export default function UrbanFashionCollectionsPage({ collections, loading }) {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <nav className="flex items-center gap-2 py-4 text-xs text-gray-400">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <span>/</span>
          <span className="text-black font-medium uppercase tracking-wider">Koleksi</span>
        </nav>

        <h1 className="text-2xl md:text-3xl font-bold tracking-wider uppercase text-black pb-5 border-b border-gray-200">
          Semua Koleksi
        </h1>

        <p className="text-xs text-gray-400 tracking-wide py-3">
          {loading ? '' : `${collections.length} koleksi`}
        </p>
      </div>

      {loading ? (
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-gray-100 animate-pulse" />
            ))}
          </div>
        </div>
      ) : collections.length === 0 ? (
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <p className="text-gray-400 text-sm tracking-widest uppercase">Belum ada koleksi tersedia</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10">
            {collections.map((col) => (
              <Link
                key={col.id}
                href={`/collections/${col.handle}`}
                className="group block"
              >
                <div className="relative overflow-hidden bg-stone-100 aspect-[3/4]">
                  {col.image ? (
                    <img
                      src={col.image}
                      alt={col.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="pt-3 pb-5 px-0.5">
                  <p className="text-sm font-medium text-gray-900 uppercase tracking-wider leading-snug group-hover:opacity-60 transition-opacity">
                    {col.title}
                  </p>
                  {col.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{col.description}</p>
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
