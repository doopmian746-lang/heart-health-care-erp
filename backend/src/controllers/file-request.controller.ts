import { Response } from 'express';
import { fileRequestRepo } from '../repositories/file-request.repo.js';
import { patientRepo } from '../repositories/patient.repo.js';
import { FileRequest } from '../types/index.js';
import { generateFileRequestId } from '../utils/id-generator.js';
import { createAuditLog } from '../services/audit.service.js';
import { AuthRequest } from '../middleware/auth.js';
import { getDatabase } from '../config/database.js';

export const fileRequestController = {
  getAll(_req: AuthRequest, res: Response): void {
    res.json(fileRequestRepo.findAll());
  },

  create(req: AuthRequest, res: Response): void {
    const { patientId, purpose, urgency } = req.body;
    const patient = patientRepo.findById(patientId);
    if (!patient) {
      res.status(404).json({ error: 'Patient not found' });
      return;
    }

    const count = (getDatabase().prepare('SELECT COUNT(*) as count FROM file_requests').get() as any).count;
    const newRequest: FileRequest = {
      id: generateFileRequestId(count + 1),
      patientId: patient.id,
      patientName: patient.fullName,
      requestedBy: req.user?.name || 'Staff',
      purpose: purpose || '',
      urgency: urgency || 'Medium',
      status: 'Pending',
      requestDate: new Date().toISOString(),
    };

    fileRequestRepo.create(newRequest);
    createAuditLog(req.user?.name || 'Staff', 'File Request Submitted', 'FileRequest', newRequest.id, `File request for ${patient.fullName}: ${purpose}`);
    res.json(newRequest);
  },

  action(req: AuthRequest, res: Response): void {
    const { action, remarks } = req.body;
    const request = fileRequestRepo.findById(req.params.id);
    if (!request) {
      res.status(404).json({ error: 'File request not found' });
      return;
    }

    const newStatus = action === 'Fulfilled' ? 'Fulfilled' : 'Rejected';
    fileRequestRepo.update(req.params.id, {
      status: newStatus,
      remarks: remarks || '',
      fulfilledBy: req.user?.name || 'Admin',
      fulfillmentDate: new Date().toISOString(),
    });

    createAuditLog(req.user?.name || 'Admin', `File Request ${newStatus}`, 'FileRequest', req.params.id, `File request ${newStatus} for ${request.patientName}`);
    res.json(fileRequestRepo.findById(req.params.id));
  },
};
