import { Response } from 'express';
import { donorRepo } from '../repositories/donor.repo.js';
import { DonorPayment } from '../types/index.js';
import { generateDonorPaymentId, generateReceiptNumber } from '../utils/id-generator.js';
import { createAuditLog } from '../services/audit.service.js';
import { AuthRequest } from '../middleware/auth.js';
import { getDatabase } from '../config/database.js';

export const donorController = {
  getAll(_req: AuthRequest, res: Response): void {
    res.json(donorRepo.findAll());
  },

  getPending(_req: AuthRequest, res: Response): void {
    try {
      const db = getDatabase();
      const pending = db.prepare("SELECT * FROM donor_payments WHERE payment_status = 'Pending' ORDER BY payment_date DESC").all();
      res.json(pending);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch pending donations' });
    }
  },

  create(req: AuthRequest, res: Response): void {
    const data = req.body;
    const newPayment: DonorPayment = {
      id: generateDonorPaymentId(),
      donorName: data.donorName,
      email: data.email || '',
      phone: data.phone || '',
      amount: Number(data.amount),
      paymentDate: new Date().toISOString(),
      paymentMethod: data.paymentMethod || 'Bank Transfer',
      projectSponsorship: data.projectSponsorship || 'General Cardiac Fund',
      receiptNumber: generateReceiptNumber(),
      notes: data.notes || '',
    };

    donorRepo.create(newPayment);
    createAuditLog(req.user?.name || 'Admin', 'Donor Payment Registered', 'Donor', newPayment.id, `Registered donation of PKR ${newPayment.amount} from ${data.donorName}`);
    res.json(newPayment);
  },

  verify(req: AuthRequest, res: Response): void {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['Verified', 'Rejected'].includes(status)) {
      res.status(400).json({ error: 'Invalid status. Must be: Verified or Rejected' });
      return;
    }

    try {
      const db = getDatabase();
      const existing = db.prepare('SELECT * FROM donor_payments WHERE id = ?').get(id) as any;
      if (!existing) {
        res.status(404).json({ error: 'Donation not found' });
        return;
      }

      db.prepare('UPDATE donor_payments SET payment_status = ?, verified_by = ?, verification_date = datetime(\'now\') WHERE id = ?')
        .run(status, req.user?.name || 'Admin', id);

      createAuditLog(
        req.user?.name || 'Admin',
        `Donation ${status}`,
        'Donor',
        id,
        `Donation of PKR ${existing.amount} from ${existing.donor_name} ${status.toLowerCase()} by ${req.user?.name || 'Admin'}`
      );

      res.json({ success: true, message: `Donation ${status.toLowerCase()} successfully` });
    } catch (err) {
      res.status(500).json({ error: 'Failed to verify donation' });
    }
  },
};
