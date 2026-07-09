import { Response } from 'express';
import { assistanceRepo } from '../repositories/assistance.repo.js';
import { patientRepo } from '../repositories/patient.repo.js';
import { FoundationAssistance } from '../types/index.js';
import { getAssistanceCount } from '../repositories/index.js';
import { generateAssistanceId } from '../utils/id-generator.js';
import { createAuditLog } from '../services/audit.service.js';
import { AuthRequest } from '../middleware/auth.js';

export const assistanceController = {
  getAll(_req: AuthRequest, res: Response): void {
    res.json(assistanceRepo.findAll());
  },

  create(req: AuthRequest, res: Response): void {
    const reqData = req.body;
    const patient = patientRepo.findById(reqData.patientId);
    if (!patient) {
      res.status(404).json({ error: 'Patient not found' });
      return;
    }

    const newRequest: FoundationAssistance = {
      id: generateAssistanceId(getAssistanceCount() + 1),
      patientId: patient.id,
      patientName: patient.fullName,
      type: reqData.type,
      estimatedCost: reqData.estimatedCost || 0,
      patientContribution: reqData.patientContribution || 0,
      foundationContribution: reqData.foundationContribution ?? reqData.estimatedCost ?? 0,
      status: 'Pending',
      justification: reqData.justification || '',
      remarks: '',
      requestedBy: req.user?.name || 'Staff',
      requestDate: new Date().toISOString(),
      approvedBy: null,
      approvalDate: null,
    };

    assistanceRepo.create(newRequest);
    createAuditLog(req.user?.name || 'Staff', 'Assistance Request Submitted', 'Assistance', newRequest.id, `Submitted ${newRequest.type} request for ${patient.fullName} (PKR ${newRequest.estimatedCost})`);
    res.json(newRequest);
  },

  update(req: AuthRequest, res: Response): void {
    const { status, remarks, patientContribution, foundationContribution } = req.body;
    const existing = assistanceRepo.findById(req.params.id);
    if (!existing) {
      res.status(404).json({ error: 'Assistance request not found' });
      return;
    }

    const updateData: any = {
      status,
      remarks: remarks || '',
      patientContribution: patientContribution !== undefined ? Number(patientContribution) : undefined,
      foundationContribution: foundationContribution !== undefined ? Number(foundationContribution) : undefined,
    };
    if (status === 'Approved') {
      updateData.approvedBy = req.user?.name || 'Admin';
      updateData.approvalDate = new Date().toISOString();
    }
    assistanceRepo.update(req.params.id, updateData);

    const action = status === 'Approved' ? 'Assistance Approved' : 'Assistance Rejected';
    const detail = status === 'Approved'
      ? `Approved ${existing.type} for ${existing.patientName}. Foundation covers ${foundationContribution || existing.foundationContribution}`
      : `Rejected assistance for ${existing.patientName}: "${remarks}"`;

    createAuditLog(req.user?.name || 'Admin', action, 'Assistance', req.params.id, detail);
    res.json(assistanceRepo.findById(req.params.id));
  },
};
