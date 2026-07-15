import { Response } from 'express';
import { consultationRepo } from '../repositories/consultation.repo.js';
import { patientRepo } from '../repositories/patient.repo.js';
import { Consultation } from '../types/index.js';
import { generateConsultationId } from '../utils/id-generator.js';
import { getConsultationCount } from '../repositories/index.js';
import { createAuditLog } from '../services/audit.service.js';
import { AuthRequest } from '../middleware/auth.js';

export const consultationController = {
  getAll(_req: AuthRequest, res: Response): void {
    res.json(consultationRepo.findAll());
  },

  getByPatientId(req: AuthRequest, res: Response): void {
    res.json(consultationRepo.findByPatientId(req.params.patientId));
  },

  create(req: AuthRequest, res: Response): void {
    const patientId = req.params.id;
    const patient = patientRepo.findById(patientId);
    if (!patient) {
      res.status(404).json({ error: 'Patient not found' });
      return;
    }

    const conData = req.body;
    const consultation: Consultation = {
      id: generateConsultationId(getConsultationCount() + 1),
      patientId,
      visitDate: new Date().toISOString(),
      vitals: {
        bpSystolic: conData.vitals?.bpSystolic || 120,
        bpDiastolic: conData.vitals?.bpDiastolic || 80,
        pulse: conData.vitals?.pulse || 72,
        weight: conData.vitals?.weight || 70,
        height: conData.vitals?.height || 170,
        bmi: conData.vitals?.bmi || 24.2,
        spo2: conData.vitals?.spo2 || 98,
      },
      chiefComplaint: conData.chiefComplaint || '',
      symptoms: conData.symptoms || '',
      examinationFindings: conData.examinationFindings || '',
      diagnosis: conData.diagnosis || '',
      doctorNotes: conData.doctorNotes || '',
      investigations: conData.investigations || '',
      procedures: conData.procedures || '',
      referrals: conData.referrals || '',
      foundationReferral: conData.foundationReferral || false,
      requirements: conData.requirements || '',
      followUpDate: conData.followUpDate || '',
      followUpInstructions: conData.followUpInstructions || '',
      doctorName: req.user?.name || 'Unknown Doctor',
    };

    consultationRepo.create(consultation);
    createAuditLog(req.user?.name || 'Doctor', 'Consultation Created', 'Consultation', consultation.id, `Created consultation for ${patient.fullName}`);
    res.json(consultation);
  },
};
