import { Router } from 'express';
import { consultationController } from '../controllers/consultation.controller.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { validate, createConsultationSchema } from '../middleware/validate.js';

const router = Router();

router.get('/', authenticateToken, consultationController.getAll);
router.get('/patient/:patientId', authenticateToken, consultationController.getByPatientId);
router.post('/patient/:id', authenticateToken, requireRole('Admin', 'Doctor'), validate(createConsultationSchema), consultationController.create);

export default router;
