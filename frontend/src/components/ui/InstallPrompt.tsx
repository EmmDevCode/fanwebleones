import React, { useState, useEffect } from 'react';
import { X, Share, MoreVertical, PlusSquare } from 'lucide-react';
import './InstallPrompt.css';

const InstallPrompt: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [device, setDevice] = useState<'ios' | 'android' | 'desktop'>('desktop');

  useEffect(() => {
    // 1. Verificamos si la app YA está instalada en el inicio (Modo Standalone)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    
    // 2. Verificamos si ya le mostramos el mensaje antes
    const hasSeenPrompt = localStorage.getItem('leones_install_prompt');

    if (isStandalone || hasSeenPrompt) {
      return; // Si ya la tiene o ya cerró el mensaje, no hacemos nada.
    }

    // 3. Detectamos el sistema operativo
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setDevice('ios');
      setIsVisible(true);
    } else if (/android/.test(userAgent)) {
      setDevice('android');
      setIsVisible(true);
    }
    // Si es desktop, 'isVisible' se queda en false para no molestar.
  }, []);

  const closePrompt = () => {
    // Guardamos que ya lo vio para no volver a mostrarlo
    localStorage.setItem('leones_install_prompt', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="install-prompt-overlay">
      <div className="install-prompt-modal">
        <button className="close-btn" onClick={closePrompt} aria-label="Cerrar">
          <X size={20} />
        </button>
        
        <div className="install-content">
          <h3>📱 Lleva a los Leones contigo</h3>
          <p>Agrega la app a tu pantalla de inicio para un acceso más rápido.</p>
          
          {device === 'ios' && (
            <div className="instructions">
              <p>
                1. Toca el botón Compartir <Share size={18} className="inline-icon"/> en la barra inferior.
              </p>
              <p>
                2. Desliza hacia abajo y selecciona <strong>Agregar a inicio</strong> <PlusSquare size={18} className="inline-icon"/>.
              </p>
            </div>
          )}
          
          {device === 'android' && (
            <div className="instructions">
              <p>
                1. Toca el menú <MoreVertical size={18} className="inline-icon"/> de tu navegador arriba a la derecha.
              </p>
              <p>
                2. Selecciona <strong>Agregar a la pantalla principal</strong>.
              </p>
            </div>
          )}

          <button className="btn-entendido" onClick={closePrompt}>
            ¡Listo, lo haré!
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;