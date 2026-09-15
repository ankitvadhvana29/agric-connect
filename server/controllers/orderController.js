import Order from '../models/Order.js';
import User from '../models/User.js';
import Commission from '../models/Commission.js';
import { generateUPIPaymentData } from '../services/upiService.js';
import { DEFAULT_FOUNDER_COMMISSION_PERCENT, ESCROW_STATUS, ORDER_STATUS } from '../config/constants.js';
import { isDatabaseConnected } from '../config/db.js';
import { mockOrders, mockUsers } from '../config/mockStore.js';

/**
 * @desc    Create new Order with 5% Founder Commission Calculation & Escrow Setup
 * @route   POST /api/orders
 * @access  Private (Consumer)
 */
export const createOrder = async (req, res, next) => {
  try {
    const { items, farmerId, hubId, deliveryAddress, taluka } = req.body;
    const buyerId = req.user?._id || 'usr_consumer_01';

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order items are required.' });
    }

    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const commissionRate = DEFAULT_FOUNDER_COMMISSION_PERCENT; // 5% founder commission
    const commissionAmount = parseFloat(((subtotal * commissionRate) / 100).toFixed(2));
    const netFarmerAmount = parseFloat((subtotal - commissionAmount).toFixed(2));

    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;
    const pooledBatchCode = `POOL-${(taluka || 'NSK').substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`;

    const newOrder = {
      _id: `ord_${Date.now()}`,
      orderNumber,
      buyer: buyerId,
      farmer: farmerId || 'usr_farmer_01',
      items,
      subtotal,
      deliveryFee: 0,
      totalAmount: subtotal,
      founderCommissionRate: commissionRate,
      founderCommissionAmount: commissionAmount,
      netFarmerAmount,
      escrowStatus: ESCROW_STATUS.PENDING_PAYMENT,
      orderStatus: ORDER_STATUS.PLACED,
      taluka: taluka || 'Nashik',
      pooledBatchCode,
      deliveryAddress,
    };

    if (isDatabaseConnected()) {
      await Order.create(newOrder);
      if (commissionAmount > 0) {
        await Commission.create({
          order: newOrder._id,
          buyer: buyerId,
          farmer: farmerId,
          orderTotal: subtotal,
          commissionPercentage: commissionRate,
          commissionAmount,
          payoutStatus: 'accrued',
        });
      }
    } else {
      mockOrders.unshift(newOrder);
    }

    const paymentData = await generateUPIPaymentData({
      orderId: newOrder._id,
      orderNumber: newOrder.orderNumber,
      amount: newOrder.totalAmount,
      buyerName: req.user?.fullName || 'Consumer',
    });

    res.status(201).json({
      success: true,
      message: 'Order created! Please complete UPI payment to lock funds in Escrow.',
      order: newOrder,
      payment: paymentData,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Current User Orders (Farmer or Consumer)
 * @route   GET /api/orders/my-orders
 * @access  Private
 */
export const getMyOrders = async (req, res, next) => {
  try {
    if (!isDatabaseConnected()) {
      return res.json({
        success: true,
        count: mockOrders.length,
        orders: mockOrders,
      });
    }

    const isFarmer = req.user?.role === 'farmer';
    const query = isFarmer ? { farmer: req.user._id } : { buyer: req.user._id };

    const orders = await Order.find(query)
      .populate('buyer', 'fullName phone taluka')
      .populate('farmer', 'fullName phone taluka aadhaarMasked trustScore')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders: orders.length > 0 ? orders : mockOrders,
    });
  } catch (error) {
    res.json({
      success: true,
      count: mockOrders.length,
      orders: mockOrders,
    });
  }
};

/**
 * @desc    Update Order Delivery Status
 * @route   PATCH /api/orders/:id/status
 * @access  Private (Hub Manager / Admin)
 */
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!isDatabaseConnected()) {
      const order = mockOrders.find((o) => o._id === id || o.orderNumber === id);
      if (order) order.orderStatus = status;
      return res.json({ success: true, message: `Order status updated to ${status}.`, order });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    order.orderStatus = status;
    await order.save();

    res.json({
      success: true,
      message: `Order status updated to ${status}.`,
      order,
    });
  } catch (error) {
    next(error);
  }
};
