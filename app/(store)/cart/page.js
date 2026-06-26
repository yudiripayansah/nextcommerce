'use client'

import Link from 'next/link'
import CartItem from '@/components/store/CartItem'
import WhatsAppOrderButton from '@/components/store/WhatsAppOrderButton'
import { useCart } from '@/store/cartStore'
import { formatCurrency } from '@/lib/helpers'
import { useEffect, useState } from 'react'
import { getSettings } from '@/services/settings'

export default function CartPage() {
  const { cart, totalItems, totalAmount } = useCart()
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    getSettings().then(setSettings)
  }, [])

  if (cart.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <p className="text-gray-900 font-semibold text-lg mb-2">Keranjang Kosong</p>
        <p className="text-gray-500 text-sm mb-6">Belum ada produk yang ditambahkan</p>
        <Link
          href="/collections"
          className="inline-block px-6 py-2.5 rounded-xl font-medium hover:opacity-90 transition-opacity"
          style={{ background: 'var(--color-primary)', color: 'var(--color-primary-fg)' }}
        >
          Mulai Belanja
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Keranjang Belanja</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            {cart.items.map((item) => (
              <CartItem key={`${item.productId}-${item.variantId}`} item={item} />
            ))}
          </div>
        </div>

        {/* Order summary */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Ringkasan</h2>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Item</span>
                <span className="font-medium">{totalItems}</span>
              </div>
              <div className="flex justify-between text-base font-bold border-t pt-2 mt-2">
                <span>Total</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Data Pemesanan</h2>
            <WhatsAppOrderButton settings={settings} />
          </div>
        </div>
      </div>
    </div>
  )
}
