import React, { useEffect, useRef } from 'react'
import './MapScreen.css'
import { DRIVERS_DATA } from '../DriversModal/DriversModal'

// Coordenadas base — Miramar, Puntarenas
const BASE_LAT = 10.090251463947457
const BASE_LNG = -84.7301023843662

const STATUS_COLOR = {
  'Disponible': '#ECF244',
  'En Viaje':   '#44c2f2',
  'Descanso':   '#f27444',
}

export default function MapScreen({ onBack, selectedDriverId }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)

  useEffect(() => {
    let isMounted = true
    let mapInstance = null

    import('leaflet').then(async leaflet => {
      if (!isMounted) return
      const L = leaflet.default

      if (!mapRef.current) return

      // Evitar doble init en HMR
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }

      // Center on selected driver if provided
      let centerCoords = [BASE_LAT, BASE_LNG]
      if (selectedDriverId) {
        const sd = DRIVERS_DATA.find(d => d.id === selectedDriverId)
        if (sd) centerCoords = [sd.lat, sd.lng]
      }

      const map = L.map(mapRef.current, {
        center: centerCoords,
        zoom: 15,
        zoomControl: false,
        attributionControl: false,
      })

      setTimeout(() => {
        if (isMounted && map) map.invalidateSize()
      }, 100)

      mapInstance = map
      mapInstanceRef.current = map

      // Tiles oscuros CartoDB Dark Matter
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        {
          attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 19,
        }
      ).addTo(map)

      // Zoom controls esquina inferior derecha
      L.control.zoom({ position: 'bottomright' }).addTo(map)

      // Pin central (base)
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

      // Pines de choferes
      DRIVERS_DATA.forEach(driver => {
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

        const marker = L.marker([driver.lat, driver.lng], { icon: driverIcon }).addTo(map)

        marker.bindPopup(`
          <div class="map-popup">
            <strong>${driver.name}</strong><br/>
            <span style="color:${color}">● ${driver.status}</span><br/>
            <span style="color:#aaa; font-size:0.8em">📦 ${driver.tripsToday} viajes hoy</span>
          </div>
        `, { className: 'dark-popup' })

        // Auto-open popup if this is the selected driver
        if (selectedDriverId && driver.id === selectedDriverId) {
          setTimeout(() => {
            if (isMounted) marker.openPopup()
          }, 350)
        }
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
      isMounted = false
      if (mapInstance) {
        mapInstance.remove()
      } else if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  return (
    <div className="map-screen">

      {/* Header */}
      <div className="map-screen-header">
        <button className="map-screen-back" onClick={onBack} aria-label="Volver">
          ‹ Volver
        </button>
        <div className="map-screen-title">
          <span className="map-screen-dot"></span>
          <span>Miramar en Vivo</span>
          <span className="map-screen-sub">· Miramar, Puntarenas</span>
        </div>
        <div className="map-screen-legend">
          {Object.entries(STATUS_COLOR).map(([status, color]) => (
            <div key={status} className="map-legend-item">
              <div className="map-legend-dot" style={{ background: color }}></div>
              <span>{status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Map fills remaining space */}
      <div className="map-screen-map" ref={mapRef}></div>

      {/* Footer */}
      <div className="map-screen-footer">
        <span>📍 {BASE_LAT.toFixed(5)}, {BASE_LNG.toFixed(5)}</span>
        <span className="map-footer-sep">·</span>
        <span>🛵 {DRIVERS_DATA.filter(d => d.status === 'Disponible').length} disponibles</span>
        <span className="map-footer-sep">·</span>
        <span>⚡ {DRIVERS_DATA.filter(d => d.status === 'En Viaje').length} en viaje</span>
        <span className="map-footer-sep map-footer-right">·</span>
        <span>CartoDB Dark Matter</span>
      </div>

    </div>
  )
}
