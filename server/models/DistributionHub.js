import mongoose from 'mongoose';

const DistributionHubSchema = new mongoose.Schema(
  {
    hubCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    taluka: {
      type: String,
      required: true,
      trim: true,
    },
    district: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      default: 'Maharashtra',
    },
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    capacityKg: {
      type: Number,
      default: 50000,
    },
    currentLoadKg: {
      type: Number,
      default: 0,
    },
    farmersConnected: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Active', 'Maintenance', 'Inactive'],
      default: 'Active',
    },
    managerContact: {
      name: String,
      phone: String,
    },
    coldStorageAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

DistributionHubSchema.index({ taluka: 1, district: 1 });

const DistributionHub = mongoose.model('DistributionHub', DistributionHubSchema);
export default DistributionHub;
