import QRCode from 'qrcode';
import Transparency from '../models/Transparency.js';
import Product from '../models/Product.js';
import { isDatabaseConnected } from '../config/db.js';
import { mockTransparencies, mockProducts } from '../config/mockStore.js';

/**
 * @desc    Get Farm-to-Fork Transparency Trace by Product ID
 * @route   GET /api/transparency/product/:productId
 * @access  Public
 */
export const getTransparencyByProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!isDatabaseConnected()) {
      const stored = mockTransparencies[productId] || mockTransparencies['prod_01'];
      return res.json({
        success: true,
        transparency: stored,
      });
    }

    let transparency = await Transparency.findOne({ product: productId })
      .populate('product', 'name category price unit images')
      .populate('farmer', 'fullName phone taluka district kycStatus aadhaarMasked trustScore');

    if (!transparency) {
      const stored = mockTransparencies[productId] || mockTransparencies['prod_01'];
      return res.json({
        success: true,
        transparency: stored,
      });
    }

    res.json({
      success: true,
      transparency,
    });
  } catch (error) {
    res.json({
      success: true,
      transparency: mockTransparencies['prod_01'],
    });
  }
};

/**
 * @desc    Create Farm Transparency Batch Record
 * @route   POST /api/transparency
 * @access  Private (Farmer or Hub Inspector)
 */
export const createTransparencyRecord = async (req, res, next) => {
  try {
    const { productId, harvestDate, soilType, waterSource } = req.body;
    const batchNumber = `BATCH-${Date.now().toString().slice(-6)}`;

    const newRecord = {
      product: productId,
      batchNumber,
      harvestDate: harvestDate || new Date(),
      soilType: soilType || 'Black Cotton Alluvial Soil',
      waterSource: waterSource || 'Solar Drip Irrigation',
      isOrganicCertified: true,
      pesticideRecord: '100% Zero Synthetic Pesticides. Plant-based neem extract applied.',
    };

    if (isDatabaseConnected()) {
      await Transparency.create(newRecord);
    } else {
      mockTransparencies[productId] = newRecord;
    }

    res.status(201).json({
      success: true,
      message: 'Farm transparency passport created!',
      record: newRecord,
    });
  } catch (error) {
    next(error);
  }
};
