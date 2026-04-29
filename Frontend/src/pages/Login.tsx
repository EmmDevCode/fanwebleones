/* import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';*/
import './Auth.css';
import EnConstruccion from '../components/EnConstruccion';

const Login = () => {
    return (
        <div>
            {/* Otras cosas como tu Navbar, etc. */}

            <EnConstruccion
                titulo="Noticias oficiales Proximamente"
                mensaje="Estamos trabajando duro para traerte una mejor experiencia en la pagina."
            />

            {/* Footer */}
        </div>
    );
}
export default Login;