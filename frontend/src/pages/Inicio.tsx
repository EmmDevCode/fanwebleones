import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Inicio.css';
import WidgetPrincipal from '@/components/WidgetPrincipal';
import Standings from '@/components/Standings';
import LideresEquipo from '@/components/LideresEquipo';

// ⚾ TUS 3 COMPONENTES EN VIVO
import Linescore from '@/components/Linescore';
import Gamecast from '@/components/Gamecast'; 
import JugadasEnVivo from '@/components/JugadasEnVivo';

const Inicio: React.FC = () => {
  const [juegoEnVivoId, setJuegoEnVivoId] = useState<number | null>(null);

  useEffect(() => {
    // Consultamos tu API para ver si hay juego en vivo
    axios.get("/api/juegos/widget-principal")
      .then(res => {
        if (res.data?.tipo_vista === "en_vivo") {
          setJuegoEnVivoId(res.data.datos.id_lmb);
        }
      })
      .catch(err => console.error(err));
  }, []);

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

      {/* Sección Principal */}
      <section className="section-container">
        
        {/* ⚾ EL WIDGET PRINCIPAL SIEMPRE SE MUESTRA (Es tu cabecera de juego o próximo juego) */}
        <div className="widget-wrapper" style={{ marginBottom: juegoEnVivoId ? '1.5rem' : '2rem' }}>
          <WidgetPrincipal />
        </div>

        {/* ⚾ DASHBOARD EN VIVO (Totalmente separado, se anexa abajo solo si hay juego) */}
        {juegoEnVivoId && (
          <div className="live-dashboard-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', marginBottom: '2rem' }}>
            
            {/* 1. TARJETA SUPERIOR: La pizarra de entradas (Linescore) */}
            <Linescore idLmb={juegoEnVivoId} />

            {/* 2. TARJETAS INFERIORES: Gamecast a la izquierda, Jugadas a la derecha */}
            <div style={{ display: 'flex', gap: '1.5rem', width: '100%', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div style={{ flex: '2', minWidth: '300px' }}>
                <Gamecast idLmb={juegoEnVivoId} />
              </div>

              <div style={{ flex: '1', minWidth: '300px' }}>
                <JugadasEnVivo idJuego={juegoEnVivoId} />
              </div>
            </div>

          </div>
        )}

        <div className="standings-wrapper">
          <Standings />
          <LideresEquipo />
        </div>
      </section>

      {/* Footer Legal & Créditos */}
      <footer className="inicio-footer">
        <p className="footer-disclaimer">
          Esto es un proyecto hecho por fans, sin ningún vínculo oficial con la Liga Mexicana de Béisbol (LMB) o los Leones de Yucatán. Los logos, nombres y marcas que aparecen aquí pertenecen a sus dueños legítimos. El objetivo es simple: celebrar al béisbol desde la tribuna digital.
        </p>
        <div className="footer-divider"></div>
        <p className="footer-signature">
          🦁 Desarrollada por y para los fans | <a href="" target="_blank" rel="noopener noreferrer" className="signature-link">LEONMELENUDO</a>
        </p>
      </footer>

    </div>
  );
};

export default Inicio;