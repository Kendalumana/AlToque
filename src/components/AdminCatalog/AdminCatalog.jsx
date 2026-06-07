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

const CAT_LABEL = {
  mandados: 'Mandados', super: 'Súper', farmacia: 'Farmacia', ferreteria: 'Ferretería'
}

/* ─────────────────────────────────────────────────────────
   Modal Editar Local (solo vista, próximamente real)
───────────────────────────────────────────────────────── */
function EditLocalModal({ local, onClose }) {
  return (
    <div className="ac-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="ac-modal-box ac-form-box fade-up">
        <button className="ac-modal-x" onClick={onClose}>✕</button>
        <div className="ac-modal-icon">✏️</div>
        <h3>Editar Local</h3>
        <p className="ac-form-subtitle">Vista previa de edición para <strong>{local.name}</strong></p>

        <div className="ac-form-group">
          <label>Emoji</label>
          <input className="ac-form-input small-c" defaultValue={local.emoji} />
        </div>
        <div className="ac-form-group">
          <label>Nombre del local</label>
          <input className="ac-form-input" defaultValue={local.name} />
        </div>
        <div className="ac-form-group">
          <label>Categoría / Tag</label>
          <input className="ac-form-input" defaultValue={local.tag} />
        </div>

        <div className="ac-prox-banner">
          <span className="ac-prox-badge">🚀 Próximamente</span>
          <p>La edición real de locales se habilitará junto con la integración a base de datos. Por ahora es modo demostración.</p>
        </div>

        <button className="ac-modal-confirm full-btn" onClick={onClose}>Entendido</button>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   Modal Agregar Nuevo Local — formulario animado en pasos
───────────────────────────────────────────────────────── */
function AddLocalModal({ onClose }) {
  const [step, setStep] = useState(1)
  const TOTAL = 3
  const [form, setForm] = useState({ emoji: '🍽️', name: '', tag: '', phone: '', schedule: '' })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="ac-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="ac-modal-box ac-form-box fade-up">
        <button className="ac-modal-x" onClick={onClose}>✕</button>

        {/* Progress bar */}
        <div className="ac-steps-bar">
          {[1,2,3].map(n => (
            <div key={n} className={`ac-step-dot ${step >= n ? 'done' : ''} ${step === n ? 'current' : ''}`}>
              {step > n ? '✓' : n}
            </div>
          ))}
          <div className="ac-steps-track">
            <div className="ac-steps-fill" style={{ width: `${((step-1)/(TOTAL-1))*100}%` }} />
          </div>
        </div>

        {/* ── Paso 1: Info básica ── */}
        {step === 1 && (
          <div className="ac-step-content fade-up">
            <div className="ac-modal-icon">🏪</div>
            <h3>Nuevo Local</h3>
            <p className="ac-form-subtitle">Información básica del establecimiento</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <div className="ac-form-group" style={{ width: 70, flexShrink: 0 }}>
                <label>Icono</label>
                <input className="ac-form-input small-c" value={form.emoji} onChange={e => set('emoji', e.target.value)} maxLength={2} />
              </div>
              <div className="ac-form-group" style={{ flex: 1 }}>
                <label>Nombre</label>
                <input className="ac-form-input" placeholder="Ej: La Soda de Doña Ana" value={form.name} onChange={e => set('name', e.target.value)} />
              </div>
            </div>
            <div className="ac-form-group">
              <label>Tipo de comida</label>
              <input className="ac-form-input" placeholder="Ej: Comida casera · Almuerzos" value={form.tag} onChange={e => set('tag', e.target.value)} />
            </div>
            <div className="ac-modal-actions">
              <button className="ac-modal-cancel" onClick={onClose}>Cancelar</button>
              <button className="ac-modal-confirm" disabled={!form.name} onClick={() => setStep(2)}>
                Siguiente →
              </button>
            </div>
          </div>
        )}

        {/* ── Paso 2: Contacto ── */}
        {step === 2 && (
          <div className="ac-step-content fade-up">
            <div className="ac-modal-icon">📞</div>
            <h3>Contacto y horario</h3>
            <p className="ac-form-subtitle">Datos de contacto del local</p>
            <div className="ac-form-group">
              <label>Teléfono / WhatsApp</label>
              <input className="ac-form-input" placeholder="Ej: 8800-0000" value={form.phone} onChange={e => set('phone', e.target.value)} />
            </div>
            <div className="ac-form-group">
              <label>Horario de atención</label>
              <input className="ac-form-input" placeholder="Ej: Lun–Sáb 7am–9pm" value={form.schedule} onChange={e => set('schedule', e.target.value)} />
            </div>
            <div className="ac-form-group">
              <label>Foto del local</label>
              <div className="ac-upload-placeholder">
                <span>📷</span>
                <span>Subida de fotos — Próximamente</span>
              </div>
            </div>
            <div className="ac-modal-actions">
              <button className="ac-modal-cancel" onClick={() => setStep(1)}>← Atrás</button>
              <button className="ac-modal-confirm" onClick={() => setStep(3)}>Siguiente →</button>
            </div>
          </div>
        )}

        {/* ── Paso 3: Confirmación / Próximamente ── */}
        {step === 3 && (
          <div className="ac-step-content fade-up" style={{ textAlign: 'center' }}>
            <div className="ac-modal-icon" style={{ fontSize: '3.5rem' }}>🎉</div>
            <h3>¡Listo!</h3>
            <div className="ac-preview-card">
              <span className="ac-preview-emoji">{form.emoji}</span>
              <div>
                <strong>{form.name || 'Nuevo Local'}</strong>
                <p>{form.tag || 'Sin categoría'}</p>
                {form.phone && <p>📞 {form.phone}</p>}
              </div>
            </div>
            <div className="ac-prox-banner">
              <span className="ac-prox-badge">🚀 Próximamente</span>
              <p>
                El registro real de locales estará disponible cuando se integre la base de datos.
                Tus datos han sido guardados en modo demostración local.
              </p>
            </div>
            <button className="ac-modal-confirm full-btn" onClick={onClose}>Entendido ✓</button>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   Componente Principal
───────────────────────────────────────────────────────── */
export default function AdminCatalog({ products, setProducts, restaurants, setRestaurants }) {
  const [activeTab, setActiveTab] = useState('restaurants')
  const [filterCat, setFilterCat] = useState('all')
  const [editLocal, setEditLocal] = useState(null)
  const [showAddLocal, setShowAddLocal] = useState(false)

  // Reset localStorage y recargar datos originales al montar
  useEffect(() => {
    localStorage.removeItem('alToqueProducts')
    localStorage.removeItem('alToqueRestaurants')
    setProducts(INITIAL_PRODUCTS)
    setRestaurants(INITIAL_RESTAURANTS)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filteredProducts = filterCat === 'all'
    ? products
    : products.filter(p => p.cat === filterCat)

  return (
    <div className="admin-catalog">
      {editLocal   && <EditLocalModal local={editLocal} onClose={() => setEditLocal(null)} />}
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

      {/* ── RESTAURANTES ── */}
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
                  <th>Acciones</th>
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
                      <button
                        className="ac-edit-btn"
                        onClick={() => setEditLocal(r)}
                        title="Editar local"
                      >
                        ✏️ Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── PRODUCTOS ── */}
      {activeTab === 'products' && (
        <div className="admin-section fade-up">
          <div className="admin-section-header">
            <div>
              <h2>Productos del Catálogo</h2>
              <p>Súper, Farmacia, Ferretería y Mandados.</p>
            </div>
          </div>

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
                    <td><span className="ac-cat-chip">{CAT_LABEL[p.cat] || p.cat}</span></td>
                    <td className="ac-muted">{p.shop}</td>
                    <td><span className="ac-price">₡{p.price.toLocaleString()}</span></td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr><td colSpan={4} className="ac-empty-row">Sin productos en esta categoría</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
