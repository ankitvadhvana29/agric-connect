import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import User from '../models/User.js';
import DistributionHub from '../models/DistributionHub.js';
import Product from '../models/Product.js';
import Transparency from '../models/Transparency.js';
import Commission from '../models/Commission.js';
import { DEFAULT_TALUKAS } from '../config/constants.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedDatabase = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/agriconnect';
    console.log(`Connecting to MongoDB at: ${mongoURI}...`);
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB. Starting database seed...');

    // 1. Clear old data
    await User.deleteMany({});
    await DistributionHub.deleteMany({});
    await Product.deleteMany({});
    await Transparency.deleteMany({});
    await Commission.deleteMany({});
    console.log('Cleared existing database records.');

    // 2. Seed Taluka Distribution Hubs (Feature 3)
    const createdHubs = await DistributionHub.insertMany(
      DEFAULT_TALUKAS.map((hub) => ({
        hubCode: hub.talukaId,
        name: hub.name,
        taluka: hub.taluka,
        district: hub.district,
        state: hub.state,
        location: { latitude: hub.latitude, longitude: hub.longitude },
        capacityKg: hub.capacityKg,
        currentLoadKg: hub.currentLoadKg,
        farmersConnected: hub.farmersConnected,
        status: hub.status,
      }))
    );
    console.log(`Seeded ${createdHubs.length} Taluka Distribution Hubs.`);

    // 3. Seed Users (Farmers & Consumers) (Feature 6, 12)
    const farmer1 = await User.create({
      fullName: 'Ramesh Patil',
      phone: '9822012345',
      email: 'ramesh.patil@agriconnect.in',
      password: 'password123',
      role: 'farmer',
      taluka: 'Nashik',
      district: 'Nashik',
      state: 'Maharashtra',
      kycStatus: 'verified',
      aadhaarMasked: 'XXXX-XXXX-1234',
      trustScore: 92,
      subscriptionPlan: 'farmer_pro',
      subscriptionValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    const farmer2 = await User.create({
      fullName: 'Suresh Kumar',
      phone: '9822054321',
      email: 'suresh.kumar@agriconnect.in',
      password: 'password123',
      role: 'farmer',
      taluka: 'Pune Rural',
      district: 'Pune',
      state: 'Maharashtra',
      kycStatus: 'verified',
      aadhaarMasked: 'XXXX-XXXX-5678',
      trustScore: 88,
      subscriptionPlan: 'free', // non-subscribed farmer subject to 5% commission
    });

    const farmer3 = await User.create({
      fullName: 'Anita Desai',
      phone: '9822098765',
      email: 'anita.desai@agriconnect.in',
      password: 'password123',
      role: 'farmer',
      taluka: 'Ratnagiri',
      district: 'Ratnagiri',
      state: 'Maharashtra',
      kycStatus: 'verified',
      aadhaarMasked: 'XXXX-XXXX-9012',
      trustScore: 96,
      subscriptionPlan: 'farmer_pro',
      subscriptionValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    const consumer1 = await User.create({
      fullName: 'Rajesh Sharma',
      phone: '9811122233',
      email: 'rajesh.sharma@gmail.com',
      password: 'password123',
      role: 'consumer',
      taluka: 'Nashik',
      district: 'Nashik',
      state: 'Maharashtra',
      kycStatus: 'verified',
      aadhaarMasked: 'XXXX-XXXX-4321',
      trustScore: 85,
      subscriptionPlan: 'consumer_pass',
    });

    const adminUser = await User.create({
      fullName: 'Founder / Platform Admin',
      phone: '9999900000',
      email: 'admin@agriconnect.in',
      password: 'adminpassword123',
      role: 'admin',
      taluka: 'Nashik',
      district: 'Nashik',
      state: 'Maharashtra',
      kycStatus: 'verified',
      aadhaarMasked: 'XXXX-XXXX-0000',
      trustScore: 100,
    });
    console.log('Seeded Users (Farmers, Consumers, Admin).');

    // 4. Seed Products with Consumer-visible Photos (Feature 7, 10)
    const product1 = await Product.create({
      farmer: farmer1._id,
      hub: createdHubs[0]._id,
      name: 'Saurashtra Bold Groundnuts (સૌરાષ્ટ્ર મગફળી)',
      category: 'Oilseeds',
      variety: 'GG-20 Saurashtra Bold',
      price: 75,
      unit: 'kg',
      availableQuantity: 1500,
      locationTaluka: 'Nashik Taluka',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&q=80&w=600',
          caption: 'Harvested bold high-oil groundnuts',
          isPrimary: true,
        },
      ],
      aiGrading: {
        scannedAt: new Date(),
        detectedCrop: 'Groundnuts (GG-20)',
        qualityGrade: 'Grade A',
        confidenceScore: '94%',
        suggestedPriceRange: { min: 70, max: 82 },
        marketTrend: '+4% steady demand',
      },
      isVerified: true,
    });

    const product2 = await Product.create({
      farmer: farmer2._id,
      hub: createdHubs[1]._id,
      name: 'Gondal Resham Patti Red Chillies (ગોંડલ મરચા)',
      category: 'Spices',
      variety: 'Resham Patti Special',
      price: 240,
      unit: 'kg',
      availableQuantity: 800,
      locationTaluka: 'Pune Taluka',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&q=80&w=600',
          caption: 'Pure sun-dried Gondal chillies',
          isPrimary: true,
        },
      ],
      aiGrading: {
        scannedAt: new Date(),
        detectedCrop: 'Red Chillies',
        qualityGrade: 'Grade A',
        confidenceScore: '95%',
        suggestedPriceRange: { min: 220, max: 260 },
        marketTrend: '+8% high mandi rate',
      },
      isVerified: true,
    });

    const product3 = await Product.create({
      farmer: farmer3._id,
      hub: createdHubs[2]._id,
      name: 'Organic Cumin Seeds (જીરું / Jeera)',
      category: 'Spices',
      variety: 'Gujarat Cumin-4',
      price: 380,
      unit: 'kg',
      availableQuantity: 400,
      locationTaluka: 'Ratnagiri Taluka',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=600',
          caption: 'Naturally dried aromatic cumin seeds',
          isPrimary: true,
        },
      ],
      aiGrading: {
        scannedAt: new Date(),
        detectedCrop: 'Cumin Seeds',
        qualityGrade: 'Grade A',
        confidenceScore: '97%',
        suggestedPriceRange: { min: 360, max: 420 },
        marketTrend: '+10% export demand',
      },
      isVerified: true,
    });
    console.log('Seeded Marketplace Produce with AI Grades and Photos.');

    // 5. Seed Transparency Passport (Feature 7)
    await Transparency.create({
      product: product1._id,
      farmer: farmer1._id,
      batchNumber: 'BATCH-TOM-7801',
      harvestDate: new Date(Date.now() - 18 * 60 * 60 * 1000), // 18 hrs ago
      soilType: 'Black Alluvial Soil (Organic carbon 0.75%)',
      waterSource: 'Deep Borewell Solar Drip Irrigation',
      isOrganicCertified: true,
      fertilizersUsed: [
        { name: 'Cow Manure & Vermicompost', type: 'Vermicompost', appliedDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000) },
        { name: 'Trichoderma Bio-fungicide', type: 'Bio-fertilizer', appliedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
      ],
      pesticideRecord: 'Zero synthetic chemical pesticides. Certified residual chemical free.',
      coldChainTracking: [
        { checkpoint: 'Nashik Farm Gate Cold Hub', temperatureCelsius: 12.0, timestamp: new Date() },
      ],
      farmLocationCoordinates: { latitude: 19.9975, longitude: 73.7898 },
    });
    console.log('Seeded Farm-to-Fork Transparency Passport.');

    console.log('===================================================');
    console.log(' Seed completed successfully!');
    console.log(' Test Farmer Login:');
    console.log('   Phone: 9822012345 | Password: password123');
    console.log(' Test Consumer Login:');
    console.log('   Phone: 9811122233 | Password: password123');
    console.log(' Test Admin Login:');
    console.log('   Phone: 9999900000 | Password: adminpassword123');
    console.log('===================================================');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seed Error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
