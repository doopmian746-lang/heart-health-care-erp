import { Response } from 'express';
import { donorRepo } from '../repositories/donor.repo.js';
import { DonorPayment } from '../types/index.js';
import { generateDonorPaymentId, generateReceiptNumber } from '../utils/id-generator.js';
import { createAuditLog } from '../services/audit.service.js';
import { AuthRequest } from '../middleware/auth.js';

export const donorController = {
  getAll(_req: AuthRequest, res: Response): void {
    res.json(donorRepo.findAll());
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
};
