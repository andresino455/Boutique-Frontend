import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import axios from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    return token;
  });

  // Obtener usuario autenticado
  const fetchUser = useCallback(async () => {
    try {
      const res = await axios.get('/auth/user/');
      const userData = res.data;
      
      // Asegurarnos de que el usuario tenga un rol
      if (!userData.role) {
        userData.role = 'customer'; // Valor por defecto
      }
      
      setUser(userData);
      return userData;
    } catch (err) {
      console.error('[AUTH] Usuario no autenticado:', err.response?.data || err);
      logout(); // Limpiar si token ya no es válido
      return null;
    }
  }, []);

  // Verificar sesión al montar el proveedor
  useEffect(() => {
    if (accessToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      fetchUser();
    }
  }, [accessToken, fetchUser]);

// Login - Versión corregida
const login = async ({ username, password }) => {
  try {
    const res = await axios.post('/auth/token/', { username, password });
    const { access } = res.data;

    // Guardar token
    localStorage.setItem('accessToken', access);
    axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
    setAccessToken(access);

    // Esperar a que fetchUser complete y obtener los datos del usuario
    const userData = await fetchUser();
    
    return { 
      success: true, 
      user: userData  // ← Ahora userData contiene el usuario con el rol
    };
  } catch (err) {
    console.error('[AUTH] Error al iniciar sesión:', err.response?.data || err);
    return { 
      success: false, 
      message: err.response?.data?.detail || 'Error desconocido' 
    };
  }
};

  // Logout
  const logout = () => {
    localStorage.removeItem('accessToken');
    setAccessToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  // Verificar si el usuario tiene un rol específico
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Verificar si el usuario tiene al menos uno de los roles especificados
  const hasAnyRole = (roles) => {
    return roles.includes(user?.role);
  };

  // Helper functions para roles específicos
  const checkIsAdmin = () => hasRole('admin');
  const checkIsSeller = () => hasRole('seller');
  const checkIsCustomer = () => hasRole('customer');

  const value = {
    user,
    login,
    logout,
    accessToken,
    isAuthenticated: !!user,
    // Funciones de verificación de roles
    hasRole,
    hasAnyRole,
    checkIsAdmin,
    checkIsSeller,
    checkIsCustomer,
    // Propiedades directas para fácil acceso
    userRole: user?.role || null,
    isAdmin: user?.role === 'admin',
    isSeller: user?.role === 'seller',
    isCustomer: user?.role === 'customer',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};