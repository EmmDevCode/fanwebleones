// src/pages/Inicio.tsx
import React from 'react';
import './Inicio.css'; 
import WidgetPrincipal from '@/components/WidgetPrincipal';
import Standings from '@/components/Standings';

const Inicio: React.FC = () => {
  // Obtenemos la fecha actual formateada para darle más contexto a la app
  const fechaHoy = new Intl.DateTimeFormat('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(new Date());

  return (
    <div className="inicio-container">
      
      {/* Cabecera */}
      <header className="inicio-header">
        <h1 className="header-title">Leones</h1>
        <span className="header-subtitle">{fechaHoy}</span>
      </header>

      {/* Sección: El Cerebro del Marcador / Próximo Juego */}
      <section className="section-container">
        {/* WidgetPrincipal ya maneja sus propios estados (cargando, en vivo, próximo).
          ¡Adiós a los if/else largos en esta pantalla! 
        */}
        <WidgetPrincipal />
        <Standings />
      </section>

    </div>
  );
};

export default Inicio;