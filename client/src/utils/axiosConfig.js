// client/src/utils/axiosConfig.js
import axios from 'axios';

// Add a constant to ensure consistency
const API_PREFIX = '/api';

const instance = axios.create({
  // Fix baseURL to match AuthContext.js and avoid path duplication
  baseURL: process.env.REACT_APP_API_URL || 'https://auth-sys-backend.onrender.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add debugging to show the full URL construction
const debugRequest = (url) => {
  // Add a check to ensure URL starts with /api
  const apiUrl = url.startsWith(API_PREFIX) ? url : `${API_PREFIX}${url}`;
  console.log(`API Request to: ${instance.defaults.baseURL}${apiUrl}`);
  return apiUrl;
};

// Add debugging to both axiosConfig and request/response
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

// Improved API request helpers with automatic /api prefix handling
export const api = {
  get: (url, config = {}) => {
    const apiUrl = debugRequest(url);
    return instance.get(apiUrl, config);
  },
  post: (url, data, config = {}) => {
    const apiUrl = debugRequest(url);
    return instance.post(apiUrl, data, config);
  },
  put: (url, data, config = {}) => {
    const apiUrl = debugRequest(url);
    return instance.put(apiUrl, data, config);
  },
  delete: (url, config = {}) => {
    const apiUrl = debugRequest(url);
    return instance.delete(apiUrl, config);
  }
};

export default instance;