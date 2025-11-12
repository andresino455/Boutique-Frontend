// src/api/axios.js
import axios from 'axios';

// ✅ Usar variable de entorno con fallback a localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

console.log('[AXIOS] API URL configurada:', API_URL);

const instance = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true, // Para cookies (JWT puede omitirse)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token automáticamente
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    console.log('[AXIOS] Enviando token:', token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas (opcional pero útil)
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Manejar errores de autenticación
    if (error.response?.status === 401) {
      console.log('[AXIOS] Token inválido o expirado');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      // Opcional: redirigir al login
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;