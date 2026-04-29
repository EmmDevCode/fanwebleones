import { useState, useEffect } from 'react';
import type { JuegoEnVivo } from '@/types';

export const useLiveScore = () => {
  const [juego, setJuego] = useState<JuegoEnVivo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Función que hace la petición al backend
    const fetchLiveScore = async () => {
      try {
        // Asegúrate de que esta URL coincida con el puerto de tu FastAPI (usualmente 8000)
        const response = await fetch('/api/juegos/en-vivo');
        
        if (!response.ok) {
          throw new Error('No hay juegos activos en este momento');
        }

        const data: JuegoEnVivo = await response.json();
        setJuego(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Error al conectar con el servidor');
      } finally {
        setLoading(false);
      }
    };

    // Ejecutamos la primera vez inmediatamente
    fetchLiveScore();

    // Configuramos un "polling" para que consulte la API cada 15 segundos
    const intervalId = setInterval(fetchLiveScore, 15000);

    // Limpiamos el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }, []);

  return { juego, loading, error };
};