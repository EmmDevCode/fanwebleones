import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './WidgetPrincipal.css';

const WidgetPrincipal: React.FC = () => {
  const [datosWidget, setDatosWidget] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const cargarDatos = () => {
    axios.get("http://127.0.0.1:8000/api/juegos/widget-principal")
      .then(res => {
        setDatosWidget(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error cargando el widget:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    cargarDatos();
    const intervalo = setInterval(() => {
      if (datosWidget && datosWidget.tipo_vista === "en_vivo") {
        cargarDatos();
      }
    }, 10000);
    return () => clearInterval(intervalo);
  }, [datosWidget?.tipo_vista]);

  if (loading) return (
    <div className="wp-loading-container">
      <div className="wp-spinner"></div>
      <span>Sincronizando Pizarra...</span>
    </div>
  );
  
  if (!datosWidget) return null;

  const { tipo_vista, datos } = datosWidget;

  const getLogo = (equipo: any) => {
    if (!equipo) return "https://via.placeholder.com/50";
    return `/logos/${equipo.slug}.png`; 
  };

  if (tipo_vista === "en_vivo") {
    const b1 = datos.corredor_1b;
    const b2 = datos.corredor_2b;
    const b3 = datos.corredor_3b;

    // Analizar el inning para saber si es alta o baja
    const inningStr = datos.inning_actual || "Alta 1";
    const esAlta = inningStr.toLowerCase().includes("alta");
    const inningNum = inningStr.replace(/[^0-9]/g, '') || "1";

    return (
      <div className="wp-card wp-live">
        
        {/* Zona Superior: Marcador Principal (Estilo TV) */}
        <div className="wp-scoreboard-tv">
          <div className="wp-team visitor">
            <img src={getLogo(datos.visitante)} alt="Visitante" className="wp-team-logo" />
            <span className="wp-team-abbr">{(datos.visitante?.slug || "VIS").substring(0, 3).toUpperCase()}</span>
            <span className="wp-score">{datos.score_visitante || 0}</span>
          </div>

          <div className="wp-inning-indicator">
            <div className="wp-inning-arrow">{esAlta ? "▲" : "▼"}</div>
            <div className="wp-inning-num">{inningNum}</div>
            <div className="wp-live-badge">EN VIVO</div>
          </div>

          <div className="wp-team local">
            <span className="wp-score">{datos.score_local || 0}</span>
            <span className="wp-team-abbr">YUC</span>
            <img src={getLogo(datos.local)} alt="Local" className="wp-team-logo" />
          </div>
        </div>

        {/* Zona Inferior: Diamante, Cuenta y Jugadores */}
        <div className="wp-situational">
          
          {/* Diamante Realista */}
          <div className="wp-diamond-container">
            <div className="wp-diamond">
              <div className="wp-dirt-path"></div>
              <div className={`wp-base wp-second-base ${b2 ? 'active' : ''}`}></div>
              <div className={`wp-base wp-third-base ${b3 ? 'active' : ''}`}></div>
              <div className={`wp-base wp-first-base ${b1 ? 'active' : ''}`}></div>
              <div className="wp-base wp-home-plate"></div>
            </div>
          </div>

          {/* Cuenta LED (Bolas, Strikes, Outs) */}
          <div className="wp-count-board">
            <div className="wp-count-row">
              <span className="wp-count-label">B</span>
              <div className="wp-leds">
                {[1, 2, 3, 4].map(i => <div key={i} className={`wp-led ball ${i <= (datos.bolas || 0) ? 'on' : ''}`}></div>)}
              </div>
            </div>
            <div className="wp-count-row">
              <span className="wp-count-label">S</span>
              <div className="wp-leds">
                {[1, 2, 3].map(i => <div key={i} className={`wp-led strike ${i <= (datos.strikes || 0) ? 'on' : ''}`}></div>)}
              </div>
            </div>
            <div className="wp-count-row">
              <span className="wp-count-label">O</span>
              <div className="wp-leds">
                {[1, 2, 3].map(i => <div key={i} className={`wp-led out ${i <= (datos.outs || 0) ? 'on' : ''}`}></div>)}
              </div>
            </div>
          </div>

          {/* Duelo de Jugadores */}
          <div className="wp-matchup">
            <div className="wp-player-box">
              <span className="wp-player-role">P</span>
              <span className="wp-player-name">{datos.pitcher_actual || "Calentando..."}</span>
            </div>
            <div className="wp-player-box">
              <span className="wp-player-role">B</span>
              <div className="wp-batter-info">
                <span className="wp-player-name active-batter">{datos.bateador_actual || "En turno..."}</span>
                <span className="wp-on-deck">Sig: {datos.bateador_siguiente || "Siguiente..."}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  if (tipo_vista === "proximo") {
    const fecha = new Date(datos.fecha).toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
    const hora = datos.hora?.substring(0, 5) || "19:30";

    return (
      <div className="wp-card wp-upcoming">
        <div className="wp-upcoming-header">
          <span className="wp-upcoming-badge">PRÓXIMO JUEGO</span>
        </div>
        <div className="wp-upcoming-matchup">
          <div className="wp-team">
            <img src={getLogo(datos.local)} alt="L" className="wp-team-logo-large" />
            <span className="wp-team-name">LEONES</span>
          </div>
          <div className="wp-vs">VS</div>
          <div className="wp-team">
            <img src={getLogo(datos.visitante)} alt="V" className="wp-team-logo-large" />
            <span className="wp-team-name">{datos.visitante?.nombre?.toUpperCase() || "RIVAL"}</span>
          </div>
        </div>
        <div className="wp-upcoming-footer">
          <span className="wp-date">{fecha.toUpperCase()}</span>
          <span className="wp-time">{hora} HRS</span>
        </div>
      </div>
    );
  }

  return null;
};

export default WidgetPrincipal;