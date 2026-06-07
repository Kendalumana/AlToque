import React, { useState, useEffect } from 'react'
import './AdminCatalog.css'
import { PRODUCTS as INITIAL_PRODUCTS } from '../../data/products'
import { RESTAURANTS as INITIAL_RESTAURANTS } from '../../data/restaurants'

const CATEGORIES = [
  { id: 'all',        label: 'Todos',      emoji: '📋' },
  { id: 'mandados',   label: 'Mandados',   emoji: '🛵' },
  { id: 'super',      label: 'Súper',      emoji: '🛒' },
  { id: 'farmacia',   label: 'Farmacia',   emoji: '💊' },
  { id: 'ferreteria', label: 'Ferretería', emoji: '🔧' },
]

const CAT_LABEL = { mandados: 'Mandados', super: 'Súper', farmacia: 'Farmacia', ferreteria: 'Ferretería' }

// ── Modal Confirmación Eliminar ────────────────────────────
function DeleteConfirmModal({ item, onConfirm, onCancel }) {
  return (
    <div className="ac-modal-overlay" onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="ac-modal-box fade-up">
        <div className="ac-modal-icon">🗑️</div>
        <h3>¿Eliminar este item?</h3>
        <p>
          <strong>{item.emoji} {item.name || item.tag}</strong><br />
          Esta acción no se puede deshacer.
        </p>
        <div className="ac-modal-actions">
          <button className="ac-modal-cancel" onClick={onCancel}>Cancelar</button>
          <button className="ac-modal-confirm" onClick={onConfirm}>Siguiente →</button>
        </div>
      </div>
    </div>
  )
}

// ── Modal Formulario Nuevo Local (ficticio) ─────────────────
function AddLocalModal({ onClose }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ emoji: '🍽️', name: '', tag: '', desc: '' })

  const handleChange = (field, val) => setForm(f => ({ ...f, [field]: val }))

  return (
    <div className="ac-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="ac-modal-box ac-form-box fade-up">
        {step === 1 && (
          <>
            <div className="ac-modal-icon">🏪</div>
            <h3>Nuevo Local de Comida</h3>
            <p className="ac-form-subtitle">Completá los datos básicos del establecimiento.</p>
            <div className="ac-form-group">
              <label>Emoji del local</label>
              <input className="ac-form-input small-c" value={form.emoji} onChange={e => handleChange('emoji', e.target.value)} maxLength={2} />
            </div>
            <div className="ac-form-group">
              <label>Nombre del local</label>
              <input className="ac-form-input" placeholder="Ej: La Soda de Doña Ana" value={form.name} onChange={e => handleChange('name', e.target.value)} />
            </div>
            <div className="ac-form-group">
              <label>Categoría / Tipo de comida</label>
              <input className="ac-form-input" placeholder="Ej: Comida casera · Almuerzo" value={form.tag} onChange={e => handleChange('tag', e.target.value)} />
            </div>
            <div className="ac-modal-actions">
              <button className="ac-modal-cancel" onClick={onClose}>Cancelar</button>
              <button className="ac-modal-confirm" onClick={() => setStep(2)} disabled={!form.name}>
                Siguiente →
              </button>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <div className="ac-modal-icon">📸</div>
            <h3>Foto y descripción</h3>
            <p className="ac-form-subtitle">Agregá una imagen y descripción del local.</p>
            <div className="ac-form-group">
              <label>URL de imagen</label>
              <input className="ac-form-input" placeholder="https://…" />
              <span className="ac-form-hint">Próximamente: subida directa de fotos</span>
            </div>
            <div className="ac-form-group">
              <label>Descripción breve</label>
              <textarea className="ac-form-input ac-textarea" placeholder="Describe el local y sus especialidades…" value={form.desc} onChange={e => handleChange('desc', e.target.value)} rows={3} />
            </div>
            <div className="ac-modal-actions">
              <button className="ac-modal-cancel" onClick={() => setStep(1)}>← Atrás</button>
              <button className="ac-modal-confirm" onClick={() => setStep(3)}>Siguiente →</button>
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <div className="ac-modal-icon success-icon">✅</div>
            <h3>¡Local registrado!</h3>
            <div className="ac-preview-card">
              <span className="ac-preview-emoji">{form.emoji}</span>
              <div>
                <strong>{form.name || 'Nuevo Local'}</strong>
                <p>{form.tag || 'Sin categoría'}</p>
              </div>
            </div>
            <div className="ac-prox-note">
              <span>🚀</span>
              <span>La integración real con la base de datos estará disponible próximamente. Por ahora los datos se guardan en modo demostración.</span>
            </div>
            <button className="ac-modal-confirm full-btn" onClick={onClose}>Entendido</button>
          </>
        )}
      </div>
    </div>
  )
}

