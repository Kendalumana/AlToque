import React, { useState, useEffect } from 'react'
import './AdminDrivers.css'
import '../DriversModal/DriversModal.css'
import { DRIVERS_DATA } from '../DriversModal/DriversModal'

const MOCK_DRIVERS = [
  { id: 1, name: 'Juan Perez',  phone: '8800-1234', status: 'Disponible', emoji: '🛵', x: 22, y: 32, orders: 7 },
  { id: 2, name: 'Carlos R.',   phone: '8811-5678', status: 'En Viaje',   emoji: '🛵', x: 68, y: 55, orders: 12 },
  { id: 3, name: 'María L.',    phone: '8822-9012', status: 'Disponible', emoji: '🛵', x: 42, y: 72, orders: 5 },
  { id: 4, name: 'Diego M.',    phone: '8833-3456', status: 'Descanso',   emoji: '🛵', x: 78, y: 25, orders: 3 },
]

const STATUS_COLOR = {
  'Disponible': '#ECF244',
  'En Viaje':   '#44c2f2',
  'Descanso':   '#f27444',
}

const STATUS_BG = {
  'Disponible': 'rgba(236,242,68,0.1)',
  'En Viaje':   'rgba(68,194,242,0.1)',
  'Descanso':   'rgba(242,116,68,0.1)',
}

