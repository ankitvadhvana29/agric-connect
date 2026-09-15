import express from 'express';
import { getProducts, getProductById, createProduct } from '../controllers/productController.js';
import { protect, authorizeRoles } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Feature 10: Multi-Image produce listings seen by customer
router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', protect, authorizeRoles('farmer', 'admin'), upload.array('images', 5), createProduct);

export default router;
