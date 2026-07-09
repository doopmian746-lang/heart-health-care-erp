import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { validate, loginSchema, createUserSchema } from '../middleware/validate.js';

const router = Router();

router.post('/login', validate(loginSchema), authController.login);
router.get('/users', authenticateToken, requireRole('Admin'), authController.getUsers);
router.post('/users', authenticateToken, requireRole('Admin'), validate(createUserSchema), authController.createUser);
router.get('/me', authenticateToken, authController.getProfile);

export default router;
