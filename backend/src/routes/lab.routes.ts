import { Router } from 'express';
import { labController } from '../controllers/lab.controller.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

// Test catalog
router.get('/tests', authenticateToken, labController.getAllTests);
router.post('/tests', authenticateToken, requireRole('Admin', 'Lab Staff'), labController.createTest);
router.patch('/tests/:id', authenticateToken, requireRole('Admin', 'Lab Staff'), labController.updateTest);

// Orders
router.get('/orders', authenticateToken, labController.getAllOrders);
router.get('/orders/:id', authenticateToken, labController.getOrderById);
router.get('/orders/patient/:patientId', authenticateToken, labController.getOrdersByPatient);
router.post('/orders', authenticateToken, requireRole('Admin', 'Doctor', 'Lab Staff'), labController.createOrder);
router.patch('/orders/:id/status', authenticateToken, requireRole('Admin', 'Doctor', 'Lab Staff'), labController.updateOrderStatus);

// Results
router.patch('/results/:itemId', authenticateToken, requireRole('Admin', 'Lab Staff'), labController.updateResult);

// Stats
router.get('/stats', authenticateToken, labController.getStats);

export default router;
