// src/api/axios.ts

import axios from 'axios';

// Obtenha o token salvo no localStorage
const getToken = () => localStorage.getItem('token');

const BASE_URL = import.meta.env.VITE_BASE_URL


// Cria a instância do Axios
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de requisição para adicionar token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de resposta para salvar o token ao fazer login
api.interceptors.response.use(
  (response) => {
    // Suponha que o token venha como response.data.token
    if (response.config.url?.includes('/auth/client-login') && response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('client', JSON.stringify(response.data.cliente))
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expirado ou inválido
      //signOut();
      localStorage.clear()

      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;
