// src/components/JugadasEnVivo.tsx
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import GameAnimator, { type AnimationType } from './GameAnimator';
import './JugadasEnVivo.css';

interface Props {
    idJuego: number; // El gamePk de la LMB
}

const JugadasEnVivo: React.FC<Props> = ({ idJuego }) => {
    const [jugadas, setJugadas] = useState<any[]>([]);
    const [eventoAnimacion, setEventoAnimacion] = useState<AnimationType>(null);

    // useRef actúa como la memoria a corto plazo para no repetir animaciones
    const ultimoAtBatRef = useRef<number>(-1);

    const fetchJugadas = async () => {
        try {
            const res = await axios.get(`http://127.0.0.1:8000/api/juegos/${idJuego}/jugadas`);
            const jugadasNuevas = res.data.jugadas || [];

            if (jugadasNuevas.length > 0) {
                const jugadaMasReciente = jugadasNuevas[0]; // Como las volteamos, la [0] es la última

                // LÓGICA DE EVENTOS EN VIVO
                // Si el id de esta jugada es mayor al último que vimos, ¡es una jugada nueva!
                if (ultimoAtBatRef.current !== -1 && jugadaMasReciente.id_jugada > ultimoAtBatRef.current) {

                    const evento = jugadaMasReciente.evento.toLowerCase();

                    if (evento.includes("home run")) {
                        setEventoAnimacion('homerun');
                    } else if (evento.includes("strikeout")) {
                        setEventoAnimacion('strikeout');
                    } else if (evento.includes("single") || evento.includes("double") || evento.includes("triple")) {
                        // Si quieres, aquí puedes disparar otra animación de "hit"
                    }
                }

                // Actualizamos nuestra memoria
                ultimoAtBatRef.current = jugadaMasReciente.id_jugada;
                setJugadas(jugadasNuevas);
            }
        } catch (err) {
            console.error("Error buscando jugadas en vivo");
        }
    };

    useEffect(() => {
        // 1. Cargamos todo el historial al entrar a la página (sin animar)
        fetchJugadas();

        // 2. Nos quedamos escuchando cada 10 segundos
        const intervalo = setInterval(() => {
            fetchJugadas();
        }, 10000);

        return () => clearInterval(intervalo);
    }, [idJuego]);

    return (
        <div className="play-by-play-container">

            {/* ⚾ EL ESCUCHADOR DE ANIMACIONES ESTÁ AQUÍ OCULTO */}
            <GameAnimator
                eventoActual={eventoAnimacion}
                onAnimationEnd={() => setEventoAnimacion(null)}
            />

            <h3 className="pbp-title">Jugada por Jugada</h3>

            <div className="pbp-feed">
                {jugadas.map((jugada) => (
                    <div key={jugada.id_jugada} className="play-card">

                        <div className="play-left">
                            <img src={jugada.foto_bateador} alt="Bateador" className="play-batter-img" />
                        </div>

                        <div className="play-right">
                            <div className="play-header">
                                <span className="play-count">{jugada.bolas}-{jugada.strikes}, {jugada.outs} out</span>
                                <span className="play-badge">{jugada.evento}</span>
                            </div>
                            <p className="play-desc">{jugada.descripcion}</p>
                            <div className="play-score">
                                <strong>VIS {jugada.marcador_away}</strong> - <strong>LOC {jugada.marcador_home}</strong>
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default JugadasEnVivo;