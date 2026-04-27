// src/pages/Login.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import './Auth.css';

const Login: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    const response = await fetch('http://localhost:8000/api/usuarios/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
        // 3. Guardamos la sesión persistente!
        login(data.usuario, data.access_token);
        navigate('/perfil');
      } else {
        alert(data.detail || "Error al iniciar sesión");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h1 className="auth-title">Bienvenido</h1>
        <p className="auth-subtitle">Inicia sesión para seguir a los Leones.</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
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
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="auth-btn-primary">
          Entrar
        </button>
      </form>

      <div className="auth-footer">
        ¿No tienes cuenta? 
        <Link to="/registro" className="auth-link">Regístrate</Link>
      </div>
    </div>
  );
};

export default Login;