import Product from '../models/Product.js';
import User from '../models/User.js';
import { isDatabaseConnected } from '../config/db.js';
import { mockProducts } from '../config/mockStore.js';

/**
 * @desc    Get all produce products (Marketplace with Taluka Filter & Images)
 * @route   GET /api/products
 * @access  Public
 */
const filterMockProducts = (taluka, category) => {
  let filtered = [...mockProducts];
  if (taluka) {
    filtered = filtered.filter((p) => (p.locationTaluka || '').toLowerCase().includes(taluka.toLowerCase()));
  }
  if (category && category !== 'All') {
    const sel = category.toLowerCase().trim();
    filtered = filtered.filter((p) => {
      const cat = (p.category || '').toLowerCase().trim();
      if (sel.includes('oil') && cat.includes('oil')) return true;
      if (sel.includes('spice') && cat.includes('spice')) return true;
      if ((sel.includes('grain') || sel.includes('cereal') || sel.includes('wheat') || sel.includes('bajra') || sel.includes('jowar')) &&
          (cat.includes('grain') || cat.includes('cereal') || cat.includes('wheat') || cat.includes('bajra') || cat.includes('jowar'))) return true;
      if ((sel.includes('pulse') || sel.includes('legume') || sel.includes('dal') || sel.includes('chana') || sel.includes('moong')) &&
          (cat.includes('pulse') || cat.includes('legume') || cat.includes('dal') || cat.includes('chana') || cat.includes('moong'))) return true;
      if ((sel.includes('cotton') || sel.includes('cash')) && (cat.includes('cotton') || cat.includes('cash'))) return true;
      return cat === sel;
    });
  }
  return filtered;
};

export const getProducts = async (req, res, next) => {
  try {
    const { taluka, category } = req.query;

    if (!isDatabaseConnected()) {
      const filtered = filterMockProducts(taluka, category);
      return res.json({
        success: true,
        count: filtered.length,
        products: filtered,
      });
    }

    let query = { status: 'Available' };
    if (taluka) query.locationTaluka = { $regex: new RegExp(taluka, 'i') };
    if (category && category !== 'All') {
      const sel = category.toLowerCase().trim();
      if (sel.includes('oil')) query.category = { $regex: /oil/i };
      else if (sel.includes('spice')) query.category = { $regex: /spice/i };
      else if (sel.includes('grain') || sel.includes('cereal')) query.category = { $regex: /grain|cereal|wheat|bajra|jowar/i };
      else if (sel.includes('pulse') || sel.includes('legume')) query.category = { $regex: /pulse|legume|dal|chana|moong/i };
      else if (sel.includes('cotton') || sel.includes('cash')) query.category = { $regex: /cotton|cash/i };
      else query.category = { $regex: new RegExp(category, 'i') };
    }

    const products = await Product.find(query)
      .populate('farmer', 'fullName phone taluka district kycStatus trustScore aadhaarMasked')
      .populate('hub', 'name taluka district status')
      .sort({ createdAt: -1 });

    const fallbackFiltered = filterMockProducts(taluka, category);
    res.json({
      success: true,
      count: products.length > 0 ? products.length : fallbackFiltered.length,
      products: products.length > 0 ? products : fallbackFiltered,
    });
  } catch (error) {
    const fallbackFiltered = filterMockProducts(req.query.taluka, req.query.category);
    res.json({
      success: true,
      count: fallbackFiltered.length,
      products: fallbackFiltered,
    });
  }
};

/**
 * @desc    Get single product by ID with full images & transparency
 * @route   GET /api/products/:id
 * @access  Public
 */
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isDatabaseConnected()) {
      const product = mockProducts.find((p) => p._id === id) || mockProducts[0];
      return res.json({ success: true, product });
    }

    const product = await Product.findById(id)
      .populate('farmer', 'fullName phone taluka district kycStatus trustScore aadhaarMasked')
      .populate('hub', 'name taluka district status')
      .populate('transparency');

    if (!product) {
      const fallback = mockProducts.find((p) => p._id === id) || mockProducts[0];
      return res.json({ success: true, product: fallback });
    }

    res.json({ success: true, product });
  } catch (error) {
    res.json({ success: true, product: mockProducts[0] });
  }
};

/**
 * @desc    Create Produce Listing with Multiple Images (Farmer)
 * @route   POST /api/products
 * @access  Private (Farmer)
 */
export const createProduct = async (req, res, next) => {
  try {
    const { name, category, variety, price, unit, availableQuantity, locationTaluka, hubId } = req.body;
    const files = req.files || [];

    const images = files.map((file, idx) => ({
      url: `/uploads/${file.filename}`,
      caption: idx === 0 ? 'Primary Produce Photo' : 'Farm / Quality Photo',
      isPrimary: idx === 0,
    }));

    if (images.length === 0) {
      images.push({
        url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=600',
        caption: 'Produce Photo',
        isPrimary: true,
      });
    }

    const newProd = {
      farmer: req.user?._id || 'usr_farmer_01',
      name,
      category: category || 'Oilseeds',
      variety: variety || 'Farm Standard',
      price: parseFloat(price) || 25,
      unit: unit || 'kg',
      availableQuantity: parseFloat(availableQuantity) || 100,
      locationTaluka: locationTaluka || 'Nashik Taluka',
      images,
      isVerified: true,
      status: 'Available',
    };

    if (isDatabaseConnected()) {
      const saved = await Product.create(newProd);
      return res.status(201).json({
        success: true,
        message: 'Produce listing published to Taluka marketplace!',
        product: saved,
      });
    } else {
      newProd._id = `prod_${Date.now()}`;
      mockProducts.unshift(newProd);
    }

    res.status(201).json({
      success: true,
      message: 'Produce listing published to Taluka marketplace!',
      product: newProd,
    });
  } catch (error) {
    next(error);
  }
};