// models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

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
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
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