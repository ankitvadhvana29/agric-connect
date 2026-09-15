import express from 'express';
import { getDistributionHubs, getHubByTaluka, getPooledLogisticsStatus } from '../controllers/distributionController.js';

const router = express.Router();

// Feature 3: Taluka based distribution centre & pooled logistics
router.get('/hubs', getDistributionHubs);
router.get('/hubs/:taluka', getHubByTaluka);
router.get('/pooled-logistics/:taluka', getPooledLogisticsStatus);

export default router;
