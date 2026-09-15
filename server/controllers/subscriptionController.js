import Subscription from '../models/Subscription.js';
import Commission from '../models/Commission.js';
import User from '../models/User.js';
import { SUBSCRIPTION_PLANS, DEFAULT_FOUNDER_COMMISSION_PERCENT } from '../config/constants.js';

/**
 * @desc    Get Available Subscription Plans
 * @route   GET /api/subscription/plans
 * @access  Public
 */
export const getPlans = (req, res) => {
  res.json({
    success: true,
    plans: Object.values(SUBSCRIPTION_PLANS),
    platformCommissionNote: `Non-subscribed users contribute a nominal ${DEFAULT_FOUNDER_COMMISSION_PERCENT}% platform fee on transactions.`,
  });
};

/**
 * @desc    Subscribe to Farmer Pro or Consumer Pass
 * @route   POST /api/subscription/subscribe
 * @access  Private
 */
export const subscribeToPlan = async (req, res, next) => {
  try {
    const { planId, paymentRef = `SUB_PAY_${Date.now()}` } = req.body;
    const userId = req.user._id;

    if (!['farmer_pro', 'consumer_pass'].includes(planId)) {
      return res.status(400).json({ success: false, message: 'Invalid plan selected.' });
    }

    const planConfig = planId === 'farmer_pro' ? SUBSCRIPTION_PLANS.FARMER_PRO : SUBSCRIPTION_PLANS.CONSUMER_PASS;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30); // 30-day validity

    // Create Subscription record
    const subscription = await Subscription.create({
      user: userId,
      planId,
      planName: planConfig.name,
      amountPaid: planConfig.price,
      startDate: new Date(),
      expiryDate,
      isActive: true,
      paymentRef,
    });

    // Update User Profile
    await User.findByIdAndUpdate(userId, {
      subscriptionPlan: planId,
      subscriptionValidUntil: expiryDate,
    });

    res.status(201).json({
      success: true,
      message: `Successfully subscribed to ${planConfig.name}! Enjoy 0% commission and priority benefits.`,
      subscription,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Founder Commission Ledger & Financial Summary (Founders/Admin)
 * @route   GET /api/subscription/founder-commissions
 * @access  Private (Admin / Founder)
 */
export const getFounderCommissions = async (req, res, next) => {
  try {
    const commissions = await Commission.find()
      .populate('farmer', 'fullName phone taluka')
      .populate('buyer', 'fullName phone')
      .sort({ createdAt: -1 });

    const totalCommissionCollected = commissions.reduce((sum, item) => sum + item.commissionAmount, 0);
    const totalGrossMerchandiseValue = commissions.reduce((sum, item) => sum + item.orderTotal, 0);

    res.json({
      success: true,
      summary: {
        totalGrossMerchandiseValue: `₹${totalGrossMerchandiseValue.toFixed(2)}`,
        founderCommissionPercentage: `${DEFAULT_FOUNDER_COMMISSION_PERCENT}%`,
        totalFounderCommissionCollected: `₹${totalCommissionCollected.toFixed(2)}`,
        totalTransactionsCount: commissions.length,
      },
      ledger: commissions,
    });
  } catch (error) {
    next(error);
  }
};
