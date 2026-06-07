import React from 'react'
import './ProductCard.css'

export default function ProductCard({ product, qty, onChangeQty }) {
  const inCart = qty > 0

  return (
    <div className={`product-card ${inCart ? 'in-cart' : ''}`}>
      <div className="product-emoji">{product.emoji}</div>

      <div className="product-info">
        <div className="product-name">{product.name}</div>
        <div className="product-shop">{product.shop}</div>
        <div className="product-price">₡{product.price.toLocaleString('es-CR')}</div>
      </div>

      <div className="product-qty-ctrl">
        {inCart ? (
          <>
            <button
              className="qty-btn minus"
              onClick={() => onChangeQty(product, -1)}
              aria-label="Quitar uno"
            >−</button>
            <span className="qty-num">{qty}</span>
            <button
              className="qty-btn plus"
              onClick={() => onChangeQty(product, 1)}
              aria-label="Agregar uno"
            >+</button>
          </>
        ) : (
          <div className="add-inline">
            <button className="qty-btn minus disabled" disabled aria-label="Quitar">−</button>
            <span className="qty-zero">0</span>
            <button
              className="qty-btn plus"
              onClick={() => onChangeQty(product, 1)}
              aria-label="Agregar al carrito"
            >+</button>
          </div>
        )}
      </div>
    </div>
  )
}
