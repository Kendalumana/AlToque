import React, { useState, useEffect } from 'react'
import RoleScreen from './components/RoleScreen/RoleScreen'
import LocationScreen from './components/LocationScreen/LocationScreen'
import CatalogScreen from './components/CatalogScreen/CatalogScreen'
import OtrosScreen from './components/OtrosScreen/OtrosScreen'
import CartPanel from './components/CartPanel/CartPanel'
import ProximamenteModal from './components/ProximamenteModal/ProximamenteModal'
import AdminLayout from './components/AdminLayout/AdminLayout'
import { useCart } from './hooks/useCart'
import { PRODUCTS as INITIAL_PRODUCTS } from './data/products'
import { RESTAURANTS as INITIAL_RESTAURANTS } from './data/restaurants'

function App() {
  const [role, setRole] = useState(null) // null, 'client', 'admin'
  const [screen, setScreen] = useState('location')
  const [zone, setZone] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [proximamenteRest, setProximamenteRest] = useState(null)

  // Estado global editable de productos y restaurantes (persiste en localStorage para demo)
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('alToqueProducts')
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS
  })
  const [restaurants, setRestaurants] = useState(() => {
    const saved = localStorage.getItem('alToqueRestaurants')
    return saved ? JSON.parse(saved) : INITIAL_RESTAURANTS
  })

  // Guardar en localStorage cada vez que cambian
  useEffect(() => {
    localStorage.setItem('alToqueProducts', JSON.stringify(products))
  }, [products])

  useEffect(() => {
    localStorage.setItem('alToqueRestaurants', JSON.stringify(restaurants))
  }, [restaurants])

  const { cart, addToCart, changeQty, getQty, cartCount, cartTotal } = useCart()

  const handleSelectZone = (selectedZone) => {
    setZone(selectedZone)
    if (selectedZone === 'otros') {
      setScreen('otros')
    } else {
      setScreen('catalog')
    }
  }

  const handleBackToLocation = () => {
    setScreen('location')
    setZone(null)
  }

  // --- RENDERING PRINCIPAL ---
  if (!role) {
    return <RoleScreen onSelectRole={setRole} />
  }

  if (role === 'admin') {
    return (
      <AdminLayout 
        onLogout={() => setRole(null)}
        products={products}
        setProducts={setProducts}
        restaurants={restaurants}
        setRestaurants={setRestaurants}
      />
    )
  }

  // Vista de Cliente
  return (
    <>
      {screen === 'location' && (
        <LocationScreen onSelectZone={handleSelectZone} />
      )}

      {screen === 'catalog' && (
        <CatalogScreen 
          onToggleCart={() => setCartOpen(!cartOpen)}
          cartCount={cartCount}
          onBack={handleBackToLocation}
          onChangeQty={changeQty}
          getQty={getQty}
          onOpenProximamente={setProximamenteRest}
          // Injecting dynamic state
          products={products}
          restaurants={restaurants}
        />
      )}

      {screen === 'otros' && (
        <OtrosScreen onBack={handleBackToLocation} />
      )}

      <CartPanel 
        isOpen={cartOpen} 
        onClose={() => setCartOpen(false)} 
        cartItems={cart}
        cartTotal={cartTotal}
        onChangeQty={changeQty}
      />

      <ProximamenteModal 
        restaurant={proximamenteRest} 
        onClose={() => setProximamenteRest(null)} 
      />
    </>
  )
}

export default App
