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

  // Determinar resultado para Leones
  const isLeonesLocal = juego.local?.nombre.toLowerCase().includes("leones");
  const isLeonesVisitor = juego.visitante?.nombre.toLowerCase().includes("leones");
  
  let leonesResultado = null;
  if (juego.estado === 'finalizado') {
    if (isLeonesLocal) {
      leonesResultado = juego.score_local > juego.score_visitante ? "W" : "L";
    } else if (isLeonesVisitor) {
      leonesResultado = juego.score_visitante > juego.score_local ? "W" : "L";
    }
  }

  return (
    <div className={`game-card ${juego.estado}`}>
      <div className="game-header">
        <div className="header-top-row">
          <div className={`status-badge ${juego.estado}`}>
            {juego.estado.replace('_', ' ')}
          </div>
          {/* ⚾ Badge de Resultado (W/L) */}
          {leonesResultado && (
            <div className={`result-badge ${leonesResultado === 'W' ? 'win' : 'loss'}`}>
              {leonesResultado}
            </div>
          )}
        </div>
        <div className="game-info-top">
          <span className="game-date">{formatearFechaLarga(juego.fecha)}</span>
          <span className="game-time">🕒 {juego.hora.substring(0, 5)} HRS</span>
        </div>
        <div className="game-stadium">🏟️ {obtenerNombreEstadio(juego)}</div>
      </div>

      <div className="game-body">
        <div className="team-display visitor">
          <div className="team-logo-wrapper">
            <img src={getLogo(juego.visitante)} alt="Logo" className="team-logo-cal" />
          </div>
          <span className="team-name-cal">{juego.visitante?.nombre}</span>
          {juego.estado === 'finalizado' && <span className="final-score">{juego.score_visitante}</span>}
        </div>

        <div className="game-vs-status">
          {juego.estado === 'finalizado' ? <span className="final-label">FINAL</span> : <span className="vs-label">VS</span>}
        </div>

        <div className="team-display local">
          {juego.estado === 'finalizado' && <span className="final-score">{juego.score_local}</span>}
          <span className="team-name-cal">{juego.local?.nombre}</span>
          <div className="team-logo-wrapper">
            <img src={getLogo(juego.local)} alt="Logo" className="team-logo-cal" />
          </div>
        </div>
      </div>

    <div className="game-footer">
        {juego.estado === 'finalizado' ? (
          <>
            <div className="pitcher-info pitcher-win-box">
              <span className="pitcher-label">PG:</span>
              <span className="pitcher-name">{juego.pitcher_ganador || "N/A"}</span>
            </div>
            <div className="pitcher-info pitcher-loss-box">
              <span className="pitcher-label">PP:</span>
              <span className="pitcher-name">{juego.pitcher_perdedor || "N/A"}</span>
            </div>
          </>
        ) : (
          <>
            <div className="pitcher-info">
              <span className="pitcher-label">P. Probable (VIS):</span>
              <span className="pitcher-name">{juego.pitcher_visitante_probable || "Por anunciar"}</span>
            </div>
            <div className="pitcher-info">
              <span className="pitcher-label">P. Probable (LOC):</span>
              <span className="pitcher-name">{juego.pitcher_local_probable || "Por anunciar"}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default JuegoCard;