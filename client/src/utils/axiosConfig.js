// client/src/utils/axiosConfig.js
import axios from 'axios';

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
  console.log(`API Request to: ${instance.defaults.baseURL}${url}`);
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

// API request helpers
export const api = {
  get: (url, config = {}) => {
    debugRequest(url);
    return instance.get(url, config);
  },
  post: (url, data, config = {}) => {
    debugRequest(url);
    return instance.post(url, data, config);
  },
  put: (url, data, config = {}) => {
    debugRequest(url);
    return instance.put(url, data, config);
  },
  delete: (url, config = {}) => {
    debugRequest(url);
    return instance.delete(url, config);
  }
};

export default instance;