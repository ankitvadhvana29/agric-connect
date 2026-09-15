import mongoose from 'mongoose';

const KYCSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    idType: {
      type: String,
      enum: ['aadhaar', 'voter_id', 'pan'],
      default: 'aadhaar',
    },
    // Masked for privacy (e.g. XXXX-XXXX-1234)
    aadhaarMasked: {
      type: String,
      required: true,
    },
    // Verhoeff checksum validation result
    isChecksumValid: {
      type: Boolean,
      default: true,
    },
    documentPhotoUrl: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    trustScoreAwarded: {
      type: Number,
      default: 35, // Added to base trust score upon verification
    },
    verifiedAt: Date,
    rejectionReason: String,
    reviewerNotes: String,
  },
  {
    timestamps: true,
  }
);

const KYC = mongoose.model('KYC', KYCSchema);
export default KYC;
