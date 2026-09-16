import express from 'express';
import { getProducts, getProductById, createProduct, deleteProduct } from '../controllers/productController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Feature 10: Produce listings synced across all devices
router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', upload.array('images', 5), createProduct);
router.delete('/:id', deleteProduct);

export default router;
