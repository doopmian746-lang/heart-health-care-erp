import { Router } from 'express';
import { donorController } from '../controllers/donor.controller.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { validate, createDonorSchema } from '../middleware/validate.js';

const router = Router();

router.get('/', authenticateToken, donorController.getAll);
router.post('/', authenticateToken, validate(createDonorSchema), donorController.create);
router.patch('/:id/verify', authenticateToken, requireRole('Admin', 'Receptionist'), donorController.verify);
router.get('/pending', authenticateToken, requireRole('Admin', 'Receptionist'), donorController.getPending);

export default router;
