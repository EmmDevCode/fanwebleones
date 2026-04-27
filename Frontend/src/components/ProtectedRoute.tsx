import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // Si está logueado, lo dejamos pasar al contenido (<Outlet />)
  // Si no, lo mandamos expulsado a la pantalla de login
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;