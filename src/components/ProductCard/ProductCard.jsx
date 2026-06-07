import React from 'react'
import './ProductCard.css'

export default function ProductCard({ product, qty, onChangeQty }) {
  return (
    <div className="product-card">
      <div className="product-emoji">{product.emoji}</div>
      <div className="product-info">
        <div className="product-name">{product.name}</div>
        <div className="product-shop">{product.shop}</div>
        <div className="product-price">₡{product.price.toLocaleString('es-CR')}</div>
      </div>
      
      <div className="product-qty-ctrl">
        {qty > 0 ? (
          <>
            <button className="qty-btn" onClick={() => onChangeQty(product.id, -1)}>−</button>
            <span className="qty-num">{qty}</span>
            <button className="qty-btn" onClick={() => onChangeQty(product.id, 1)}>+</button>
          </>
        ) : (
          <button className="add-btn" onClick={() => onChangeQty(product.id, 1)}>+ Agregar</button>
        )}
      </div>
    </div>
  )
}
