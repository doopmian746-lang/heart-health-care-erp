import { getDatabase } from '../config/database.js';
import { LabTest, LabOrder, LabOrderItem } from '../types/index.js';

const rowToLabTest = (row: any): LabTest => ({
  id: row.id,
  testName: row.test_name,
  category: row.category,
  description: row.description,
  normalRange: row.normal_range,
  unit: row.unit,
  cost: row.cost,
  isActive: !!row.is_active,
});

const rowToLabOrder = (row: any): LabOrder => ({
  id: row.id,
  patientId: row.patient_id,
  patientName: row.patient_name,
  consultationId: row.consultation_id || '',
  doctorName: row.doctor_name,
  status: row.status,
  priority: row.priority,
  orderDate: row.order_date,
  notes: row.notes || '',
});

const rowToLabOrderItem = (row: any): LabOrderItem => ({
  id: row.id,
  orderId: row.order_id,
  testId: row.test_id,
  testName: row.test_name,
  result: row.result || '',
  resultValue: row.result_value || '',
  unit: row.unit || '',
  normalRange: row.normal_range || '',
  status: row.status,
  completedDate: row.completed_date,
  technician: row.technician || '',
});

export const labRepo = {
  // Tests catalog
  findAllTests(): LabTest[] {
    const db = getDatabase();
    return db.prepare('SELECT * FROM lab_tests WHERE is_active = 1 ORDER BY category, test_name').all().map(rowToLabTest);
  },

  findTestById(id: string): LabTest | undefined {
    const db = getDatabase();
    const row = db.prepare('SELECT * FROM lab_tests WHERE id = ?').get(id) as any;
    return row ? rowToLabTest(row) : undefined;
  },

  createTest(test: LabTest): void {
    const db = getDatabase();
    db.prepare('INSERT INTO lab_tests (id, test_name, category, description, normal_range, unit, cost, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .run(test.id, test.testName, test.category, test.description, test.normalRange, test.unit, test.cost, test.isActive ? 1 : 0);
  },

  updateTest(id: string, data: Partial<LabTest>): void {
    const db = getDatabase();
    const updates: string[] = [];
    const params: any[] = [];
    if (data.testName !== undefined) { updates.push('test_name = ?'); params.push(data.testName); }
    if (data.category !== undefined) { updates.push('category = ?'); params.push(data.category); }
    if (data.description !== undefined) { updates.push('description = ?'); params.push(data.description); }
    if (data.normalRange !== undefined) { updates.push('normal_range = ?'); params.push(data.normalRange); }
    if (data.unit !== undefined) { updates.push('unit = ?'); params.push(data.unit); }
    if (data.cost !== undefined) { updates.push('cost = ?'); params.push(data.cost); }
    if (data.isActive !== undefined) { updates.push('is_active = ?'); params.push(data.isActive ? 1 : 0); }
    if (updates.length === 0) return;
    params.push(id);
    db.prepare(`UPDATE lab_tests SET ${updates.join(', ')} WHERE id = ?`).run(...params);
  },

  // Orders
  findAllOrders(): LabOrder[] {
    const db = getDatabase();
    return db.prepare('SELECT * FROM lab_orders ORDER BY order_date DESC').all().map(rowToLabOrder);
  },

  findOrderById(id: string): LabOrder | undefined {
    const db = getDatabase();
    const row = db.prepare('SELECT * FROM lab_orders WHERE id = ?').get(id) as any;
    if (!row) return undefined;
    const order = rowToLabOrder(row);
    order.items = db.prepare('SELECT * FROM lab_order_items WHERE order_id = ?').all(id).map(rowToLabOrderItem);
    return order;
  },

  findByPatientId(patientId: string): LabOrder[] {
    const db = getDatabase();
    return db.prepare('SELECT * FROM lab_orders WHERE patient_id = ? ORDER BY order_date DESC').all(patientId).map(rowToLabOrder);
  },

  createOrder(order: LabOrder): void {
    const db = getDatabase();
    db.prepare(`INSERT INTO lab_orders (id, patient_id, patient_name, consultation_id, doctor_name, status, priority, order_date, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(order.id, order.patientId, order.patientName, order.consultationId, order.doctorName, order.status, order.priority, order.orderDate, order.notes);
  },

  updateOrderStatus(id: string, status: string): void {
    const db = getDatabase();
    db.prepare('UPDATE lab_orders SET status = ? WHERE id = ?').run(status, id);
  },

  // Order Items
  createOrderItem(item: Omit<LabOrderItem, 'id'>): void {
    const db = getDatabase();
    db.prepare(`INSERT INTO lab_order_items (order_id, test_id, test_name, result, result_value, unit, normal_range, status, completed_date, technician)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(item.orderId, item.testId, item.testName, item.result, item.resultValue, item.unit, item.normalRange, item.status, item.completedDate, item.technician);
  },

  updateOrderItem(id: number, data: Partial<LabOrderItem>): void {
    const db = getDatabase();
    const updates: string[] = [];
    const params: any[] = [];
    if (data.result !== undefined) { updates.push('result = ?'); params.push(data.result); }
    if (data.resultValue !== undefined) { updates.push('result_value = ?'); params.push(data.resultValue); }
    if (data.status !== undefined) { updates.push('status = ?'); params.push(data.status); }
    if (data.completedDate !== undefined) { updates.push('completed_date = ?'); params.push(data.completedDate); }
    if (data.technician !== undefined) { updates.push('technician = ?'); params.push(data.technician); }
    if (updates.length === 0) return;
    params.push(id);
    db.prepare(`UPDATE lab_order_items SET ${updates.join(', ')} WHERE id = ?`).run(...params);
  },

  getOrderItems(orderId: string): LabOrderItem[] {
    const db = getDatabase();
    return db.prepare('SELECT * FROM lab_order_items WHERE order_id = ?').all(orderId).map(rowToLabOrderItem);
  },

  // Stats
  getStats(): { pending: number; inProgress: number; completed: number; todayOrders: number; totalTests: number } {
    const db = getDatabase();
    const pending = (db.prepare("SELECT COUNT(*) as c FROM lab_orders WHERE status = 'Pending'").get() as any).c;
    const inProgress = (db.prepare("SELECT COUNT(*) as c FROM lab_orders WHERE status = 'In Progress'").get() as any).c;
    const completed = (db.prepare("SELECT COUNT(*) as c FROM lab_orders WHERE status = 'Completed'").get() as any).c;
    const today = new Date().toISOString().split('T')[0];
    const todayOrders = (db.prepare("SELECT COUNT(*) as c FROM lab_orders WHERE order_date LIKE ?").get(`${today}%`) as any).c;
    const totalTests = (db.prepare('SELECT COUNT(*) as c FROM lab_tests WHERE is_active = 1').get() as any).c;
    return { pending, inProgress, completed, todayOrders, totalTests };
  },
};
