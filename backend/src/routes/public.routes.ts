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

export default router;
