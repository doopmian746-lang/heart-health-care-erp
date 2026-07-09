import { getDatabase } from '../config/database.js';
import { FileRequest } from '../types/index.js';

const rowToFileRequest = (row: any): FileRequest => ({
  id: row.id,
  patientId: row.patient_id,
  patientName: row.patient_name,
  requestedBy: row.requested_by,
  purpose: row.purpose,
  urgency: row.urgency,
  status: row.status,
  requestDate: row.request_date,
  remarks: row.remarks,
  fulfilledBy: row.fulfilled_by,
  fulfillmentDate: row.fulfillment_date,
});

export const fileRequestRepo = {
  findAll(): FileRequest[] {
    const db = getDatabase();
    return db.prepare('SELECT * FROM file_requests ORDER BY request_date DESC').all().map(rowToFileRequest);
  },

  findById(id: string): FileRequest | undefined {
    const db = getDatabase();
    const row = db.prepare('SELECT * FROM file_requests WHERE id = ?').get(id) as any;
    return row ? rowToFileRequest(row) : undefined;
  },

  create(req: FileRequest): void {
    const db = getDatabase();
    db.prepare(`
      INSERT INTO file_requests (id, patient_id, patient_name, requested_by, purpose, urgency, status, request_date, remarks, fulfilled_by, fulfillment_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(req.id, req.patientId, req.patientName, req.requestedBy, req.purpose, req.urgency, req.status, req.requestDate, req.remarks, req.fulfilledBy, req.fulfillmentDate);
  },

  update(id: string, data: Partial<FileRequest>): void {
    const db = getDatabase();
    const updates: string[] = [];
    const params: any[] = [];
    if (data.status !== undefined) { updates.push('status = ?'); params.push(data.status); }
    if (data.remarks !== undefined) { updates.push('remarks = ?'); params.push(data.remarks); }
    if (data.fulfilledBy !== undefined) { updates.push('fulfilled_by = ?'); params.push(data.fulfilledBy); }
    if (data.fulfillmentDate !== undefined) { updates.push('fulfillment_date = ?'); params.push(data.fulfillmentDate); }
    if (updates.length === 0) return;
    params.push(id);
    db.prepare(`UPDATE file_requests SET ${updates.join(', ')} WHERE id = ?`).run(...params);
  },
};
