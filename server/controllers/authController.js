// controllers/authController.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Debug utility function
const debugLog = (section, message, data = null) => {
  console.log(`[DEBUG][${section}] ${message}`);
  if (data) {
    console.log(JSON.stringify(data, null, 2));
  }
};

export const register = async (req, res) => {
  debugLog('REGISTER', 'Register endpoint hit');
  debugLog('REGISTER', 'Request body:', req.body);
  
  try {
    const { name, email, password } = req.body;
    
    debugLog('REGISTER', `Processing registration for ${email}`);
    
    // Check if user exists
    let existingUser = await User.findOne({ email });
    debugLog('REGISTER', `Existing user check: ${existingUser ? 'User exists' : 'User does not exist'}`);
    
    if (existingUser) {
      debugLog('REGISTER', `Registration failed - User already exists: ${email}`);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Check if this is the first user (will be superadmin)
    const userCount = await User.countDocuments();
    const isFirstUser = userCount === 0;
    debugLog('REGISTER', `Is first user: ${isFirstUser}, User count: ${userCount}`);
    
    const user = new User({
      name,
      email,
      password,
      role: isFirstUser ? 'superadmin' : 'user'
    });

    debugLog('REGISTER', `Saving new user with role: ${user.role}`);
    await user.save();
    debugLog('REGISTER', `User saved successfully with ID: ${user._id}`);

    // Create token
    const payload = {
      user: {
        id: user._id,
        role: user.role
      }
    };
    debugLog('REGISTER', 'Creating JWT token with payload:', payload);

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) {
          debugLog('REGISTER', 'JWT token creation failed:', err);
          throw err;
        }
        
        debugLog('REGISTER', 'JWT token created successfully');
        const responseData = { 
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        };
        debugLog('REGISTER', 'Sending registration success response:', responseData);
        res.json(responseData);
      }
    );
  } catch (err) {
    debugLog('REGISTER', 'Registration error:', err);
    res.status(500).json({ 
      message: 'Server error during registration',
      error: err.message 
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    
    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Email and new password required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = newPassword; 
    await user.save();
    
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const login = async (req, res) => {
  debugLog('LOGIN', 'Login endpoint hit');
  debugLog('LOGIN', 'Request body:', { ...req.body, password: '[REDACTED]' });
  
  try {
    const { email, password } = req.body;
    
    // Input validation
    if (!email) {
      debugLog('LOGIN', 'Login failed - Email is missing');
      return res.status(400).json({ message: 'Email is required' });
    }
    
    if (!password) {
      debugLog('LOGIN', 'Login failed - Password is missing');
      return res.status(400).json({ message: 'Password is required' });
    }
    
    debugLog('LOGIN', `Attempting to find user with email: ${email}`);
    
    // Find the user
    const user = await User.findOne({ email });
    
    if (!user) {
      debugLog('LOGIN', `Login failed - User not found with email: ${email}`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    debugLog('LOGIN', `User found: ${user.email}, ID: ${user._id}, Role: ${user.role}`);
    debugLog('LOGIN', 'Comparing password');
    
    // Verify password
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      debugLog('LOGIN', `Login failed - Invalid password for user: ${email}`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    debugLog('LOGIN', `Password verified successfully for: ${email}`);
    
    // Update last login time
    user.lastLogin = new Date();
    await user.save();
    debugLog('LOGIN', `Updated last login time for: ${email}`);
    
    // Generate payload for token
    const payload = {
      user: {
        id: user._id,
        role: user.role
      }
    };
    
    debugLog('LOGIN', 'Creating JWT token with payload:', payload);
    
    // Create and send token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) {
          debugLog('LOGIN', 'JWT token creation failed:', err);
          throw err;
        }
        
        debugLog('LOGIN', 'JWT token created successfully');
        
        const responseData = {
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        };
        
        debugLog('LOGIN', 'Sending login success response');
        res.json(responseData);
      }
    );
  } catch (error) {
    debugLog('LOGIN', 'Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getProfile = async (req, res) => {
  debugLog('PROFILE', 'Profile endpoint hit');
  debugLog('PROFILE', `User from token: ${req.user.email}, ID: ${req.user._id}`);
  
  try {
    debugLog('PROFILE', `Fetching user profile for ID: ${req.user.id}`);
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      debugLog('PROFILE', `Profile fetch failed - User not found with ID: ${req.user.id}`);
      return res.status(404).json({ message: 'User not found' });
    }
    
    debugLog('PROFILE', 'Profile fetch successful, sending response');
    res.json(user);
  } catch (error) {
    debugLog('PROFILE', 'Profile fetch error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};