// src/api/aiApi.js
import axios from 'axios';

const aiApi = axios.create({
  baseURL: 'http://192.168.42.236:8001/api/ai/', 
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

aiApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default aiApi;
