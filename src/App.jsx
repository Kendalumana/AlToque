import React, { useState } from 'react'
import LocationScreen from './components/LocationScreen/LocationScreen'
import CatalogScreen from './components/CatalogScreen/CatalogScreen'
import OtrosScreen from './components/OtrosScreen/OtrosScreen'
import CartPanel from './components/CartPanel/CartPanel'
import ProximamenteModal from './components/ProximamenteModal/ProximamenteModal'
import { useCart } from './hooks/useCart'

function App() {
  const [screen, setScreen] = useState('location')
  const [zone, setZone] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [proximamenteRest, setProximamenteRest] = useState(null)

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
