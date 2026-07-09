import { Router } from 'express';
import { donorController } from '../controllers/donor.controller.js';
import { authenticateToken } from '../middleware/auth.js';
import { validate, createDonorSchema } from '../middleware/validate.js';

const router = Router();

router.get('/', authenticateToken, donorController.getAll);
router.post('/', authenticateToken, validate(createDonorSchema), donorController.create);

export default router;
