import React, { createContext, useState, useEffect, useContext } from 'react';

// Tipamos lo que guardaremos del usuario
interface Usuario {
  nombre: string;
  email: string;
}

interface AuthContextType {
  usuario: Usuario | null;
  token: string | null;
  login: (userData: Usuario, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Cuando la app carga, revisamos si ya hay un token guardado
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('usuario');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUsuario(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData: Usuario, newToken: string) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('usuario', JSON.stringify(userData));
    setToken(newToken);
    setUsuario(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setToken(null);
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return context;
};