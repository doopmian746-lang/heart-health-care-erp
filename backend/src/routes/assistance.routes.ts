import { Router } from 'express';
import { assistanceController } from '../controllers/assistance.controller.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { validate, createAssistanceSchema } from '../middleware/validate.js';

const router = Router();

router.get('/', authenticateToken, assistanceController.getAll);
router.post('/', authenticateToken, validate(createAssistanceSchema), assistanceController.create);
router.patch('/:id', authenticateToken, requireRole('Admin', 'Doctor'), assistanceController.update);

export default router;
