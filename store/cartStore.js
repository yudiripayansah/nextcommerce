'use client'

import { createContext, useContext, useReducer, useEffect } from 'react'

const CartContext = createContext(null)

const STORAGE_KEY = 'nc_cart'

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, variant, quantity } = action.payload
      const existing = state.items.findIndex(
        (i) => i.productId === product.id && i.variantId === (variant?.id || null)
      )
      if (existing >= 0) {
        const items = [...state.items]
        items[existing] = {
          ...items[existing],
          quantity: items[existing].quantity + quantity,
          subtotal: (items[existing].quantity + quantity) * items[existing].price,
        }
        return { ...state, items }
      }
      const price = variant ? variant.price : 0
      const newItem = {
        productId: product.id,
        productTitle: product.title,
        productHandle: product.handle,
        featuredImage: variant?.image || product.featuredImage,
        variantId: variant?.id || null,
        variantTitle: variant?.title || '',
        price,
        quantity,
        subtotal: price * quantity,
      }
      return { ...state, items: [...state.items, newItem] }
    }
    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter(
          (i) => !(i.productId === action.payload.productId && i.variantId === action.payload.variantId)
        ),
      }
    }
    case 'UPDATE_QUANTITY': {
      const { productId, variantId, quantity } = action.payload
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (i) => !(i.productId === productId && i.variantId === variantId)
          ),
        }
      }
      const items = state.items.map((i) => {
        if (i.productId === productId && i.variantId === variantId) {
          return { ...i, quantity, subtotal: quantity * i.price }
        }
        return i
      })
      return { ...state, items }
    }
    case 'CLEAR':
      return { items: [] }
    case 'HYDRATE':
      return action.payload
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, { items: [] })

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) dispatch({ type: 'HYDRATE', payload: JSON.parse(saved) })
    } catch {}
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
  }, [cart])

  const totalItems = cart.items.reduce((acc, i) => acc + i.quantity, 0)
  const totalAmount = cart.items.reduce((acc, i) => acc + i.subtotal, 0)

  return (
    <CartContext.Provider value={{ cart, dispatch, totalItems, totalAmount }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
