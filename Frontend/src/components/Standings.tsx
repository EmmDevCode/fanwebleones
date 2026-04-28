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

  if (loading) return (
    <div className="standings-container loading-state">
      <div className="spinner"></div>
      <span>Sincronizando posiciones...</span>
    </div>
  );

  if (!posiciones || posiciones.error) return (
    <div className="standings-container error-state">
      <div className="error-icon">⚠️</div>
      <span>No hay datos disponibles en este momento.</span>
    </div>
  );

  const equiposMostrar = posiciones[zonaActiva] || [];

  const getLogoStanding = (nombreEquipo: string) => {
    // Normalizamos el nombre para evitar problemas con mayúsculas o acentos
    const slugAuto = nombreEquipo
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
      
    // ZONA SUR
    if (slugAuto.includes("leones")) return "/logos/leones.png";
    if (slugAuto.includes("aguila")) return "/logos/el-aguila.png";
    if (slugAuto.includes("tigres")) return "/logos/tigres.png"; // Ajustado para ser más simple
    if (slugAuto.includes("pericos")) return "/logos/pericos.png"; // Ajustado
    if (slugAuto.includes("diablos")) return "/logos/diablos.png";
    if (slugAuto.includes("bravos")) return "/logos/bravos.png";
    if (slugAuto.includes("conspiradores")) return "/logos/conspiradores.png";
    if (slugAuto.includes("guerreros")) return "/logos/guerreros.png";
    if (slugAuto.includes("olmecas")) return "/logos/olmecas.png";
    if (slugAuto.includes("piratas")) return "/logos/piratas.png";

    // ZONA NORTE
    if (slugAuto.includes("acereros")) return "/logos/acereros.png";
    if (slugAuto.includes("algodoneros")) return "/logos/algodoneros.png";
    if (slugAuto.includes("caliente")) return "/logos/caliente.png";
    if (slugAuto.includes("charros")) return "/logos/charros.png";
    if (slugAuto.includes("dorados")) return "/logos/dorados.png";
    if (slugAuto.includes("rieleros")) return "/logos/rieleros.png";
    if (slugAuto.includes("saraperos")) return "/logos/saraperos.png";
    if (slugAuto.includes("sultanes")) return "/logos/sultanes.png";
    if (slugAuto.includes("tecolotes")) return "/logos/tecolotes.png";
    if (slugAuto.includes("toros")) return "/logos/toros.png";

    // Fallback de seguridad (por si cambia el nombre de un equipo)
    return "/logos/default.png";
  };

  return (
    <div className="standings-container">
      <div className="standings-header">
        <h2 className="standings-title">STANDING</h2>
        <div className="season-badge">LMB 2026</div>
      </div>

      {/* Selector tipo Segmented Control de iOS */}
      <div className="zone-selector">
        <button 
          className={`zone-btn ${zonaActiva === "Zona Sur" ? "active" : ""}`}
          onClick={() => setZonaActiva("Zona Sur")}
        >
          <span className="zone-text">Zona Sur</span>
        </button>
        <button 
          className={`zone-btn ${zonaActiva === "Zona Norte" ? "active" : ""}`}
          onClick={() => setZonaActiva("Zona Norte")}
        >
          <span className="zone-text">Zona Norte</span>
        </button>
      </div>

      <div className="table-responsive">
        <table className="standings-table">
          <thead>
            <tr>
              <th className="text-left col-equipo">EQUIPO</th>
              <th>G</th>
              <th>P</th>
              <th>PCT</th>
              <th>JD</th>
              <th>RACHA</th>
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
                  <td className="stat-cell">{equipo.victorias}</td>
                  <td className="stat-cell">{equipo.derrotas}</td>
                  <td className="stat-cell pct">{equipo.pct}</td>
                  <td className="stat-cell">{equipo.jd}</td>
                  <td className="stat-cell">
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