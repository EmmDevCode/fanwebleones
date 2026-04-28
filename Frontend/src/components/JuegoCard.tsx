// src/components/JuegoCard.tsx
import React from 'react';
import './JuegoCard.css';

interface JuegoCardProps {
  juego: any;
  formatearFechaLarga: (fechaStr: string) => string;
  obtenerNombreEstadio: (juego: any) => string;
}

const JuegoCard: React.FC<JuegoCardProps> = ({ 
  juego, 
  formatearFechaLarga, 
  obtenerNombreEstadio 
}) => {
  
  const getLogo = (equipo: any) => {
    if (!equipo || !equipo.slug) return "/logos/default.png";
    return `/logos/${equipo.slug}.png`;
  };

  return (
    <div className={`game-card ${juego.estado}`}>
      {/* Header: Fecha y Sede */}
      <div className="game-header">
        <div className="game-info-top">
          <span className="game-date">{formatearFechaLarga(juego.fecha)}</span>
          <span className="game-time">{juego.hora.substring(0, 5)} HRS</span>
        </div>
        <div className="game-stadium">
          <i className="fas fa-map-marker-alt"></i> {obtenerNombreEstadio(juego)}
        </div>
      </div>

      {/* Cuerpo: Enfrentamiento */}
      <div className="game-body">
        <div className="team-display visitor">
          <img src={getLogo(juego.visitante)} alt="Logo" className="team-logo-cal" />
          <span className="team-name-cal">{juego.visitante?.nombre}</span>
          {juego.estado === 'finalizado' && <span className="final-score">{juego.score_visitante}</span>}
        </div>

        <div className="game-vs-status">
          {juego.estado === 'finalizado' ? <span className="final-label">FINAL</span> : <span className="vs-label">VS</span>}
        </div>

        <div className="team-display local">
          {juego.estado === 'finalizado' && <span className="final-score">{juego.score_local}</span>}
          <span className="team-name-cal">{juego.local?.nombre}</span>
          <img src={getLogo(juego.local)} alt="Logo" className="team-logo-cal" />
        </div>
      </div>

      {/* Footer: Pitchers Probables */}
      <div className="game-footer">
        <div className="pitcher-info">
          <span className="pitcher-label">P. Probable (VIS):</span>
          <span className="pitcher-name">{juego.pitcher_visitante_probable || "Por anunciar"}</span>
        </div>
        <div className="pitcher-info">
          <span className="pitcher-label">P. Probable (LOC):</span>
          <span className="pitcher-name">{juego.pitcher_local_probable || "Por anunciar"}</span>
        </div>
      </div>

      {/* Badge de estado flotante */}
      <div className={`status-badge ${juego.estado}`}>
        {juego.estado.replace('_', ' ')}
      </div>
    </div>
  );
};

export default JuegoCard;