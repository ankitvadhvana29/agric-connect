import express from 'express';
import { registerUser, loginUser, sendMobileOTP, getMyProfile } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Feature 12: Login portal & Registration
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/send-otp', sendMobileOTP);
router.get('/me', protect, getMyProfile);

export default router;
