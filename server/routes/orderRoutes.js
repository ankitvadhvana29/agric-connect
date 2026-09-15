import express from 'express';
import { createOrder, getMyOrders, updateOrderStatus } from '../controllers/orderController.js';
import { protect, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Order lifecycle
router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.patch('/:id/status', protect, authorizeRoles('hub_manager', 'admin'), updateOrderStatus);

export default router;
