import { Router } from 'express';
import { getDatabase } from '../config/database.js';

const router = Router();

router.get('/stats', (_req, res) => {
  try {
    const db = getDatabase();
    const totalPatients = (db.prepare('SELECT COUNT(*) as c FROM patients').get() as any).c;
    const totalDonations = (db.prepare('SELECT COALESCE(SUM(amount), 0) as total FROM donor_payments').get() as any).total;
    const donationCount = (db.prepare('SELECT COUNT(*) as c FROM donor_payments').get() as any).c;
    const totalAssistance = (db.prepare("SELECT COUNT(*) as c FROM assistance_requests WHERE status = 'Approved'").get() as any).c;
    const fundsGranted = (db.prepare("SELECT COALESCE(SUM(foundation_contribution), 0) as total FROM assistance_requests WHERE status = 'Approved'").get() as any).total;

    res.json({
      totalPatients,
      totalDonations,
      donationCount,
      totalAssistance,
      fundsGranted,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

router.get('/staff', (_req, res) => {
  try {
    const db = getDatabase();
    const staff = db.prepare("SELECT id, username, name, role FROM users WHERE active = 1 ORDER BY role, name").all();
    res.json(staff);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch staff' });
  }
});

router.get('/donations/recent', (_req, res) => {
  try {
    const db = getDatabase();
    const donations = db.prepare("SELECT donor_name, amount, payment_date, project_sponsorship FROM donor_payments ORDER BY payment_date DESC LIMIT 10").all();
    res.json(donations);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch donations' });
  }
});

router.post('/donations', (req, res) => {
  try {
    const { donorName, email, phone, amount, paymentMethod, projectSponsorship, notes } = req.body;

    if (!donorName || !donorName.trim()) {
      res.status(400).json({ error: 'Donor name is required' });
      return;
    }
    if (!amount || amount <= 0) {
      res.status(400).json({ error: 'Valid donation amount is required' });
      return;
    }

    const db = getDatabase();
    const id = `DON-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const receiptNumber = `RCT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`;
    const paymentDate = new Date().toISOString();

    db.prepare(`
      INSERT INTO donor_payments (id, donor_name, email, phone, amount, payment_date, payment_method, project_sponsorship, receipt_number, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, donorName.trim(), email || '', phone || '', amount, paymentDate, paymentMethod || 'Online', projectSponsorship || 'General Cardiac Fund', receiptNumber, notes || '');

    res.json({
      success: true,
      id,
      receiptNumber,
      message: `Thank you ${donorName}! Your donation of Rs. ${amount.toLocaleString()} has been recorded. Receipt: ${receiptNumber}`,
    });
  } catch (err) {
    console.error('Donation error:', err);
    res.status(500).json({ error: 'Failed to process donation' });
  }
});

export default router;
