export { patientRepo } from './patient.repo.js';
export { userRepo } from './user.repo.js';
export { consultationRepo } from './consultation.repo.js';
export { prescriptionRepo } from './prescription.repo.js';
export { inventoryRepo } from './inventory.repo.js';
export { assistanceRepo } from './assistance.repo.js';
export { donorRepo } from './donor.repo.js';
export { fileRequestRepo } from './file-request.repo.js';
export { auditRepo } from './audit.repo.js';

import { getDatabase } from '../config/database.js';

export const getPatientCount = () => {
  const row = getDatabase().prepare("SELECT COALESCE(MAX(CAST(SUBSTR(id, 3) AS INTEGER)), 1000) as max_id FROM patients").get() as any;
  return row.max_id - 1000;
};
export const getInventoryCount = () => {
  const row = getDatabase().prepare("SELECT COALESCE(MAX(CAST(SUBSTR(id, 3) AS INTEGER)), 0) as max_id FROM inventory").get() as any;
  return row.max_id;
};
export const getConsultationCount = () => (getDatabase().prepare('SELECT COUNT(*) as count FROM consultations').get() as any).count;
export const getPrescriptionCount = () => (getDatabase().prepare('SELECT COUNT(*) as count FROM prescriptions').get() as any).count;
export const getAssistanceCount = () => (getDatabase().prepare('SELECT COUNT(*) as count FROM assistance_requests').get() as any).count;
export const getMedicineIssueCount = () => (getDatabase().prepare('SELECT COUNT(*) as count FROM medicine_issues').get() as any).count;
