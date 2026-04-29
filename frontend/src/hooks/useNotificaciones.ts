// src/hooks/useNotificaciones.ts
import { useState } from 'react';
// import { messaging, VAPID_KEY } from '@/core/firebase';
// import { getToken } from 'firebase/messaging';

export const useNotificaciones = () => {
  const [notificacionesActivas, setNotificacionesActivas] = useState(false);

  const toggleNotificaciones = async () => {
    if (notificacionesActivas) {
      // Si ya están activas, las "apagamos" en la UI (en la vida real, eliminarías el token de la BD)
      setNotificacionesActivas(false);
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('Permiso concedido.');
        // Aquí obtendrías el token de Firebase:
        // const token = await getToken(messaging, { vapidKey: VAPID_KEY });
        // Y harías el POST a tu backend para guardar el token...
        
        setNotificacionesActivas(true);
      } else {
        console.log('Permiso denegado por el usuario.');
        alert('Debes habilitar las notificaciones en tu navegador para recibir alertas.');
      }
    } catch (error) {
      console.error('Error al solicitar permiso:', error);
    }
  };

  return { notificacionesActivas, toggleNotificaciones };
};