import { Request, Response } from 'express';
import { patientRepo } from '../repositories/patient.repo.js';
import { consultationRepo } from '../repositories/consultation.repo.js';
import { prescriptionRepo } from '../repositories/prescription.repo.js';
import { assistanceRepo } from '../repositories/assistance.repo.js';
import { Patient } from '../types/index.js';
import { getDatabase } from '../config/database.js';
import { generatePatientId, generatePatientCode } from '../utils/id-generator.js';
import { getPatientCount } from '../repositories/index.js';
import { createAuditLog } from '../services/audit.service.js';
import { AuthRequest } from '../middleware/auth.js';

const rowToMedicalHistory = (row: any) => row ? {
  patientId: row.patient_id,
  chronicConditions: JSON.parse(row.chronic_conditions || '[]'),
  lifestyleFactors: JSON.parse(row.lifestyle_factors || '[]'),
  familyHistory: JSON.parse(row.family_history || '[]'),
  allergies: row.allergies,
  existingMedications: row.existing_medications,
  priorCardiacProcedures: JSON.parse(row.prior_cardiac_procedures || '[]'),
  lastUpdated: row.last_updated,
  updatedBy: row.updated_by,
} : null;

export const patientController = {
  getAll(req: Request, res: Response): void {
    const search = req.query.search as string;
    const patients = patientRepo.findAll(search);
    res.json(patients);
  },

  getById(req: Request, res: Response): void {
    const patient = patientRepo.findById(req.params.id);
    if (!patient) {
      res.status(404).json({ error: 'Patient not found' });
      return;
    }
    const db = getDatabase();
    const mhRow = db.prepare('SELECT * FROM medical_histories WHERE patient_id = ?').get(patient.id) as any;
    const medicalHistory = mhRow ? rowToMedicalHistory(mhRow) : null;
    const consultations = consultationRepo.findByPatientId(patient.id);
    const prescriptions = prescriptionRepo.findByPatientId(patient.id);
    const assistances = assistanceRepo.findByPatientId(patient.id);
    res.json({ patient, medicalHistory, consultations, prescriptions, assistanceHistory: assistances });
  },

  create(req: AuthRequest, res: Response): void {
    const data = req.body;
    const nextNum = getPatientCount() + 1;
    const newPatient: Patient = {
      id: generatePatientId(1000 + nextNum),
      patientCode: generatePatientCode(nextNum),
      registrationDate: new Date().toISOString(),
      fullName: data.fullName,
      fatherHusbandName: data.fatherHusbandName || '',
      cnic: data.cnic || '',
      dob: data.dob || '',
      age: data.age || 0,
      gender: data.gender || 'Male',
      maritalStatus: data.maritalStatus || 'Single',
      occupation: data.occupation || '',
      mobile: data.mobile || '',
      alternateContact: data.alternateContact || '',
      address: data.address || '',
      bloodGroup: data.bloodGroup || 'Unknown',
      photo: data.photo || '',
      referredBy: data.referredBy || '',
      createdBy: req.user?.id || '',
      socioEconomic: data.socioEconomic,
    };

    patientRepo.create(newPatient);
    createAuditLog(req.user?.name || 'Front Desk', 'Patient Registered', 'Patient', newPatient.id, `Registered patient ${newPatient.fullName} (${newPatient.id})`);
    res.json(newPatient);
  },

  update(req: AuthRequest, res: Response): void {
    try {
      const existing = patientRepo.findById(req.params.id);
      if (!existing) {
        res.status(404).json({ error: 'Patient not found' });
        return;
      }
      patientRepo.update(req.params.id, req.body);
      createAuditLog(req.user?.name || 'User', 'Patient Updated', 'Patient', req.params.id, `Updated patient record for ${existing.fullName}`);
      res.json(patientRepo.findById(req.params.id));
    } catch (err) {
      console.error('Update patient error:', err);
      res.status(500).json({ error: 'Failed to update patient' });
    }
  },

  delete(req: AuthRequest, res: Response): void {
    const existing = patientRepo.findById(req.params.id);
    if (!existing) {
      res.status(404).json({ error: 'Patient not found' });
      return;
    }
    patientRepo.delete(req.params.id);
    createAuditLog(req.user?.name || 'User', 'Patient Deleted', 'Patient', req.params.id, `Deleted patient ${existing.fullName}`);
    res.json({ success: true });
  },
};
