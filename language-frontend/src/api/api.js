// src/api/api.js
import axios from 'axios';

// 👇 Set your Laravel API URL (use environment variables for production!)
const api = axios.create({
  baseURL: 'http://192.168.57.12:8000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});


// 👇 Auto-attach Bearer token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


export default api;
