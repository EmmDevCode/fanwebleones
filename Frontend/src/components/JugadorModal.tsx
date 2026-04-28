// src/components/JugadorModal.tsx
import React from 'react';
import './JugadorModal.css';

interface Props {
  jugador: any;
  stats: any;
  onClose: () => void;
}

const JugadorModal: React.FC<Props> = ({ jugador, stats, onClose }) => {
  const esPitcher = jugador.posicion === "Lanzador";

  // Función de apoyo en caso de que la MLB no devuelva datos (ej. jugador inactivo o novato)
  const statsSeguras = stats || {};

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        
        <div className="modal-header">
          <img 
            src={jugador.foto_url || "https://via.placeholder.com/150"} 
            alt={jugador.nombre} 
            className="player-large-img" 
            onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/150"; }}
          />
          <div className="player-main-info">
            <h2>{jugador.nombre} <span className="player-number">#{jugador.numero}</span></h2>
            <p className="player-pos-team">{jugador.posicion} | {jugador.equipo}</p>
            <div className="bat-pitch-info">
                <span className="info-pill">Batea: {jugador.bateo}</span>
                <span className="info-pill">Lanza: {jugador.picheo}</span>
            </div>
          </div>
        </div>

        <div className="stats-container">
          <h3>Estadísticas Temporada Regular</h3>
          
          {!stats ? (
            <p className="no-stats-msg">Datos no disponibles por el momento.</p>
          ) : (
            <div className="stats-grid">
              {esPitcher ? (
                <>
                  <div className="stat-item"><label>ERA</label><span>{statsSeguras.era || "-.--"}</span></div>
                  <div className="stat-item"><label>W - L</label><span>{statsSeguras.wins || 0}-{statsSeguras.losses || 0}</span></div>
                  <div className="stat-item"><label>SO</label><span>{statsSeguras.strikeOuts || 0}</span></div>
                  <div className="stat-item"><label>WHIP</label><span>{statsSeguras.whip || "-.--"}</span></div>
                  <div className="stat-item"><label>J</label><span>{statsSeguras.gamesPlayed || 0}</span></div>
                  <div className="stat-item"><label>IP</label><span>{statsSeguras.inningsPitched || 0}</span></div>
                </>
              ) : (
                <>
                  <div className="stat-item"><label>AVG</label><span>{statsSeguras.avg || ".000"}</span></div>
                  <div className="stat-item"><label>HR</label><span>{statsSeguras.homeRuns || 0}</span></div>
                  <div className="stat-item"><label>RBI</label><span>{statsSeguras.rbi || 0}</span></div>
                  <div className="stat-item"><label>OPS</label><span>{statsSeguras.ops || ".000"}</span></div>
                  <div className="stat-item"><label>J</label><span>{statsSeguras.gamesPlayed || 0}</span></div>
                  <div className="stat-item"><label>H</label><span>{statsSeguras.hits || 0}</span></div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JugadorModal;