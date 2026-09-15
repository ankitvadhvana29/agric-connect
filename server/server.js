import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import errorHandler from './middleware/errorHandler.js';

// Route Imports - Separate part for all 12 features (Feature 11)
import authRoutes from './routes/authRoutes.js';
import weatherRoutes from './routes/weatherRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import distributionRoutes from './routes/distributionRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import kycRoutes from './routes/kycRoutes.js';
import productRoutes from './routes/productRoutes.js';
import transparencyRoutes from './routes/transparencyRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Global Middleware
app.use(cors({
  origin: '*', // Allow Vite frontend connections
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Feature 10: Serve produce and farm images statically so consumer can view them
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Health Check & Root Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'AgriConnect Backend API',
    version: '1.0.0 - SIH 2026',
    timestamp: new Date().toISOString(),
    featuresActive: [
      '1. Weather prediction & agricultural advisories',
      '2. UPI payment & Escrow hold/release',
      '3. Taluka based distribution centre & pooled logistics',
      '4. Kisan AI Chatbot for agricultural current affairs, MSP & weather',
      '5. Subscription & 5% founder commission ledger',
      '6. ID card verified (Aadhaar KYC & Trust score)',
      '7. Farm-to-Fork transparency for agricultural crops & commodities',
      '8. Multiple languages (EN, HI, MR, GU)',
      '9. Rural friendly lightweight JSON payloads',
      '10. Customer visible produce image gallery',
      '11. Clean modular structure for all features',
      '12. Login portal with role authorization & mobile OTP'
    ],
  });
});

// API Routes Mounting
app.use('/api/auth', authRoutes);                   // Feature 12: Login portal
app.use('/api/weather', weatherRoutes);             // Feature 1: Weather prediction
app.use('/api/payment', paymentRoutes);             // Feature 2: UPI payment
app.use('/api/distribution', distributionRoutes);   // Feature 3: Taluka distribution
app.use('/api/ai', aiRoutes);                       // Feature 4: Kisan AI Chatbot (Weather & Current Affairs)
app.use('/api/subscription', subscriptionRoutes);   // Feature 5: Subscription & 5% commission
app.use('/api/kyc', kycRoutes);                     // Feature 6: Aadhaar KYC
app.use('/api/transparency', transparencyRoutes);   // Feature 7: Farm-to-Fork transparency
app.use('/api/products', productRoutes);             // Feature 10: Produce catalog & images
app.use('/api/orders', orderRoutes);                 // Orders & Pooled dispatch

// Error Handling Middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` AgriConnect Backend running on http://localhost:${PORT}`);
  console.log(` API Health Check: http://localhost:${PORT}/api/health`);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`====================================================`);
});

export default app;
