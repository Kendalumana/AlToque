import React from 'react'
import './TopBar.css'

export default function TopBar({ cartCount, onToggleCart, onExitRole }) {
  return (
    <header className="top-bar">
      <div className="top-bar-left">
        <img src="/resources/AlToqueIcon.jpeg" alt="Al Toque" className="top-logo" />
        <span className="top-brand">Al Toque</span>
      </div>

      <div className="top-bar-right">
        {/* Botón carrito */}
        <button className="cart-btn" onClick={onToggleCart} aria-label="Carrito">
          🛒 <span className="cart-badge">{cartCount}</span>
        </button>

        {/* Botón salir a pantalla de perfiles */}
        {onExitRole && (
          <button className="exit-role-btn" onClick={onExitRole} title="Cambiar perfil">
            ⇄
          </button>
        )}
      </div>
    </header>
  )
}
