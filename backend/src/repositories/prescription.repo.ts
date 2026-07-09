import { getDatabase } from '../config/database.js';
import { Prescription, PrescriptionItem } from '../types/index.js';

export const prescriptionRepo = {
  findAll(): Prescription[] {
    const db = getDatabase();
    const rows = db.prepare('SELECT * FROM prescriptions ORDER BY date DESC').all() as any[];
    return rows.map(row => {
      const items = db.prepare('SELECT * FROM prescription_items WHERE prescription_id = ?').all(row.id) as any[];
      return {
        id: row.id,
        consultationId: row.consultation_id,
        patientId: row.patient_id,
        date: row.date,
        items: items.map(i => ({
          medicineId: i.medicine_id,
          medicineName: i.medicine_name,
          strength: i.strength,
          dosage: i.dosage,
          frequency: i.frequency,
          duration: i.duration,
          instructions: i.instructions,
        })),
        lifestyleRecommendations: row.lifestyle_recommendations,
        doctorName: row.doctor_name,
        status: row.status,
      };
    });
  },

  findById(id: string): Prescription | undefined {
    const db = getDatabase();
    const row = db.prepare('SELECT * FROM prescriptions WHERE id = ?').get(id) as any;
    if (!row) return undefined;
    const items = db.prepare('SELECT * FROM prescription_items WHERE prescription_id = ?').all(row.id) as any[];
    return {
      id: row.id,
      consultationId: row.consultation_id,
      patientId: row.patient_id,
      date: row.date,
      items: items.map(i => ({
        medicineId: i.medicine_id,
        medicineName: i.medicine_name,
        strength: i.strength,
        dosage: i.dosage,
        frequency: i.frequency,
        duration: i.duration,
        instructions: i.instructions,
      })),
      lifestyleRecommendations: row.lifestyle_recommendations,
      doctorName: row.doctor_name,
      status: row.status,
    };
  },

  findByPatientId(patientId: string): Prescription[] {
    const db = getDatabase();
    const rows = db.prepare('SELECT * FROM prescriptions WHERE patient_id = ? ORDER BY date DESC').all(patientId) as any[];
    return rows.map(row => {
      const items = db.prepare('SELECT * FROM prescription_items WHERE prescription_id = ?').all(row.id) as any[];
      return {
        id: row.id,
        consultationId: row.consultation_id,
        patientId: row.patient_id,
        date: row.date,
        items: items.map(i => ({
          medicineId: i.medicine_id,
          medicineName: i.medicine_name,
          strength: i.strength,
          dosage: i.dosage,
          frequency: i.frequency,
          duration: i.duration,
          instructions: i.instructions,
        })),
        lifestyleRecommendations: row.lifestyle_recommendations,
        doctorName: row.doctor_name,
        status: row.status,
      };
    });
  },

  create(prescription: Prescription): void {
    const db = getDatabase();
    db.prepare(`
      INSERT INTO prescriptions (id, consultation_id, patient_id, date, lifestyle_recommendations, doctor_name, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(prescription.id, prescription.consultationId, prescription.patientId,
      prescription.date, prescription.lifestyleRecommendations, prescription.doctorName, prescription.status);
    const insertItem = db.prepare(`
      INSERT INTO prescription_items (prescription_id, medicine_id, medicine_name, strength, dosage, frequency, duration, instructions)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const item of prescription.items) {
      insertItem.run(prescription.id, item.medicineId, item.medicineName, item.strength, item.dosage, item.frequency, item.duration, item.instructions);
    }
  },

  updateStatus(id: string, status: string): void {
    const db = getDatabase();
    db.prepare('UPDATE prescriptions SET status = ? WHERE id = ?').run(status, id);
  },
};
