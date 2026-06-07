import React, { useState } from 'react'
import './CatalogScreen.css'
import TopBar from '../TopBar/TopBar'
import CategoryGrid from '../CategoryGrid/CategoryGrid'
import ProductCard from '../ProductCard/ProductCard'
import RestaurantCard from '../RestaurantCard/RestaurantCard'

export default function CatalogScreen({ 
  onToggleCart, 
  cartCount, 
  onBack, 
  onChangeQty, 
  getQty, 
  onOpenProximamente,
  products,
  restaurants 
}) {
  const [currentCat, setCurrentCat] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase())
  }

  const filteredProducts = products.filter(p => {
    const matchCat = currentCat === 'all' || p.cat === currentCat
    const matchSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery) || 
      p.shop.toLowerCase().includes(searchQuery)
    return matchCat && matchSearch
  })

  let restaurantCards = null
  let itemCount = 0

  if (currentCat === 'comida') {
    itemCount = restaurants.length
  } else {
    itemCount = filteredProducts.length
    if (currentCat === 'all') {
      const rFiltered = searchQuery
        ? restaurants.filter(r => 
            r.name.toLowerCase().includes(searchQuery) || 
            r.tag.toLowerCase().includes(searchQuery))
        : restaurants

      if (rFiltered.length > 0) {
        restaurantCards = (
          <>
            <div className="section-mini-title">🍽️ Comida</div>
            <div className="restaurant-grid">
              {rFiltered.map(r => (
                <RestaurantCard 
                  key={r.id} 
                  restaurant={r} 
                  onClick={onOpenProximamente} 
                />
              ))}
            </div>
            {filteredProducts.length > 0 && (
              <div className="section-mini-title" style={{ marginTop: 16 }}>📦 Otros productos</div>
            )}
          </>
        )
        itemCount += rFiltered.length
      }
    }
  }

  const renderProductsList = () => {
    if (currentCat === 'comida') {
      return (
        <div className="restaurant-grid">
          {restaurants.map(r => (
            <RestaurantCard 
              key={r.id} 
              restaurant={r} 
              onClick={onOpenProximamente} 
            />
          ))}
        </div>
      )
    }

    if (itemCount === 0) {
      return (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <p>No encontramos "<strong>{searchQuery || currentCat}</strong>"</p>
          <p style={{ marginTop: 6, fontSize: '0.8rem' }}>Intentá con otra búsqueda</p>
        </div>
      )
    }

    return (
      <>
        {restaurantCards}
        {filteredProducts.map(p => (
          <ProductCard 
            key={p.id} 
            product={p} 
            qty={getQty(p.id)} 
            onChangeQty={onChangeQty} 
          />
        ))}
      </>
    )
  }

  return (
    <div className="screen fade-up active">
      <div className="app-shell">
        <TopBar cartCount={cartCount} onToggleCart={onToggleCart} />

        <div className="zone-pill">
          <span className="zone-pill-icon">📍</span>
          <span>Miramar Centro</span>
          <button className="cambiar-btn" onClick={onBack}>Cambiar</button>
        </div>

        <div className="search-bar-wrap">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            className="search-input" 
            placeholder="¿Qué necesitás hoy?" 
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        <div className="delivery-badge">
          <span className="bolt">⚡</span>
          <span>Entrega exprés en Miramar Centro · 30–45 min</span>
        </div>

        <CategoryGrid activeCat={currentCat} onSelectCat={setCurrentCat} />

        <section className="section-block">
          <h3 className="section-title">
            DISPONIBLE EN MIRAMAR CENTRO <span className="item-count">{itemCount} {currentCat === 'comida' ? 'locales' : 'items'}</span>
          </h3>
          <div className="products-list">
            {renderProductsList()}
          </div>
        </section>
      </div>
    </div>
  )
}
