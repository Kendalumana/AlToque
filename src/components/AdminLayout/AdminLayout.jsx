import React, { useState } from 'react'
import './AdminLayout.css'
import AdminCatalog from '../AdminCatalog/AdminCatalog'
import AdminDrivers from '../AdminDrivers/AdminDrivers'

export default function AdminLayout({ 
  onLogout, 
  products, 
  setProducts, 
  restaurants, 
  setRestaurants 
}) {
  const [activeTab, setActiveTab] = useState('catalog')

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <img src="/resources/AlToqueIcon.jpeg" alt="Logo" className="admin-logo" />
          <div>
            <h2>Al Toque</h2>
            <span>Admin Panel</span>
          </div>
        </div>

        <nav className="admin-nav">
          <button 
            className={`admin-nav-item ${activeTab === 'catalog' ? 'active' : ''}`}
            onClick={() => setActiveTab('catalog')}
          >
            📦 Catálogo
          </button>
          <button 
            className={`admin-nav-item ${activeTab === 'drivers' ? 'active' : ''}`}
            onClick={() => setActiveTab('drivers')}
          >
            🗺️ Choferes
          </button>
        </nav>

        <button className="admin-logout" onClick={onLogout}>
          ← Salir a Perfiles
        </button>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <h1>{activeTab === 'catalog' ? 'Gestión de Catálogo' : 'Gestión de Choferes'}</h1>
          <div className="admin-user-badge">
            <span>Admin</span>
            <div className="admin-avatar">🛡️</div>
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
            <AdminDrivers />
          )}
        </div>
      </main>
    </div>
  )
}
