import express from 'express';
import { verifyAadhaar, getKycStatus } from '../controllers/kycController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Feature 6: ID card verified (Aadhaar KYC)
router.post('/verify-aadhaar', protect, upload.single('document'), verifyAadhaar);
router.get('/status', protect, getKycStatus);

export default router;
