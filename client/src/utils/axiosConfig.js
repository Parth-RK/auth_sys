// client/src/utils/axiosConfig.js
import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://auth-sys-backend.onrender.com',//'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add logging to help debug the issue
instance.interceptors.response.use(
  (response) => {
    console.log('API Response:', response);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response);
    return Promise.reject(error);
  }
);

// API request helpers
export const api = {
  get: (url, config = {}) => instance.get(url, config),
  post: (url, data, config = {}) => instance.post(url, data, config),
  put: (url, data, config = {}) => instance.put(url, data, config),
  delete: (url, config = {}) => instance.delete(url, config)
};

export default instance;