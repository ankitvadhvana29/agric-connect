import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['farmer', 'consumer', 'hub_manager', 'admin'],
      default: 'farmer',
    },
    taluka: {
      type: String,
      required: [true, 'Taluka is required for regional routing'],
      trim: true,
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true,
    },
    state: {
      type: String,
      default: 'Maharashtra',
    },
    preferredLanguage: {
      type: String,
      enum: ['en', 'hi', 'mr', 'gu'],
      default: 'en',
    },
    // Feature 6: Aadhaar KYC & Trust
    kycStatus: {
      type: String,
      enum: ['unverified', 'pending', 'verified', 'rejected'],
      default: 'unverified',
    },
    aadhaarMasked: {
      type: String,
      default: null,
    },
    trustScore: {
      type: Number,
      default: 50,
      min: 0,
      max: 100,
    },
    // Feature 5: Subscription
    subscriptionPlan: {
      type: String,
      enum: ['free', 'farmer_pro', 'consumer_pass'],
      default: 'free',
    },
    subscriptionValidUntil: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Check if user has active paid subscription
UserSchema.methods.hasActiveSubscription = function () {
  if (this.subscriptionPlan === 'free') return false;
  if (!this.subscriptionValidUntil) return false;
  return new Date(this.subscriptionValidUntil) > new Date();
};

const User = mongoose.model('User', UserSchema);
export default User;
