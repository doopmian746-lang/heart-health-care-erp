import { getDatabase } from '../config/database.js';
import { FoundationAssistance } from '../types/index.js';

const rowToAssistance = (row: any): FoundationAssistance => ({
  id: row.id,
  patientId: row.patient_id,
  patientName: row.patient_name,
  type: row.type,
  estimatedCost: row.estimated_cost,
  patientContribution: row.patient_contribution,
  foundationContribution: row.foundation_contribution,
  status: row.status,
  justification: row.justification,
  remarks: row.remarks,
  requestedBy: row.requested_by,
  requestDate: row.request_date,
  approvedBy: row.approved_by,
  approvalDate: row.approval_date,
});

export const assistanceRepo = {
  findAll(): FoundationAssistance[] {
    const db = getDatabase();
    return db.prepare('SELECT * FROM assistance_requests ORDER BY request_date DESC').all().map(rowToAssistance);
  },

  findById(id: string): FoundationAssistance | undefined {
    const db = getDatabase();
    const row = db.prepare('SELECT * FROM assistance_requests WHERE id = ?').get(id) as any;
    return row ? rowToAssistance(row) : undefined;
  },

  findByPatientId(patientId: string): FoundationAssistance[] {
    const db = getDatabase();
    return db.prepare('SELECT * FROM assistance_requests WHERE patient_id = ? ORDER BY request_date DESC').all(patientId).map(rowToAssistance);
  },

  create(req: FoundationAssistance): void {
    const db = getDatabase();
    db.prepare(`
      INSERT INTO assistance_requests (id, patient_id, patient_name, type, estimated_cost, patient_contribution, foundation_contribution, status, justification, remarks, requested_by, request_date, approved_by, approval_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(req.id, req.patientId, req.patientName, req.type, req.estimatedCost, req.patientContribution, req.foundationContribution, req.status, req.justification, req.remarks, req.requestedBy, req.requestDate, req.approvedBy, req.approvalDate);
  },

  update(id: string, data: Partial<FoundationAssistance>): void {
    const db = getDatabase();
    const updates: string[] = [];
    const params: any[] = [];
    if (data.status !== undefined) { updates.push('status = ?'); params.push(data.status); }
    if (data.remarks !== undefined) { updates.push('remarks = ?'); params.push(data.remarks); }
    if (data.patientContribution !== undefined) { updates.push('patient_contribution = ?'); params.push(data.patientContribution); }
    if (data.foundationContribution !== undefined) { updates.push('foundation_contribution = ?'); params.push(data.foundationContribution); }
    if (data.approvedBy !== undefined) { updates.push('approved_by = ?'); params.push(data.approvedBy); }
    if (data.approvalDate !== undefined) { updates.push('approval_date = ?'); params.push(data.approvalDate); }
    if (updates.length === 0) return;
    params.push(id);
    db.prepare(`UPDATE assistance_requests SET ${updates.join(', ')} WHERE id = ?`).run(...params);
  },

  getPendingCount(): number {
    const db = getDatabase();
    const row = db.prepare("SELECT COUNT(*) as count FROM assistance_requests WHERE status = 'Pending'").get() as any;
    return row.count;
  },

  getApprovedSum(): number {
    const db = getDatabase();
    const row = db.prepare("SELECT COALESCE(SUM(foundation_contribution), 0) as total FROM assistance_requests WHERE status = 'Approved'").get() as any;
    return row.total;
  },
};
