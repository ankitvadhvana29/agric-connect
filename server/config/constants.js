/**
 * System-wide constants for AgriConnect Platform
 * Configured for Saurashtra (Gujarat) Agricultural Network
 */

export const USER_ROLES = {
  FARMER: 'farmer',
  CONSUMER: 'consumer',
  HUB_MANAGER: 'hub_manager',
  ADMIN: 'admin'
};

export const KYC_STATUS = {
  UNVERIFIED: 'unverified',
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected'
};

export const ORDER_STATUS = {
  PLACED: 'placed',
  POOLED_IN_TALUKA: 'pooled_in_taluka',
  TRANSIT_TO_HUB: 'transit_to_hub',
  READY_AT_HUB: 'ready_at_hub',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

export const ESCROW_STATUS = {
  PENDING_PAYMENT: 'pending_payment',
  HELD_IN_ESCROW: 'held_in_escrow',
  RELEASED_TO_FARMER: 'released_to_farmer',
  REFUNDED: 'refunded'
};

export const DEFAULT_FOUNDER_COMMISSION_PERCENT = 5; // 5% for founders

export const SUBSCRIPTION_PLANS = {
  FREE: {
    id: 'free',
    name: 'Standard Free',
    price: 0,
    features: ['Full Marketplace Access', 'Standard Logistics', 'Direct Mandi Benchmarking']
  },
  FARMER_PRO: {
    id: 'farmer_pro',
    name: 'Farmer Pro Pass',
    price: 99,
    features: ['Unlimited AI Crop Health Scans', 'Priority Taluka Hub Logistics', 'Direct Mandi Analytics', 'Priority Hub Ingestion']
  },
  CONSUMER_PASS: {
    id: 'consumer_pass',
    name: 'Consumer Prime Pass',
    price: 199,
    features: ['Free Taluka Delivery', 'Complete Farm Transparency Access', 'Early Fresh Harvest Alert', 'Direct Producer Video Calls']
  }
};

/**
 * Saurashtra (Gujarat) Distribution Hubs & APMC Centres
 */
export const DEFAULT_TALUKAS = [
  {
    talukaId: 'SAU-RAJ-01',
    name: 'Gondal APMC & Logistics Hub',
    taluka: 'Gondal',
    district: 'Rajkot',
    state: 'Gujarat',
    latitude: 21.9619,
    longitude: 70.7923,
    status: 'Active',
    capacityKg: 80000,
    currentLoadKg: 42000,
    farmersConnected: 120,
    specialty: 'Groundnut, Red Chillies, Garlic'
  },
  {
    talukaId: 'SAU-JUN-02',
    name: 'Talala - Gir Kesar Mango Hub',
    taluka: 'Talala / Gir Somnath',
    district: 'Junagadh',
    state: 'Gujarat',
    latitude: 21.0500,
    longitude: 70.5200,
    status: 'Active',
    capacityKg: 65000,
    currentLoadKg: 28000,
    farmersConnected: 95,
    specialty: 'GI Gir Kesar Mangoes, Sugarcane'
  },
  {
    talukaId: 'SAU-BHV-03',
    name: 'Mahuva Onion & Dehydration Hub',
    taluka: 'Mahuva',
    district: 'Bhavnagar',
    state: 'Gujarat',
    latitude: 21.0914,
    longitude: 71.7633,
    status: 'Active',
    capacityKg: 75000,
    currentLoadKg: 36000,
    farmersConnected: 85,
    specialty: 'White Onions, Dehydrated Garlic'
  },
  {
    talukaId: 'SAU-AMR-04',
    name: 'Amreli Agro Logistic Centre',
    taluka: 'Amreli',
    district: 'Amreli',
    state: 'Gujarat',
    latitude: 21.6032,
    longitude: 71.2221,
    status: 'Active',
    capacityKg: 50000,
    currentLoadKg: 21000,
    farmersConnected: 64,
    specialty: 'Cotton, Sesame (Til), Bajra'
  },
  {
    talukaId: 'SAU-JAM-05',
    name: 'Jamnagar Spices & Grain Centre',
    taluka: 'Jamnagar Rural',
    district: 'Jamnagar',
    state: 'Gujarat',
    latitude: 22.4707,
    longitude: 70.0577,
    status: 'Active',
    capacityKg: 45000,
    currentLoadKg: 16000,
    farmersConnected: 52,
    specialty: 'Coriander, Cumin (Jeera), Wheat'
  },
  {
    talukaId: 'SAU-MOR-06',
    name: 'Morbi Agro Distribution Centre',
    taluka: 'Morbi',
    district: 'Morbi',
    state: 'Gujarat',
    latitude: 22.8173,
    longitude: 70.8370,
    status: 'Active',
    capacityKg: 40000,
    currentLoadKg: 14500,
    farmersConnected: 48,
    specialty: 'Cotton, Castor, Vegetables'
  }
];
