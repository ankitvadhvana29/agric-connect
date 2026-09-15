import DistributionHub from '../models/DistributionHub.js';
import Order from '../models/Order.js';
import { isDatabaseConnected } from '../config/db.js';
import { mockHubs, mockOrders } from '../config/mockStore.js';

/**
 * @desc    Get all Taluka Distribution Hubs
 * @route   GET /api/distribution/hubs
 * @access  Public
 */
export const getDistributionHubs = async (req, res, next) => {
  try {
    if (!isDatabaseConnected()) {
      return res.json({
        success: true,
        count: mockHubs.length,
        hubs: mockHubs,
      });
    }

    const hubs = await DistributionHub.find().sort({ farmersConnected: -1 });
    res.json({
      success: true,
      count: hubs.length,
      hubs: hubs.length > 0 ? hubs : mockHubs,
    });
  } catch (error) {
    // Fallback to in-memory hubs on any DB error
    res.json({
      success: true,
      count: mockHubs.length,
      hubs: mockHubs,
    });
  }
};

/**
 * @desc    Get Hub by Taluka Name
 * @route   GET /api/distribution/hubs/:taluka
 * @access  Public
 */
export const getHubByTaluka = async (req, res, next) => {
  try {
    const { taluka } = req.params;

    if (!isDatabaseConnected()) {
      const hub = mockHubs.find((h) => h.taluka.toLowerCase().includes(taluka.toLowerCase())) || mockHubs[0];
      return res.json({ success: true, hub });
    }

    let hub = await DistributionHub.findOne({
      taluka: { $regex: new RegExp(taluka, 'i') },
    });

    if (!hub) {
      hub = mockHubs.find((h) => h.taluka.toLowerCase().includes(taluka.toLowerCase())) || mockHubs[0];
    }

    res.json({ success: true, hub });
  } catch (error) {
    const hub = mockHubs.find((h) => h.taluka.toLowerCase().includes(req.params.taluka.toLowerCase())) || mockHubs[0];
    res.json({ success: true, hub });
  }
};

/**
 * @desc    Get Pooled Logistics Status for a Taluka
 * @route   GET /api/distribution/pooled-logistics/:taluka
 * @access  Public / Private
 */
export const getPooledLogisticsStatus = async (req, res, next) => {
  try {
    const { taluka } = req.params;

    let pooledCount = 4;
    if (isDatabaseConnected()) {
      const pooledOrders = await Order.find({
        taluka: { $regex: new RegExp(taluka, 'i') },
        orderStatus: { $in: ['placed', 'pooled_in_taluka'] },
      });
      if (pooledOrders.length > 0) pooledCount = pooledOrders.length;
    }

    res.json({
      success: true,
      taluka,
      isPoolingActive: true,
      pooledOrdersCount: pooledCount,
      estimatedVehicleCapacityUsed: `${Math.min(pooledCount * 18, 92)}%`,
      savingsPercentage: '38% transport cost saved through Taluka clustering',
      message: `Your order will be pooled with ${pooledCount} other orders in ${taluka} for zero-waste delivery.`,
      activeBatches: [
        {
          batchId: `BATCH-${taluka.substring(0, 3).toUpperCase()}-401`,
          dispatchTime: 'Today, 5:30 PM',
          route: `${taluka} Hub -> Village Cluster -> Central Mandi`,
          vehicleType: 'Electric Agri-Van (EV-Eco)',
          temperatureControlled: true,
        },
      ],
    });
  } catch (error) {
    next(error);
  }
};
