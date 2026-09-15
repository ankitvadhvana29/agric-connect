import KYC from '../models/KYC.js';
import User from '../models/User.js';
import { validateVerhoeffAadhaar, maskAadhaarNumber, computeTrustScore } from '../services/kycService.js';
import { KYC_STATUS } from '../config/constants.js';

/**
 * @desc    Submit Aadhaar KYC for Farmer or Consumer Verification
 * @route   POST /api/kyc/verify-aadhaar
 * @access  Private
 */
export const verifyAadhaar = async (req, res, next) => {
  try {
    const { aadhaarNumber, idType = 'aadhaar' } = req.body;
    const userId = req.user._id;
    const documentFile = req.file;

    if (!aadhaarNumber) {
      return res.status(400).json({ success: false, message: '12-digit Aadhaar number is required.' });
    }

    const cleanNumber = aadhaarNumber.replace(/[\s-]/g, '');

    // Strict Verhoeff Checksum Verification (UIDAI Standard)
    const isChecksumValid = validateVerhoeffAadhaar(cleanNumber);
    const maskedNumber = maskAadhaarNumber(cleanNumber);

    if (!isChecksumValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Aadhaar number! Verhoeff mathematical checksum verification failed.',
      });
    }

    // Update KYC Record in database
    const kycRecord = await KYC.findOneAndUpdate(
      { user: userId },
      {
        user: userId,
        idType,
        aadhaarMasked: maskedNumber,
        isChecksumValid: true,
        documentPhotoUrl: documentFile ? `/uploads/${documentFile.filename}` : null,
        status: KYC_STATUS.VERIFIED,
        trustScoreAwarded: 35,
        verifiedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    // Compute updated Trust Score
    const updatedTrustScore = computeTrustScore(true, 5);

    // Update User Profile
    await User.findByIdAndUpdate(userId, {
      kycStatus: KYC_STATUS.VERIFIED,
      aadhaarMasked: maskedNumber,
      trustScore: updatedTrustScore,
    });

    res.json({
      success: true,
      message: 'Aadhaar Identity Verified successfully! Trust score updated.',
      kyc: {
        status: KYC_STATUS.VERIFIED,
        maskedId: maskedNumber,
        trustScore: updatedTrustScore,
        trustRating: 'Excellent (Aadhaar Verified)',
        verifiedAt: kycRecord.verifiedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Current User KYC Status
 * @route   GET /api/kyc/status
 * @access  Private
 */
export const getKycStatus = async (req, res, next) => {
  try {
    const kyc = await KYC.findOne({ user: req.user._id });
    const user = await User.findById(req.user._id);

    res.json({
      success: true,
      kycStatus: user.kycStatus,
      aadhaarMasked: user.aadhaarMasked,
      trustScore: user.trustScore,
      documentUrl: kyc?.documentPhotoUrl || null,
      isVerified: user.kycStatus === KYC_STATUS.VERIFIED,
    });
  } catch (error) {
    next(error);
  }
};
