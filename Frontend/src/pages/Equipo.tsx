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

  const [loading, setLoading] = useState(true);

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
  const renderJugadores = (lista: any[]) => (
    <div className="roster-grid">
      {lista.map((jugador: any) => (
        <div 
           key={jugador.id_jugador} 
           className="jugador-card"
           onClick={() => manejarClickJugador(jugador.id_jugador)} // <-- LA ACCIÓN
           style={{ cursor: 'pointer' }} // Para que el usuario sepa que puede dar clic
        >
          
          <div className="jugador-foto-wrapper">
            <img
              src={jugador.foto_url || "https://via.placeholder.com/150"}
              alt={jugador.nombre}
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/150";
              }}
              className="jugador-img"
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

  return (
    <div className="equipo-container">
      <div className="eq-bg-glow"></div>

      <header className="equipo-header">
        <div className="header-badge">LMB 2026</div>
        <h1 className="equipo-title">ROSTER</h1>
        <p className="equipo-subtitle">LEONES DE YUCATÁN</p>
      </header>

      {/* Aquí podrías agregar un spinner flotante usando loadingModal si quieres */}

      <div className="roster-section">
        <h2 className="posicion-title">Lanzadores</h2>
        {renderJugadores(roster.lanzadores)}
      </div>

      <div className="roster-section">
        <h2 className="posicion-title">Receptores</h2>
        {renderJugadores(roster.receptores)}
      </div>

      <div className="roster-section">
        <h2 className="posicion-title">Infielders</h2>
        {renderJugadores(roster.infielders)}
      </div>

      <div className="roster-section">
        <h2 className="posicion-title">Outfielders</h2>
        {renderJugadores(roster.outfielders)}
      </div>

      {/* 🔥 ESTE ES EL SPINNER QUE USA LA VARIABLE loadingModal */}
      {loadingModal && (
        <div className="modal-overlay" style={{ zIndex: 1001 }}>
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