export default function AdminDrivers() {
  const [selected, setSelected] = useState(null)
  const [positions, setPositions] = useState(MOCK_DRIVERS.map(d => ({ id: d.id, x: d.x, y: d.y })))
  const [showProxOverlay, setShowProxOverlay] = useState(true)
  
  // Modal de Agregar Chofer
  const [showAddModal, setShowAddModal] = useState(false)
  const [formSuccess, setFormSuccess] = useState(false)
  
  // Modal de Detalle Completo de Chofer
  const [detailModalOpen, setDetailModalOpen] = useState(false)

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

  const handleAddSubmit = (e) => {
    e.preventDefault()
    setFormSuccess(true)
  }

  const closeAddModal = () => {
    setShowAddModal(false)
    setTimeout(() => setFormSuccess(false), 300)
  }

  const selectedDriver = selected ? DRIVERS_DATA.find(d => d.id === selected) : null

  return (
    <>
      <div className="admin-drivers-container fade-up">
        {/* Panel izquierdo estilo DriversModal */}
        <div className="drivers-left-panel dm-style">
          <div className="dm-header" style={{ padding: '16px', borderBottom: '1px solid #222' }}>
            <div className="dm-title">
              <span className="dm-title-icon" style={{ width: 40, height: 40, fontSize: '1.4rem' }}>🛵</span>
              <div>
                <h2 style={{ fontSize: '1.05rem' }}>Equipo de Choferes</h2>
                <span className="dm-subtitle">{DRIVERS_DATA.length} registrados</span>
              </div>
            </div>
          </div>
          
          <div className="dm-list" style={{ width: '100%', flex: 1, borderRight: 'none' }}>
            {DRIVERS_DATA.map(d => (
              <button
                key={d.id}
                className={`dm-card ${selected === d.id ? 'selected' : ''}`}
                onClick={() => setSelected(selected === d.id ? null : d.id)}
              >
                <div className="dm-card-left">
                  <div className="dm-avatar" style={{ borderColor: STATUS_COLOR[d.status], width: 38, height: 38, fontSize: '1.1rem' }}>
                    {d.emoji}
                    <span className="dm-avatar-dot" style={{ background: STATUS_COLOR[d.status], width: 9, height: 9 }}></span>
                  </div>
                  <div className="dm-card-info">
                    <strong>{d.name}</strong>
                    <span className="dm-alias">"{d.alias}"</span>
                    <span className="dm-status" style={{ color: STATUS_COLOR[d.status], background: STATUS_BG[d.status], fontSize: '0.65rem' }}>
                      {d.status}
                    </span>
                  </div>
                </div>
                <div className="dm-card-right">
                  <div className="dm-stat-pill" style={{ fontSize: '0.7rem' }}>
                    <span>📦</span><span>{d.tripsToday} hoy</span>
                  </div>
                  <div className="dm-rating" style={{ fontSize: '0.75rem' }}>⭐ {d.rating}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="drivers-panel-footer">
            <button className="drivers-add-btn-large" onClick={() => setShowAddModal(true)}>
              ➕ Agregar Chofer
            </button>
          </div>
        </div>

        {/* Contenido Derecho: Stats + Mapa Mock */}
        <div className="drivers-right-area">
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
          </div>

          {/* Simulación visual de mapa */}
          <div className="map-container">
            <div className="map-grid-bg"></div>
            <div className="map-road horizontal" style={{ top: '35%' }}></div>
            <div className="map-road horizontal" style={{ top: '65%' }}></div>
            <div className="map-road vertical" style={{ left: '30%' }}></div>
            <div className="map-road vertical" style={{ left: '60%' }}></div>

            <div className="map-zone-label">📍 Miramar, Puntarenas</div>

            {/* Central hub (casita) */}
            <div className="driver-pin casita" style={{ left: '50%', top: '50%' }}>
              <div className="pin-pulse" style={{ borderColor: 'var(--yellow-bright)' }}></div>
              <div className="pin-avatar" style={{ borderColor: 'var(--yellow-bright)', background: '#111' }}>🏠</div>
              <div className="pin-label">Central</div>
            </div>

            {MOCK_DRIVERS.map(driver => {
              const pos = positions.find(p => p.id === driver.id) || driver
              return (
                <div
                  key={driver.id}
                  className={`driver-pin ${driver.status.replace(' ', '-').toLowerCase()}`}
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    transition: 'left 1.8s ease, top 1.8s ease'
                  }}
                >
                  <div className="pin-pulse"></div>
                  <div className="pin-avatar">{driver.emoji}</div>
                  <div className="pin-label">{driver.name.split(' ')[0]}</div>
                </div>
              )
            })}

            {/* Detalle Flotante si se selecciona un chofer de la lista izquierda */}
            {selectedDriver && (
              <div className="driver-detail-floating">
                <button className="driver-detail-close" onClick={() => setSelected(null)}>✕</button>
                <div className="driver-detail-avatar" style={{ borderColor: STATUS_COLOR[selectedDriver.status] }}>
                  {selectedDriver.emoji}
                </div>
                <div className="driver-detail-info">
                  <h4>{selectedDriver.name}</h4>
                  <div className="driver-detail-status" style={{ color: STATUS_COLOR[selectedDriver.status] }}>
                    ● {selectedDriver.status}
                  </div>
                  <div className="driver-detail-meta">
                    📞 {selectedDriver.phone} · 📦 {selectedDriver.tripsToday} viajes hoy
                  </div>
                  <button className="driver-floating-more-btn" onClick={() => setDetailModalOpen(true)}>
                    Ver más detalles
                  </button>
                </div>
              </div>
            )}

            {/* Overlay Próximamente */}
            {!selectedDriver && showProxOverlay && (
              <div className="drivers-prox-overlay">
                <div className="drivers-prox-card">
                  <div className="drivers-prox-icon">📡</div>
                  <div className="drivers-prox-badge">En Desarrollo</div>
                  <h3>Asignación de Choferes</h3>
                  <p>
                    Próximamente podrás ver a todos los choferes en tiempo real sobre el mapa de Miramar,
                    asignarles viajes automáticamente según cercanía, y ver el estatus de las entregas.
                  </p>
                  <button className="drivers-prox-btn" onClick={() => setShowProxOverlay(false)}>
                    🗺️ Ver en tiempo real
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Agregar Chofer */}
      {showAddModal && (
        <div className="add-driver-modal-overlay" onClick={e => e.target === e.currentTarget && closeAddModal()}>
          <div className="add-driver-modal">
            <div className="add-driver-header">
              <h3>➕ Agregar Nuevo Chofer</h3>
              <button className="add-driver-close" onClick={closeAddModal}>✕</button>
            </div>

            {!formSuccess ? (
              <form className="add-driver-form" onSubmit={handleAddSubmit}>
                <div className="form-group">
                  <label>Nombre Completo</label>
                  <input type="text" placeholder="Ej: Juan Pérez" required />
                </div>
                <div className="form-group">
                  <label>Número de Teléfono</label>
                  <input type="tel" placeholder="Ej: 8888-8888" required />
                </div>
                <div className="form-group">
                  <label>Vehículo / Placa</label>
                  <input type="text" placeholder="Ej: Moto Honda - XXX-123" required />
                </div>
                <div className="form-group">
                  <label>Zona Principal</label>
                  <select required>
                    <option value="">Seleccione una zona...</option>
                    <option value="miramar">Miramar Centro</option>
                    <option value="esparza">Esparza</option>
                    <option value="barranca">Barranca</option>
                  </select>
                </div>
                <button type="submit" className="add-driver-submit">Confirmar Registro</button>
              </form>
            ) : (
              <div className="add-driver-success fade-up">
                <h4>¡Registro en cola! 📡</h4>
                <p>Próximamente podrás agregar, editar y eliminar choferes desde este panel. La función está en desarrollo.</p>
                <button className="drivers-prox-btn" onClick={closeAddModal}>
                  Entendido
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de Detalle Extendido de Chofer */}
      {detailModalOpen && selectedDriver && (
        <div className="dm-overlay" onClick={e => e.target === e.currentTarget && setDetailModalOpen(false)}>
          <div className="dm-container fade-up" style={{ width: 'min(700px, 96vw)', maxHeight: '85vh', background: '#111' }}>
            <div className="dm-header">
              <div className="dm-title">
                <span className="dm-title-icon">🛵</span>
                <div>
                  <h2>Perfil del Chofer</h2>
                  <span className="dm-subtitle">Detalles y estadísticas</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="dm-edit-btn" onClick={() => alert('Próximamente: La edición de perfiles de chofer está en desarrollo.')}>✏️</button>
                <button className="dm-close" onClick={() => setDetailModalOpen(false)}>✕</button>
              </div>
            </div>

            <div className="dm-body" style={{ flexDirection: 'column' }}>
              <div className="dm-detail" style={{ padding: '24px' }}>
                <div className="dm-detail-header">
                  <div className="dm-detail-avatar" style={{ borderColor: STATUS_COLOR[selectedDriver.status] }}>
                    {selectedDriver.emoji}
                  </div>
                  <div>
                    <h3>{selectedDriver.name}</h3>
                    <p className="dm-detail-alias">"{selectedDriver.alias}" · {selectedDriver.zone}</p>
                    <span className="dm-detail-status" style={{ color: STATUS_COLOR[selectedDriver.status], background: STATUS_BG[selectedDriver.status] }}>
                      ● {selectedDriver.status}
                    </span>
                  </div>
                </div>

                <div className="dm-detail-grid">
                  <div className="dm-detail-item">
                    <span className="dm-detail-label">📞 Teléfono</span>
                    <span className="dm-detail-val">{selectedDriver.phone}</span>
                  </div>
                  <div className="dm-detail-item">
                    <span className="dm-detail-label">🛵 Vehículo</span>
                    <span className="dm-detail-val">{selectedDriver.vehicle}</span>
                  </div>
                  <div className="dm-detail-item">
                    <span className="dm-detail-label">🔖 Placa</span>
                    <span className="dm-detail-val mono">{selectedDriver.plate}</span>
                  </div>
                  <div className="dm-detail-item">
                    <span className="dm-detail-label">⭐ Calificación</span>
                    <span className="dm-detail-val">{selectedDriver.rating} / 5.0</span>
                  </div>
                  <div className="dm-detail-item">
                    <span className="dm-detail-label">📦 Viajes hoy</span>
                    <span className="dm-detail-val">{selectedDriver.tripsToday}</span>
                  </div>
                  <div className="dm-detail-item">
                    <span className="dm-detail-label">🏆 Viajes totales</span>
                    <span className="dm-detail-val">{selectedDriver.tripsTotal}</span>
                  </div>
                  <div className="dm-detail-item">
                    <span className="dm-detail-label">💰 Ganancia hoy</span>
                    <span className="dm-detail-val yellow">₡{selectedDriver.earnings_today.toLocaleString()}</span>
                  </div>
                  <div className="dm-detail-item">
                    <span className="dm-detail-label">📅 Ingresó</span>
                    <span className="dm-detail-val">{new Date(selectedDriver.joinedDate).toLocaleDateString('es-CR', { year:'numeric', month:'long', day:'numeric' })}</span>
                  </div>
                </div>

                <div className="dm-detail-notes">
                  <span className="dm-detail-label">📝 Notas</span>
                  <p>{selectedDriver.notes}</p>
                </div>

                <a
                  className="dm-whatsapp-btn"
                  href={`https://wa.me/${selectedDriver.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  💬 Contactar por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
