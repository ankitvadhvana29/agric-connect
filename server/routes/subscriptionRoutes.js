import express from 'express';
import { getPlans, subscribeToPlan, getFounderCommissions } from '../controllers/subscriptionController.js';
import { protect, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Feature 5: Subscription or 5% commission for founders
router.get('/plans', getPlans);
router.post('/subscribe', protect, subscribeToPlan);
router.get('/founder-commissions', protect, authorizeRoles('admin'), getFounderCommissions);

export default router;
