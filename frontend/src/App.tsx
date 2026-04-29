import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '@/components/ui/Layout';
import Inicio from '@/pages/Inicio';
import Login from '@/pages/Login';
import ProtectedRoute from '@/components/ProtectedRoute';
import Registro from '@/pages/Registro';
import Perfil from '@/pages/Perfil';
import { AuthProvider } from '@/context/AuthContext';
import Calendario from '@/pages/Calendario';
import Equipo from '@/pages/Equipo';
import Noticias from '@/pages/Noticias'; // Importamos Noticias
import SplashScreen from '@/components/ui/SplashScreen';


const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          {/* Rutas con la Barra de Navegación */}
          <Route element={<Layout />}>
            <Route path="/" element={<Inicio />} />
            <Route path="/calendario" element={<Calendario />} />
            <Route path="/equipo" element={<Equipo />} />
            <Route path="/noticias" element={<Noticias />} />
            {/* Rutas Protegidas (Solo usuarios logueados) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/perfil" element={<Perfil />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;