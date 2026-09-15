import express from 'express';
import { getWeather, getSupportedTalukas } from '../controllers/weatherController.js';

const router = express.Router();

// Feature 1: Weather prediction & Agricultural advisories
router.get('/', getWeather);
router.get('/talukas', getSupportedTalukas);

export default router;
