import { Response } from 'express';
import { inventoryRepo } from '../repositories/inventory.repo.js';
import { prescriptionRepo } from '../repositories/prescription.repo.js';
import { patientRepo } from '../repositories/patient.repo.js';
import { InventoryItem, MedicineIssue, MedicineIssueItem } from '../types/index.js';
import { getInventoryCount, getMedicineIssueCount } from '../repositories/index.js';
import { generateInventoryId, generateMedicineIssueId } from '../utils/id-generator.js';
import { createAuditLog } from '../services/audit.service.js';
import { AuthRequest } from '../middleware/auth.js';
import { getDatabase } from '../config/database.js';

export const pharmacyController = {
  getAll(_req: AuthRequest, res: Response): void {
    res.json(inventoryRepo.findAll());
  },

  create(req: AuthRequest, res: Response): void {
    const med = req.body;
    const newItem: InventoryItem = {
      id: generateInventoryId(getInventoryCount() + 1),
      medicineName: med.medicineName,
      category: med.category || '',
      supplier: med.supplier || '',
      batchNumber: med.batchNumber,
      purchaseDate: med.purchaseDate || new Date().toISOString().split('T')[0],
      expiryDate: med.expiryDate || '',
      quantityAvailable: med.quantityAvailable || 0,
      minimumStockLevel: med.minimumStockLevel || 50,
      unitPrice: med.unitPrice || 0,
    };

    inventoryRepo.create(newItem);
    createAuditLog(req.user?.name || 'Pharmacist', 'Inventory Added', 'Inventory', newItem.id, `Added ${newItem.medicineName} (${newItem.quantityAvailable} units)`);
    res.json(newItem);
  },

  update(req: AuthRequest, res: Response): void {
    const { id, ...data } = req.body;
    const existing = inventoryRepo.findById(id);
    if (!existing) {
      res.status(404).json({ error: 'Medicine not found' });
      return;
    }
    inventoryRepo.update(id, data);
    createAuditLog(req.user?.name || 'Pharmacist', 'Inventory Updated', 'Inventory', id, `Updated ${data.medicineName || existing.medicineName}`);
    res.json(inventoryRepo.findById(id));
  },

  dispense(req: AuthRequest, res: Response): void {
    const prescriptionId = req.params.prescriptionId;
    const prescription = prescriptionRepo.findById(prescriptionId);
    if (!prescription) {
      res.status(404).json({ error: 'Prescription not found' });
      return;
    }

    const patient = patientRepo.findById(prescription.patientId);
    const { items, paymentStatus, sponsorshipId } = req.body;

    if (!items || !items.length) {
      res.status(400).json({ error: 'No medicines specified' });
      return;
    }

    const db = getDatabase();
    const transaction = db.transaction(() => {
      const issueItems: MedicineIssueItem[] = [];
      for (const issueReq of items) {
        const medItem = inventoryRepo.findById(issueReq.medicineId);
        if (medItem) {
          const qtyToDeduct = Math.min(medItem.quantityAvailable, parseInt(issueReq.quantityIssued) || 0);
          inventoryRepo.deductStock(medItem.id, qtyToDeduct);
          issueItems.push({
            medicineId: medItem.id,
            medicineName: medItem.medicineName,
            batchNumber: medItem.batchNumber,
            quantityIssued: qtyToDeduct,
          });
        }
      }

      const newIssue: MedicineIssue = {
        id: generateMedicineIssueId(getMedicineIssueCount() + 1),
        prescriptionId,
        patientId: prescription.patientId,
        issueDate: new Date().toISOString(),
        issuedBy: req.user?.name || 'Pharmacist',
        paymentStatus: paymentStatus || 'Fully Paid',
        sponsorshipId: sponsorshipId || null,
        items: issueItems,
      };

      const insertIssue = db.prepare(`
        INSERT INTO medicine_issues (id, prescription_id, patient_id, issue_date, issued_by, payment_status, sponsorship_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      insertIssue.run(newIssue.id, newIssue.prescriptionId, newIssue.patientId, newIssue.issueDate, newIssue.issuedBy, newIssue.paymentStatus, newIssue.sponsorshipId);

      const insertItem = db.prepare(`
        INSERT INTO medicine_issue_items (issue_id, medicine_id, medicine_name, batch_number, quantity_issued)
        VALUES (?, ?, ?, ?, ?)
      `);
      for (const item of issueItems) {
        insertItem.run(newIssue.id, item.medicineId, item.medicineName, item.batchNumber, item.quantityIssued);
      }

      prescriptionRepo.updateStatus(prescriptionId, 'Dispensed');
      return newIssue;
    });

    const result = transaction();
    createAuditLog(req.user?.name || 'Pharmacist', 'Medicines Dispensed', 'Dispensing', result.id, `Dispensed against Rx ${prescriptionId} for ${patient?.fullName || 'Patient'}`);
    res.json(result);
  },
};
