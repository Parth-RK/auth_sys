import express from 'express';
import { authenticateToken, authorize } from '../middleware/auth.js';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

const router = express.Router();

// Debug utility function
const debugLog = (section, message, data = null) => {
  console.log(`[DEBUG][${section}] ${message}`);
  if (data) {
    console.log(JSON.stringify(data, null, 2));
  }
};

// Log all routes for debugging
router.use((req, res, next) => {
  debugLog('USERS_ROUTE', `${req.method} ${req.originalUrl}`);
  next();
});

// Get all users - accessible to admin and superadmin
// Fixed: Pass roles as separate arguments instead of an array
router.get('/', authenticateToken, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Get single user
router.get('/:id', authenticateToken, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id, '-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
});

// Update user - restricted to admins and superadmins
// Fixed: Pass roles as separate arguments
router.put('/:id', authenticateToken, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const { name, email, role, password } = req.body;
    const userId = req.params.id;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent role escalation
    if (role && req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Only superadmin can modify roles' });
    }

    // Prevent superadmin modification by non-superadmin
    if (user.role === 'superadmin' && req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Cannot modify superadmin user' });
    }

    // Update user data
    const updateData = { name, email, role };

    // Only hash and update password if it's provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, select: '-password' }
    );

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
});

// Delete user - restricted to admins and superadmins
// Fixed: Pass roles as separate arguments
router.delete('/:id', authenticateToken, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const userId = req.params.id;
    const userToDelete = await User.findById(userId);

    if (!userToDelete) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent superadmin deletion by non-superadmin
    if (userToDelete.role === 'superadmin' && req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Cannot delete superadmin user' });
    }

    // Prevent self-deletion for superadmin
    if (userToDelete.role === 'superadmin' && userId === req.user._id.toString()) {
      return res.status(403).json({ message: 'Superadmin cannot delete their own account' });
    }

    await User.findByIdAndDelete(userId);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
});

// Search users
router.get('/search', authenticateToken, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const { query } = req.query;
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    }, '-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error searching users', error: error.message });
  }
});

export default router;