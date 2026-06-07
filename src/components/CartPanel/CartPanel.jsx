import React from 'react'
import './CartPanel.css'

export default function CartPanel({ isOpen, onClose, cartItems, cartTotal, onChangeQty }) {
  if (!isOpen) return null

  const handleWhatsApp = () => {
    let msg = '¡Hola! Quiero hacer un pedido Al Toque:%0A%0A'
    cartItems.forEach(c => {
      msg += `• ${c.product.name} x${c.qty} = ₡${(c.product.price * c.qty).toLocaleString('es-CR')}%0A`
    })
    msg += `%0A*Total estimado: ₡${cartTotal.toLocaleString('es-CR')}*%0A%0AGracias 🛵`
    window.open(`https://wa.me/50684607119?text=${msg}`, '_blank')
  }

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-panel" onClick={e => e.stopPropagation()}>
        <div className="cart-header">
          <h3 className="cart-title">Tu Pedido</h3>
          <button className="cart-close" onClick={onClose}>✕</button>
        </div>
        
        <div className="cart-items">
          {cartItems.length === 0 ? (
            <p className="cart-empty">Tu pedido está vacío.<br/>¡Agregá algo! 🛵</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.product.id} className="cart-item-row">
                <span className="cart-item-emoji">{item.product.emoji}</span>
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.product.name}</div>
                  <div className="cart-item-price">₡{(item.product.price * item.qty).toLocaleString('es-CR')}</div>
                </div>
                <div className="cart-item-qty">
                  <button className="qty-btn" onClick={() => onChangeQty(item.product.id, -1)}>−</button>
                  <span className="qty-num">{item.qty}</span>
                  <button className="qty-btn" onClick={() => onChangeQty(item.product.id, 1)}>+</button>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total-row">
              <span>Total estimado</span>
              <span id="cart-total">₡{cartTotal.toLocaleString('es-CR')}</span>
            </div>
            <p className="cart-note">* Costo de envío se coordina al confirmar.</p>
            <button className="cta-whatsapp cart-whatsapp-btn" onClick={handleWhatsApp}>
              💬 Confirmar por WhatsApp
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