// ── Componente Principal ────────────────────────────────────
export default function AdminCatalog({ products, setProducts, restaurants, setRestaurants }) {
  const [activeTab, setActiveTab] = useState('restaurants')
  const [filterCat, setFilterCat] = useState('all')
  const [deleteTarget, setDeleteTarget] = useState(null)   // { type: 'product'|'restaurant', item }
  const [showAddLocal, setShowAddLocal] = useState(false)

  // Resetear localStorage y recargar datos originales al montar
  useEffect(() => {
    localStorage.removeItem('alToqueProducts')
    localStorage.removeItem('alToqueRestaurants')
    setProducts(INITIAL_PRODUCTS)
    setRestaurants(INITIAL_RESTAURANTS)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleConfirmDelete = () => {
    if (!deleteTarget) return
    if (deleteTarget.type === 'product') {
      setProducts(prev => prev.filter(p => p.id !== deleteTarget.item.id))
    } else {
      setRestaurants(prev => prev.filter(r => r.id !== deleteTarget.item.id))
    }
    setDeleteTarget(null)
  }

  const filteredProducts = filterCat === 'all' ? products : products.filter(p => p.cat === filterCat)

  return (
    <div className="admin-catalog">

      {/* Modals */}
      {deleteTarget && (
        <DeleteConfirmModal
          item={deleteTarget.item}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
      {showAddLocal && <AddLocalModal onClose={() => setShowAddLocal(false)} />}

      {/* Tabs */}
      <div className="ac-tabs">
        <button className={`ac-tab ${activeTab === 'restaurants' ? 'active' : ''}`} onClick={() => setActiveTab('restaurants')}>
          🍽️ Restaurantes <span className="ac-count">{restaurants.length}</span>
        </button>
        <button className={`ac-tab ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
          📦 Productos <span className="ac-count">{products.length}</span>
        </button>
      </div>

      {/* ── RESTAURANTES ─────────────────────────────────── */}
      {activeTab === 'restaurants' && (
        <div className="admin-section fade-up">
          <div className="admin-section-header">
            <div>
              <h2>Locales de Comida</h2>
              <p>Vista de administración · Los cambios se reflejan en la app del cliente.</p>
            </div>
            <button className="ac-add-btn" onClick={() => setShowAddLocal(true)}>+ Agregar Local</button>
          </div>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Local</th>
                  <th>Categoría</th>
                  <th>Estilo de color</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {restaurants.map(r => (
                  <tr key={r.id}>
                    <td>
                      <div className="ac-item-cell">
                        <span className="ac-item-emoji">{r.emoji}</span>
                        <span className="ac-item-name">{r.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="ac-tag-chip">{r.tag}</span>
                    </td>
                    <td>
                      <span className="ac-prox-chip">🎨 Próximamente</span>
                    </td>
                    <td>
                      <button
                        className="ac-delete-btn"
                        onClick={() => setDeleteTarget({ type: 'restaurant', item: r })}
                        title="Eliminar"
                      >✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── PRODUCTOS ────────────────────────────────────── */}
      {activeTab === 'products' && (
        <div className="admin-section fade-up">
          <div className="admin-section-header">
            <div>
              <h2>Productos del Catálogo</h2>
              <p>Súper, Farmacia, Ferretería y Mandados.</p>
            </div>
          </div>

          {/* Filtro por categoría */}
          <div className="ac-cat-filter">
            {CATEGORIES.map(c => (
              <button
                key={c.id}
                className={`ac-cat-pill ${filterCat === c.id ? 'active' : ''}`}
                onClick={() => setFilterCat(c.id)}
              >
                {c.emoji} {c.label}
                <span className="ac-count">
                  {c.id === 'all' ? products.length : products.filter(p => p.cat === c.id).length}
                </span>
              </button>
            ))}
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Tienda</th>
                  <th>Precio</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div className="ac-item-cell">
                        <span className="ac-item-emoji">{p.emoji}</span>
                        <span className="ac-item-name">{p.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="ac-cat-chip">{CAT_LABEL[p.cat] || p.cat}</span>
                    </td>
                    <td className="ac-muted">{p.shop}</td>
                    <td>
                      <span className="ac-price">₡{p.price.toLocaleString()}</span>
                    </td>
                    <td>
                      <button
                        className="ac-delete-btn"
                        onClick={() => setDeleteTarget({ type: 'product', item: p })}
                        title="Eliminar"
                      >✕</button>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="ac-empty-row">Sin productos en esta categoría</td>
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
