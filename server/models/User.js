// models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Debug utility function
const debugLog = (section, message, data = null) => {
  console.log(`[DEBUG][${section}] ${message}`);
  if (data) {
    console.log(JSON.stringify(data, null, 2));
  }
};

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 3 // changed from 8
  },
  role: {
    type: String,
    enum: ['user', 'manager', 'admin', 'superadmin'],
    default: 'user'
  },
  lastLogin: {
    type: Date,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ensure password is hashed before saving
UserSchema.pre('save', async function(next) {
  debugLog('USER_MODEL', `Pre-save hook triggered for user: ${this.email}`);
  
  if (!this.isModified('password')) {
    debugLog('USER_MODEL', 'Password not modified, skipping hash');
    return next();
  }
  
  try {
    debugLog('USER_MODEL', 'Hashing password');
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    debugLog('USER_MODEL', 'Password hashed successfully');
    next();
  } catch (error) {
    debugLog('USER_MODEL', 'Password hashing error:', error);
    next(error);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword) {
  debugLog('USER_MODEL', `Comparing password for user: ${this.email}`);
  
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    debugLog('USER_MODEL', `Password comparison result: ${isMatch ? 'Match' : 'No match'}`);
    return isMatch;
  } catch (error) {
    debugLog('USER_MODEL', 'Password comparison error:', error);
    throw error;
  }
};

// Method to check if user can modify target user
UserSchema.methods.canModify = function(targetUserRole) {
  const roleHierarchy = {
    'superadmin': 4,
    'admin': 3,
    'manager': 2,
    'user': 1
  };

  return roleHierarchy[this.role] > roleHierarchy[targetUserRole];
};

// Static method to find active users by role
UserSchema.statics.findByRole = function(role) {
  return this.find({ role, isActive: true });
};

export default mongoose.model('User', UserSchema);