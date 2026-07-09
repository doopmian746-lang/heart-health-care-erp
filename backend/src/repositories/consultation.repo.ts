import { getDatabase } from '../config/database.js';
import { Consultation, Vitals } from '../types/index.js';

const rowToConsultation = (row: any): Consultation => ({
  id: row.id,
  patientId: row.patient_id,
  visitDate: row.visit_date,
  vitals: {
    bpSystolic: row.bp_systolic,
    bpDiastolic: row.bp_diastolic,
    pulse: row.pulse,
    weight: row.weight,
    height: row.height,
    bmi: row.bmi,
    spo2: row.spo2,
  },
  chiefComplaint: row.chief_complaint,
  symptoms: row.symptoms,
  examinationFindings: row.examination_findings,
  diagnosis: row.diagnosis,
  doctorNotes: row.doctor_notes,
  followUpDate: row.follow_up_date,
  followUpInstructions: row.follow_up_instructions,
  doctorName: row.doctor_name,
});

export const consultationRepo = {
  findByPatientId(patientId: string): Consultation[] {
    const db = getDatabase();
    return db.prepare('SELECT * FROM consultations WHERE patient_id = ? ORDER BY visit_date DESC').all(patientId).map(rowToConsultation);
  },

  findById(id: string): Consultation | undefined {
    const db = getDatabase();
    const row = db.prepare('SELECT * FROM consultations WHERE id = ?').get(id) as any;
    return row ? rowToConsultation(row) : undefined;
  },

  findAll(): Consultation[] {
    const db = getDatabase();
    return db.prepare('SELECT * FROM consultations ORDER BY visit_date DESC').all().map(rowToConsultation);
  },

  create(consultation: Consultation): void {
    const db = getDatabase();
    db.prepare(`
      INSERT INTO consultations (id, patient_id, visit_date, bp_systolic, bp_diastolic, pulse, weight, height, bmi, spo2,
        chief_complaint, symptoms, examination_findings, diagnosis, doctor_notes, follow_up_date, follow_up_instructions, doctor_name)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      consultation.id, consultation.patientId, consultation.visitDate,
      consultation.vitals.bpSystolic, consultation.vitals.bpDiastolic,
      consultation.vitals.pulse, consultation.vitals.weight, consultation.vitals.height,
      consultation.vitals.bmi, consultation.vitals.spo2,
      consultation.chiefComplaint, consultation.symptoms, consultation.examinationFindings,
      consultation.diagnosis, consultation.doctorNotes, consultation.followUpDate,
      consultation.followUpInstructions, consultation.doctorName
    );
  },

  getTodayCount(): number {
    const db = getDatabase();
    const today = new Date().toISOString().split('T')[0];
    const row = db.prepare("SELECT COUNT(*) as count FROM consultations WHERE visit_date LIKE ?").get(`${today}%`) as any;
    return row.count;
  },
};
