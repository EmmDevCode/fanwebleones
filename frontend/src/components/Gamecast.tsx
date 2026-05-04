import { useEffect, useState } from 'react';
import axios from 'axios';
import './Gamecast.css'; 

interface GamecastProps {
  idLmb: number | string;
}

const Gamecast = ({ idLmb }: GamecastProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [gamecast, setGamecast] = useState<any>(null);

  useEffect(() => {
    const fetchGamecast = async () => {
      try {
        const res = await axios.get(`/api/juegos/${idLmb}/gamecast`);
        setGamecast(res.data);
      } catch (error) {
        console.error("Error fetching gamecast", error);
      }
    };

    fetchGamecast();
    const interval = setInterval(fetchGamecast, 3000); 
    return () => clearInterval(interval);
  }, [idLmb]);

  if (!gamecast || gamecast.error) return <div className="gamecast-loading">Esperando lanzamiento...</div>;

  const { enfrentamiento, pitcheos } = gamecast;

  return (
    <div className="gamecast-container">
      
      {/* 1. SECCIÓN DE ENFRENTAMIENTO (MATCHUP) */}
      <div className="gc-matchup">
        <div className="gc-player">
          <div className="gc-avatar border-blue">
            <img src={enfrentamiento?.pitcher?.foto} alt="Pitcher" />
          </div>
          <h3 className="gc-name">{enfrentamiento?.pitcher?.nombre}</h3>
          <span className="gc-badge badge-blue">LANZANDO</span>
          <div className="gc-stats">
            <span>P <strong>{enfrentamiento?.pitcher?.pitches || 0}</strong></span>
          </div>
        </div>

        <div className="gc-vs-section">
          <h2 className="gc-vs">VS</h2>
          <span className="gc-live-badge">
            <span className="live-dot"></span> LIVE
          </span>
        </div>

        <div className="gc-player">
          <div className="gc-avatar border-yellow">
            <img src={enfrentamiento?.bateador?.foto} alt="Bateador" />
          </div>
          <h3 className="gc-name">{enfrentamiento?.bateador?.nombre}</h3>
          <span className="gc-badge badge-yellow">AL BATE</span>
          <div className="gc-stats">
            <span>AVG <strong>{enfrentamiento?.bateador?.avg || ".000"}</strong></span>
          </div>
        </div>
      </div>

      {/* 2. RADAR DE BATALLA */}
      {/* 2. RADAR DE BATALLA (DISEÑO VECTORIAL PERFECTO) */}
      <div className="gc-radar-section">
        <div className="gc-radar-container" style={{ width: '100%', maxWidth: '280px', margin: '0 auto', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '12px', padding: '1rem' }}>
          <h4 style={{ textAlign: 'center', fontSize: '0.65rem', fontWeight: 800, color: '#a1a1aa', letterSpacing: '2px', marginBottom: '1rem' }}>ZONA DE STRIKE</h4>
          
          {/* EL LIENZO SVG (250x250 es el tamaño nativo de Gameday) */}
          <div style={{ width: '100%', aspectRatio: '1/1', position: 'relative' }}>
            <svg viewBox="0 0 250 250" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              
              {/* Filtro para el brillo de las bolas */}
              <defs>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.8"/>
                </filter>
              </defs>

              {/* HOME PLATE (Ancho de 105px para que cuadre con la zona cuadrada) */}
              <polygon points="72.5,215 177.5,215 177.5,222 125,235 72.5,222" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />

              {/* LA ZONA DE STRIKE (Cuadrado perfecto de 105x105, X: 72.5, Y: 95) */}
              <rect x="72.5" y="95" width="105" height="105" fill="rgba(0,0,0,0.4)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />

              {/* CUADRÍCULA INTERNA (Separaciones exactas de 35px para los 9 cuadros) */}
              {/* Verticales */}
              <line x1="107.5" y1="95" x2="107.5" y2="200" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="142.5" y1="95" x2="142.5" y2="200" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="3,3" />
              
              {/* Horizontales */}
              <line x1="72.5" y1="130" x2="177.5" y2="130" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="72.5" y1="165" x2="177.5" y2="165" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="3,3" />

              {/* DIBUJAR LOS PITCHEOS */}
              {pitcheos?.map((pitch: any, index: number) => {
                let cx = 125; 
                let cy = 160; 

                if (pitch.x != null && pitch.y != null) {
                  // Mapeo Statcast 3D
                  cx = 125 + (pitch.x * 60); 
                  cy = 95 + ((pitch.sz_top - pitch.y) / (pitch.sz_top - pitch.sz_bottom)) * 105;
                } else if (pitch.gx != null && pitch.gy != null) {
                  // Mapeo Gameday 2D
                  cx = 250 - pitch.gx; 
                  
                  // ¡AQUÍ ESTÁ LA MAGIA! Le restamos exactamente 1 fila (35px) al desfase de la API
                  cy = pitch.gy - 35; 
                } else {
                  return null;
                }

                const isStrike = pitch.es_strike;
                const colorBola = isStrike ? '#ef4444' : '#32d74b';
                const bordeBola = isStrike ? '#fca5a5' : '#86efac';

                return (
                  <g key={index} transform={`translate(${cx}, ${cy})`}>
                    <circle 
                      r="9" 
                      fill={colorBola} 
                      stroke={bordeBola} 
                      strokeWidth="1.5" 
                      filter="url(#glow)"
                      style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                    >
                      <title>{pitch.descripcion}</title>
                    </circle>
                    {/* Número perfectamente centrado con dy="0.3em" */}
                    <text 
                      x="0" 
                      y="0" 
                      dy="0.3em" 
                      textAnchor="middle" 
                      fill="white" 
                      fontSize="10" 
                      fontWeight="bold" 
                      fontFamily="system-ui, sans-serif"
                      style={{ pointerEvents: 'none' }}
                    >
                      {pitch.numero}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Gamecast;