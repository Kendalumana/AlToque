import React, { useState, useEffect } from 'react'
import './AdminDrivers.css'
import MapModal from '../MapModal/MapModal'

const MOCK_DRIVERS = [
  { id: 1, name: 'Juan Perez',  phone: '8800-1234', status: 'Disponible', emoji: '🛵', x: 22, y: 32, orders: 7 },
  { id: 2, name: 'Carlos R.',   phone: '8811-5678', status: 'En Viaje',   emoji: '🛵', x: 68, y: 55, orders: 12 },
  { id: 3, name: 'María L.',    phone: '8822-9012', status: 'Disponible', emoji: '🛵', x: 42, y: 72, orders: 5 },
  { id: 4, name: 'Diego M.',    phone: '8833-3456', status: 'Descanso',   emoji: '🛵', x: 78, y: 25, orders: 3 },
]

const STATUS_COLOR = {
  'Disponible': 'var(--yellow-bright)',
  'En Viaje':   '#44c2f2',
  'Descanso':   '#f27444',
}

export default function AdminDrivers() {
  const [selected, setSelected] = useState(null)
  const [mapOpen, setMapOpen] = useState(false)
  const [positions, setPositions] = useState(MOCK_DRIVERS.map(d => ({ id: d.id, x: d.x, y: d.y })))

  // Choferes "En Viaje" se mueven levemente
  useEffect(() => {
    const interval = setInterval(() => {
      setPositions(prev => prev.map(p => {
        const driver = MOCK_DRIVERS.find(d => d.id === p.id)
        if (driver?.status !== 'En Viaje') return p
        return {
          ...p,
          x: Math.max(5, Math.min(90, p.x + (Math.random() - 0.5) * 2)),
          y: Math.max(5, Math.min(90, p.y + (Math.random() - 0.5) * 2)),
        }
      }))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {mapOpen && <MapModal onClose={() => setMapOpen(false)} />}

      <div className="admin-drivers fade-up">
        {/* Stats bar */}
        <div className="drivers-stats-bar">
          {Object.entries(STATUS_COLOR).map(([status, color]) => (
            <div key={status} className="drivers-stat">
              <div className="stat-dot" style={{ background: color }}></div>
              <span className="stat-label">{status}</span>
              <span className="stat-count">{MOCK_DRIVERS.filter(d => d.status === status).length}</span>
            </div>
          ))}
          <div className="drivers-stat" style={{ marginLeft: 'auto' }}>
            <span className="stat-label" style={{ color: '#888' }}>Total viajes hoy:</span>
            <span className="stat-count" style={{ color: 'var(--yellow-bright)' }}>
              {MOCK_DRIVERS.reduce((a, d) => a + d.orders, 0)}
            </span>
          </div>
          {/* Botón Ver Mapa Real */}
          <button className="drivers-map-btn" onClick={() => setMapOpen(true)}>
            🗺️ Ver Mapa Real
          </button>
        </div>

        {/* Simulación visual de mapa */}
        <div className="map-container">
          <div className="map-grid-bg"></div>
          <div className="map-road horizontal" style={{ top: '35%' }}></div>
          <div className="map-road horizontal" style={{ top: '65%' }}></div>
          <div className="map-road vertical" style={{ left: '30%' }}></div>
          <div className="map-road vertical" style={{ left: '60%' }}></div>

          <div className="map-zone-label">📍 Miramar, Puntarenas</div>

          {MOCK_DRIVERS.map(driver => {
            const pos = positions.find(p => p.id === driver.id) || driver
            return (
              <button
                key={driver.id}
                className={`driver-pin ${driver.status.replace(' ', '-').toLowerCase()} ${selected?.id === driver.id ? 'selected' : ''}`}
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transition: 'left 1.8s ease, top 1.8s ease'
                }}
                onClick={() => setSelected(selected?.id === driver.id ? null : driver)}
              >
                <div className="pin-pulse"></div>
                <div className="pin-avatar">{driver.emoji}</div>
                <div className="pin-label">{driver.name.split(' ')[0]}</div>
              </button>
            )
          })}

          {selected && (
            <div className="driver-detail-card fade-up">
              <button className="driver-detail-close" onClick={() => setSelected(null)}>✕</button>
              <div className="driver-detail-avatar">{selected.emoji}</div>
              <div className="driver-detail-info">
                <h4>{selected.name}</h4>
                <div className="driver-detail-status" style={{ color: STATUS_COLOR[selected.status] }}>
                  ● {selected.status}
                </div>
                <div className="driver-detail-meta">
                  📞 {selected.phone} · 📦 {selected.orders} viajes hoy
                </div>
              </div>
            </div>
          )}

          {/* Overlay Próximamente */}
          <div className="drivers-prox-overlay">
            <div className="drivers-prox-card">
              <div className="drivers-prox-icon">📡</div>
              <div className="drivers-prox-badge">En Desarrollo</div>
              <h3>Asignación de Choferes</h3>
              <p>
                Próximamente podrás ver a todos los choferes en tiempo real sobre el mapa de Miramar,
                asignarles viajes automáticamente según cercanía, y ver el estatus de las entregas.
              </p>
              <button className="drivers-prox-btn" onClick={() => setMapOpen(true)}>
                🗺️ Ver Mapa de Miramar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
