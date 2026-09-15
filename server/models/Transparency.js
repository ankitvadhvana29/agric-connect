import mongoose from 'mongoose';

const TransparencySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      unique: true,
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    batchNumber: {
      type: String,
      required: true,
      unique: true,
    },
    harvestDate: {
      type: Date,
      required: true,
    },
    soilType: {
      type: String,
      default: 'Black Cotton / Alluvial Soil',
    },
    waterSource: {
      type: String,
      default: 'Drip Irrigation / Borewell',
    },
    isOrganicCertified: {
      type: Boolean,
      default: true,
    },
    fertilizersUsed: [
      {
        name: String,
        type: { type: String, enum: ['Organic Compost', 'Bio-fertilizer', 'Chemical', 'Vermicompost'] },
        appliedDate: Date,
      },
    ],
    pesticideRecord: {
      type: String,
      default: 'Zero Synthetic Pesticides - 100% Neem Oil & Biological Pest Control',
    },
    coldChainTracking: [
      {
        checkpoint: String,
        temperatureCelsius: Number,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    farmLocationCoordinates: {
      latitude: Number,
      longitude: Number,
    },
    farmPhotos: [
      {
        url: String,
        description: String,
      },
    ],
    qrCodePayload: {
      type: String, // Public verifiable URL or signed batch hash
    },
  },
  {
    timestamps: true,
  }
);

const Transparency = mongoose.model('Transparency', TransparencySchema);
export default Transparency;
