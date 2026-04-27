import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Standings.css';

const Standings: React.FC = () => {
  const [posiciones, setPosiciones] = useState<any>(null);
  const [zonaActiva, setZonaActiva] = useState<"Zona Sur" | "Zona Norte">("Zona Sur");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/juegos/posiciones")
      .then(res => {
        setPosiciones(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error cargando posiciones:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="standings-loading text-center p-4">Sincronizando posiciones... 📊</div>;
  if (!posiciones || posiciones.error) return <div className="standings-error text-center p-4">No hay datos disponibles.</div>;

  const equiposMostrar = posiciones[zonaActiva] || [];

  const getLogoStanding = (nombreEquipo: string) => {
    const slugAuto = nombreEquipo
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");
      
    if (slugAuto.includes("leones")) return "/logos/leones.png";
    if (slugAuto.includes("aguila")) return "/logos/el-aguila.png";
    if (slugAuto.includes("tigres")) return "/logos/tigres-de-quintana-roo.png";
    if (slugAuto.includes("pericos")) return "/logos/pericos-de-puebla.png";
    // El resto buscará su nombre automático con guiones
    return `/logos/${slugAuto}.png`;
  };

  return (
    <div className="standings-container">
      <h2 className="standings-title">Posiciones</h2>

      {/* Botones Fijos para las Zonas */}
      <div className="zone-selector">
        <button 
          className={`zone-btn ${zonaActiva === "Zona Sur" ? "active" : ""}`}
          onClick={() => setZonaActiva("Zona Sur")}
        >
          Zona Sur
        </button>
        <button 
          className={`zone-btn ${zonaActiva === "Zona Norte" ? "active" : ""}`}
          onClick={() => setZonaActiva("Zona Norte")}
        >
          Zona Norte
        </button>
      </div>

      <div className="table-responsive">
        <table className="standings-table">
          <thead>
            <tr>
              <th className="text-left">Equipo</th>
              <th>G</th>
              <th>P</th>
              <th>PCT</th>
              <th>JD</th>
              <th>Racha</th>
            </tr>
          </thead>
          <tbody>
            {equiposMostrar.map((equipo: any, index: number) => {
              const isLeones = equipo.nombre.toLowerCase().includes("leones");

              return (
                <tr key={index} className={isLeones ? "highlight-row" : ""}>
                  <td className="team-name-cell">
                    <span className="rank-number">{index + 1}</span>
                    <img 
                      src={getLogoStanding(equipo.nombre)} 
                      alt={equipo.nombre} 
                      className="standing-team-logo"
                      onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/25/333333/FFFFFF?text=LMB"; }}
                    />
                    <span className="team-name">
                      {equipo.nombre.split(' de ')[0].replace(' del ', '')} 
                    </span>
                  </td>
                  <td>{equipo.victorias}</td>
                  <td>{equipo.derrotas}</td>
                  <td>{equipo.pct}</td>
                  <td>{equipo.jd}</td>
                  <td>
                    <span className={`streak-badge ${equipo.racha?.includes('W') ? 'win' : 'loss'}`}>
                      {equipo.racha}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Standings;