import React from 'react'
import './AdminDrivers.css'

export default function AdminDrivers() {
  const mockDrivers = [
    { id: 1, name: 'Juan Perez', status: 'Disponible', x: 20, y: 30 },
    { id: 2, name: 'Carlos R.', status: 'En Viaje', x: 70, y: 50 },
    { id: 3, name: 'María L.', status: 'Disponible', x: 40, y: 75 },
  ]

  return (
    <div className="admin-drivers fade-up">
      <div className="map-container">
        {/* Simulación del fondo del mapa usando CSS de cuadrícula */}
        <div className="map-grid-bg"></div>

        {/* Pines de choferes en el mapa */}
        {mockDrivers.map(driver => (
          <div 
            key={driver.id} 
            className={`driver-pin ${driver.status === 'Disponible' ? 'available' : 'busy'}`}
            style={{ left: `${driver.x}%`, top: `${driver.y}%` }}
          >
            <div className="pin-avatar">🛵</div>
            <div className="pin-info">
              <span className="pin-name">{driver.name}</span>
              <span className="pin-status">{driver.status}</span>
            </div>
          </div>
        ))}

        {/* Modal/Aviso de Próximamente flotante */}
        <div className="drivers-prox-overlay">
          <div className="drivers-prox-card">
            <div className="drivers-prox-icon">📡</div>
            <div className="drivers-prox-badge">En Desarrollo</div>
            <h3>Asignación de Choferes</h3>
            <p>
              Próximamente podrás ver a todos los choferes en tiempo real sobre el mapa de Miramar, asignarles viajes automáticamente según cercanía, y ver el estatus de las entregas.
            </p>
            <button className="drivers-prox-btn">Solicitar Acceso Anticipado</button>
          </div>
        </div>
      </div>
    </div>
  )
}
