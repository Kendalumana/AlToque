import { useState } from 'react'

export function useCart() {
  const [cart, setCart] = useState([])

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.product.id === product.id)
      if (existing) {
        return prev.map((c) =>
          c.product.id === product.id ? { ...c, qty: c.qty + 1 } : c
        )
      }
      return [...prev, { product, qty: 1 }]
    })
  }

  const changeQty = (productId, delta) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.product.id === productId)
      if (!existing) return prev

      const newQty = existing.qty + delta
      if (newQty <= 0) {
        return prev.filter((c) => c.product.id !== productId)
      }

      return prev.map((c) =>
        c.product.id === productId ? { ...c, qty: newQty } : c
      )
    })
  }

  const getQty = (productId) => {
    const item = cart.find((c) => c.product.id === productId)
    return item ? item.qty : 0
  }

  const cartCount = cart.reduce((s, c) => s + c.qty, 0)
  const cartTotal = cart.reduce((s, c) => s + c.product.price * c.qty, 0)

  return { cart, addToCart, changeQty, getQty, cartCount, cartTotal, setCart }
}
