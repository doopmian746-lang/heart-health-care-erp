import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.js';
import { auditRepo } from '../repositories/audit.repo.js';
import { AuditLog, EntityType } from '../types/index.js';
import { generateAuditId } from '../utils/id-generator.js';

export function logAudit(action: string, entityType: EntityType, getDetails: (req: AuthRequest) => { entityId: string; details: string }) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    const originalJson = res.json.bind(res);
    res.json = function (body: any) {
      const { entityId, details } = getDetails(req);
      const log: AuditLog = {
        id: generateAuditId(),
        timestamp: new Date().toISOString(),
        user: req.user?.name || 'System',
        action,
        entityType,
        entityId,
        details,
      };
      auditRepo.create(log);
      return originalJson(body);
    };
    next();
  };
}
