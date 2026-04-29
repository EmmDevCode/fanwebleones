import React from 'react';
import { useNavigate } from 'react-router-dom'; // Asumiendo que usas react-router-dom
import './EnConstruccion.css';

interface Props {
    titulo?: string;
    mensaje?: string;
}

const EnConstruccion: React.FC<Props> = ({ 
    titulo = "¡SECCIÓN EN CONSTRUCCIÓN!", 
    mensaje = "Estamos trabajando duro en la jaula de bateo para tener esta sección lista muy pronto. Perdona las molestias." 
}) => {
    const navigate = useNavigate();

    return (
        <div className="construccion-wrapper">
            <div className="construccion-card">
                <div className="construccion-icon-container">
                    <div className="construccion-icon-bg"></div>
                    <span className="construccion-icon">🦁</span>
                </div>
                
                <h1 className="construccion-titulo">{titulo}</h1>
                <p className="construccion-mensaje">{mensaje}</p>
                
                <div className="construccion-loader">
                    <div className="loader-dot"></div>
                    <div className="loader-dot"></div>
                    <div className="loader-dot"></div>
                </div>

                <button className="btn-regresar" onClick={() => navigate(-1)}>
                    <span className="btn-icon">←</span>
                    <span>Regresar a la página anterior</span>
                </button>
            </div>
        </div>
    );
};

export default EnConstruccion;