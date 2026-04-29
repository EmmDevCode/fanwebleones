// src/components/JugadorModal.tsx
import React from 'react';
import { createPortal } from 'react-dom';
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

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <span className="material-icon">✖</span>
        </button>

        <div className="modal-header">
          <div className="player-img-wrapper">
            <img
              src={jugador.foto_url || "https://via.placeholder.com/150"}
              alt={jugador.nombre}
              className="player-large-img"
              onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/150"; }}
            />
            <div className="player-number-badge">#{jugador.numero}</div>
          </div>
          <div className="player-main-info">
            <h2>{jugador.nombre}</h2>
            <p className="player-pos-team">
              <span className="pos-badge">{jugador.posicion}</span>
              <span className="team-name">{jugador.equipo}</span>
            </p>
            <div className="bat-pitch-info">
              <span className="info-pill">🏏 B: {jugador.bateo}</span>
              <span className="info-pill">⚾ L: {jugador.picheo}</span>
            </div>
          </div>
        </div>

        <div className="stats-container">
          <div className="stats-header">
            <h3>🔥 Estadísticas Temporada</h3>
            <span className="season-badge">2026</span>
          </div>

          {!stats ? (
            <div className="no-stats-msg">
               <span className="no-stats-icon">📉</span>
               <p>Datos no disponibles por el momento.</p>
            </div>
          ) : (
            <div className="stats-grid">
              {esPitcher ? (
                <>
                  <div className="stat-item"><label>📉 ERA</label><span>{statsSeguras.era || "-.--"}</span></div>
                  <div className="stat-item"><label>⚖️ W-L</label><span>{statsSeguras.wins || 0}-{statsSeguras.losses || 0}</span></div>
                  <div className="stat-item"><label>⚡ SO</label><span>{statsSeguras.strikeOuts || 0}</span></div>
                  <div className="stat-item"><label>🎯 WHIP</label><span>{statsSeguras.whip || "-.--"}</span></div>
                  <div className="stat-item"><label>🏟️ J</label><span>{statsSeguras.gamesPlayed || 0}</span></div>
                  <div className="stat-item"><label>⏱️ IP</label><span>{statsSeguras.inningsPitched || 0}</span></div>
                </>
              ) : (
                <>
                  <div className="stat-item"><label>📊 AVG</label><span>{statsSeguras.avg || ".000"}</span></div>
                  <div className="stat-item"><label>💥 HR</label><span>{statsSeguras.homeRuns || 0}</span></div>
                  <div className="stat-item"><label>🏃‍♂️ RBI</label><span>{statsSeguras.rbi || 0}</span></div>
                  <div className="stat-item"><label>📈 OPS</label><span>{statsSeguras.ops || ".000"}</span></div>
                  <div className="stat-item"><label>🏟️ J</label><span>{statsSeguras.gamesPlayed || 0}</span></div>
                  <div className="stat-item"><label>⚾ H</label><span>{statsSeguras.hits || 0}</span></div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default JugadorModal;