import { Response } from 'express';
import { getDatabase } from '../config/database.js';
import { cashMaalService } from '../services/cashmaal.service.js';
import { generateDonorPaymentId, generateReceiptNumber } from '../utils/id-generator.js';
import { createAuditLog } from '../services/audit.service.js';
import { AuthRequest } from '../middleware/auth.js';
import { env } from '../config/env.js';

export const donationController = {
  initiateDonation(req: AuthRequest, res: Response): void {
    try {
      const { donorName, email, phone, amount, currency, projectSponsorship, payMethod, notes } = req.body;

      if (!donorName || !email || !amount || amount <= 0) {
        res.status(400).json({ error: 'Donor name, email, and valid amount are required' });
        return;
      }

      if (!env.CASHMAAL_WEB_ID) {
        res.status(500).json({ error: 'Payment system not configured. Please contact administrator.' });
        return;
      }

      const donationId = generateDonorPaymentId();
      const db = getDatabase();

      db.prepare(`INSERT INTO donor_payments (id, donor_name, email, phone, amount, payment_method, project_sponsorship, receipt_number, notes, payment_status, transaction_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', '')`)
        .run(donationId, donorName, email || '', phone || '', Number(amount), payMethod || 'Online', projectSponsorship || 'General Cardiac Fund', generateReceiptNumber(), notes || '');

      const redirectHtml = cashMaalService.buildRedirectHtml({
        amount: Number(amount),
        currency: (currency === 'USD' ? 'USD' : 'PKR') as 'PKR' | 'USD',
        email,
        orderId: donationId,
        additionalInfo: `Donation: ${donorName} - ${projectSponsorship || 'General'}`,
        payMethod: payMethod || '',
      });

      createAuditLog(req.user?.name || 'Public', 'Donation Initiated', 'Donor', donationId, `Online donation of ${currency || 'PKR'} ${amount} from ${donorName}`);

      res.setHeader('Content-Type', 'text/html');
      res.send(redirectHtml);
    } catch (err: any) {
      console.error('Donation initiation error:', err);
      res.status(500).json({ error: 'Failed to initiate donation' });
    }
  },

  verifyPayment(req: AuthRequest, res: Response): void {
    try {
      const { CM_TID } = req.query;

      if (!CM_TID) {
        res.redirect(`${env.SITE_URL}/donate?status=error&message=Missing+transaction+ID`);
        return;
      }

      cashMaalService.verifyTransaction(CM_TID as string).then((result) => {
        if (!result || result.status !== '1') {
          res.redirect(`${env.SITE_URL}/donate?status=failed&message=Payment+verification+failed`);
          return;
        }

        const db = getDatabase();
        const orderId = result.order_id;
        const existing = db.prepare('SELECT * FROM donor_payments WHERE id = ?').get(orderId) as any;

        if (existing) {
          db.prepare(`UPDATE donor_payments SET
            transaction_id = ?,
            payment_status = 'Verified',
            verification_date = datetime('now'),
            notes = COALESCE(notes, '') || ' | CashMaal TID: ' || ?
            WHERE id = ?`)
            .run(result.transaction_id, result.transaction_id, orderId);

          createAuditLog('System', 'Donation Verified via CashMaal', 'Donor', orderId, `Payment of ${result.PKR_amount || result.USD_amount} verified. CashMaal TID: ${result.transaction_id}`);
        }

        res.redirect(`${env.SITE_URL}/donate?status=success&transactionId=${result.transaction_id}&amount=${result.PKR_amount || result.USD_amount}&currency=${result.currency || 'PKR'}`);
      }).catch((err) => {
        console.error('CashMaal verification error:', err);
        res.redirect(`${env.SITE_URL}/donate?status=error&message=Verification+service+unavailable`);
      });
    } catch (err: any) {
      console.error('Payment verify error:', err);
      res.redirect(`${env.SITE_URL}/donate?status=error&message=Internal+error`);
    }
  },

  webhookNotification(req: AuthRequest, res: Response): void {
    try {
      const ipnKey = req.body.ipn_key || req.query.ipn_key;

      if (ipnKey !== env.CASHMAAL_IPN_KEY) {
        res.status(403).send('Invalid IPN key');
        return;
      }

      const { status, CM_TID, Amount, currency, client_email, order_id, web_id } = req.body;

      if (status === '1') {
        const db = getDatabase();
        const existing = db.prepare('SELECT * FROM donor_payments WHERE id = ?').get(order_id) as any;

        if (existing) {
          db.prepare(`UPDATE donor_payments SET
            transaction_id = ?,
            payment_status = 'Verified',
            verification_date = datetime('now')
            WHERE id = ?`)
            .run(CM_TID, order_id);

          createAuditLog('System', 'Donation Verified via IPN', 'Donor', order_id, `IPN confirmed: PKR ${Amount}. CashMaal TID: ${CM_TID}`);
        }
      }

      res.status(200).send('**OK**');
    } catch (err: any) {
      console.error('Webhook error:', err);
      res.status(200).send('**OK**');
    }
  },

  getDonationStatus(req: AuthRequest, res: Response): void {
    try {
      const { id } = req.params;
      const db = getDatabase();
      const donation = db.prepare('SELECT id, donor_name, amount, payment_status, transaction_id, payment_date FROM donor_payments WHERE id = ?').get(id) as any;

      if (!donation) {
        res.status(404).json({ error: 'Donation not found' });
        return;
      }

      res.json(donation);
    } catch (err) {
      res.status(500).json({ error: 'Failed to get donation status' });
    }
  },
};
