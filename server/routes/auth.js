// routes/auth.js
import express from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import { authenticateToken, validateRegistration } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', validateRegistration, register);
router.post('/login', login);
router.get('/profile', authenticateToken, getProfile);

export default router;