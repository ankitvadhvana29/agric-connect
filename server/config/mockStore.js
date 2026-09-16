import { DEFAULT_TALUKAS } from './constants.js';

/**
 * In-Memory Data Store for Saurashtra (Gujarat) Agricultural Hubs & Produce
 */

export const mockUsers = [
  {
    _id: 'usr_farmer_01',
    fullName: 'Mansukhbhai Patel',
    phone: '9825012345',
    email: 'mansukh.patel@agriconnect.in',
    role: 'farmer',
    taluka: 'Gondal',
    district: 'Rajkot',
    state: 'Gujarat',
    kycStatus: 'verified',
    aadhaarMasked: 'XXXX-XXXX-1234',
    trustScore: 94,
  },
  {
    _id: 'usr_farmer_02',
    fullName: 'Pravinbhai Vala',
    phone: '9825054321',
    email: 'pravin.vala@agriconnect.in',
    role: 'farmer',
    taluka: 'Talala',
    district: 'Junagadh',
    state: 'Gujarat',
    kycStatus: 'verified',
    aadhaarMasked: 'XXXX-XXXX-5678',
    trustScore: 98,
  },
  {
    _id: 'usr_farmer_03',
    fullName: 'Hareshbhai Gohil',
    phone: '9825098765',
    email: 'haresh.gohil@agriconnect.in',
    role: 'farmer',
    taluka: 'Mahuva',
    district: 'Bhavnagar',
    state: 'Gujarat',
    kycStatus: 'verified',
    aadhaarMasked: 'XXXX-XXXX-9012',
    trustScore: 91,
  },
  {
    _id: 'usr_consumer_01',
    fullName: 'Jigneshbhai Shah',
    phone: '9898011223',
    email: 'jignesh.shah@gmail.com',
    role: 'consumer',
    taluka: 'Rajkot',
    district: 'Rajkot',
    state: 'Gujarat',
    kycStatus: 'verified',
    aadhaarMasked: 'XXXX-XXXX-4321',
    trustScore: 88,
  },
];

export const mockHubs = DEFAULT_TALUKAS.map((h, idx) => ({
  _id: `hub_${idx + 1}`,
  hubCode: h.talukaId,
  name: h.name,
  taluka: h.taluka,
  district: h.district,
  state: h.state,
  location: { latitude: h.latitude, longitude: h.longitude },
  capacityKg: h.capacityKg,
  currentLoadKg: h.currentLoadKg,
  farmersConnected: h.farmersConnected,
  status: h.status,
  specialty: h.specialty,
}));

// Real-time Produce Store (Empty initially; populated when farmers list produce)
export const mockProducts = [];

export const mockOrders = [
  {
    _id: 'ord_01',
    orderNumber: 'ORD-SAU-9102',
    buyer: mockUsers[3],
    farmer: mockUsers[1],
    items: [{ name: 'Saurashtra Bhalia Wheat (2 Quintal)', quantity: 2, unitPrice: 520, totalPrice: 1040 }],
    totalAmount: 1040,
    founderCommissionRate: 5,
    founderCommissionAmount: 52,
    netFarmerAmount: 988,
    escrowStatus: 'held_in_escrow',
    orderStatus: 'transit_to_hub',
    taluka: 'Talala, Junagadh',
  },
  {
    _id: 'ord_02',
    orderNumber: 'ORD-SAU-8421',
    buyer: mockUsers[3],
    farmer: mockUsers[0],
    items: [{ name: 'Gondal Red Chillies', quantity: 5, unitPrice: 240, totalPrice: 1200 }],
    totalAmount: 1200,
    founderCommissionRate: 5,
    founderCommissionAmount: 60,
    netFarmerAmount: 1140,
    escrowStatus: 'held_in_escrow',
    orderStatus: 'pooled_in_taluka',
    taluka: 'Gondal, Rajkot',
  },
];

export const mockTransparencies = {
  prod_01: {
    batchNumber: 'BATCH-WHEAT-2026',
    productName: 'Saurashtra Bhalia Sharbati Wheat',
    farmerName: 'Pravinbhai Vala',
    farmerTaluka: 'Talala, Junagadh (Gir Agro Hub)',
    harvestDate: 'Harvested 2 days ago',
    soilType: 'Rich Black Alluvial Soil (pH 7.2)',
    waterSource: 'Solar Powered Drip Irrigation & Rainfed Farm',
    isOrganicCertified: true,
    fertilizersUsed: [
      { name: 'Cow Manure & Gir Cow Panchamrit', type: 'Organic Compost' },
      { name: 'Jeevamrutha Bio-culture', type: 'Bio-fertilizer' },
    ],
    pesticideRecord: '100% Zero Synthetic Pesticides. Traditional neem decoction and agniastra.',
    coldChainTracking: [
      { checkpoint: 'Talala APMC Clean Grain Silo', temperatureCelsius: 22.0 },
      { checkpoint: 'Saurashtra Central Agro Logistics Hub', temperatureCelsius: 21.0 },
    ],
    farmLocationCoordinates: { latitude: 21.0500, longitude: 70.5200 },
    freshnessGuarantee: 'Cleaned, graded, moisture tested (<10%), zero foreign matter.',
  },
};
