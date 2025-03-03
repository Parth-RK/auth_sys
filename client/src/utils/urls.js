// URL Configuration for the entire application
export const URLS = {
  // Frontend routes
  LOGIN: '/login',
  REGISTER: '/register',
  HOME: '/',
  DASHBOARD: '/dashboard',
  PRIVILEGES: '/privileges',
  USERS: '/users',
  APPEARANCE: '/appearance',
  
  // API URLs
  API: {
    BASE: process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000',
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      VERIFY: '/auth/verify',
      LOGOUT: '/auth/logout',
      PROFILE: '/auth/profile',
    },
    USERS: '/api/users',
    PRIVILEGES: '/api/privileges',
    SETTINGS: '/api/settings',
  }
};
