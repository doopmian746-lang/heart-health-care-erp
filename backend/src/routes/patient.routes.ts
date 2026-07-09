import { Router } from 'express';
import { patientController } from '../controllers/patient.controller.js';
import { authenticateToken } from '../middleware/auth.js';
import { validate, createPatientSchema, updatePatientSchema } from '../middleware/validate.js';

const router = Router();

router.get('/', authenticateToken, patientController.getAll);
router.get('/:id', authenticateToken, patientController.getById);
router.post('/', authenticateToken, validate(createPatientSchema), patientController.create);
router.patch('/:id', authenticateToken, validate(updatePatientSchema), patientController.update);
router.delete('/:id', authenticateToken, patientController.delete);

export default router;
