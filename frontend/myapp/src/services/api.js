import axios from 'axios';
import Cookies from 'js-cookie';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor
API.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear auth and redirect
      Cookies.remove('token');
      Cookies.remove('user');
      window.location.href = '/login';
    }
    
    if (error.response?.status === 403) {
      // Forbidden
      window.location.href = '/unauthorized';
    }
    
    return Promise.reject(error);
  }
);

export default API;