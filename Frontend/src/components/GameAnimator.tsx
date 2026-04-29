// src/components/GameAnimator.tsx
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import './GameAnimator.css';

export type AnimationType = 'homerun' | 'strikeout' | 'win' | 'run' | null;

interface Props {
    eventoActual: AnimationType;
    onAnimationEnd: () => void;
}

const GameAnimator: React.FC<Props> = ({ eventoActual, onAnimationEnd }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (eventoActual) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(onAnimationEnd, 500); // Allow fade out transition
            }, 4000);

            return () => clearTimeout(timer);
        }
    }, [eventoActual, onAnimationEnd]);

    if (!eventoActual) return null;

    return createPortal(
        <div className={`animator-overlay ${eventoActual} ${!isVisible ? 'fade-out' : ''}`}>
            <div className="animator-content">
                {eventoActual === 'homerun' && (
                    <div className="anim-homerun-container">
                        <div className="hr-sparks"></div>
                        <h1 className="hr-text" data-text="HOME RUN">HOME RUN</h1>
                        <h2 className="hr-sub">¡VUELA LA PELOTA!</h2>
                    </div>
                )}

                {eventoActual === 'strikeout' && (
                    <div className="anim-strikeout-container">
                        <div className="k-bg-glow"></div>
                        <h1 className="k-text">K</h1>
                        <p className="k-sub">PONCHE</p>
                        <div className="k-slash"></div>
                    </div>
                )}

                {eventoActual === 'run' && (
                    <div className="anim-run-container">
                        <div className="run-trails"></div>
                        <h1 className="run-text">¡CARRERA!</h1>
                        <div className="run-plate"></div>
                    </div>
                )}

                {eventoActual === 'win' && (
                    <div className="anim-win-container">
                        <div className="win-confetti"></div>
                        <h1 className="win-text">¡VICTORIA!</h1>
                        <p className="win-sub">LEONES DE YUCATÁN</p>
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};

export default GameAnimator;