// src/components/LideresEquipo.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import JugadorModal from './JugadorModal'; 
import './LideresEquipo.css';

const LideresEquipo: React.FC = () => {
  const [lideres, setLideres] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Estados para el Modal
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState<any>(null);
  const [statsActuales, setStatsActuales] = useState<any>(null);
  const [loadingModal, setLoadingModal] = useState(false);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/equipo/lideres")
      .then(res => {
        if (!res.data.error) setLideres(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error cargando líderes:", err);
        setLoading(false);
      });
  }, []);

  const manejarClickLider = async (id: number) => {
    if (!id) {
        console.error("❌ ERROR: El líder no tiene id_jugador asociado.");
        return;
    }
    
    console.log("⚾ Buscando stats para el jugador ID:", id);
    setLoadingModal(true);
    try {
        // Asegúrate de que esta ruta sea la misma que usas en Equipo.tsx
        const res = await axios.get(`http://127.0.0.1:8000/api/equipo/jugadores/${id}/stats`);
        setJugadorSeleccionado(res.data.perfil);
        setStatsActuales(res.data.stats_temporada);
    } catch (err) {
        console.error("❌ Error al cargar stats del líder:", err);
    } finally {
        setLoadingModal(false);
    }
  };

  if (loading) return <div className="lideres-loading">Buscando a los reyes de la selva...</div>;
  if (!lideres) return null;

  // Sub-componente interno para cada tarjeta
  const LiderCard = ({ titulo, data, statKey, format = "num" }: any) => {
    if (!data) return null;
    const valor = format === "avg" ? data.stats[statKey] : data.stats[statKey] || "0";
    
    return (
      <div 
        className="lider-card" 
        onClick={() => manejarClickLider(data.id_jugador)}
        style={{ cursor: 'pointer' }}
      >
        <div className="lider-card-inner">
          <span className="lider-categoria">{titulo}</span>
          <div className="lider-img-wrapper">
            <img 
              src={data.foto} 
              alt={data.nombre} 
              className="lider-foto" 
              onError={(e) => e.currentTarget.src = "https://via.placeholder.com/150"} 
            />
            <div className="lider-badge">#1</div>
          </div>
          <div className="lider-info">
            <span className="lider-nombre">{data.nombre}</span>
            <span className="lider-valor">{valor}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="lideres-container">
      <div className="lideres-header-container">
        <h2 className="lideres-header">👑 LÍDERES MELENUDOS</h2>
        <p className="lideres-subtitle">LOS MEJORES DE LA TEMPORADA</p>
      </div>
      
      <div className="lideres-seccion">
        <div className="seccion-titulo-wrapper">
          <h3 className="seccion-titulo">🔥 PODER OFENSIVO</h3>
        </div>
        <div className="lideres-grid">
          <LiderCard titulo="📊 PROMEDIO (AVG)" data={lideres.bateo.avg} statKey="avg" format="avg" />
          <LiderCard titulo="💥 HOME RUNS" data={lideres.bateo.hr} statKey="homeRuns" />
          <LiderCard titulo="🏃‍♂️ CARRERAS IMPULSADAS" data={lideres.bateo.rbi} statKey="rbi" />
          <LiderCard titulo="👟 BASES ROBADAS" data={lideres.bateo.sb} statKey="stolenBases" />
        </div>
      </div>

      <div className="lideres-seccion">
        <div className="seccion-titulo-wrapper">
          <h3 className="seccion-titulo">🎯 AS DEL MONTÍCULO</h3>
        </div>
        <div className="lideres-grid">
          <LiderCard titulo="📉 EFECTIVIDAD (ERA)" data={lideres.pitcheo.era} statKey="era" format="avg" />
          <LiderCard titulo="🏆 VICTORIAS" data={lideres.pitcheo.w} statKey="wins" />
          <LiderCard titulo="⚡ PONCHES (SO)" data={lideres.pitcheo.so} statKey="strikeOuts" />
          <LiderCard titulo="🔒 SALVAMENTOS" data={lideres.pitcheo.sv} statKey="saves" />
        </div>
      </div>

      {/* Pantalla de carga mientras abre el modal */}
      {loadingModal && (
        <div className="modal-overlay" style={{ zIndex: 2000 }}>
           <div className="eq-spinner"></div>
        </div>
      )}

      {/* Modal de Detalle */}
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

export default LideresEquipo;