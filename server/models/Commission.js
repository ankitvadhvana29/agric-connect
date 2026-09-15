import mongoose from 'mongoose';

const CommissionSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
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
    orderTotal: {
      type: Number,
      required: true,
    },
    commissionPercentage: {
      type: Number,
      default: 5.0, // 5% for founders
    },
    commissionAmount: {
      type: Number,
      required: true,
    },
    payoutStatus: {
      type: String,
      enum: ['accrued', 'transferred_to_founders'],
      default: 'accrued',
    },
    transferredAt: Date,
  },
  {
    timestamps: true,
  }
);

CommissionSchema.index({ createdAt: -1 });

const Commission = mongoose.model('Commission', CommissionSchema);
export default Commission;
