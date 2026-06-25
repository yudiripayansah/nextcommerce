'use client'

import { useCart } from '@/store/cartStore'
import { formatCurrency } from '@/lib/helpers'

export default function CartItem({ item }) {
  const { dispatch } = useCart()

  function updateQty(qty) {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId: item.productId, variantId: item.variantId, quantity: qty } })
  }

  function remove() {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId: item.productId, variantId: item.variantId } })
  }

  return (
    <div className="flex gap-4 py-4 border-b border-gray-100 last:border-0">
      <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
        {item.featuredImage ? (
          <img src={item.featuredImage} alt={item.productTitle} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">{item.productTitle}</p>
        {item.variantTitle && <p className="text-sm text-gray-500">{item.variantTitle}</p>}
        <p className="text-sm font-semibold text-gray-700 mt-1">{formatCurrency(item.price)}</p>

        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => updateQty(item.quantity - 1)}
            className="w-7 h-7 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 text-sm font-medium"
          >
            -
          </button>
          <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
          <button
            onClick={() => updateQty(item.quantity + 1)}
            className="w-7 h-7 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 text-sm font-medium"
          >
            +
          </button>
          <button onClick={remove} className="ml-2 text-red-400 hover:text-red-600 text-xs">
            Hapus
          </button>
        </div>
      </div>

      <div className="text-right">
        <p className="font-semibold text-gray-900">{formatCurrency(item.subtotal)}</p>
      </div>
    </div>
  )
}
