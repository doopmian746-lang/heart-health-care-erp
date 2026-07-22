import { Router } from 'express';
import { reportsController } from '../controllers/reports.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticateToken, reportsController.getReport);
router.get('/daily', authenticateToken, reportsController.getDailyReport);
router.get('/weekly', authenticateToken, reportsController.getWeeklyReport);
router.get('/monthly', authenticateToken, reportsController.getMonthlyReport);
router.get('/yearly', authenticateToken, reportsController.getYearlyReport);
router.get('/custom', authenticateToken, reportsController.getCustomReport);

export default router;