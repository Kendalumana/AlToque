import React from 'react'
import './LocationScreen.css'

export default function LocationScreen({ onSelectZone }) {
  return (
    <div className="screen fade-up active">
      <div className="app-shell location-bg">
        <div className="splash-header">
          <div className="logo-wrapper">
            <img src="/resources/AlToqueIcon.jpeg" alt="Al Toque logo" className="logo-img" />
          </div>
          <h1 className="brand-name">Al Toque</h1>
          <p className="brand-sub">MULTISERVICIOS</p>
          <p className="brand-tagline">Delivery regional · Costa Rica</p>
        </div>

        <div className="location-card">
          <div className="location-header">
            <span className="pin-icon">📍</span>
            <div>
              <h2 className="location-title">Primero, dinos dónde estás</h2>
              <p className="location-desc">Tu región define los servicios disponibles y el costo de envío.</p>
            </div>
          </div>

          <div className="zone-list">
            <button className="zone-item" onClick={() => onSelectZone('miramar')}>
              <div className="zone-info">
                <span className="zone-name">Miramar Centro</span>
                <span className="zone-prov">Puntarenas</span>
              </div>
              <span className="zone-arrow">›</span>
            </button>

            <button className="zone-item" onClick={() => onSelectZone('otros')}>
              <div className="zone-info">
                <span className="zone-name">Otros</span>
                <span className="zone-prov">Zona pendiente de cobertura</span>
              </div>
              <span className="zone-arrow">›</span>
            </button>
          </div>
        </div>

        <p className="footer-note">Al Toque Multiservicios · Desde 2021 · 8460-7119</p>
      </div>
    </div>
  )
}
