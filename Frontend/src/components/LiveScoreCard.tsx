import React from 'react';
import type { JuegoEnVivo } from '@/types';
import './LiveScoreCard.css';

interface LiveScoreCardProps {
  juego: JuegoEnVivo;
}

const LiveScoreCard: React.FC<LiveScoreCardProps> = ({ juego }) => {
  const {
    local,
    visitante,
    score_local,
    score_visitante,
    inning_actual,
    outs,
    bolas,
    strikes,
    corredor_1b,
    corredor_2b,
    corredor_3b
  } = juego;

  const esAlta = (inning_actual || "").toLowerCase().includes("alta");
  const inningNum = (inning_actual || "").replace(/[^0-9]/g, '') || "1";

  return (
    <div className="lsc-container">
      {/* Marcador Superior */}
      <div className="lsc-scoreboard">
        <div className="lsc-team">
          <div className="lsc-logo-wrapper">
            <span className="lsc-team-slug">{visitante.slug}</span>
          </div>
          <span className="lsc-score">{score_visitante}</span>
        </div>

        <div className="lsc-inning-center">
          <div className="lsc-inning-indicator">
            <span className="lsc-arrow">{esAlta ? "▲" : "▼"}</span>
            <span className="lsc-inning-num">{inningNum}</span>
          </div>
        </div>

        <div className="lsc-team local">
          <span className="lsc-score">{score_local}</span>
          <div className="lsc-logo-wrapper local">
            <span className="lsc-team-slug">{local.slug}</span>
          </div>
        </div>
      </div>

      {/* Stats Inferiores (Diamante y Cuenta) */}
      <div className="lsc-stats-bar">

        <div className="lsc-count">
          <div className="lsc-count-item">
            <span className="lsc-count-label">B</span>
            <div className="lsc-leds">
              {[1, 2, 3, 4].map(i => <div key={i} className={`lsc-led ball ${i <= bolas ? 'on' : ''}`}></div>)}
            </div>
          </div>
          <div className="lsc-count-item">
            <span className="lsc-count-label">S</span>
            <div className="lsc-leds">
              {[1, 2, 3].map(i => <div key={i} className={`lsc-led strike ${i <= strikes ? 'on' : ''}`}></div>)}
            </div>
          </div>
          <div className="lsc-count-item">
            <span className="lsc-count-label">O</span>
            <div className="lsc-leds">
              {[1, 2, 3].map(i => <div key={i} className={`lsc-led out ${i <= outs ? 'on' : ''}`}></div>)}
            </div>
          </div>
        </div>

        {/* Diamante 3D Minimalista */}
        <div className="lsc-diamond-container">
          <div className="lsc-diamond">
            <div className="lsc-dirt"></div>
            <div className={`lsc-base lsc-2b ${corredor_2b ? 'active' : ''}`}></div>
            <div className={`lsc-base lsc-3b ${corredor_3b ? 'active' : ''}`}></div>
            <div className={`lsc-base lsc-1b ${corredor_1b ? 'active' : ''}`}></div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LiveScoreCard;