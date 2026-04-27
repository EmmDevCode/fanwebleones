import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotificaciones } from '@/hooks/useNotificaciones';
import './Perfil.css';

const Perfil: React.FC = () => {
  const navigate = useNavigate();
  const { notificacionesActivas, toggleNotificaciones } = useNotificaciones();

  // Datos simulados del usuario (esto vendría de tu Context de Autenticación)
  const usuario = {
    nombre: "Emmanuel",
    email: "emmanuel@ejemplo.com",
    inicial: "E"
  };

  const handleLogout = () => {
    // Aquí limpiarías el token de sesión
    navigate('/login');
  };

  return (
    <div className="perfil-container">
      <div className="perfil-bg-glow"></div>
      
      <header className="perfil-header-container">
        <h1 className="perfil-header">Perfil</h1>
      </header>

      {/* Tarjeta de Información */}
      <div className="user-card">
        <div className="user-avatar">{usuario.inicial}</div>
        <div className="user-info">
          <h2>{usuario.nombre}</h2>
          <p>{usuario.email}</p>
        </div>
      </div>

      {/* Configuración */}
      <div className="settings-section">
        <h3 className="settings-title">Preferencias</h3>
        <div className="settings-group">
          
          <div className="settings-item">
            <div className="settings-label-wrapper">
              <span className="settings-icon">🔔</span>
              <span className="settings-label">Notificaciones en vivo</span>
            </div>
            
            {/* El Toggle Switch Premium */}
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={notificacionesActivas}
                onChange={toggleNotificaciones}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          
          <div className="settings-item">
            <div className="settings-label-wrapper">
              <span className="settings-icon">⚾</span>
              <span className="settings-label">Equipo Favorito</span>
            </div>
            <span className="settings-value">Leones</span>
          </div>
        </div>
      </div>

      {/* Cerrar Sesión */}
      <div className="logout-section">
        <button className="logout-btn" onClick={handleLogout}>
          <span className="logout-icon">↪</span>
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default Perfil;