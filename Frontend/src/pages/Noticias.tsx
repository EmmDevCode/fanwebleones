// src/pages/Noticias.tsx
import React from 'react';
import './Noticias.css';

const Noticias: React.FC = () => {
  // Datos simulados [cite: 235-244]
  const noticias = [
    {
      id: 1,
      titulo: "Blanqueada de pitcheo en el Kukulcán",
      extracto: "César Valdez lanza 7 entradas en blanco y los Leones se llevan la serie ante los Diablos Rojos.",
      fecha: "25 Mayo, 2026",
      // Imagen de relleno (puedes cambiarla por URLs reales)
      imagen: "https://images.unsplash.com/photo-1508344928928-7165b67de128?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 2,
      titulo: "Art Charles lidera el departamento de cuadrangulares",
      extracto: "El toletero conectó su jonrón número 15 de la temporada, consolidándose como el bateador más temido.",
      fecha: "23 Mayo, 2026",
      imagen: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?auto=format&fit=crop&q=80&w=800"
    }
  ];

  return (
    <div className="noticias-container">
      <h1 className="noticias-header">Noticias</h1>
      
      <div className="noticias-lista">
        {noticias.map((noticia) => (
          <article key={noticia.id} className="noticia-card">
            <img src={noticia.imagen} alt="Noticia" className="noticia-imagen" />
            <div className="noticia-info">
              <span className="noticia-fecha">{noticia.fecha}</span>
              <h2 className="noticia-titulo">{noticia.titulo}</h2>
              <p className="noticia-extracto">{noticia.extracto}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Noticias;