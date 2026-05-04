import React, { useState, useEffect, useRef } from 'react';
import { Radio, Info, X } from 'lucide-react';
import './RadioBoton.css';

const RadioBoton: React.FC = () => {
  const [juegoEnVivo, setJuegoEnVivo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  
  // Referencia al elemento de audio oculto
  const audioRef = useRef<HTMLAudioElement>(null);

  // ¡AQUÍ VA EL ENLACE DIRECTO DEL STREAMING, NO LA PÁGINA WEB!
  const streamUrl = "https://cast4.my-control-panel.com/proxy/televiso/comadremid";

  const verificarJuegoEnVivo = async () => {
    try {
      // 1. Apuntamos al endpoint que ya sabe si hay juego en vivo
      const response = await fetch('/api/juegos/widget-principal'); 
      
      if (!response.ok) return;
      
      const data = await response.json();
      
      // 2. Tu backend es genial porque ya nos da el "tipo_vista"
      // Si el tipo_vista es "en_vivo", encendemos el botón, si no, lo apagamos.
      if (data.tipo_vista === "en_vivo") {
        setJuegoEnVivo(true);
      } else {
        setJuegoEnVivo(false);
      }
      
    } catch (error) {
      console.error("Error al verificar estado del juego:", error);
    }
  };

  useEffect(() => {
    verificarJuegoEnVivo();
    const intervalo = setInterval(verificarJuegoEnVivo, 300000);
    return () => clearInterval(intervalo);
  }, []);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        // El play() puede fallar si la red está lenta, lo atrapamos
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            setShowInfo(false); // Ocultamos la info al reproducir para limpiar la UI
          })
          .catch(err => {
            console.error("Error al reproducir la radio:", err);
            alert("No se pudo conectar con la radio en este momento.");
          });
      }
    }
  };

  if (!juegoEnVivo) return null;

  return (
    <>
      {/* Reproductor invisible de HTML5 */}
      <audio ref={audioRef} src={streamUrl} preload="none" />

      <div className="radio-container">
        <div className="radio-controls-wrapper">
          
          {/* Tarjeta de Información Glassmorphism */}
          <div className={`radio-info-card ${showInfo ? 'visible' : ''}`}>
            <button className="close-info-btn" onClick={() => setShowInfo(false)} aria-label="Cerrar información">
              <X size={14} />
            </button>
            <p>
              A través de esta plataforma se distribuyen las señales oficiales de los Leones de Yucatán. 
              El acceso a la señal de <strong>La Comadre 98.5 FM</strong> es restringido, limitado al horario de los juegos, 
              y su transmisión tiene fines exclusivamente informativos y de servicio social, sin fines de lucro.
            </p>
          </div>

          {/* Botón para mostrar/ocultar información */}
          <button 
            className="radio-info-toggle" 
            onClick={() => setShowInfo(!showInfo)}
            aria-label="Información de la transmisión"
          >
            <Info size={18} />
          </button>

          {/* Botón Principal Flotante */}
          <button 
            className={`radio-main-btn ${isPlaying ? 'playing' : ''}`} 
            onClick={toggleAudio}
            aria-label={isPlaying ? "Pausar radio" : "Escuchar juego en vivo"}
          >
            <div className="radio-glow-effect"></div>
            
            {isPlaying ? (
              <div className="equalizer-icon">
                <span className="eq-bar"></span>
                <span className="eq-bar"></span>
                <span className="eq-bar"></span>
                <span className="eq-bar"></span>
              </div>
            ) : (
              <Radio size={24} className="radio-icon" />
            )}
            
            <span className="radio-badge">
              {isPlaying ? 'Al Aire' : 'En Vivo'}
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default RadioBoton;