import React from 'react';
import './Inicio.css';
import WidgetPrincipal from '@/components/WidgetPrincipal';
import Standings from '@/components/Standings';

const Inicio: React.FC = () => {
  // Obtenemos la fecha actual formateada para darle más contexto a la app

  return (
    <div className="inicio-container">
      {/* Premium ambient background */}
      <div className="inicio-bg-glow"></div>

      {/* Cabecera dinámica - LETRERO LED ESTADIO */}
      <header className="led-stadium-header">
        <div className="led-board">
          <div className="led-scanline"></div>
          <div className="led-marquee">
            <h1 className="led-text">VAMOS LEONES 🦁 • VAMOS LEONES 🦁 • VAMOS LEONES 🦁 • VAMOS LEONES 🦁</h1>
          </div>
        </div>
      </header>

      {/* Sección: El Cerebro del Marcador / Próximo Juego y Standings */}
      <section className="section-container">
        <div className="widget-wrapper">
          <WidgetPrincipal />
        </div>
        <div className="standings-wrapper">
          <Standings />
        </div>
      </section>

      {/* Footer Legal & Créditos */}
      {/* Footer Legal & Créditos */}
      <footer className="inicio-footer">
        <p className="footer-disclaimer">
          Esto es un proyecto hecho por fans, sin ningún vínculo oficial con la Liga Mexicana de Béisbol (LMB) o los Leones de Yucatán. Los logos, nombres y marcas que aparecen aquí pertenecen a sus dueños legítimos. El objetivo es simple: celebrar al béisbol desde la tribuna digital.
        </p>
        <div className="footer-divider"></div>
        <p className="footer-signature">
          🦁 Desarrollada por y para los fans | <a href="https://github.com/EmmDevCode" target="_blank" rel="noopener noreferrer" className="signature-link">EmmDevCode</a>
        </p>
      </footer>

    </div>
  );
};

export default Inicio;