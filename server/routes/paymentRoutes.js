import express from 'express';
import { generateUPI, confirmPaymentToEscrow, releaseEscrow } from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Feature 2: UPI payment & Escrow
router.post('/generate-upi', generateUPI);
router.post('/verify-escrow', protect, confirmPaymentToEscrow);
router.post('/release-escrow', protect, releaseEscrow);

export default router;
