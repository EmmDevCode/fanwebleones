// src/pages/Calendario.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import JuegoCard from '../components/JuegoCard'; // Importación segura con ruta relativa
import './Calendario.css';

const Calendario: React.FC = () => {
  const [juegos, setJuegos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Funciones de ayuda (Helpers) - ¡Ya sin la función de abreviaturas!
  const obtenerNombreEstadio = (juego: any) => {
    if (juego.estadio?.nombre) return juego.estadio.nombre;
    const fallbacks: { [key: string]: string } = {
      "Leones de Yucatán": "Estadio Victor Cervera Pacheco",
      "Diablos Rojos del México": "Estadio Alfredo Harp Helú",
      "Tigres de Quintana Roo": "Estadio Beto Ávila",
      "Pericos de Puebla": "Estadio Hermanos Serdán",
      "El Águila de Veracruz": "Estadio Beto Ávila (Veracruz)",
      "Bravos de León": "Estadio Domingo Santana"
    };
    return fallbacks[juego.local?.nombre] || "Estadio por definir";
  };

  const formatearFechaLarga = (fechaStr: string) => {
    const fechaObj = new Date(`${fechaStr}T12:00:00`);
    return fechaObj.toLocaleDateString('es-ES', { 
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
    }).toUpperCase();
  };

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/juegos/calendario")
      .then(res => {
        if (Array.isArray(res.data)) setJuegos(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Cargando temporada...</div>;

  return (
    <div className="calendario-page">
      <header className="calendario-header">
        <h1>Calendario de Temporada</h1>
        <p>Temporada Regular LMB 2026</p>
      </header>

      <div className="calendario-grid">
        {juegos.map((juego) => (
          <JuegoCard 
            key={juego.id_juego} 
            juego={juego} 
            formatearFechaLarga={formatearFechaLarga}
            obtenerNombreEstadio={obtenerNombreEstadio}
          />
        ))}
      </div>
    </div>
  );
};

export default Calendario;