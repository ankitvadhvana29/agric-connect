import mongoose from 'mongoose';
import { ORDER_STATUS, ESCROW_STATUS } from '../config/constants.js';

const OrderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  imageUrl: { type: String },
});

const OrderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    hub: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DistributionHub',
    },
    items: [OrderItemSchema],
    subtotal: {
      type: Number,
      required: true,
    },
    deliveryFee: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    // Feature 5: 5% Founder Commission
    founderCommissionRate: {
      type: Number,
      default: 5.0, // 5% standard commission
    },
    founderCommissionAmount: {
      type: Number,
      required: true,
    },
    netFarmerAmount: {
      type: Number,
      required: true,
    },
    // Feature 2: UPI & Escrow State Machine
    escrowStatus: {
      type: String,
      enum: Object.values(ESCROW_STATUS),
      default: ESCROW_STATUS.PENDING_PAYMENT,
    },
    upiTransactionRef: {
      type: String,
      default: null,
    },
    orderStatus: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PLACED,
    },
    // Feature 3: Taluka Pooled Logistics
    taluka: {
      type: String,
      required: true,
    },
    pooledBatchCode: {
      type: String,
      default: null,
    },
    deliveryAddress: {
      street: String,
      taluka: String,
      district: String,
      pincode: String,
    },
    paidAt: Date,
    deliveredAt: Date,
    escrowReleasedAt: Date,
  },
  {
    timestamps: true,
  }
);

OrderSchema.index({ buyer: 1, orderStatus: 1 });
OrderSchema.index({ farmer: 1, orderStatus: 1 });

const Order = mongoose.model('Order', OrderSchema);
export default Order;
