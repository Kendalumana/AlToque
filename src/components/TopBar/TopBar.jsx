import React from 'react'
import './TopBar.css'

export default function TopBar({ cartCount, onToggleCart, onBack, title }) {
  return (
    <header className="top-bar">
      <div className="top-bar-left">
        <img src="/resources/AlToqueIcon.jpeg" alt="Al Toque" className="top-logo" />
        <span className="top-brand">{title || 'Al Toque'}</span>
      </div>
      
      {onBack ? (
        <button className="back-btn" onClick={onBack}>←</button>
      ) : (
        <button className="cart-btn" onClick={onToggleCart}>
          🛒 <span className="cart-badge">{cartCount}</span>
        </button>
      )}
    </header>
  )
}
