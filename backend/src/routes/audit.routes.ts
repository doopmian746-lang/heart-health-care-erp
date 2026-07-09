import { Router } from 'express';
import { auditRepo } from '../repositories/audit.repo.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticateToken, requireRole('Admin'), (_req, res) => {
  res.json(auditRepo.findAll());
});

export default router;
