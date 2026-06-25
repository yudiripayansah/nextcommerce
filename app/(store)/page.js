'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import ProductCard from '@/components/store/ProductCard'
import { getProducts } from '@/services/products'
import { getCollections } from '@/services/collections'

export default function HomePage() {
  const [products, setProducts] = useState([])
  const [collections, setCollections] = useState([])

  useEffect(() => {
    getProducts({ status: 'active', pageLimit: 8 }).then(setProducts).catch(() => {})
    getCollections({ status: 'active' }).then(setCollections).catch(() => {})
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="bg-gray-900 text-white py-20 px-4 text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">Belanja Mudah, Pesan via WhatsApp</h1>
        <p className="text-gray-300 text-lg mb-8">Temukan produk pilihan terbaik untuk Anda</p>
        <Link
          href="/collections"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
        >
          Lihat Koleksi
        </Link>
      </section>

      {/* Collections */}
      {collections.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Koleksi</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                  <p className="text-white font-semibold">{col.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Products */}
      {products.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Produk Terbaru</h2>
            <Link href="/collections" className="text-sm text-blue-600 hover:underline">Lihat semua</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
