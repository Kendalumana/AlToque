import { useState, useEffect } from 'react'

const STORAGE_KEY = 'alToqueCart'

export function useCart() {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })

  // Persistir en localStorage cada vez que cambia el carrito
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
  }, [cart])

  // Cambia cantidad — si delta=+1 y no existe, lo agrega; si llega a 0, lo quita
  const changeQty = (product, delta) => {
    // Acepta product como objeto o como id
    const isObj = typeof product === 'object'
    const productId = isObj ? product.id : product

    setCart(prev => {
      const existing = prev.find(c => c.product.id === productId)

      if (!existing) {
        // Primera vez que se agrega — necesitamos el objeto completo
        if (delta > 0 && isObj) {
          return [...prev, { product, qty: 1 }]
        }
        return prev
      }

      const newQty = existing.qty + delta
      if (newQty <= 0) {
        return prev.filter(c => c.product.id !== productId)
      }
      return prev.map(c =>
        c.product.id === productId ? { ...c, qty: newQty } : c
      )
    })
  }

  const getQty = (productId) => {
    const item = cart.find(c => c.product.id === productId)
    return item ? item.qty : 0
  }

  const clearCart = () => {
    setCart([])
    localStorage.removeItem(STORAGE_KEY)
  }

  const cartCount = cart.reduce((s, c) => s + c.qty, 0)
  const cartTotal = cart.reduce((s, c) => s + c.product.price * c.qty, 0)

  return { cart, changeQty, getQty, cartCount, cartTotal, clearCart, setCart }
}
