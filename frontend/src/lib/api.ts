import axios from 'axios';

const PROD_API_URL = 'https://finance-smart-0k7k.onrender.com/api';
const BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? PROD_API_URL : '/api');

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pg_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally — but NOT on auth routes (login/register already handle their own errors)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const isAuthRoute = err.config?.url?.includes('/auth/login') ||
                        err.config?.url?.includes('/auth/register');
    if (err.response?.status === 401 && !isAuthRoute) {
      localStorage.removeItem('pg_token');
      localStorage.removeItem('pg_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
