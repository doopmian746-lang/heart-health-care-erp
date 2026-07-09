import { getDatabase } from '../config/database.js';
import { DonorPayment } from '../types/index.js';

const rowToDonor = (row: any): DonorPayment => ({
  id: row.id,
  donorName: row.donor_name,
  email: row.email,
  phone: row.phone,
  amount: row.amount,
  paymentDate: row.payment_date,
  paymentMethod: row.payment_method,
  projectSponsorship: row.project_sponsorship,
  receiptNumber: row.receipt_number,
  notes: row.notes,
});

export const donorRepo = {
  findAll(): DonorPayment[] {
    const db = getDatabase();
    return db.prepare('SELECT * FROM donor_payments ORDER BY payment_date DESC').all().map(rowToDonor);
  },

  create(payment: DonorPayment): void {
    const db = getDatabase();
    db.prepare(`
      INSERT INTO donor_payments (id, donor_name, email, phone, amount, payment_date, payment_method, project_sponsorship, receipt_number, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(payment.id, payment.donorName, payment.email, payment.phone, payment.amount,
      payment.paymentDate, payment.paymentMethod, payment.projectSponsorship, payment.receiptNumber, payment.notes);
  },

  getTotalDonations(): number {
    const db = getDatabase();
    const row = db.prepare('SELECT COALESCE(SUM(amount), 0) as total FROM donor_payments').get() as any;
    return row.total;
  },
};
