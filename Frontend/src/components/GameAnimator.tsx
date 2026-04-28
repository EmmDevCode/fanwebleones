// src/components/GameAnimator.tsx
import React, { useEffect, useState } from 'react';
import './GameAnimator.css';

// Definimos los tipos de animaciones que soportamos
export type AnimationType = 'homerun' | 'strikeout' | 'win' | 'run' | null;

interface Props {
    eventoActual: AnimationType;
    onAnimationEnd: () => void; // Función para limpiar el estado cuando termine la animación
}

const GameAnimator: React.FC<Props> = ({ eventoActual, onAnimationEnd }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (eventoActual) {
            setIsVisible(true);

            // La animación dura 4 segundos, luego desaparece
            const timer = setTimeout(() => {
                setIsVisible(false);
                onAnimationEnd();
            }, 4000);

            return () => clearTimeout(timer);
        }
    }, [eventoActual, onAnimationEnd]);

    if (!isVisible || !eventoActual) return null;

    // Renderizamos diferentes estilos dependiendo del evento
    return (
        <div className={`animator-overlay ${eventoActual}`}>
            <div className="animator-content">
                {eventoActual === 'homerun' && (
                    <>
                        <h1 className="glitch-text" data-text="¡HOME RUN!">¡HOME RUN!</h1>
                        <div className="fireworks"></div>
                    </>
                )}

                {eventoActual === 'strikeout' && (
                    <>
                        <h1 className="strike-text">K</h1>
                        <p className="strike-sub">PONCHE</p>
                    </>
                )}

                {eventoActual === 'run' && (
                    <>
                        <h1 className="run-text">¡CARRERA!</h1>
                    </>
                )}

                {eventoActual === 'win' && (
                    <>
                        <h1 className="win-text">¡VICTORIA!</h1>
                        <p className="win-sub">LEONES DE YUCATÁN</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default GameAnimator;