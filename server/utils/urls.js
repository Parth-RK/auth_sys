import * as dotenv from 'dotenv';
dotenv.config();

// Parse frontend URLs from environment variable
const parseFrontendUrls = () => {
  const urlsString = process.env.FRONTEND_URL || 'http://localhost:3000';
  return urlsString.split(',').map(url => url.trim());
};

// API route configuration with environment variables or defaults
const apiPrefix = process.env.API_PREFIX || '/api';

export const SERVER_URLS = {
  FRONTEND: parseFrontendUrls(),
  API: {
    PREFIX: apiPrefix,
    AUTH: `${apiPrefix}${process.env.AUTH_ROUTE || '/auth'}`,
    USERS: `${apiPrefix}${process.env.USERS_ROUTE || '/users'}`,
    HEALTH: `${apiPrefix}${process.env.HEALTH_ROUTE || '/health'}`,
    CORS_TEST: `${apiPrefix}${process.env.CORS_TEST_ROUTE || '/cors-test'}`
  }
};

export default SERVER_URLS;
