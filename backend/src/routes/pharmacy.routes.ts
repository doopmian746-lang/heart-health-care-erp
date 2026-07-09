import { Router } from 'express';
import { pharmacyController } from '../controllers/pharmacy.controller.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { validate, createInventorySchema } from '../middleware/validate.js';

const router = Router();

router.get('/', authenticateToken, pharmacyController.getAll);
router.post('/', authenticateToken, requireRole('Admin', 'Pharmacy Staff'), validate(createInventorySchema), pharmacyController.create);
router.post('/update', authenticateToken, requireRole('Admin', 'Pharmacy Staff'), pharmacyController.update);
router.post('/prescriptions/:prescriptionId/dispense', authenticateToken, requireRole('Admin', 'Pharmacy Staff'), pharmacyController.dispense);

export default router;
