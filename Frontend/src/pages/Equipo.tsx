import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Equipo.css';

const Equipo: React.FC = () => {

  const [roster, setRoster] = useState<any>({
    lanzadores: [],
    infielders: [],
    outfielders: [],
    receptores: []
  });

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
    return <div className="equipo-container">Cargando roster...</div>;
  }

  // 🔥 COMPONENTE REUTILIZABLE ACTUALIZADO
  const renderJugadores = (lista: any[]) => (
    lista.map((jugador: any) => (
      // Cambiamos a jugador.id_jugador
      <div key={jugador.id_jugador} className="jugador-card">

        {/* 🖼️ IMAGEN (Con la clase CSS que agregaremos) */}
        <img
          src={jugador.foto_url || "https://via.placeholder.com/80"}
          alt={jugador.nombre}
          onError={(e) => {
            e.currentTarget.src = "https://via.placeholder.com/80";
          }}
          className="jugador-img"
        />

        <div className="jugador-info">
          <div className="flex items-center gap-2">
            <div className="jugador-numero">#{jugador.numero}</div>
            <h3 className="jugador-nombre">{jugador.nombre}</h3>
          </div>
          
          {/* Aprovechamos la data real de bateo y pitcheo */}
          <p className="jugador-detalles">
            Batea: {jugador.bateo} • Lanza: {jugador.picheo}
          </p>
        </div>

      </div>
    ))
  );

  return (
    <div className="equipo-container">

      <header className="equipo-header">
        <h1 className="equipo-title">Roster</h1>
        <p className="equipo-subtitle">Leones de Yucatán • Temporada 2026</p>
      </header>

      <h2 className="posicion-title">Lanzadores</h2>
      {renderJugadores(roster.lanzadores)}

      <h2 className="posicion-title">Receptores</h2>
      {renderJugadores(roster.receptores)}

      <h2 className="posicion-title">Jugadores del cuadro</h2>
      {renderJugadores(roster.infielders)}

      <h2 className="posicion-title">Jardineros</h2>
      {renderJugadores(roster.outfielders)}

    </div>
  );
};

export default Equipo;