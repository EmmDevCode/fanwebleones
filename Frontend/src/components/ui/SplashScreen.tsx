import React, { useEffect } from 'react';
import './SplashScreen.css';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    // Ajusta el tiempo que quieres que dure la pantalla de carga (en milisegundos)
    const timer = setTimeout(() => {
      onComplete();
    }, 3000); // 3 segundos por defecto

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="splash-screen">
      <div className="splash-content">
        <div className="video-placeholder">
          {
            <video autoPlay loop muted playsInline className="splash-video">
              <source src="/loader/loader.mp4" type="video/mp4" />
              Tu navegador no soporta el elemento de video.
            </video>
          }
        </div>

        <h1 className="splash-title">Leones fanweb</h1>

        <div className="loader-container">
          <div className="loader"></div>
          <span className="loader-text">Cargando...</span>
        </div>
      </div>

      <div className="splash-footer">
        <p>🦁 hecha por los fans para los fans</p>
      </div>
    </div>
  );
};

export default SplashScreen;
