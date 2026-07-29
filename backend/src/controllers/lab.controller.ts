import { Response } from 'express';
import { labRepo } from '../repositories/lab.repo.js';
import { patientRepo } from '../repositories/patient.repo.js';
import { LabTest, LabOrder, LabOrderItem } from '../types/index.js';
import { createAuditLog } from '../services/audit.service.js';
import { AuthRequest } from '../middleware/auth.js';
import { getDatabase } from '../config/database.js';

export const labController = {
  // Test catalog
  getAllTests(_req: AuthRequest, res: Response): void {
    res.json(labRepo.findAllTests());
  },

  createTest(req: AuthRequest, res: Response): void {
    const { testName, category, description, normalRange, unit, cost } = req.body;
    if (!testName) { res.status(400).json({ error: 'Test name is required' }); return; }
    const count = (getDatabase().prepare('SELECT COUNT(*) as c FROM lab_tests').get() as any).c;
    const test: LabTest = {
      id: `LT-${String(count + 1).padStart(3, '0')}`,
      testName, category: category || 'General', description: description || '',
      normalRange: normalRange || '', unit: unit || '', cost: Number(cost) || 0, isActive: true,
    };
    labRepo.createTest(test);
    createAuditLog(req.user?.name || 'Admin', 'Lab Test Created', 'LabTest', test.id, `Created test: ${testName}`);
    res.json(test);
  },

  updateTest(req: AuthRequest, res: Response): void {
    const { id } = req.params;
    labRepo.updateTest(id, req.body);
    res.json(labRepo.findTestById(id));
  },

  // Orders
  getAllOrders(_req: AuthRequest, res: Response): void {
    const orders = labRepo.findAllOrders();
    const enriched = orders.map(o => ({
      ...o,
      items: labRepo.getOrderItems(o.id),
    }));
    res.json(enriched);
  },

  getOrderById(req: AuthRequest, res: Response): void {
    const order = labRepo.findOrderById(req.params.id);
    if (!order) { res.status(404).json({ error: 'Order not found' }); return; }
    res.json(order);
  },

  getOrdersByPatient(req: AuthRequest, res: Response): void {
    const orders = labRepo.findByPatientId(req.params.patientId);
    res.json(orders);
  },

  createOrder(req: AuthRequest, res: Response): void {
    const { patientId, consultationId, doctorName, priority, notes, testIds } = req.body;
    if (!patientId || !testIds || testIds.length === 0) {
      res.status(400).json({ error: 'Patient and at least one test are required' });
      return;
    }
    const patient = patientRepo.findById(patientId);
    if (!patient) { res.status(404).json({ error: 'Patient not found' }); return; }

    const count = (getDatabase().prepare('SELECT COUNT(*) as c FROM lab_orders').get() as any).c;
    const order: LabOrder = {
      id: `LAB-${String(count + 1).padStart(4, '0')}`,
      patientId, patientName: patient.fullName,
      consultationId: consultationId || '',
      doctorName: doctorName || '',
      status: 'Pending', priority: priority || 'Routine',
      orderDate: new Date().toISOString(),
      notes: notes || '',
    };
    labRepo.createOrder(order);

    for (const testId of testIds) {
      const test = labRepo.findTestById(testId);
      if (test) {
        labRepo.createOrderItem({
          orderId: order.id, testId: test.id, testName: test.testName,
          result: '', resultValue: '', unit: test.unit, normalRange: test.normalRange,
          status: 'Pending', completedDate: null, technician: '',
        });
      }
    }

    createAuditLog(req.user?.name || 'Doctor', 'Lab Order Created', 'LabOrder', order.id, `Lab order for ${patient.fullName}: ${testIds.length} tests`);
    res.json({ ...order, items: labRepo.getOrderItems(order.id) });
  },

  updateOrderStatus(req: AuthRequest, res: Response): void {
    const { status } = req.body;
    if (!['Pending', 'In Progress', 'Completed', 'Cancelled'].includes(status)) {
      res.status(400).json({ error: 'Invalid status' }); return;
    }
    labRepo.updateOrderStatus(req.params.id, status);
    const order = labRepo.findOrderById(req.params.id);
    createAuditLog(req.user?.name || 'Lab Staff', `Lab Order ${status}`, 'LabOrder', req.params.id, `Order ${req.params.id} status changed to ${status}`);
    res.json(order);
  },

  // Results
  updateResult(req: AuthRequest, res: Response): void {
    const { itemId } = req.params;
    const { result, resultValue, status, technician } = req.body;
    labRepo.updateOrderItem(Number(itemId), {
      result: result || '',
      resultValue: resultValue || '',
      status: status || 'Completed',
      completedDate: new Date().toISOString(),
      technician: technician || req.user?.name || 'Lab Tech',
    });

    const db = getDatabase();
    const item = db.prepare('SELECT * FROM lab_order_items WHERE id = ?').get(Number(itemId)) as any;
    if (item) {
      const allItems = db.prepare('SELECT status FROM lab_order_items WHERE order_id = ?').all(item.order_id) as any[];
      const allDone = allItems.every(i => i.status !== 'Pending');
      if (allDone) {
        labRepo.updateOrderStatus(item.order_id, 'Completed');
      }
    }

    createAuditLog(req.user?.name || 'Lab Staff', 'Lab Result Entered', 'LabOrder', itemId, `Test result entered for item ${itemId}`);
    res.json({ success: true });
  },

  // Stats
  getStats(_req: AuthRequest, res: Response): void {
    res.json(labRepo.getStats());
  },
};
