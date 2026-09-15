import React from 'react';
import {
  Leaf, LayoutDashboard, ShoppingCart, Bot,
  Truck, UserCheck, LogIn, LogOut, Globe, ShieldCheck, PlusCircle
} from 'lucide-react';

export default function Navbar({
  currentView,
  setView,
  lang,
  setLang,
  t,
  currentUser,
  onOpenLogin,
  onLogout,
  onOpenFarmerSell
}) {
  const navItems = [
    { id: 'dashboard', label: t.dashboard, icon: <LayoutDashboard size={18} /> },
    { id: 'marketplace', label: t.marketplace, icon: <ShoppingCart size={18} /> },
    { id: 'ai-chatbot', label: t.aiChatbot || 'AI Assistant', icon: <Bot size={18} /> },
    { id: 'logistics', label: t.logistics, icon: <Truck size={18} /> },
    { id: 'kyc', label: t.kyc, icon: <UserCheck size={18} /> },
  ];

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Brand */}
        <div className="nav-brand" onClick={() => setView('dashboard')} style={{ cursor: 'pointer' }}>
          <Leaf size={28} />
          <div>
            <span>{t.appName}</span>
            <div style={{ fontSize: '0.65rem', color: '#16a34a', fontWeight: 'bold', letterSpacing: '0.5px' }}>
              SAURASHTRA AGRI • SIH 2026
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="nav-links">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`nav-btn ${currentView === item.id ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}

          {/* Direct Sell Produce Button (Hidden for Consumers) */}
          {currentUser?.role !== 'consumer' && (
            <button
              onClick={onOpenFarmerSell}
              className="nav-btn"
              style={{
                background: '#f0fdf4',
                color: '#15803d',
                border: '1px solid #86efac',
                fontWeight: '600',
                padding: '0.45rem 0.75rem',
              }}
              title="List Produce for Sale (Farmers)"
            >
              <PlusCircle size={16} />
              <span>🌾 {t.sellProduce || 'Sell Produce'}</span>
            </button>
          )}

          {/* Language Switcher (Feature 8) */}
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: '0.25rem' }}>
            <Globe size={16} style={{ color: '#4b5563', marginRight: '4px' }} />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="lang-select"
              title="Select Regional Language"
            >
              <option value="en">English</option>
              <option value="gu">ગુજરાતી (Gujarati)</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="mr">मराठी (Marathi)</option>
            </select>
          </div>

          {/* User Auth Portal Status (Feature 12) */}
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '0.5rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                }}
              >
                {currentUser.kycStatus === 'verified' ? (
                  <ShieldCheck size={14} style={{ color: '#16a34a', marginRight: '4px' }} />
                ) : (
                  <UserCheck size={14} style={{ color: '#6b7280', marginRight: '4px' }} />
                )}
                <span style={{ fontWeight: '600', color: '#166534' }}>
                  {currentUser.fullName?.split(' ')[0]}
                </span>
                <span style={{ fontSize: '0.7rem', color: '#15803d', marginLeft: '4px' }}>
                  ({currentUser.role})
                </span>
              </div>
              <button
                onClick={onLogout}
                className="nav-btn"
                title={t.logout}
                style={{ color: '#dc2626', padding: '6px' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button onClick={onOpenLogin} className="login-btn">
              <LogIn size={16} style={{ marginRight: '6px' }} />
              {t.login}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
