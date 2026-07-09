import { getDatabase } from '../config/database.js';
import { AuditLog } from '../types/index.js';

const rowToAuditLog = (row: any): AuditLog => ({
  id: row.id,
  timestamp: row.timestamp,
  user: row.user_name,
  action: row.action,
  entityType: row.entity_type,
  entityId: row.entity_id,
  details: row.details,
});

export const auditRepo = {
  findAll(limit = 100): AuditLog[] {
    const db = getDatabase();
    return db.prepare('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT ?').all(limit).map(rowToAuditLog);
  },

  create(log: AuditLog): void {
    const db = getDatabase();
    db.prepare(`
      INSERT INTO audit_logs (id, timestamp, user_name, action, entity_type, entity_id, details)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(log.id, log.timestamp, log.user, log.action, log.entityType, log.entityId, log.details);
  },
};
