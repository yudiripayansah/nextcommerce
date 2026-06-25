'use client'

import { useEffect, useState } from 'react'
import { useParams, notFound } from 'next/navigation'
import ProductCard from '@/components/store/ProductCard'
import { getCollectionByHandle } from '@/services/collections'
import { getProductsByCollection } from '@/services/products'

export default function CollectionDetailPage() {
  const { handle } = useParams()
  const [collection, setCollection] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const col = await getCollectionByHandle(handle)
      if (!col) { setLoading(false); return }
      setCollection(col)
      const prods = await getProductsByCollection(col.id)
      setProducts(prods)
      setLoading(false)
    }
    load()
  }, [handle])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-square rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (!collection) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-gray-500">Koleksi tidak ditemukan.</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        {collection.image && (
          <div className="w-full h-48 rounded-xl overflow-hidden mb-4">
            <img src={collection.image} alt={collection.title} className="w-full h-full object-cover" />
          </div>
        )}
        <h1 className="text-2xl font-bold text-gray-900">{collection.title}</h1>
        {collection.description && <p className="text-gray-600 mt-2">{collection.description}</p>}
      </div>

      {products.length === 0 ? (
        <p className="text-gray-500">Belum ada produk di koleksi ini.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
