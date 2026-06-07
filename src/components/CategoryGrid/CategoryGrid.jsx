import React from 'react'
import './CategoryGrid.css'

export default function CategoryGrid({ activeCat, onSelectCat }) {
  const categories = [
    { id: 'all', icon: '🏪', label: 'Todo' },
    { id: 'mandados', icon: '🛵', label: 'Mandados' },
    { id: 'comida', icon: '🍕', label: 'Comida', sub: 'Local' },
    { id: 'super', icon: '🛒', label: 'Supermercado', sub: 'Palí' },
    { id: 'farmacia', icon: '💊', label: 'Farmacia' },
    { id: 'ferreteria', icon: '🔧', label: 'Ferretería' },
  ]

  return (
    <section className="section-block">
      <h3 className="section-title">CATEGORÍAS</h3>
      <div className="categories-grid">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`cat-card ${activeCat === cat.id ? 'active' : ''}`}
            onClick={() => onSelectCat(cat.id)}
          >
            <span className="cat-icon">{cat.icon}</span>
            <span className="cat-label">{cat.label}</span>
            {cat.sub && <span className="cat-sub">{cat.sub}</span>}
          </button>
        ))}
      </div>
    </section>
  )
}
