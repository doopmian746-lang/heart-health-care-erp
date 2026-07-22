import { Router } from 'express';
import { prescriptionController } from '../controllers/prescription.controller.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { validate, createPrescriptionSchema } from '../middleware/validate.js';

const router = Router();

router.get('/', authenticateToken, prescriptionController.getAll);
router.post('/patient/:id', authenticateToken, requireRole('Admin', 'Doctor'), validate(createPrescriptionSchema), prescriptionController.create);
router.patch('/:id', authenticateToken, requireRole('Admin', 'Pharmacy Staff'), prescriptionController.updateStatus);

export default router;
