import React, { useEffect } from 'react'
import './ProximamenteModal.css'

export default function ProximamenteModal({ restaurant, onClose }) {
  useEffect(() => {
    if (restaurant) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [restaurant])

  if (!restaurant) return null

  return (
    <div className="modal-prox" onClick={onClose}>
      <div className="modal-prox-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-prox-handle"></div>
        <div className="modal-prox-emoji">{restaurant.emoji}</div>
        <div className="modal-prox-badge">Próximamente</div>
        <h2 className="modal-prox-title"><span>{restaurant.name}</span></h2>
        <p className="modal-prox-desc">
          Este local estará disponible muy pronto en Al Toque.<br/>
          ¡Seguí pendiente, llegamos al toque! 🛵
        </p>
        <button className="modal-prox-close" onClick={onClose}>Entendido</button>
      </div>
    </div>
  )
}
