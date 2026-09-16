import React, { useState, useEffect } from 'react';
import {
  Leaf, CreditCard, ShoppingCart, Globe, PlusCircle, CheckCircle2, ShieldCheck, ArrowRight, Bot
} from 'lucide-react';
import './app.css';

// Translations
import translations from './utils/translations';
import api from './services/api';

// Modular Feature Components
import Navbar from './components/Navbar';
import WeatherWidget from './components/WeatherWidget';
import AIChatbot from './components/AIChatbot';
import LogisticsTracker from './components/LogisticsTracker';
import KYCPortal from './components/KYCPortal';
import Marketplace from './components/Marketplace';
import TransparencyModal from './components/TransparencyModal';
import UPIPaymentModal from './components/UPIPaymentModal';
import LoginPage from './components/LoginPage';
import FarmerSellModal from './components/FarmerSellModal';

// Load custom products from localStorage on startup
function loadCustomProducts() {
  try {
    const stored = localStorage.getItem('agriconnect_custom_products');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [lang, setLang] = useState('en');

  // User State
  const [currentUser, setCurrentUser] = useState(() => api.getCurrentUser());

  // Farmer-listed products persisted in localStorage
  const [customProducts, setCustomProducts] = useState(() => loadCustomProducts());

  // Modals state
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({ amount: 650, note: 'AgriConnect Saurashtra Produce Order', quantity: 1 });
  const [isTransparencyOpen, setIsTransparencyOpen] = useState(false);
  const [transparencyProduct, setTransparencyProduct] = useState({ id: 'prod_02', name: 'Gondal Resham Patti Red Chillies' });
  const [isFarmerSellOpen, setIsFarmerSellOpen] = useState(false);
  const [isFloatingChatOpen, setIsFloatingChatOpen] = useState(false);

  const t = translations[lang] || translations.en;

  // Sync current user
  useEffect(() => {
    const user = api.getCurrentUser();
    if (user) setCurrentUser(user);
  }, []);

  const handleOpenPayment = (amount = 650, note = 'AgriConnect Saurashtra Produce Order') => {
    setPaymentDetails({ amount, note, quantity: 1 });
    setIsPaymentOpen(true);
  };

  // Accepts product + quantity, computes total
  const handleOpenPaymentWithProduct = (product, quantity = 1) => {
    const qty = Math.max(1, parseInt(quantity) || 1);
    setPaymentDetails({
      amount: product.price * qty,
      note: `Order: ${product.name} × ${qty} ${product.unit || 'kg'} from ${product.farmer?.fullName || 'Farmer'} (${product.locationTaluka || 'Saurashtra'})`,
      quantity: qty,
    });
    setIsPaymentOpen(true);
  };

  const handleOpenTransparency = (productId, productName) => {
    setTransparencyProduct({ id: productId, name: productName });
    setIsTransparencyOpen(true);
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
  };

  // Guard: only farmers can open sell modal; non-logged-in users go to login page
  const handleOpenFarmerSell = () => {
    if (!currentUser) {
      setCurrentView('login');
      return;
    }
    if (currentUser.role === 'consumer') {
      // Consumer sees a blocked message in FarmerSellModal — still open it so they see the message
      setIsFarmerSellOpen(true);
      return;
    }
    setIsFarmerSellOpen(true);
  };

  const handleProductCreated = (newProduct) => {
    setCustomProducts((prev) => {
      const updated = [newProduct, ...prev];
      // Persist to localStorage so products survive page refresh
      try {
        localStorage.setItem('agriconnect_custom_products', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await api.deleteProduct(productId);
    } catch {}
    setCustomProducts((prev) => {
      const updated = prev.filter((p) => (p._id || p.id) !== productId);
      try {
        localStorage.setItem('agriconnect_custom_products', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Login success handler — navigate back to dashboard
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setCurrentView('dashboard');
  };

  // Open login page
  const handleOpenLogin = () => {
    setCurrentView('login');
  };

  return (
    <div className="app-container">
      {/* Navbar */}
      <Navbar
        currentView={currentView}
        setView={setCurrentView}
        lang={lang}
        setLang={setLang}
        t={t}
        currentUser={currentUser}
        onOpenLogin={handleOpenLogin}
        onLogout={handleLogout}
        onOpenFarmerSell={handleOpenFarmerSell}
      />

      {/* Main App Content */}
      <main className="main-content">

        {/* ================= VIEW: LOGIN PAGE ================= */}
        {currentView === 'login' && (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onBack={() => setCurrentView('dashboard')}
            t={t}
          />
        )}

        {/* ================= VIEW 1: DASHBOARD ================= */}
        {currentView === 'dashboard' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#111827' }}>
                  {currentUser
                    ? `${t.welcome}, ${currentUser.fullName} (${currentUser.role === 'farmer' ? t.farmer : t.consumer})`
                    : `${t.welcome} to ${t.appName} (Saurashtra Direct Agri)`}
                </h1>
                <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>{t.tagline}</p>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                {/* Direct Sell Produce Action (Farmers Only - Hidden for Consumers) */}
                {currentUser?.role !== 'consumer' && (
                  <button
                    onClick={handleOpenFarmerSell}
                    className="login-btn"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: '#15803d',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }}
                  >
                    <PlusCircle size={16} /> 🌾 Sell Produce (ખેડૂત વેચાણ)
                  </button>
                )}

                <button
                  onClick={() => handleOpenPayment(650, 'Escrow Order #ORD-SAU-9102')}
                  className="login-btn"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#2563eb' }}
                >
                  <CreditCard size={16} /> {t.testPayment}
                </button>
              </div>
            </div>

            {/* Responsive Dashboard Grid */}
            <div className="dashboard-grid">
              {/* Left Column */}
              <div className="dashboard-col">
                {/* Feature 1: Weather Prediction & Agricultural Advisory (Saurashtra) */}
                <WeatherWidget t={t} />

                {/* Feature 4: Kisan AI Chatbot (Current Affairs & Weather) */}
                <AIChatbot
                  t={t}
                  lang={lang}
                  setLang={setLang}
                  selectedTaluka={currentUser?.taluka || 'Gondal'}
                />

                {/* Recent Escrow Orders Card */}
                <div className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 className="card-title" style={{ margin: 0 }}>
                      <ShoppingCart size={18} /> Saurashtra Mandi Orders & Escrow
                    </h3>
                    <span style={{ fontSize: '0.75rem', background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
                      Escrow Protected
                    </span>
                  </div>

                  <div className="list-item">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ width: '40px', height: '40px', backgroundColor: '#fef3c7', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px' }}>
                        <span style={{ fontSize: '1.2rem' }}>🌾</span>
                      </div>
                      <div>
                        <p style={{ fontWeight: '600', color: '#111827' }}>Saurashtra Bhalia Wheat (2 Bags)</p>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          Order #ORD-SAU-9102 • Talala Agro Hub
                        </p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontWeight: 'bold', color: 'var(--primary-green)', display: 'block' }}>₹1,040.00</span>
                      <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: '500' }}>✓ In Transit</span>
                    </div>
                  </div>

                  <div className="list-item">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ width: '40px', height: '40px', backgroundColor: '#fee2e2', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px' }}>
                        <span style={{ fontSize: '1.2rem' }}>🌶️</span>
                      </div>
                      <div>
                        <p style={{ fontWeight: '600', color: '#111827' }}>Gondal Resham Patti Chillies (5kg)</p>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          Order #ORD-SAU-8421 • Gondal APMC Hub
                        </p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontWeight: 'bold', color: 'var(--primary-green)', display: 'block' }}>₹1,200.00</span>
                      <span style={{ fontSize: '0.7rem', color: '#2563eb', fontWeight: '500' }}>● Escrow Held</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="dashboard-col">
                {currentUser?.role === 'consumer' ? (
                  /* Consumer Portal Card */
                  <div
                    className="card"
                    style={{
                      background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                      border: '1px solid #bfdbfe',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <h3 className="card-title" style={{ margin: 0, color: '#1e40af' }}>
                        <ShoppingCart size={20} /> Consumer Direct Mandi
                      </h3>
                      <span style={{ fontSize: '0.7rem', background: '#2563eb', color: 'white', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
                        Farm to Fork
                      </span>
                    </div>

                    <p style={{ fontSize: '0.85rem', color: '#1e3a8a', lineHeight: '1.4', marginBottom: '1rem' }}>
                      Buy authentic, AGMARK tested agricultural produce directly from verified Saurashtra farmers without intermediate markups.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '1rem', fontSize: '0.8rem', color: '#1e3a8a' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CheckCircle2 size={14} style={{ color: '#2563eb' }} />
                        <span>100% Escrow Protected: Funds released only after delivery</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CheckCircle2 size={14} style={{ color: '#2563eb' }} />
                        <span>Gondal & Saurashtra APMC Mandi benchmark prices</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CheckCircle2 size={14} style={{ color: '#2563eb' }} />
                        <span>Zero-waste pooled logistics from nearest APMC hub</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setCurrentView('marketplace')}
                      className="scan-btn"
                      style={{
                        width: '100%', backgroundColor: '#2563eb',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        gap: '8px', padding: '10px', fontSize: '0.9rem',
                      }}
                    >
                      <span>🛒 Browse Fresh Produce (ખરીદી કરો)</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                ) : (
                  /* Farmer Direct Sell Portal Card */
                  <div
                    className="card"
                    style={{
                      background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                      border: '1px solid #86efac',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <h3 className="card-title" style={{ margin: 0, color: '#166534' }}>
                        <PlusCircle size={20} /> Farmer Direct Sell Portal
                      </h3>
                      <span style={{ fontSize: '0.7rem', background: '#16a34a', color: 'white', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
                        Mandi Verified
                      </span>
                    </div>

                    <p style={{ fontSize: '0.85rem', color: '#166534', lineHeight: '1.4', marginBottom: '1rem' }}>
                      Are you a Saurashtra farmer? Sell your produce directly to consumers across Rajkot, Gondal, Junagadh, Bhavnagar, and Amreli.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '1rem', fontSize: '0.8rem', color: '#14532d' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CheckCircle2 size={14} style={{ color: '#16a34a' }} />
                        <span>Direct APMC Mandi Benchmark Pricing</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CheckCircle2 size={14} style={{ color: '#16a34a' }} />
                        <span>Instant UPI Escrow release upon delivery</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CheckCircle2 size={14} style={{ color: '#16a34a' }} />
                        <span>Free pickup from your local Taluka Distribution Hub</span>
                      </div>
                    </div>

                    <button
                      onClick={handleOpenFarmerSell}
                      className="scan-btn"
                      style={{
                        width: '100%', backgroundColor: '#15803d',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        gap: '8px', padding: '10px', fontSize: '0.9rem',
                      }}
                    >
                      <span>🌾 List Your Produce for Sale</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= VIEW 2: MARKETPLACE ================= */}
        {currentView === 'marketplace' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#111827' }}>
                  {t.directMarketplace} (સૌરાષ્ટ્ર મંડી)
                </h1>
                <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                  Direct harvest from farmers in Gondal, Talala Gir, Mahuva, Amreli & Jamnagar
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#15803d', background: '#f0fdf4', padding: '6px 12px', borderRadius: '20px', border: '1px solid #bbf7d0', fontSize: '0.85rem', fontWeight: '500' }}>
                <Globe size={16} />
                <span>Direct Mandi Network • 100% Escrow Protected</span>
              </div>
            </div>

            <Marketplace
              t={t}
              currentUser={currentUser}
              onOpenTransparency={handleOpenTransparency}
              onOpenPaymentWithProduct={handleOpenPaymentWithProduct}
              onOpenFarmerSell={handleOpenFarmerSell}
              selectedTaluka={currentUser?.taluka || 'Gondal'}
              customProducts={customProducts}
              onOpenLogin={handleOpenLogin}
              onDeleteProduct={handleDeleteProduct}
            />
          </div>
        )}

        {/* ================= VIEW 3: KISAN AI CHATBOT ================= */}
        {currentView === 'ai-chatbot' && (
          <div style={{ maxWidth: '840px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.25rem' }}>
                🤖 {t.aiChatbot || 'Kisan AI Assistant'}
              </h1>
              <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                {t.chatSubtitle || 'Agricultural Current Affairs, 2026 MSP Rates & Real-Time Weather Advisories'}
              </p>
            </div>
            <AIChatbot
              t={t}
              lang={lang}
              setLang={setLang}
              selectedTaluka={currentUser?.taluka || 'Gondal'}
            />
          </div>
        )}

        {/* ================= VIEW 4: TALUKA DISTRIBUTION ================= */}
        {currentView === 'logistics' && (
          <div style={{ maxWidth: '680px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>
              {t.talukaHubs} (Saurashtra APMC Network)
            </h1>
            <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Regional distribution centers across Rajkot, Junagadh, Bhavnagar, Amreli, Jamnagar, and Morbi.
            </p>
            <LogisticsTracker t={t} />
          </div>
        )}

        {/* ================= VIEW 5: AADHAAR KYC ================= */}
        {currentView === 'kyc' && (
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>
              Identity & Trust (Aadhaar KYC)
            </h1>
            <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Build verified trust scores with UIDAI Verhoeff mathematical algorithm validation.
            </p>
            <KYCPortal
              t={t}
              currentUser={currentUser}
              onKycVerified={(kyc) => {
                const updated = { ...currentUser, kycStatus: 'verified', aadhaarMasked: kyc.maskedId, trustScore: kyc.trustScore };
                setCurrentUser(updated);
                localStorage.setItem('agriconnect_user', JSON.stringify(updated));
              }}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <Leaf size={16} style={{ color: 'var(--primary-green)' }} />
          AgriConnect &copy; 2026. Empowering Saurashtra farmers, feeding communities directly.
        </p>
      </footer>

      {/* Modals */}
      <FarmerSellModal
        isOpen={isFarmerSellOpen}
        onClose={() => setIsFarmerSellOpen(false)}
        onProductCreated={handleProductCreated}
        currentUser={currentUser}
        t={t}
      />

      <UPIPaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        amount={paymentDetails.amount}
        note={paymentDetails.note}
        t={t}
      />

      <TransparencyModal
        isOpen={isTransparencyOpen}
        onClose={() => setIsTransparencyOpen(false)}
        productId={transparencyProduct.id}
        productName={transparencyProduct.name}
        t={t}
      />

      {/* Floating Kisan AI Assistant */}
      {currentView !== 'login' && (
        <div className="floating-ai-launcher">
          {isFloatingChatOpen && (
            <div className="floating-ai-popup">
              <AIChatbot
                t={t}
                lang={lang}
                setLang={setLang}
                selectedTaluka={currentUser?.taluka || 'Gondal'}
                isFloating={true}
                onClose={() => setIsFloatingChatOpen(false)}
              />
            </div>
          )}
          <button
            onClick={() => setIsFloatingChatOpen(!isFloatingChatOpen)}
            className="floating-ai-fab"
            title="Open Kisan AI Assistant (Weather & Current Affairs)"
          >
            <Bot size={22} />
            <span className="fab-label">Ask AI</span>
          </button>
        </div>
      )}
    </div>
  );
}
