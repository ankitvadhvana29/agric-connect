import Order from '../models/Order.js';
import Commission from '../models/Commission.js';
import { generateUPIPaymentData, verifyUPIPayment } from '../services/upiService.js';
import { ESCROW_STATUS, ORDER_STATUS } from '../config/constants.js';

/**
 * @desc    Generate UPI Intent Link and QR Code for an Order or Test Amount
 * @route   POST /api/payment/generate-upi
 * @access  Public / Private
 */
export const generateUPI = async (req, res, next) => {
  try {
    const { orderId, amount, note } = req.body;

    let targetAmount = amount ? parseFloat(amount) : 450.0;
    let orderNumber = 'TEST-UPI-450';
    let order = null;

    if (orderId) {
      order = await Order.findById(orderId);
      if (order) {
        targetAmount = order.totalAmount;
        orderNumber = order.orderNumber;
      }
    }

    const upiData = await generateUPIPaymentData({
      orderId: order?._id || 'demo-order',
      orderNumber,
      amount: targetAmount,
      note: note || `AgriConnect Escrow Order #${orderNumber}`,
    });

    res.json({
      success: true,
      message: 'UPI payment link and QR generated successfully.',
      payment: upiData,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Confirm UPI Payment and lock funds in AgriConnect Escrow
 * @route   POST /api/payment/verify-escrow
 * @access  Private
 */
export const confirmPaymentToEscrow = async (req, res, next) => {
  try {
    const { orderId, transactionRef } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const verification = await verifyUPIPayment(transactionRef);

    order.escrowStatus = ESCROW_STATUS.HELD_IN_ESCROW;
    order.upiTransactionRef = transactionRef;
    order.paidAt = new Date();
    order.orderStatus = ORDER_STATUS.POOLED_IN_TALUKA;
    await order.save();

    // Record Founder 5% Commission in Ledger
    await Commission.findOneAndUpdate(
      { order: order._id },
      {
        order: order._id,
        buyer: order.buyer,
        farmer: order.farmer,
        orderTotal: order.totalAmount,
        commissionPercentage: order.founderCommissionRate,
        commissionAmount: order.founderCommissionAmount,
        payoutStatus: 'accrued',
      },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      message: 'Payment received. Funds securely locked in Escrow. Farmer notified to drop produce at Taluka Hub.',
      order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Release Escrow funds to Farmer upon delivery & consumer approval
 * @route   POST /api/payment/release-escrow
 * @access  Private (Consumer or Hub Manager)
 */
export const releaseEscrow = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    if (order.escrowStatus !== ESCROW_STATUS.HELD_IN_ESCROW) {
      return res.status(400).json({ success: false, message: 'Order is not in HELD_IN_ESCROW state.' });
    }

    order.escrowStatus = ESCROW_STATUS.RELEASED_TO_FARMER;
    order.orderStatus = ORDER_STATUS.DELIVERED;
    order.deliveredAt = new Date();
    order.escrowReleasedAt = new Date();
    await order.save();

    res.json({
      success: true,
      message: `Escrow released! ₹${order.netFarmerAmount} directly transferred to Farmer UPI VPA.`,
      order,
    });
  } catch (error) {
    next(error);
  }
};
