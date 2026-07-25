import { Router } from 'express';
import { donationController } from '../controllers/donation.controller.js';

const router = Router();

router.post('/initiate', donationController.initiateDonation);
router.get('/verify', donationController.verifyPayment);
router.post('/webhook', donationController.webhookNotification);
router.get('/status/:id', donationController.getDonationStatus);

export default router;
