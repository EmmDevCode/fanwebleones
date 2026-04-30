import React, { useState, useEffect } from 'react';
import './CookieBanner.css';

const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Al cargar, verificamos si ya existe el registro de consentimiento
    const consent = localStorage.getItem('leones_cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    // Guardamos la decisión del usuario en el almacenamiento local
    localStorage.setItem('leones_cookie_consent', 'true');
    setIsVisible(false);
    
    // Aquí (a futuro) puedes disparar la inicialización de Google Analytics o Facebook Pixel
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-banner-container">
      <div className="cookie-banner-content">
        <div className="cookie-banner-text-wrapper">
          <span className="cookie-icon">🍪</span>
          <p>
            Usamos cookies para asegurar que tengas la mejor experiencia en la cueva. 
            Al continuar navegando, aceptas nuestro uso de cookies.
          </p>
        </div>
        <button onClick={acceptCookies} className="btn-accept-cookies">
          <span>¡Entendido!</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;