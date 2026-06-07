import React, { useEffect, useRef } from 'react'
import { DRIVERS_DATA } from '../DriversModal/DriversModal'

const BASE_LAT = 10.090251463947457
const BASE_LNG = -84.7301023843662

const STATUS_COLOR = {
  'Disponible': '#ECF244',
  'En Viaje':   '#44c2f2',
  'Descanso':   '#f27444',
}

export default function MiniMapPreview({ selectedDriverId, onClose, onShowDetails }) {
  const mapRef        = useRef(null)
  const mapInstanceRef = useRef(null)

  useEffect(() => {
    let isMounted = true
    let mapInstance = null

    import('leaflet').then(leaflet => {
      if (!isMounted || !mapRef.current) return
      const L = leaflet.default

      // Si ya existía un mapa guardado en el ref de la instancia, lo eliminamos.
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove()
        } catch (e) {
          console.warn(e)
        }
        mapInstanceRef.current = null
      }

      // Adicionalmente, Leaflet guarda en la propiedad interna del elemento del DOM si ya tiene un mapa.
      if (mapRef.current && mapRef.current._leaflet_id) {
        mapRef.current._leaflet_id = null
      }

      let centerCoords = [BASE_LAT, BASE_LNG]
      const sd = DRIVERS_DATA.find(d => d.id === selectedDriverId)
      if (sd) {
        centerCoords = [sd.lat, sd.lng]
      }

      const map = L.map(mapRef.current, {
        center: centerCoords,
        zoom: 15,
        zoomControl: false,
        attributionControl: false,
        dragging: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        boxZoom: true,
        keyboard: true,
        touchZoom: true,
      })

      setTimeout(() => {
        if (isMounted && map) map.invalidateSize()
      }, 100)

      mapInstance = map
      mapInstanceRef.current = map

      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        { subdomains: 'abcd', maxZoom: 19 }
      ).addTo(map)

      // Base pin
      const baseIcon = L.divIcon({
        className: '',
        html: `
          <div class="map-pin-base">
            <div class="map-pin-pulse-ring base-pulse"></div>
            <div class="map-pin-inner base-inner">🏠</div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      })
      L.marker([BASE_LAT, BASE_LNG], { icon: baseIcon }).addTo(map)

      // Pines de choferes
      if (sd) {
        // Mostrar SOLO el seleccionado
        const color = STATUS_COLOR[sd.status] || '#ECF244'
        const driverIcon = L.divIcon({
          className: '',
          html: `
            <div class="map-pin-driver mini-pin-selected" style="--pin-color: ${color}">
              <div class="map-pin-pulse-ring driver-pulse" style="border-color: ${color}"></div>
              <div class="map-pin-inner driver-inner" style="transform:scale(1.3)">🛵</div>
              <div class="map-pin-label">${sd.name.split(' ')[0]}</div>
            </div>
          `,
          iconSize: [48, 56],
          iconAnchor: [24, 44],
        })
        const marker = L.marker([sd.lat, sd.lng], { icon: driverIcon }).addTo(map)
        marker.bindPopup(`
          <div class="map-popup">
            <strong>${sd.name}</strong><br/>
            <span style="color:${color}">● ${sd.status}</span><br/>
            <span style="color:#aaa; font-size:0.85em; display:block; margin-bottom: 6px;">📦 ${sd.tripsToday} viajes hoy</span>
            <button id="popup-more-details-btn" class="popup-detail-btn">Ver más detalles</button>
          </div>
        `, { className: 'dark-popup' })
        
        setTimeout(() => {
          if (isMounted) marker.openPopup()
        }, 400)
      } else {
        // Mostrar TODOS los choferes si no hay uno seleccionado específicamente
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
            iconSize: [48, 56],
            iconAnchor: [24, 44],
          })
          const marker = L.marker([driver.lat, driver.lng], { icon: driverIcon }).addTo(map)
          marker.bindPopup(`
            <div class="map-popup">
              <strong>${driver.name}</strong><br/>
              <span style="color:${color}">● ${driver.status}</span><br/>
              <span style="color:#aaa; font-size:0.85em; display:block; margin-bottom: 6px;">📦 ${driver.tripsToday} viajes hoy</span>
              <button data-driver-id="${driver.id}" class="popup-detail-btn list-popup-btn">Ver más detalles</button>
            </div>
          `, { className: 'dark-popup' })
        })
      }

      // Event listener cuando se abre un popup para interceptar el clic del botón
      map.on('popupopen', (e) => {
        const popupNode = e.popup.getElement()
        if (!popupNode) return

        const singleBtn = popupNode.querySelector('#popup-more-details-btn')
        if (singleBtn) {
          singleBtn.onclick = () => {
            if (onShowDetails && sd) onShowDetails(sd.id)
          }
        }

        const listBtns = popupNode.querySelectorAll('.list-popup-btn')
        listBtns.forEach(btn => {
          btn.onclick = () => {
            const id = parseInt(btn.getAttribute('data-driver-id'), 10)
            if (onShowDetails) onShowDetails(id)
          }
        })
      })

      // Coverage circle
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
        try {
          mapInstance.remove()
        } catch (e) {
          console.warn(e)
        }
      } else if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove()
        } catch (e) {
          console.warn(e)
        }
        mapInstanceRef.current = null
      }
    }
  }, [selectedDriverId])

  return (
    <div className="mini-map-wrapper">
      {/* Label top-left */}
      <div className="mini-map-badge">
        <span className="mini-map-dot" />
        Vista Previa Miramar
      </div>

      {/* Leaflet map */}
      <div className="mini-map-leaflet" ref={mapRef} />

      {/* Close button */}
      <button className="mini-map-close-btn" onClick={onClose} title="Salir y volver al mapa general">
        ✕ Salir del mapa
      </button>
    </div>
  )
}


