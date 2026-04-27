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

  if (loading) return <div className="widget-container text-center">Sincronizando pizarra... ⚾</div>;
  if (!datosWidget) return null;

  const { tipo_vista, datos } = datosWidget;

  // Busca el logo local o usa el de internet
  const getLogo = (equipo: any) => {
    if (!equipo) return "https://via.placeholder.com/50";
    return `/logos/${equipo.slug}.png`; 
  };

  // ------------------------------------------
  // VISTA 1: JUEGO EN VIVO (Broadcast Pro)
  // ------------------------------------------
  if (tipo_vista === "en_vivo") {
    const b1 = datos.corredor_1b;
    const b2 = datos.corredor_2b;
    const b3 = datos.corredor_3b;

    return (
      <div className="widget-container en-vivo-card">
        {/* Cabecera del Marcador */}
        <div className="live-header">
          <div className="status-badge live">🔴 EN VIVO</div>
          <div className="inning-badge">{datos.inning_actual || "Alta 1"}</div>
        </div>
        
        {/* Score Principal */}
        <div className="marcador-main">
          <div className="equipo-block">
            <img src={getLogo(datos.local)} alt="Local" className="team-logo-main" />
            <span className="team-abbr">YUC</span>
            <span className="score-number">{datos.score_local || 0}</span>
          </div>

          <div className="vs-divider">-</div>

          <div className="equipo-block visitor">
            <span className="score-number">{datos.score_visitante || 0}</span>
            <span className="team-abbr">{(datos.visitante?.slug || "VIS").substring(0, 3).toUpperCase()}</span>
            <img src={getLogo(datos.visitante)} alt="Visitante" className="team-logo-main" />
          </div>
        </div>

        {/* Separador */}
        <div className="widget-divider"></div>

        {/* Zona Inferior: Duelo y Situación */}
        <div className="situational-zone">
          
          {/* Izquierda: Duelo (Pitcher vs Batter) */}
          <div className="matchup-info">
            <div className="player-stat">
              <span className="player-role">PITCHANDO</span>
              <span className="player-name">{datos.pitcher_actual || "Calentando..."}</span>
            </div>
            <div className="player-stat text-right">
              <span className="player-role">AL BATE</span>
              <span className="player-name active-batter">{datos.bateador_actual || "En turno..."}</span>
              <span className="on-deck">En espera: {datos.bateador_siguiente || "Siguiente bateador"}</span>
            </div>
          </div>

          {/* Derecha: Bases y Cuenta */}
          <div className="field-stats">
            {/* Diamante */}
            <div className="diamond-wrapper">
              <div className="diamond">
                <div className={`base second-base ${b2 ? 'active' : ''}`}></div>
                <div className={`base third-base ${b3 ? 'active' : ''}`}></div>
                <div className={`base first-base ${b1 ? 'active' : ''}`}></div>
                <div className="base home-plate active"></div>
              </div>
            </div>
            
            {/* Cuenta LED */}
            <div className="count-board">
              <div className="count-row">
                <span className="count-label">B</span>
                <div className="led-group">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className={`led ball ${i <= (datos.bolas || 0) ? 'active' : ''}`}></div>
                  ))}
                </div>
              </div>
              <div className="count-row">
                <span className="count-label">S</span>
                <div className="led-group">
                  {[1, 2, 3].map(i => (
                    <div key={i} className={`led strike ${i <= (datos.strikes || 0) ? 'active' : ''}`}></div>
                  ))}
                </div>
              </div>
              <div className="count-row">
                <span className="count-label">O</span>
                <div className="led-group">
                  {[1, 2, 3].map(i => (
                    <div key={i} className={`led out ${i <= (datos.outs || 0) ? 'active' : ''}`}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // ------------------------------------------
  // VISTA 2: PRÓXIMO JUEGO
  // ------------------------------------------
  if (tipo_vista === "proximo") {
    const fecha = new Date(datos.fecha).toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
    const hora = datos.hora?.substring(0, 5) || "19:30";

    return (
      <div className="widget-container proximo-card">
        <div className="status-badge upcoming">📅 PRÓXIMO JUEGO</div>
        <div className="matchup-row">
          <div className="matchup-team">
            <img src={getLogo(datos.local)} alt="L" className="team-logo-proximo" />
            <span>LEONES</span>
          </div>
          <div className="matchup-vs">VS</div>
          <div className="matchup-team">
            <img src={getLogo(datos.visitante)} alt="V" className="team-logo-proximo" />
            <span>{datos.visitante?.nombre?.toUpperCase() || "RIVAL"}</span>
          </div>
        </div>
        <div className="matchup-details">
          <span className="date-tag">{fecha.toUpperCase()}</span>
          <span className="time-tag">{hora} HRS</span>
        </div>
      </div>
    );
  }

  return null;
};

export default WidgetPrincipal;