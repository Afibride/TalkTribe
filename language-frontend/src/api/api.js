// src/api/api.js
import axios from "axios";

// 👇 Set your Laravel API URL (use environment variables for production!)
const api = axios.create({
  baseURL: 'http://192.168.6.13:8000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Attach token from either storage
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("authToken") || localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
