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
    <div style={{ borderTop: '1px solid var(--color-border)' }}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-4 text-sm font-semibold uppercase tracking-wide"
        style={{ color: 'var(--color-text)' }}
      >
        {title}
        <svg className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="pb-4 text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--color-text-muted)' }}>
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
      <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: 'var(--color-text-muted)' }}>
        <Link href={`/${tenantSlug}`} className="hover:opacity-100 transition-opacity">Beranda</Link>
        <span>/</span>
        {product.collectionHandle ? (
          <>
            <Link href={`/${tenantSlug}/collections/${product.collectionHandle}`} className="hover:opacity-100 transition-opacity">
              {product.collectionTitle || 'Koleksi'}
            </Link>
            <span>/</span>
          </>
        ) : null}
        <span className="truncate max-w-[180px]" style={{ color: 'var(--color-text)' }}>{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14">
        <ProductGallery images={product.images} featuredImage={product.featuredImage} />

        <div>
          <h1 className="text-2xl font-bold leading-snug mb-1" style={{ color: 'var(--color-text)' }}>{product.title}</h1>
          <p className="text-xl font-semibold mb-6" style={{ color: 'var(--color-text)' }}>{formatCurrency(price)}</p>

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
              <div className="flex items-center" style={{ border: '1px solid var(--color-border)' }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:opacity-60 transition-opacity text-lg"
                  style={{ color: 'var(--color-text)' }}
                >
                  −
                </button>
                <span className="w-10 text-center text-sm font-medium" style={{ color: 'var(--color-text)' }}>{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                  className="w-10 h-10 flex items-center justify-center hover:opacity-60 transition-opacity text-lg"
                  style={{ color: 'var(--color-text)' }}
                >
                  +
                </button>
              </div>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{stock} tersedia</p>
            </div>
          )}

          <button
            onClick={addToCart}
            disabled={outOfStock}
            className={`w-full py-4 text-sm font-semibold uppercase tracking-widest transition-opacity ${outOfStock ? 'cursor-not-allowed opacity-40' : 'hover:opacity-90'}`}
            style={outOfStock
              ? { background: 'var(--color-surface)', color: 'var(--color-text-muted)' }
              : { background: 'var(--color-primary)', color: 'var(--color-primary-fg)' }}
          >
            {outOfStock ? 'Stok Habis' : 'Tambah ke Keranjang'}
          </button>

          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-5">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 text-xs rounded-sm"
                  style={{ background: 'var(--color-surface)', color: 'var(--color-text-muted)' }}
                >
                  {tag}
                </span>
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
