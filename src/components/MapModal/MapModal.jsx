import React, { useEffect, useRef } from 'react'
import './MapModal.css'

// Coordenadas base — Miramar, Puntarenas
const BASE_LAT = 10.09138776666114
const BASE_LNG = -84.73065635505705

// Choferes simulados cerca de la zona
const DRIVERS = [
  { id: 1, name: 'Juan Perez',  status: 'Disponible', lat: BASE_LAT + 0.003,  lng: BASE_LNG - 0.002,  orders: 7  },
  { id: 2, name: 'Carlos R.',   status: 'En Viaje',   lat: BASE_LAT - 0.005,  lng: BASE_LNG + 0.004,  orders: 12 },
  { id: 3, name: 'María L.',    status: 'Disponible', lat: BASE_LAT + 0.007,  lng: BASE_LNG + 0.006,  orders: 5  },
  { id: 4, name: 'Diego M.',    status: 'Descanso',   lat: BASE_LAT - 0.002,  lng: BASE_LNG - 0.007,  orders: 3  },
]

const STATUS_COLOR = {
  'Disponible': '#ECF244',
  'En Viaje':   '#44c2f2',
  'Descanso':   '#f27444',
}

export default function MapModal({ onClose }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)

  useEffect(() => {
    // Importar Leaflet dinámicamente
    let L
    import('leaflet').then(leaflet => {
      L = leaflet.default

      // Evitar doble init en HMR
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }

      const map = L.map(mapRef.current, {
        center: [BASE_LAT, BASE_LNG],
        zoom: 15,
        zoomControl: false,
        attributionControl: false,
      })

      mapInstanceRef.current = map

      // ── Tiles oscuros: CartoDB Dark Matter (gratuitos, sin API key) ──
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        {
          attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 19,
        }
      ).addTo(map)

      // Zoom controls personalizados (esquina inferior derecha)
      L.control.zoom({ position: 'bottomright' }).addTo(map)

      // ── Pin central (sede / base) ──
      const baseIcon = L.divIcon({
        className: '',
        html: `
          <div class="map-pin-base">
            <div class="map-pin-pulse-ring base-pulse"></div>
            <div class="map-pin-inner base-inner">🏠</div>
          </div>
        `,
        iconSize: [48, 48],
        iconAnchor: [24, 24],
      })

      L.marker([BASE_LAT, BASE_LNG], { icon: baseIcon })
        .addTo(map)
        .bindPopup(`
          <div class="map-popup">
            <strong>📍 Al Toque Multiservicios</strong><br/>
            <span>Base Central · Miramar</span>
          </div>
        `, { className: 'dark-popup' })

      // ── Pines de choferes ──
      DRIVERS.forEach(driver => {
        const color = STATUS_COLOR[driver.status] || '#ECF244'
        const driverIcon = L.divIcon({
          className: '',
          html: `
            <div class="map-pin-driver" style="--pin-color: ${color}">
              <div class="map-pin-pulse-ring driver-pulse" style="border-color: ${color}"></div>
              <div class="map-pin-inner driver-inner">🛵</div>
              <div class="map-pin-label">${driver.name.split(' ')[0]}</div>
            </div>
          `,
          iconSize: [56, 64],
          iconAnchor: [28, 48],
        })

        L.marker([driver.lat, driver.lng], { icon: driverIcon })
          .addTo(map)
          .bindPopup(`
            <div class="map-popup">
              <strong>${driver.name}</strong><br/>
              <span style="color:${color}">● ${driver.status}</span><br/>
              <span style="color:#aaa; font-size:0.8em">📦 ${driver.orders} viajes hoy</span>
            </div>
          `, { className: 'dark-popup' })
      })

      // Radio de cobertura
      L.circle([BASE_LAT, BASE_LNG], {
        radius: 800,
        color: '#ECF244',
        fillColor: '#ECF244',
        fillOpacity: 0.04,
        weight: 1.5,
        dashArray: '6 6',
        opacity: 0.35,
      }).addTo(map)

    })

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // Cerrar con Escape
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div className="map-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="map-modal-container">

        {/* Header */}
        <div className="map-modal-header">
          <div className="map-modal-title">
            <span className="map-modal-dot"></span>
            <span>Miramar en Vivo</span>
            <span className="map-modal-sub">· Miramar, Puntarenas, Costa Rica</span>
          </div>
          <div className="map-modal-legend">
            {Object.entries(STATUS_COLOR).map(([status, color]) => (
              <div key={status} className="map-legend-item">
                <div className="map-legend-dot" style={{ background: color }}></div>
                <span>{status}</span>
              </div>
            ))}
          </div>
          <button className="map-modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Map */}
        <div className="map-modal-map" ref={mapRef}></div>

        {/* Footer */}
        <div className="map-modal-footer">
          <span>📍 {BASE_LAT.toFixed(5)}, {BASE_LNG.toFixed(5)}</span>
          <span className="map-footer-sep">·</span>
          <span>🛵 {DRIVERS.filter(d => d.status === 'Disponible').length} disponibles</span>
          <span className="map-footer-sep">·</span>
          <span>⚡ {DRIVERS.filter(d => d.status === 'En Viaje').length} en viaje</span>
          <span className="map-footer-sep map-footer-right">·</span>
          <span>Tiles: CartoDB Dark Matter</span>
        </div>

      </div>
    </div>
  )
}
