import React, { useState } from 'react'
import './RoleScreen.css'

export default function RoleScreen({ onSelectRole }) {
  const [selected, setSelected] = useState(null)

  const handleConfirm = () => {
    if (selected) {
      onSelectRole(selected)
    }
  }

  return (
    <div className="screen fade-up active role-bg">
      <div className="role-container">
        
        <div className="role-header">
          <div className="role-logo-wrapper">
            <img src="/resources/AlToqueIcon.jpeg" alt="Logo" className="role-logo-img" />
          </div>
          <h1 className="role-brand">AL TOQUE <span>MULTISERVICIOS</span></h1>
          <p className="role-subtitle">SISTEMA DE GESTIÓN INTERNA</p>
          
          <div className="role-desc">
            <p>Seleccioná tu perfil para iniciar turno.</p>
            <p className="role-desc-warn">(Se puede cambiar en cualquier momento)</p>
          </div>
        </div>

        <div className="role-options">
          <button 
            className={`role-card ${selected === 'client' ? 'active' : ''}`}
            onClick={() => setSelected('client')}
          >
            <div className="role-icon">🏋️</div>
            <div className="role-info">
              <span className="role-title">Cliente / Usuario</span>
              <span className="role-tag user-tag">👤 OPERADOR</span>
            </div>
          </button>

          <button 
            className={`role-card ${selected === 'admin' ? 'active' : ''}`}
            onClick={() => setSelected('admin')}
          >
            <div className="role-icon admin-icon">🛡️</div>
            <div className="role-info">
              <span className="role-title">Administrador</span>
              <span className="role-tag admin-tag">🛡️ ADMINISTRADOR</span>
            </div>
          </button>
        </div>

        <button 
          className="role-confirm-btn" 
          disabled={!selected}
          onClick={handleConfirm}
        >
          {selected === 'client' ? '🏋️ ENTRAR COMO OPERADOR' 
           : selected === 'admin' ? '🛡️ ENTRAR COMO ADMINISTRADOR' 
           : 'SELECCIONÁ UN PERFIL'}
        </button>

        <p className="role-footer-note">
          📋 Los registros diarios quedan guardados por turno y fecha.
        </p>
        
      </div>
    </div>
  )
}
