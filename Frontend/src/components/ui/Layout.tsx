import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Newspaper, User } from 'lucide-react';
import './Layout.css';

const Layout: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: <Home size={24} />, label: 'Inicio' },
    { path: '/calendario', icon: <Calendar size={24} />, label: 'Juegos' },
    { path: '/noticias', icon: <Newspaper size={24} />, label: 'Noticias' },
    { path: '/perfil', icon: <User size={24} />, label: 'Perfil' },
  ];

  return (
    <div className="app-wrapper">
      
      {/* Contenedor dinámico donde se cargan tus páginas (Inicio, Perfil, etc.) */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* Barra de Navegación Inferior */}
      <nav className="bottom-navbar">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path} 
              to={item.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <div className="nav-icon">
                {item.icon}
              </div>
              <span className="nav-label">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

    </div>
  );
};

export default Layout;