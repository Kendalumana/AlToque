import React, { useState } from 'react'
import './DriversModal.css'

export const DRIVERS_DATA = [
  {
    id: 1,
    name: 'Juan Pérez Solano',
    alias: 'Juancho',
    phone: '8800-1234',
    whatsapp: '50688001234',
    status: 'Disponible',
    emoji: '🛵',
    vehicle: 'Honda Wave 125',
    plate: 'MG-2341',
    zone: 'Miramar Centro',
    rating: 4.9,
    tripsToday: 7,
    tripsTotal: 312,
    joinedDate: '2024-03-15',
    earnings_today: 14500,
    lat: 10.09358,
    lng: -84.72855,
    notes: 'Confiable, conoce bien las rutas de Miramar y Esparza.',
  },
  {
    id: 2,
    name: 'Carlos Rodríguez Vega',
    alias: 'Caro',
    phone: '8811-5678',
    whatsapp: '50688115678',
    status: 'En Viaje',
    emoji: '🛵',
    vehicle: 'Yamaha YBR 125',
    plate: 'MG-8804',
    zone: 'Barranca',
    rating: 4.7,
    tripsToday: 12,
    tripsTotal: 589,
    joinedDate: '2023-11-02',
    earnings_today: 24800,
    lat: 10.08633,
    lng: -84.72461,
    notes: 'Experiencia en mandados bancarios y compras de súper.',
  },
  {
    id: 3,
    name: 'María López Castro',
    alias: 'Mari',
    phone: '8822-9012',
    whatsapp: '50688229012',
    status: 'Disponible',
    emoji: '🛵',
    vehicle: 'Suzuki GD 110',
    plate: 'MG-5512',
    zone: 'Miramar Norte',
    rating: 5.0,
    tripsToday: 5,
    tripsTotal: 204,
    joinedDate: '2024-07-20',
    earnings_today: 9500,
    lat: 10.09788,
    lng: -84.73512,
    notes: 'Especialista en entregas de farmacia y comida.',
  },
  {
    id: 4,
    name: 'Diego Méndez Arroyo',
    alias: 'Diegote',
    phone: '8833-3456',
    whatsapp: '50688333456',
    status: 'Descanso',
    emoji: '🛵',
    vehicle: 'Honda CB 150',
    plate: 'MG-7731',
    zone: 'Espíritu Santo',
    rating: 4.6,
    tripsToday: 3,
    tripsTotal: 97,
    joinedDate: '2025-01-10',
    earnings_today: 6200,
    lat: 10.08244,
    lng: -84.74108,
    notes: 'Chofer nuevo con buena actitud, en período de entrenamiento.',
  },
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

export default function DriversModal({ onClose }) {
  const [selected, setSelected] = useState(null)

  const driver = selected ? DRIVERS_DATA.find(d => d.id === selected) : null

  return (
    <div className="dm-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="dm-container fade-up">

        {/* Header */}
        <div className="dm-header">
          <div className="dm-title">
            <span className="dm-title-icon">🛵</span>
            <div>
              <h2>Equipo de Choferes</h2>
              <span className="dm-subtitle">{DRIVERS_DATA.length} choferes registrados · Miramar</span>
            </div>
          </div>
          <button className="dm-close" onClick={onClose}>✕</button>
        </div>

        {/* Stats summary */}
        <div className="dm-summary-bar">
          {Object.entries(STATUS_COLOR).map(([st, col]) => (
            <div key={st} className="dm-summary-item">
              <span className="dm-summary-dot" style={{ background: col }}></span>
              <span className="dm-summary-label">{st}</span>
              <span className="dm-summary-num">{DRIVERS_DATA.filter(d => d.status === st).length}</span>
            </div>
          ))}
          <div className="dm-summary-item dm-summary-total">
            <span>💰 Ganancias hoy</span>
            <strong>₡{DRIVERS_DATA.reduce((a,d) => a + d.earnings_today, 0).toLocaleString()}</strong>
          </div>
        </div>

        <div className="dm-body">
          {/* Lista de choferes */}
          <div className="dm-list">
            {DRIVERS_DATA.map(d => (
              <button
                key={d.id}
                className={`dm-card ${selected === d.id ? 'selected' : ''}`}
                onClick={() => setSelected(selected === d.id ? null : d.id)}
              >
                <div className="dm-card-left">
                  <div className="dm-avatar" style={{ borderColor: STATUS_COLOR[d.status] }}>
                    {d.emoji}
                    <span className="dm-avatar-dot" style={{ background: STATUS_COLOR[d.status] }}></span>
                  </div>
                  <div className="dm-card-info">
                    <strong>{d.name}</strong>
                    <span className="dm-alias">"{d.alias}"</span>
                    <span className="dm-status" style={{ color: STATUS_COLOR[d.status], background: STATUS_BG[d.status] }}>
                      {d.status}
                    </span>
                  </div>
                </div>
                <div className="dm-card-right">
                  <div className="dm-stat-pill">
                    <span>📦</span><span>{d.tripsToday} hoy</span>
                  </div>
                  <div className="dm-rating">⭐ {d.rating}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Detalle del chofer seleccionado */}
          {driver ? (
            <div className="dm-detail fade-up">
              <div className="dm-detail-header">
                <div className="dm-detail-avatar" style={{ borderColor: STATUS_COLOR[driver.status] }}>
                  {driver.emoji}
                </div>
                <div>
                  <h3>{driver.name}</h3>
                  <p className="dm-detail-alias">"{driver.alias}" · {driver.zone}</p>
                  <span className="dm-detail-status" style={{ color: STATUS_COLOR[driver.status], background: STATUS_BG[driver.status] }}>
                    ● {driver.status}
                  </span>
                </div>
              </div>

              <div className="dm-detail-grid">
                <div className="dm-detail-item">
                  <span className="dm-detail-label">📞 Teléfono</span>
                  <span className="dm-detail-val">{driver.phone}</span>
                </div>
                <div className="dm-detail-item">
                  <span className="dm-detail-label">🛵 Vehículo</span>
                  <span className="dm-detail-val">{driver.vehicle}</span>
                </div>
                <div className="dm-detail-item">
                  <span className="dm-detail-label">🔖 Placa</span>
                  <span className="dm-detail-val mono">{driver.plate}</span>
                </div>
                <div className="dm-detail-item">
                  <span className="dm-detail-label">⭐ Calificación</span>
                  <span className="dm-detail-val">{driver.rating} / 5.0</span>
                </div>
                <div className="dm-detail-item">
                  <span className="dm-detail-label">📦 Viajes hoy</span>
                  <span className="dm-detail-val">{driver.tripsToday}</span>
                </div>
                <div className="dm-detail-item">
                  <span className="dm-detail-label">🏆 Viajes totales</span>
                  <span className="dm-detail-val">{driver.tripsTotal}</span>
                </div>
                <div className="dm-detail-item">
                  <span className="dm-detail-label">💰 Ganancia hoy</span>
                  <span className="dm-detail-val yellow">₡{driver.earnings_today.toLocaleString()}</span>
                </div>
                <div className="dm-detail-item">
                  <span className="dm-detail-label">📅 Ingresó</span>
                  <span className="dm-detail-val">{new Date(driver.joinedDate).toLocaleDateString('es-CR', { year:'numeric', month:'long', day:'numeric' })}</span>
                </div>
              </div>

              <div className="dm-detail-notes">
                <span className="dm-detail-label">📝 Notas</span>
                <p>{driver.notes}</p>
              </div>

              <a
                className="dm-whatsapp-btn"
                href={`https://wa.me/${driver.whatsapp}`}
                target="_blank"
                rel="noreferrer"
              >
                💬 Contactar por WhatsApp
              </a>
            </div>
          ) : (
            <div className="dm-detail dm-detail-empty">
              <span>👈</span>
              <p>Seleccioná un chofer para ver sus datos completos</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
