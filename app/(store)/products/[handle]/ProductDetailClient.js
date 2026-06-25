'use client'

import { useState, useMemo } from 'react'
import ProductGallery from '@/components/store/ProductGallery'
import ProductVariantSelector from '@/components/store/ProductVariantSelector'
import Button from '@/components/ui/Button'
import { useCart } from '@/store/cartStore'
import { formatCurrency } from '@/lib/helpers'
import toast from 'react-hot-toast'

export default function ProductDetailClient({ product }) {
  const { dispatch } = useCart()
  const [selectedOptions, setSelectedOptions] = useState(() => {
    const init = {}
    product.options?.forEach((opt) => {
      if (opt.values.length > 0) init[opt.name] = opt.values[0]
    })
    return init
  })
  const [quantity, setQuantity] = useState(1)

  const selectedVariant = useMemo(() => {
    if (!product.variants?.length) return null
    return product.variants.find((v) =>
      product.options.every((opt, i) => v[`option${i + 1}`] === selectedOptions[opt.name])
    ) || null
  }, [selectedOptions, product.variants, product.options])

  const price = selectedVariant?.price || product.minPrice || 0
  const stock = selectedVariant?.stock ?? 0
  const outOfStock = product.variants?.length > 0 && stock === 0

  function addToCart() {
    if (outOfStock) return
    dispatch({
      type: 'ADD_ITEM',
      payload: { product, variant: selectedVariant, quantity },
    })
    toast.success('Ditambahkan ke keranjang')
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <ProductGallery images={product.images} featuredImage={product.featuredImage} />

        <div className="space-y-5">
          {product.collectionTitle && (
            <p className="text-sm text-blue-600 font-medium">{product.collectionTitle}</p>
          )}
          <h1 className="text-2xl font-bold text-gray-900">{product.title}</h1>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(price)}</p>

          {product.options?.length > 0 && (
            <ProductVariantSelector
              options={product.options}
              variants={product.variants}
              selectedOptions={selectedOptions}
              onChange={setSelectedOptions}
            />
          )}

          {outOfStock ? (
            <p className="text-red-500 font-medium">Stok habis</p>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded-l-lg text-lg"
                >
                  -
                </button>
                <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                  className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded-r-lg text-lg"
                >
                  +
                </button>
              </div>
              <p className="text-sm text-gray-500">Stok: {stock}</p>
            </div>
          )}

          <Button
            onClick={addToCart}
            disabled={outOfStock}
            size="lg"
            className="w-full"
          >
            Tambah ke Keranjang
          </Button>

          {product.description && (
            <div className="pt-4 border-t border-gray-100">
              <h2 className="font-semibold text-gray-900 mb-2">Deskripsi</h2>
              <p className="text-gray-600 text-sm whitespace-pre-wrap">{product.description}</p>
            </div>
          )}

          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
