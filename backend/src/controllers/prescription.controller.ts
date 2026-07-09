import { Response } from 'express';
import { prescriptionRepo } from '../repositories/prescription.repo.js';
import { patientRepo } from '../repositories/patient.repo.js';
import { Prescription } from '../types/index.js';
import { getPrescriptionCount } from '../repositories/index.js';
import { generatePrescriptionId } from '../utils/id-generator.js';
import { createAuditLog } from '../services/audit.service.js';
import { AuthRequest } from '../middleware/auth.js';

export const prescriptionController = {
  getAll(_req: AuthRequest, res: Response): void {
    res.json(prescriptionRepo.findAll());
  },

  create(req: AuthRequest, res: Response): void {
    const patientId = req.params.id;
    const patient = patientRepo.findById(patientId);
    if (!patient) {
      res.status(404).json({ error: 'Patient not found' });
      return;
    }

    const prData = req.body;
    const prescription: Prescription = {
      id: generatePrescriptionId(getPrescriptionCount() + 1),
      consultationId: prData.consultationId || '',
      patientId,
      date: new Date().toISOString(),
      items: prData.items || [],
      lifestyleRecommendations: prData.lifestyleRecommendations || '',
      doctorName: req.user?.name || 'Unknown Doctor',
      status: 'Pending',
    };

    prescriptionRepo.create(prescription);
    createAuditLog(req.user?.name || 'Doctor', 'Prescription Created', 'Prescription', prescription.id, `Created prescription with ${prescription.items.length} item(s) for ${patient.fullName}`);
    res.json(prescription);
  },
};
