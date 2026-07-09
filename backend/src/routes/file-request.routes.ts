import { Router } from 'express';
import { fileRequestController } from '../controllers/file-request.controller.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { validate, createFileRequestSchema } from '../middleware/validate.js';

const router = Router();

router.get('/', authenticateToken, fileRequestController.getAll);
router.post('/', authenticateToken, validate(createFileRequestSchema), fileRequestController.create);
router.post('/:id/action', authenticateToken, requireRole('Admin', 'Doctor'), fileRequestController.action);

export default router;
