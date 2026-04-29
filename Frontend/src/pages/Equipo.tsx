// src/pages/Equipo.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import JugadorModal from '../components/JugadorModal'; // <-- IMPORTANTE
import './Equipo.css';

const Equipo: React.FC = () => {
  const [roster, setRoster] = useState<any>({
    lanzadores: [],
    infielders: [],
    outfielders: [],
    receptores: []
  });

  const [jugadorSeleccionado, setJugadorSeleccionado] = useState<any>(null);
  const [statsActuales, setStatsActuales] = useState<any>(null);
  const [loadingModal, setLoadingModal] = useState(false); // Para mostrar que está cargando
  const [loading, setLoading] = useState(true);
  const [filtroActivo, setFiltroActivo] = useState<string>('Todos'); // Nuevo estado para el filtro

  const manejarClickJugador = async (id: number) => {
    setLoadingModal(true); // Empieza a cargar
    try {
        const res = await axios.get(`http://127.0.0.1:8000/api/equipo/jugadores/${id}/stats`); // Ojo a la ruta, la ajusté a tu equipo.py
        setJugadorSeleccionado(res.data.perfil);
        setStatsActuales(res.data.stats_temporada);
    } catch (err) {
        console.error("Error al cargar stats");
    } finally {
        setLoadingModal(false); // Termina de cargar
    }
  };

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/equipo/roster")
      .then(res => {
        setRoster(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error cargando roster:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="equipo-container loading-state">
        <div className="eq-spinner"></div>
        <span>Cargando roster oficial...</span>
      </div>
    );
  }

  // 🔥 AÑADIMOS EL EVENTO ONCLICK
  const renderJugadores = (lista: any[]) => {
    if (!lista || lista.length === 0) return null;
    return (
      <div className="roster-grid">
        {lista.map((jugador: any) => (
          <div 
             key={jugador.id_jugador} 
             className="jugador-card"
             onClick={() => manejarClickJugador(jugador.id_jugador)} // <-- LA ACCIÓN
          >
            
            <div className="jugador-foto-wrapper">
              <img
                src={jugador.foto_url || "https://via.placeholder.com/300"}
                alt={jugador.nombre}
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/300";
                }}
                className="jugador-img"
                loading="lazy"
              />
              <div className="jugador-numero-badge">{jugador.numero}</div>
            </div>

            <div className="jugador-info">
              <h3 className="jugador-nombre">{jugador.nombre}</h3>
              <div className="jugador-stats-pills">
                <span className="stat-pill">B: {jugador.bateo}</span>
                <span className="stat-pill">L: {jugador.picheo}</span>
              </div>
            </div>
            
          </div>
        ))}
      </div>
    );
  };

  const categorias = ['Todos', 'Lanzadores', 'Receptores', 'Infielders', 'Outfielders'];

  return (
    <div className="equipo-container">
      <div className="eq-bg-glow"></div>

      <header className="equipo-header">
        <div className="header-badge">LMB 2026</div>
        <h1 className="equipo-title">ROSTER OFICIAL</h1>
        <p className="equipo-subtitle">LEONES DE YUCATÁN</p>
      </header>

      {/* Filtros */}
      <div className="filtros-container">
        <div className="filtros-scroll">
          {categorias.map(cat => (
            <button 
              key={cat}
              className={`filtro-btn ${filtroActivo === cat ? 'activo' : ''}`}
              onClick={() => setFiltroActivo(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido Roster */}
      <div className="roster-content">
        {(filtroActivo === 'Todos' || filtroActivo === 'Lanzadores') && roster.lanzadores?.length > 0 && (
          <div className="roster-section">
            <h2 className="posicion-title">Lanzadores</h2>
            {renderJugadores(roster.lanzadores)}
          </div>
        )}

        {(filtroActivo === 'Todos' || filtroActivo === 'Receptores') && roster.receptores?.length > 0 && (
          <div className="roster-section">
            <h2 className="posicion-title">Receptores</h2>
            {renderJugadores(roster.receptores)}
          </div>
        )}

        {(filtroActivo === 'Todos' || filtroActivo === 'Infielders') && roster.infielders?.length > 0 && (
          <div className="roster-section">
            <h2 className="posicion-title">Infielders</h2>
            {renderJugadores(roster.infielders)}
          </div>
        )}

        {(filtroActivo === 'Todos' || filtroActivo === 'Outfielders') && roster.outfielders?.length > 0 && (
          <div className="roster-section">
            <h2 className="posicion-title">Outfielders</h2>
            {renderJugadores(roster.outfielders)}
          </div>
        )}
      </div>

      {/* 🔥 ESTE ES EL SPINNER QUE USA LA VARIABLE loadingModal */}
      {loadingModal && (
        <div className="modal-overlay-loader">
           <div className="eq-spinner"></div>
        </div>
      )}

      {/* 🔥 RENDERIZAMOS EL MODAL SI HAY UN JUGADOR SELECCIONADO */}
      {jugadorSeleccionado && (
          <JugadorModal 
              jugador={jugadorSeleccionado} 
              stats={statsActuales} 
              onClose={() => {
                  setJugadorSeleccionado(null);
                  setStatsActuales(null);
              }} 
          />
      )}

    </div>
  );
};

export default Equipo;