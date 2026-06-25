'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getCollections } from '@/services/collections'

export default function CollectionsPage() {
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCollections({ status: 'active' }).then(setCollections).finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Semua Koleksi</h1>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-square rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : collections.length === 0 ? (
        <p className="text-gray-500">Belum ada koleksi tersedia.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {collections.map((col) => (
            <Link
              key={col.id}
              href={`/collections/${col.handle}`}
              className="group block rounded-xl overflow-hidden bg-gray-100 aspect-square relative"
            >
              {col.image && (
                <img src={col.image} alt={col.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              )}
              <div className="absolute inset-0 bg-black/40 flex items-end p-4">
                <div>
                  <p className="text-white font-semibold">{col.title}</p>
                  {col.productCount > 0 && (
                    <p className="text-gray-300 text-xs">{col.productCount} produk</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
