// src/pages/Registro.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

const Registro: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    const response = await fetch('http://localhost:8000/api/usuarios/registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("¡Cuenta creada! Ahora inicia sesión.");
      navigate('/login');
    } else {
      alert(data.detail || "Error al registrar");
    }
  } catch (error) {
    console.error("Error de conexión:", error);
  }
};

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h1 className="auth-title">Crear Cuenta</h1>
        <p className="auth-subtitle">Únete a la afición más grande de la LMB.</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Nombre</label>
          <input 
            type="text" 
            className="auth-input" 
            placeholder="Tu nombre completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Correo Electrónico</label>
          <input 
            type="email" 
            className="auth-input" 
            placeholder="ejemplo@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Contraseña</label>
          <input 
            type="password" 
            className="auth-input" 
            placeholder="Crea una contraseña segura"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="auth-btn-primary">
          Registrarme
        </button>
      </form>

      <div className="auth-footer">
        ¿Ya tienes cuenta? 
        <Link to="/login" className="auth-link">Inicia sesión</Link>
      </div>
    </div>
  );
};

export default Registro;