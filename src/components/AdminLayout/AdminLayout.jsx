import React, { useState } from 'react'
import './AdminLayout.css'
import AdminCatalog from '../AdminCatalog/AdminCatalog'
import AdminDrivers from '../AdminDrivers/AdminDrivers'
import DriversModal from '../DriversModal/DriversModal'
import { DRIVERS_DATA } from '../DriversModal/DriversModal'
import { PRODUCTS as INITIAL_PRODUCTS } from '../../data/products'
import { RESTAURANTS as INITIAL_RESTAURANTS } from '../../data/restaurants'

const NAV_ITEMS = [
  { id: 'catalog', icon: '📦', label: 'Catálogo' },
  { id: 'drivers', icon: '🗺️', label: 'Choferes' },
]

export default function AdminLayout({ 
  onLogout, 
  products, 
  setProducts, 
  restaurants, 
  setRestaurants 
}) {
  const [activeTab, setActiveTab] = useState('catalog')
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [showDriversModal, setShowDriversModal] = useState(false)

  const handleReset = () => {
    setProducts(INITIAL_PRODUCTS)
    setRestaurants(INITIAL_RESTAURANTS)
    localStorage.removeItem('alToqueProducts')
    localStorage.removeItem('alToqueRestaurants')
    setShowResetConfirm(false)
  }

  const availableCount = DRIVERS_DATA.filter(d => d.status === 'Disponible').length
  const busyCount      = DRIVERS_DATA.filter(d => d.status === 'En Viaje').length

  return (
    <>
      {showDriversModal && <DriversModal onClose={() => setShowDriversModal(false)} />}

      <div className="admin-layout">
        <aside className="admin-sidebar">
          {/* Brand */}
          <div className="admin-brand">
            <img src="/resources/AlToqueIcon.jpeg" alt="Logo" className="admin-logo" />
            <div>
              <h2>Al Toque</h2>
              <span>Admin Panel</span>
            </div>
          </div>

          {/* Nav */}
          <nav className="admin-nav">
            {NAV_ITEMS.map(item => (
              <button 
                key={item.id}
                className={`admin-nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
                {item.id === 'catalog' && (
                  <span className="nav-badge">{products.length + restaurants.length}</span>
                )}
                {item.id === 'drivers' && (
                  <span className="nav-badge drivers-badge">{DRIVERS_DATA.length}</span>
                )}
              </button>
            ))}

          </nav>

          {/* Bottom */}
          <div className="admin-sidebar-bottom">
            {showResetConfirm ? (
              <div className="admin-reset-confirm">
                <p>¿Restablecer datos originales?</p>
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <button className="admin-reset-yes" onClick={handleReset}>Sí, restablecer</button>
                  <button className="admin-reset-no" onClick={() => setShowResetConfirm(false)}>Cancelar</button>
                </div>
              </div>
            ) : (
              <button className="admin-reset-btn" onClick={() => setShowResetConfirm(true)}>
                🔄 Restablecer datos
              </button>
            )}

            <button className="admin-logout" onClick={onLogout}>
              ← Salir a Perfiles
            </button>
          </div>
        </aside>

        <main className="admin-main">
          <header className="admin-header">
            <div>
              <h1>{activeTab === 'catalog' ? 'Gestión de Catálogo' : 'Gestión de Choferes'}</h1>
              <p className="admin-header-sub">
                {activeTab === 'catalog' 
                  ? `${products.length} productos · ${restaurants.length} restaurantes` 
                  : `${availableCount} disponibles · ${busyCount} en viaje`}
              </p>
            </div>
            <div className="admin-header-right">
              <div className="admin-user-badge">
                <span>Admin</span>
                <div className="admin-avatar">🛡️</div>
              </div>
            </div>
          </header>

          <div className="admin-content">
            {activeTab === 'catalog' && (
              <AdminCatalog 
                products={products} setProducts={setProducts}
                restaurants={restaurants} setRestaurants={setRestaurants}
              />
            )}
            {activeTab === 'drivers' && (
              <AdminDrivers onOpenDrivers={() => setShowDriversModal(true)} />
            )}
          </div>
        </main>
      </div>
    </>
  )
}
