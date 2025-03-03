// URL Configuration for the entire application

// Make sure the baseURL is correct and has no trailing slash
// const baseUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
const baseUrl = 'https://auth-sys-backend.onrender.com';

// Debug URL configuration
console.log('Environment variable REACT_APP_BACKEND_URL:', process.env.REACT_APP_BACKEND_URL);
console.log('URL Configuration using baseUrl:', baseUrl);

export const URLS = {
  // Frontend routes
  LOGIN: '/login',
  REGISTER: '/register',
  HOME: '/',
  DASHBOARD: '/dashboard',
  PRIVILEGES: '/privileges',
  USERS: '/users',
  APPEARANCE: '/appearance',
  
  // API URLs with full absolute paths
  API: {
    BASE: baseUrl,
    AUTH: {
      // Use full paths with API prefix to avoid path construction issues
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      VERIFY: '/api/auth/verify',
      LOGOUT: '/api/auth/logout',
      PROFILE: '/api/auth/profile',
    },
    USERS: '/api/users',
    PRIVILEGES: '/api/privileges',
    SETTINGS: '/api/settings',
  }
};
