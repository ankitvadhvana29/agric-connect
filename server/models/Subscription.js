import mongoose from 'mongoose';

const SubscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    planId: {
      type: String,
      enum: ['farmer_pro', 'consumer_pass'],
      required: true,
    },
    planName: {
      type: String,
      required: true,
    },
    amountPaid: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    paymentRef: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Subscription = mongoose.model('Subscription', SubscriptionSchema);
export default Subscription;
