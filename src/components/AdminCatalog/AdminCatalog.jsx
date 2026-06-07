import React, { useState } from 'react'
import './AdminCatalog.css'

const CATEGORIES = [
  { id: 'mandados',   label: 'Mandados',   emoji: '🛵' },
  { id: 'super',      label: 'Súper',      emoji: '🛒' },
  { id: 'farmacia',   label: 'Farmacia',   emoji: '💊' },
  { id: 'ferreteria', label: 'Ferretería', emoji: '🔧' },
]

function Toast({ msg, onDone }) {
  React.useEffect(() => {
    const t = setTimeout(onDone, 2200)
    return () => clearTimeout(t)
  }, [onDone])
  return <div className="ac-toast">{msg}</div>
}

export default function AdminCatalog({ products, setProducts, restaurants, setRestaurants }) {
  const [activeTab, setActiveTab] = useState('restaurants')
  const [filterCat, setFilterCat] = useState('all')
  const [toast, setToast] = useState(null)

  const showToast = (msg) => setToast(msg)

  // ── RESTAURANT CRUD ──────────────────────────────────────
  const handleRestaurantChange = (id, field, value) => {
    setRestaurants(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r))
  }

  const handleAddRestaurant = () => {
    const newId = `r${Date.now()}`
    setRestaurants(prev => [...prev, { id: newId, emoji: '🍽️', name: 'Nuevo Local', tag: 'Categoría · Tipo', color: '#1a1a1a' }])
    showToast('✅ Restaurante añadido')
  }

  const handleDeleteRestaurant = (id) => {
    setRestaurants(prev => prev.filter(r => r.id !== id))
    showToast('🗑️ Restaurante eliminado')
  }

  // ── PRODUCT CRUD ─────────────────────────────────────────
  const handleProductChange = (id, field, value) => {
    setProducts(prev => prev.map(p =>
      p.id === id ? { ...p, [field]: field === 'price' ? Number(value) : value } : p
    ))
  }

  const handleAddProduct = () => {
    const newId = Date.now()
    const firstCat = filterCat === 'all' ? 'super' : filterCat
    setProducts(prev => [...prev, { id: newId, cat: firstCat, emoji: '📦', name: 'Nuevo Producto', shop: 'Tienda', price: 1000 }])
    showToast('✅ Producto añadido')
  }

  const handleDeleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id))
    showToast('🗑️ Producto eliminado')
  }

  const filteredProducts = filterCat === 'all' ? products : products.filter(p => p.cat === filterCat)

  return (
    <div className="admin-catalog">
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}

      {/* Tab switcher */}
      <div className="ac-tabs">
        <button className={`ac-tab ${activeTab === 'restaurants' ? 'active' : ''}`} onClick={() => setActiveTab('restaurants')}>
          🍽️ Restaurantes <span className="ac-count">{restaurants.length}</span>
        </button>
        <button className={`ac-tab ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
          📦 Productos <span className="ac-count">{products.length}</span>
        </button>
      </div>

      {/* ── RESTAURANTS TAB ─────────────────────────────── */}
      {activeTab === 'restaurants' && (
        <div className="admin-section fade-up">
          <div className="admin-section-header">
            <div>
              <h2>Locales de Comida</h2>
              <p>Los cambios se reflejan en tiempo real en la app del cliente.</p>
            </div>
            <button className="ac-add-btn" onClick={handleAddRestaurant}>+ Agregar Local</button>
          </div>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Emoji</th>
                  <th>Nombre</th>
                  <th>Categoría / Tag</th>
                  <th>Color HEX</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {restaurants.map(r => (
                  <tr key={r.id}>
                    <td>
                      <input className="admin-input small" value={r.emoji} onChange={e => handleRestaurantChange(r.id, 'emoji', e.target.value)} />
                    </td>
                    <td>
                      <input className="admin-input" value={r.name} onChange={e => handleRestaurantChange(r.id, 'name', e.target.value)} />
                    </td>
                    <td>
                      <input className="admin-input" value={r.tag} onChange={e => handleRestaurantChange(r.id, 'tag', e.target.value)} />
                    </td>
                    <td>
                      <div className="color-input-wrap">
                        <div className="color-preview" style={{ backgroundColor: r.color }}></div>
                        <input className="admin-input small-hex" value={r.color} onChange={e => handleRestaurantChange(r.id, 'color', e.target.value)} />
                      </div>
                    </td>
                    <td>
                      <button className="ac-delete-btn" onClick={() => handleDeleteRestaurant(r.id)} title="Eliminar">✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── PRODUCTS TAB ─────────────────────────────────── */}
      {activeTab === 'products' && (
        <div className="admin-section fade-up" key="products">
          <div className="admin-section-header">
            <div>
              <h2>Productos</h2>
              <p>Súper, Farmacia, Ferretería y Mandados.</p>
            </div>
            <button className="ac-add-btn" onClick={handleAddProduct}>+ Agregar Producto</button>
          </div>

          {/* Category filter pills */}
          <div className="ac-cat-filter">
            <button className={`ac-cat-pill ${filterCat === 'all' ? 'active' : ''}`} onClick={() => setFilterCat('all')}>
              Todos <span className="ac-count">{products.length}</span>
            </button>
            {CATEGORIES.map(c => (
              <button key={c.id} className={`ac-cat-pill ${filterCat === c.id ? 'active' : ''}`} onClick={() => setFilterCat(c.id)}>
                {c.emoji} {c.label} <span className="ac-count">{products.filter(p => p.cat === c.id).length}</span>
              </button>
            ))}
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Emoji</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Tienda</th>
                  <th>Precio (₡)</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(p => (
                  <tr key={p.id}>
                    <td>
                      <input className="admin-input small" value={p.emoji} onChange={e => handleProductChange(p.id, 'emoji', e.target.value)} />
                    </td>
                    <td>
                      <input className="admin-input" value={p.name} onChange={e => handleProductChange(p.id, 'name', e.target.value)} />
                    </td>
                    <td>
                      <select
                        className="admin-input admin-select"
                        value={p.cat}
                        onChange={e => handleProductChange(p.id, 'cat', e.target.value)}
                      >
                        {CATEGORIES.map(c => (
                          <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input className="admin-input" value={p.shop} onChange={e => handleProductChange(p.id, 'shop', e.target.value)} />
                    </td>
                    <td>
                      <input className="admin-input small-num" type="number" value={p.price} onChange={e => handleProductChange(p.id, 'price', e.target.value)} />
                    </td>
                    <td>
                      <button className="ac-delete-btn" onClick={() => handleDeleteProduct(p.id)} title="Eliminar">✕</button>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="ac-empty-row">No hay productos en esta categoría</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
