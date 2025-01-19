// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
    // Log error for debugging
    console.error(err.stack);
  
    // Mongoose validation error
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation Error',
        details: Object.values(err.errors).map(error => error.message)
      });
    }
  
    // Mongoose duplicate key error
    if (err.code === 11000) {
      return res.status(400).json({
        message: 'Duplicate Error',
        details: `${Object.keys(err.keyValue)} already exists`
      });
    }
  
    // JWT authentication error
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        message: 'Invalid token',
        details: 'Authentication failed'
      });
    }
  
    // JWT expired error
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Token expired',
        details: 'Please log in again'
      });
    }
  
    // Default error
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
  
    // Development error response (includes stack trace)
    if (process.env.NODE_ENV === 'development') {
      return res.status(statusCode).json({
        message,
        stack: err.stack,
        details: err.details || null
      });
    }
  
    // Production error response (no sensitive info)
    return res.status(statusCode).json({
      message,
      details: err.details || null
    });
  };
  
  // Custom error class for API errors
  export class APIError extends Error {
    constructor(message, statusCode = 500, details = null) {
      super(message);
      this.statusCode = statusCode;
      this.details = details;
      this.name = 'APIError';
    }
  }
  
  export default errorHandler;