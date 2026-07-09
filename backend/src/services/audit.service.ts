import { auditRepo } from '../repositories/audit.repo.js';
import { AuditLog, EntityType } from '../types/index.js';
import { generateAuditId } from '../utils/id-generator.js';

export function createAuditLog(user: string, action: string, entityType: EntityType, entityId: string, details: string): void {
  const log: AuditLog = {
    id: generateAuditId(),
    timestamp: new Date().toISOString(),
    user,
    action,
    entityType,
    entityId,
    details,
  };
  auditRepo.create(log);
}
