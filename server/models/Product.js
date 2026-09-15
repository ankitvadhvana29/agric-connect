import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    hub: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DistributionHub',
    },
    name: {
      type: String,
      required: [true, 'Produce name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Oilseeds', 'Spices', 'Grains', 'Pulses', 'Cotton', 'Cash Crops'],
      default: 'Oilseeds',
    },
    variety: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [1, 'Price must be positive'],
    },
    unit: {
      type: String,
      required: true,
      enum: ['kg', 'dozen', 'quintal', 'crate', 'bundle'],
      default: 'kg',
    },
    availableQuantity: {
      type: Number,
      required: true,
      min: 0,
    },
    locationTaluka: {
      type: String,
      required: true,
    },
    // Feature 10: Multi-Image gallery seen by consumer
    images: [
      {
        url: { type: String, required: true },
        caption: { type: String, default: 'Produce photo' },
        isPrimary: { type: Boolean, default: false },
      },
    ],
    // Feature 4: AI Price & Quality Metadata
    aiGrading: {
      scannedAt: Date,
      detectedCrop: String,
      qualityGrade: {
        type: String,
        enum: ['Grade A', 'Grade B', 'Grade C', 'Pending'],
        default: 'Pending',
      },
      confidenceScore: {
        type: String,
        default: '0%',
      },
      suggestedPriceRange: {
        min: Number,
        max: Number,
      },
      marketTrend: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['Available', 'Sold Out', 'Archived'],
      default: 'Available',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate for transparency record
ProductSchema.virtual('transparency', {
  ref: 'Transparency',
  localField: '_id',
  foreignField: 'product',
  justOne: true,
});

ProductSchema.index({ name: 'text', category: 1, locationTaluka: 1 });

const Product = mongoose.model('Product', ProductSchema);
export default Product;
