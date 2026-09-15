import express from 'express';
import { getTransparencyByProduct, createTransparencyRecord } from '../controllers/transparencyController.js';
import { protect, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Feature 7: Farm-to-Fork Consumer Transparency
router.get('/product/:productId', getTransparencyByProduct);
router.post('/', protect, authorizeRoles('farmer', 'admin'), createTransparencyRecord);

export default router;
