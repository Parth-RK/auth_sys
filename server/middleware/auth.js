import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Debug utility function
const debugLog = (section, message, data = null) => {
  console.log(`[DEBUG][${section}] ${message}`);
  if (data) {
    console.log(JSON.stringify(data, null, 2));
  }
};

// Verify JWT token middleware
export const authenticateToken = async (req, res, next) => {
  debugLog('AUTH', 'Authenticating token');
  debugLog('AUTH', `Request path: ${req.path}`);
  
  try {
    // Get token from Authorization header
    const authHeader = req.headers['authorization'];
    debugLog('AUTH', `Authorization header: ${authHeader ? 'Present' : 'Missing'}`);
    
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      debugLog('AUTH', 'Authentication failed - No token provided');
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    
    debugLog('AUTH', 'Token found, verifying...');
    
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      debugLog('AUTH', 'Token decoded successfully:', decoded);
      
      // Extract user ID from token
      let userId;
      if (decoded.user && decoded.user.id) {
        userId = decoded.user.id;
      } else if (decoded.userId) {
        userId = decoded.userId;
      } else {
        debugLog('AUTH', 'Invalid token structure - Cannot find user ID', decoded);
        return res.status(401).json({ message: 'Invalid token format' });
      }
      
      debugLog('AUTH', `Looking up user with ID: ${userId}`);
      
      // Find user by ID
      const user = await User.findById(userId).select('-password');
      
      if (!user) {
        debugLog('AUTH', `Authentication failed - User not found with ID: ${userId}`);
        return res.status(401).json({ message: 'Invalid token - user not found' });
      }
      
      debugLog('AUTH', `User found: ${user.email}, Role: ${user.role}`);
      
      // Check if user is active
      if (user.isActive === false) {
        debugLog('AUTH', `Authentication failed - User account is deactivated: ${user.email}`);
        return res.status(403).json({ message: 'Account is deactivated' });
      }
      
      // Add user to request object
      req.user = user;
      debugLog('AUTH', 'Authentication successful - proceeding to next middleware');
      next();
      
    } catch (error) {
      // Handle JWT specific errors
      if (error.name === 'TokenExpiredError') {
        debugLog('AUTH', 'Authentication failed - Token expired');
        return res.status(401).json({ message: 'Token expired', expired: true });
      } 
      if (error.name === 'JsonWebTokenError') {
        debugLog('AUTH', 'Authentication failed - Invalid token format', error);
        return res.status(401).json({ message: 'Invalid token', invalid: true });
      }
      
      // Other JWT errors
      debugLog('AUTH', 'Token verification error:', error);
      throw error;
    }
  } catch (error) {
    debugLog('AUTH', 'Authentication middleware error:', error);
    next(error);
  }
};

// Authorize by role - Use the same role hierarchy from the User model
export const authorize = (...roles) => {
  return (req, res, next) => {
    debugLog('AUTHORIZE', `Authorizing access for role: ${req.user?.role}`);
    debugLog('AUTHORIZE', `Required roles: ${roles.length ? roles.join(', ') : 'any'}`);
    
    if (!req.user) {
      debugLog('AUTHORIZE', 'Authorization failed - User not authenticated');
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    // If no roles specified, allow all authenticated users
    if (roles.length === 0) {
      debugLog('AUTHORIZE', 'No specific roles required - authorization successful');
      return next();
    }
    
    // Use the same role hierarchy as defined in the User model
    const roleHierarchy = {
      'superadmin': 4,
      'admin': 3,
      'manager': 2,
      'user': 1
    };
    
    // Get the user's role value
    const userRoleValue = roleHierarchy[req.user.role.toLowerCase()] || 0;
    
    // Get the minimum required role value
    const requiredRoles = roles.map(role => role.toLowerCase());
    const minRequiredRoleValue = Math.min(...requiredRoles.map(role => roleHierarchy[role] || 999));
    
    debugLog('AUTHORIZE', `User role value: ${userRoleValue}, Required min role value: ${minRequiredRoleValue}`);
    
    // Check if user's role has sufficient permissions (higher or equal value)
    if (userRoleValue >= minRequiredRoleValue) {
      debugLog('AUTHORIZE', 'Authorization successful - User has sufficient permissions');
      return next();
    }
    
    // If we get here, user doesn't have sufficient permissions
    debugLog('AUTHORIZE', `Authorization failed - User role (${req.user.role}) insufficient`);
    return res.status(403).json({ 
      message: 'Access denied. Insufficient permissions.' 
    });
  };
};

// Update checkRole middleware to also use hierarchy for consistency
export const checkRole = (roles) => {
  return (req, res, next) => {
    debugLog('CHECKROLE', `Checking role access for user role: ${req.user?.role}`);
    debugLog('CHECKROLE', `Required roles: ${roles.join(', ')}`);
    
    // Use the same role hierarchy
    const roleHierarchy = {
      'superadmin': 4,
      'admin': 3,
      'manager': 2,
      'user': 1
    };
    
    const userRoleValue = roleHierarchy[req.user.role.toLowerCase()] || 0;
    const minRequiredRoleValue = Math.min(...roles.map(role => roleHierarchy[role.toLowerCase()] || 999));
    
    if (userRoleValue >= minRequiredRoleValue) {
      debugLog('CHECKROLE', 'Role check passed - User has sufficient permissions');
      return next();
    }
    
    debugLog('CHECKROLE', `Role check failed - User role (${req.user.role}) insufficient`);
    return res.status(403).json({ 
      message: 'You do not have permission to perform this action' 
    });
  };
};

// Rate limiting middleware
export const rateLimiter = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
};

// Input validation middleware - keeping robust validation here as the source of truth
export const validateRegistration = (req, res, next) => {
  const { email, password, name } = req.body;
  
  debugLog('VALIDATION', 'Validating registration data');
  
  // Check required fields
  if (!email || !password || !name) {
    debugLog('VALIDATION', 'Missing required field(s)');
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    debugLog('VALIDATION', `Invalid email format: ${email}`);
    return res.status(400).json({ message: 'Invalid email format' });
  }
  
  // Special case for 'admin' password
  if (password === 'admin') {
    debugLog('VALIDATION', 'Admin password exception applied');
    return next();
  }
  
  // Password strength validation
  let passwordErrors = [];
  
  if (password.length < 8) {
    passwordErrors.push('be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    passwordErrors.push('include at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    passwordErrors.push('include at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    passwordErrors.push('include at least one number');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    passwordErrors.push('include at least one special character');
  }
  
  // If password has any errors, return detailed message
  if (passwordErrors.length > 0) {
    const errorMessage = `Password must ${passwordErrors.join(', ')}`;
    debugLog('VALIDATION', `Password validation failed: ${errorMessage}`);
    
    return res.status(400).json({ 
      message: errorMessage,
      passwordErrors: passwordErrors,
      validationFailed: true
    });
  }

  debugLog('VALIDATION', 'Registration data validated successfully');
  next();
};