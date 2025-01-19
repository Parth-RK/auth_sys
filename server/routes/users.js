// routes/users.js
import express from 'express';
import { getAllUsers, updateUser, deleteUser } from '../controllers/userController.js';
import { authenticateToken, authorize } from '../middleware/auth.js';

const router = express.Router();

// Protected routes - require authentication and specific roles
router.get('/', authenticateToken, authorize('admin', 'superadmin'), getAllUsers);

router.put('/:id', 
  authenticateToken, 
  authorize('admin', 'superadmin'), 
  updateUser
);

router.delete('/:id',
  authenticateToken,
  authorize('admin', 'superadmin'),
  deleteUser
);

export default router;