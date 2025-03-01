// client/src/utils/axiosConfig.js
import axios from 'axios';

const instance = axios.create({
  // Fix baseURL to properly handle API paths
  baseURL: process.env.REACT_APP_API_URL || 'https://auth-sys-backend.onrender.com/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add more detailed debugging to see what URL is being used
console.log('axiosConfig using baseURL:', instance.defaults.baseURL);

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