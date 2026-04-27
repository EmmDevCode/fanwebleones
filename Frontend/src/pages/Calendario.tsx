// src/pages/Calendario.tsx
import React from 'react';
import './Calendario.css';

const Calendario: React.FC = () => {
  // Datos simulados (Próximamente vendrán de tu BD)
  const juegos = [
    {
      id: 1,
      fecha: "Jueves, 15 de Mayo • 19:30",
      estado: "finalizado",
      local: { slug: "YUC", nombre: "Leones" },
      visitante: { slug: "MEX", nombre: "Diablos" },
      score_local: 5,
      score_visitante: 3
    },
    {
      id: 2,
      fecha: "Viernes, 16 de Mayo • 20:00",
      estado: "programado",
      local: { slug: "YUC", nombre: "Leones" },
      visitante: { slug: "TIG", nombre: "Tigres" },
      score_local: 0,
      score_visitante: 0
    },
    {
      id: 3,
      fecha: "Sábado, 17 de Mayo • 18:00",
      estado: "programado",
      local: { slug: "YUC", nombre: "Leones" },
      visitante: { slug: "TIG", nombre: "Tigres" },
      score_local: 0,
      score_visitante: 0
    }
  ];

  return (
    <div className="calendario-container">
      <h1 className="calendario-header">Calendario</h1>

      <h2 className="mes-title">Mayo 2026</h2>
      
      <div className="juegos-lista">
        {juegos.map((juego) => (
          <div key={juego.id} className="juego-card">
            
            {/* Cabecera de la tarjeta */}
            <div className="juego-fecha">
              <span>{juego.fecha}</span>
              <span className={juego.estado === 'finalizado' ? 'badge-finalizado' : 'badge-programado'}>
                {juego.estado}
              </span>
            </div>

            {/* Equipos y Marcador */}
            <div className="juego-equipos">
              {/* Visitante */}
              <div className="equipo">
                <div className="equipo-logo">{juego.visitante.slug}</div>
                <span className="equipo-nombre">{juego.visitante.nombre}</span>
              </div>

              {/* Marcador Central */}
              <div className="marcador-central">
                {juego.estado === 'finalizado' ? (
                  <>
                    <span>{juego.score_visitante}</span>
                    <span className="marcador-vs">-</span>
                    <span>{juego.score_local}</span>
                  </>
                ) : (
                  <span className="marcador-vs">VS</span>
                )}
              </div>

              {/* Local */}
              <div className="equipo">
                <div className="equipo-logo" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
                  {juego.local.slug}
                </div>
                <span className="equipo-nombre">{juego.local.nombre}</span>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendario;