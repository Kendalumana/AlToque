import React from 'react'
import './OtrosScreen.css'
import TopBar from '../TopBar/TopBar'

export default function OtrosScreen({ onBack }) {
  return (
    <div className="screen fade-up active">
      <div className="app-shell">
        <TopBar onBack={onBack} title="Al Toque" />

        <div className="otros-wrap">
          <div className="otros-icon">🗺️</div>
          <h2 className="otros-title">Tu zona está próximamente</h2>
          <p className="otros-desc">
            Al Toque Multiservicios está expandiendo su cobertura.<br/>
            Por ahora operamos en <strong>Miramar Centro, Puntarenas</strong>.
          </p>
          <p className="otros-desc">
            Si querés solicitar un mandado fuera de cobertura, contactanos directamente:
          </p>
          
          <a href="tel:84607119" className="cta-phone">📞 8460-7119</a>
          <a 
            href="https://wa.me/50684607119?text=Hola%2C%20quiero%20solicitar%20un%20servicio%20Al%20Toque" 
            target="_blank" 
            rel="noreferrer"
            className="cta-whatsapp"
          >
            💬 Escribir por WhatsApp
          </a>
          
          <button className="btn-secondary" onClick={onBack}>← Volver</button>
        </div>
      </div>
    </div>
  )
}
