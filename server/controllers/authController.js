import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { getMessage } from '../utils/translations.js';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'agriconnect_sih_super_secure_jwt_secret_key_2026', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * @desc    Register a new user (Farmer, Consumer, Hub Manager)
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res, next) => {
  try {
    const { fullName, phone, email, password, role, taluka, district, state, preferredLanguage } = req.body;

    // Check existing phone
    const userExists = await User.findOne({ phone });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'A user with this phone number is already registered.',
      });
    }

    const user = await User.create({
      fullName,
      phone,
      email,
      password,
      role: role || 'farmer',
      taluka: taluka || 'Nashik',
      district: district || 'Nashik',
      state: state || 'Maharashtra',
      preferredLanguage: preferredLanguage || 'en',
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: getMessage('welcome', user.preferredLanguage),
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        phone: user.phone,
        email: user.email,
        role: user.role,
        taluka: user.taluka,
        district: user.district,
        kycStatus: user.kycStatus,
        aadhaarMasked: user.aadhaarMasked,
        trustScore: user.trustScore,
        subscriptionPlan: user.subscriptionPlan,
        preferredLanguage: user.preferredLanguage,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate User & get token (Login Portal)
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res, next) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ success: false, message: 'Please provide phone and password.' });
    }

    const user = await User.findOne({ phone }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid phone number or password.' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: getMessage('loginSuccess', user.preferredLanguage),
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        phone: user.phone,
        email: user.email,
        role: user.role,
        taluka: user.taluka,
        district: user.district,
        kycStatus: user.kycStatus,
        aadhaarMasked: user.aadhaarMasked,
        trustScore: user.trustScore,
        subscriptionPlan: user.subscriptionPlan,
        preferredLanguage: user.preferredLanguage,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Send OTP to phone (Rural friendly mobile login)
 * @route   POST /api/auth/send-otp
 * @access  Public
 */
export const sendMobileOTP = async (req, res, next) => {
  try {
    const { phone, lang = 'en' } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, message: 'Mobile number is required.' });
    }

    // In production, integrate with SMS gateway (Twilio, Gupshup, Fast2SMS)
    // Demo OTP for SIH evaluation
    const demoOtp = '123456';

    res.json({
      success: true,
      message: getMessage('otpSent', lang),
      phone,
      debugOtp: process.env.NODE_ENV === 'development' ? demoOtp : undefined,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Current Logged-in User Profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};
