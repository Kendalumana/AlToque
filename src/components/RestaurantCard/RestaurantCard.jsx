import React from 'react'
import './RestaurantCard.css'

export default function RestaurantCard({ restaurant, onClick }) {
  return (
    <button 
      className="restaurant-card" 
      onClick={() => onClick(restaurant)} 
      style={{ '--rc': restaurant.color }}
    >
      <div className="restaurant-emoji-wrap">{restaurant.emoji}</div>
      <div className="restaurant-body">
        <span className="restaurant-name">{restaurant.name}</span>
        <span className="restaurant-tag">{restaurant.tag}</span>
      </div>
      <span className="restaurant-arrow">›</span>
    </button>
  )
}
