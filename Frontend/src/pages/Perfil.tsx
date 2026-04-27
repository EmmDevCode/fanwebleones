// src/pages/Perfil.tsx
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
      <h1 className="perfil-header">Perfil</h1>

      {/* Tarjeta de Información */}
      <div className="user-card">
        <div className="user-avatar">{usuario.inicial}</div>
        <div className="user-info">
          <h2>{usuario.nombre}</h2>
          <p>{usuario.email}</p>
        </div>
      </div>

      {/* Configuración */}
      <h3 className="text-sm font-semibold text-[#8e8e93] uppercase tracking-wider mb-2 ml-4">
        Preferencias
      </h3>
      <div className="settings-group">
        <div className="settings-item">
          <span className="settings-label">Notificar marcadores en vivo</span>
          
          {/* El Toggle Switch */}
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={notificacionesActivas}
              onChange={toggleNotificaciones}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
        
        {/* Aquí podrías agregar más opciones en el futuro */}
        <div className="settings-item">
          <span className="settings-label">Equipo Favorito</span>
          <span className="text-[#8e8e93] font-medium">Leones</span>
        </div>
      </div>

      {/* Cerrar Sesión */}
      <button className="logout-btn" onClick={handleLogout}>
        Cerrar Sesión
      </button>
    </div>
  );
};

export default Perfil;