import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { authenticateToken, authorize, rateLimiter } from './middleware/auth.js';
import errorHandler from './middleware/errorHandler.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import { SERVER_URLS } from './utils/urls.js';

// Debug utility function
const debugLog = (section, message, data = null) => {
  console.log(`[DEBUG][${section}] ${message}`);
  if (data) {
    console.log(JSON.stringify(data, null, 2));
  }
};

// Log environment variables (without sensitive data)
const logEnv = () => {
  debugLog('ENV', '==== Environment Variables ====');
  debugLog('ENV', `NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
  debugLog('ENV', `PORT: ${process.env.PORT || 5000}`);
  debugLog('ENV', `JWT_SECRET: ${process.env.JWT_SECRET ? '[SET]' : '[NOT SET]'}`);
  debugLog('ENV', `MONGODB_URI: ${process.env.MONGODB_URI ? '[SET]' : '[NOT SET]'}`);
  debugLog('ENV', `FRONTEND_URLS: ${process.env.FRONTEND_URL || '[NOT SET]'}`);
};

dotenv.config();
logEnv();

debugLog('SERVER', 'Initializing Express server');
const app = express();

// Middleware
debugLog('SERVER', 'Setting up middleware');
app.use(cors({
  origin: SERVER_URLS.FRONTEND,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));
debugLog('SERVER', `CORS configured with origins: ${SERVER_URLS.FRONTEND.join(', ')}`);

app.use(helmet());
debugLog('SERVER', 'Helmet security enabled');

app.use(express.json());
debugLog('SERVER', 'JSON body parser enabled');

// Request logging middleware
app.use((req, res, next) => {
  debugLog('REQUEST', `${req.method} ${req.url}`);
  debugLog('REQUEST', 'Headers:', req.headers);
  if (req.body && Object.keys(req.body).length > 0) {
    const sanitizedBody = { ...req.body };
    if (sanitizedBody.password) sanitizedBody.password = '[REDACTED]';
    debugLog('REQUEST', 'Body:', sanitizedBody);
  }
  next();
});

app.use(rateLimit(rateLimiter));
debugLog('SERVER', 'Rate limiter enabled');

// Add a debugging route for CORS testing
app.options('*', cors());
app.get(SERVER_URLS.API.CORS_TEST, (req, res) => {
  debugLog('CORS', 'CORS test endpoint called');
  res.json({ 
    message: 'CORS is configured correctly',
    origin: req.headers.origin || 'No origin detected'
  });
});

// Routes
debugLog('SERVER', 'Setting up routes');
const authPath = SERVER_URLS.API.AUTH.replace(SERVER_URLS.API.PREFIX, '');
app.use(SERVER_URLS.API.AUTH, authRoutes);
debugLog('SERVER', `Auth routes registered at ${SERVER_URLS.API.AUTH}`);

const usersPath = SERVER_URLS.API.USERS.replace(SERVER_URLS.API.PREFIX, '');
app.use(SERVER_URLS.API.USERS, authenticateToken, userRoutes);
debugLog('SERVER', `User routes registered at ${SERVER_URLS.API.USERS} (protected)`);

// Health check route
app.get(SERVER_URLS.API.HEALTH, (req, res) => {
  debugLog('HEALTH', 'Health check endpoint called');
  res.json({ status: 'ok', message: 'API is running' });
});

// Error handling middleware
app.use(errorHandler);
debugLog('SERVER', 'Error handler middleware registered');

// Database connection
debugLog('SERVER', 'Connecting to MongoDB...');
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  debugLog('SERVER', 'Connected to MongoDB successfully');
})
.catch(err => {
  debugLog('SERVER', 'MongoDB connection error:', err);
  console.error('MongoDB connection error:', err);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  debugLog('SERVER', `Server running on port ${PORT}`);
  debugLog('SERVER', `API available at http://localhost:${PORT}${SERVER_URLS.API.PREFIX}`);
  console.log(`Server running on port ${PORT}`);
});