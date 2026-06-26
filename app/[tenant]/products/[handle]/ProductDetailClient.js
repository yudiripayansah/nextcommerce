'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import ProductGallery from '@/components/store/ProductGallery'
import ProductVariantSelector from '@/components/store/ProductVariantSelector'
import { useCart } from '@/store/cartStore'
import { formatCurrency } from '@/lib/helpers'
import toast from 'react-hot-toast'

function Accordion({ title, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-t border-gray-200">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-4 text-sm font-semibold text-gray-900 uppercase tracking-wide"
      >
        {title}
        <svg className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="pb-4 text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
          {children}
        </div>
      )}
    </div>
  )
}

export default function ProductDetailClient({ product }) {
  const { tenant: tenantSlug } = useParams()
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
    return (
      product.variants.find((v) =>
        product.options.every((opt, i) => v[`option${i + 1}`] === selectedOptions[opt.name])
      ) || null
    )
  }, [selectedOptions, product.variants, product.options])

  const price = selectedVariant?.price || product.minPrice || 0
  const stock = selectedVariant?.stock ?? 0
  const outOfStock = product.variants?.length > 0 && stock === 0

  function addToCart() {
    if (outOfStock) return
    dispatch({ type: 'ADD_ITEM', payload: { product, variant: selectedVariant, quantity } })
    toast.success('Ditambahkan ke keranjang')
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
      <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
        <Link href={`/${tenantSlug}`} className="hover:text-gray-900 transition-colors">Beranda</Link>
        <span>/</span>
        {product.collectionHandle ? (
          <>
            <Link href={`/${tenantSlug}/collections/${product.collectionHandle}`} className="hover:text-gray-900 transition-colors">
              {product.collectionTitle || 'Koleksi'}
            </Link>
            <span>/</span>
          </>
        ) : null}
        <span className="text-gray-900 truncate max-w-[180px]">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14">
        <ProductGallery images={product.images} featuredImage={product.featuredImage} />

        <div>
          <h1 className="text-2xl font-bold text-gray-900 leading-snug mb-1">{product.title}</h1>
          <p className="text-xl font-semibold text-gray-900 mb-6">{formatCurrency(price)}</p>

          {product.options?.length > 0 && (
            <div className="mb-6">
              <ProductVariantSelector
                options={product.options}
                variants={product.variants}
                selectedOptions={selectedOptions}
                onChange={setSelectedOptions}
              />
            </div>
          )}

          {outOfStock ? (
            <p className="text-sm text-red-500 font-medium mb-6">Stok habis</p>
          ) : (
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-gray-300">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 text-lg text-gray-700">−</button>
                <span className="w-10 text-center text-sm font-medium">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(stock, quantity + 1))} className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 text-lg text-gray-700">+</button>
              </div>
              <p className="text-xs text-gray-400">{stock} tersedia</p>
            </div>
          )}

          <button
            onClick={addToCart}
            disabled={outOfStock}
            className={`w-full py-4 text-sm font-semibold uppercase tracking-widest transition-opacity ${outOfStock ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'hover:opacity-90'}`}
            style={outOfStock ? undefined : { background: 'var(--color-primary)', color: 'var(--color-primary-fg)' }}
          >
            {outOfStock ? 'Stok Habis' : 'Tambah ke Keranjang'}
          </button>

          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-5">
              {product.tags.map((tag) => (
                <span key={tag} className="px-2.5 py-1 bg-gray-100 text-gray-500 text-xs rounded-sm">{tag}</span>
              ))}
            </div>
          )}

          <div className="mt-8">
            {product.description && <Accordion title="Deskripsi">{product.description}</Accordion>}
            <Accordion title="Panduan Ukuran">Silakan hubungi kami melalui WhatsApp untuk panduan ukuran lengkap.</Accordion>
            <Accordion title="Pengiriman & Pengembalian">Pesanan diproses 1–2 hari kerja. Konfirmasi pesanan melalui WhatsApp.</Accordion>
          </div>
        </div>
      </div>
    </div>
  )
}
