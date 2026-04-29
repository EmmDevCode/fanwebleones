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
            const res = await axios.get(`/api/juegos/${idJuego}/jugadas`);
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
        <div className="pbp-container">
            <GameAnimator
                eventoActual={eventoAnimacion}
                onAnimationEnd={() => setEventoAnimacion(null)}
            />

            <div className="pbp-header">
                <div className="pbp-live-pulse">
                    <span className="pbp-pulse-dot"></span>
                    <span>EN VIVO</span>
                </div>
                <h3 className="pbp-title">JUGADA POR JUGADA</h3>
                {/* 👇 ESTOS SON LOS BOTONES DE PRUEBA 👇 */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <button onClick={() => setEventoAnimacion('homerun')} style={{ padding: '5px 10px', background: '#d32f2f', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    Probar Jonrón
                </button>
                <button onClick={() => setEventoAnimacion('strikeout')} style={{ padding: '5px 10px', background: '#1976d2', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    Probar Ponche
                </button>
            </div>
            {/* 👆 ================================== 👆 */}
            </div>

            <div className="pbp-feed">
                {jugadas.map((jugada) => (
                    <div key={jugada.id_jugada} className="play-card">
                        <div className="play-left">
                            <div className="play-img-wrapper">
                                <img src={jugada.foto_bateador || 'https://ui-avatars.com/api/?name=Bateador&background=1c2b21&color=f7b112'} alt="Bateador" className="play-batter-img" />
                            </div>
                        </div>

                        <div className="play-right">
                            <div className="play-header-row">
                                <div className="play-count-box">
                                    <span className="play-count">{jugada.bolas}B - {jugada.strikes}S</span>
                                    <span className="play-outs">{jugada.outs} Out{jugada.outs !== 1 && 's'}</span>
                                </div>
                                <span className="play-badge">{jugada.evento}</span>
                            </div>
                            <p className="play-desc">{jugada.descripcion}</p>
                            <div className="play-score-box">
                                <span className="play-score-lbl">VIS</span> <span className="play-score-val">{jugada.marcador_away}</span>
                                <span className="play-score-div"></span>
                                <span className="play-score-val">{jugada.marcador_home}</span> <span className="play-score-lbl">LOC</span>
                            </div>
                        </div>
                    </div>
                ))}
                {jugadas.length === 0 && (
                    <div className="pbp-empty">
                        <div className="pbp-empty-icon">⚾</div>
                        <p>Esperando jugadas...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JugadasEnVivo;