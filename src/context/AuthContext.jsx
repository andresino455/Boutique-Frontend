/* eslint-disable no-unused-vars */
import { createContext, useContext, useEffect, useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Cargar usuario actual
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('/auth/user/');
        setUser(response.data);
      } catch (error) {
        if (error.response?.status !== 401) {
          console.error('Error inesperado al verificar usuario:', error);
        }
        setUser(null);
      }
    };
  
    fetchUser();
  }, []);
  
  
  const login = async (credentials) => {
    try {
      const res = await axios.post('/auth/login/', credentials);
      // No guardamos token: asumimos que la sesión está manejada por el backend
      const userResponse = await axios.get('/auth/user/');
      setUser(userResponse.data);
      setError(null);
      navigate('/products');
      return { success: true };
    } catch (err) {
      setError('Credenciales inválidas');
      return { success: false };
    }
  };

  const register = async (userData) => {
    try {
      await axios.post('/auth/register/', userData);
      navigate('/login');
      return { success: true };
    } catch (err) {
      setError('Error al registrarse');
      return { success: false };
    }
  };

  const logout = () => {
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{
      user,
      error,
      login,
      register,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
