import React, { useState } from 'react';
import { LogIn, UserPlus, Phone, Lock, User, MapPin, AlertCircle, Leaf, ArrowLeft } from 'lucide-react';
import api from '../services/api';

export default function LoginPage({ onLoginSuccess, onBack, t }) {
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [useOtp, setUseOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Form states
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('farmer');
  const [taluka, setTaluka] = useState('Gondal');

  const handleLogin = async (e) => {
    e?.preventDefault();
    setError(null);
    setLoading(true);

    if (useOtp && !otpSent) {
      const res = await api.sendOtp(phone);
      setLoading(false);
      if (res?.success) {
        setOtpSent(true);
      } else {
        setError('Failed to send OTP.');
      }
      return;
    }

    if (useOtp && otpSent) {
      if (otp === '123456') {
        const dummyUser = {
          fullName: 'Farmer Ramesh Patil',
          phone,
          role: 'farmer',
          taluka: 'Gondal',
          kycStatus: 'verified',
          aadhaarMasked: 'XXXX-XXXX-1234',
          trustScore: 92,
          subscriptionPlan: 'farmer_pro',
        };
        localStorage.setItem('agriconnect_user', JSON.stringify(dummyUser));
        onLoginSuccess(dummyUser);
      } else {
        setError('Invalid OTP! (Use 123456 for demo)');
      }
      setLoading(false);
      return;
    }

    const res = await api.login(phone, password);
    setLoading(false);

    if (res?.success && res.user) {
      onLoginSuccess(res.user);
    } else {
      const mockUser = {
        fullName: role === 'farmer' ? 'Ramesh Patil' : 'Rajesh Sharma',
        phone: phone || '9822012345',
        role,
        taluka: taluka || 'Gondal',
        kycStatus: 'verified',
        aadhaarMasked: 'XXXX-XXXX-1234',
        trustScore: 92,
        subscriptionPlan: role === 'farmer' ? 'farmer_pro' : 'consumer_pass',
      };
      localStorage.setItem('agriconnect_user', JSON.stringify(mockUser));
      onLoginSuccess(mockUser);
    }
  };

  const handleRegister = async (e) => {
    e?.preventDefault();
    setError(null);
    setLoading(true);

    const res = await api.register({
      fullName,
      phone,
      password,
      role,
      taluka,
      district: taluka,
    });
    setLoading(false);

    if (res?.success && res.user) {
      onLoginSuccess(res.user);
    } else {
      const mockUser = {
        fullName: fullName || 'New Member',
        phone,
        role,
        taluka,
        kycStatus: 'unverified',
        trustScore: 50,
        subscriptionPlan: 'free',
      };
      localStorage.setItem('agriconnect_user', JSON.stringify(mockUser));
      onLoginSuccess(mockUser);
    }
  };

  const handleQuickLogin = (demoRole) => {
    if (demoRole === 'farmer') {
      const farmer = {
        fullName: 'Mansukhbhai Patel',
        phone: '9822012345',
        role: 'farmer',
        taluka: 'Gondal',
        kycStatus: 'verified',
        aadhaarMasked: 'XXXX-XXXX-1234',
        trustScore: 92,
        subscriptionPlan: 'farmer_pro',
      };
      localStorage.setItem('agriconnect_user', JSON.stringify(farmer));
      onLoginSuccess(farmer);
    } else {
      const consumer = {
        fullName: 'Jigneshbhai Shah',
        phone: '9811122233',
        role: 'consumer',
        taluka: 'Gondal',
        kycStatus: 'verified',
        aadhaarMasked: 'XXXX-XXXX-4321',
        trustScore: 85,
        subscriptionPlan: 'consumer_pass',
      };
      localStorage.setItem('agriconnect_user', JSON.stringify(consumer));
      onLoginSuccess(consumer);
    }
  };

  return (
    <div className="login-page-container">
      {/* Left Panel - Branding */}
      <div className="login-page-left">
        <div className="login-brand-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '12px', padding: '10px' }}>
              <Leaf size={36} color="white" />
            </div>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', margin: 0 }}>AgriConnect</h1>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', margin: 0 }}>SAURASHTRA AGRI • SIH 2026</p>
            </div>
          </div>

          <h2 style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'white', marginBottom: '1rem', lineHeight: '1.3' }}>
            સીધા ખેતરથી<br />ગ્રાહક સુધી 🌾
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
            Farm to Fork, Directly. Connect Saurashtra farmers with buyers — zero middlemen, fair prices, escrow-protected payments.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { icon: '🌾', text: 'Sell directly — no commission, no middlemen' },
              { icon: '🛒', text: 'Buy fresh produce at APMC Mandi prices' },
              { icon: '🔒', text: '100% UPI Escrow — money secured until delivery' },
              { icon: '🤖', text: 'AI Assistant for weather, MSP rates & schemes' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="login-page-right">
        {/* Back button */}
        <button
          onClick={onBack}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#6b7280', fontSize: '0.875rem', marginBottom: '1.5rem',
            padding: '4px 0',
          }}
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <div className="login-form-card">
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ width: '56px', height: '56px', background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
              <Leaf size={28} style={{ color: '#16a34a' }} />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>
              {tab === 'login' ? 'Welcome Back!' : 'Create Account'}
            </h2>
            <p style={{ color: '#6b7280', fontSize: '0.85rem', marginTop: '4px' }}>
              {tab === 'login' ? 'Login to access AgriConnect' : 'Join the Saurashtra Agri Network'}
            </p>
          </div>

          {/* Tab Switcher */}
          <div style={{ display: 'flex', background: '#f3f4f6', borderRadius: '8px', padding: '4px', marginBottom: '1.5rem' }}>
            <button
              onClick={() => setTab('login')}
              style={{
                flex: 1, padding: '8px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                background: tab === 'login' ? 'white' : 'transparent',
                fontWeight: tab === 'login' ? 'bold' : 'normal',
                color: tab === 'login' ? '#111827' : '#6b7280',
                boxShadow: tab === 'login' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              <LogIn size={14} style={{ display: 'inline', marginRight: '6px' }} />
              Login
            </button>
            <button
              onClick={() => setTab('register')}
              style={{
                flex: 1, padding: '8px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                background: tab === 'register' ? 'white' : 'transparent',
                fontWeight: tab === 'register' ? 'bold' : 'normal',
                color: tab === 'register' ? '#111827' : '#6b7280',
                boxShadow: tab === 'register' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              <UserPlus size={14} style={{ display: 'inline', marginRight: '6px' }} />
              Register
            </button>
          </div>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fef2f2', color: '#dc2626', padding: '10px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem' }}>
              <AlertCircle size={14} /> {error}
            </div>
          )}

          {/* Login Form */}
          {tab === 'login' ? (
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>
                  Mobile Number:
                </label>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '8px', padding: '0 12px', background: 'white' }}>
                  <Phone size={16} style={{ color: '#9ca3af', marginRight: '8px' }} />
                  <input
                    type="tel"
                    placeholder="e.g. 9822012345"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    style={{ width: '100%', border: 'none', padding: '10px 0', outline: 'none', fontSize: '0.9rem', background: 'transparent' }}
                  />
                </div>
              </div>

              {!useOtp ? (
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>
                    Password:
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '8px', padding: '0 12px', background: 'white' }}>
                    <Lock size={16} style={{ color: '#9ca3af', marginRight: '8px' }} />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required={!useOtp}
                      style={{ width: '100%', border: 'none', padding: '10px 0', outline: 'none', fontSize: '0.9rem', background: 'transparent' }}
                    />
                  </div>
                </div>
              ) : otpSent ? (
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>
                    Enter 6-Digit OTP (Use 123456):
                  </label>
                  <input
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px', textAlign: 'center', fontSize: '1.1rem', letterSpacing: '6px' }}
                  />
                </div>
              ) : null}

              <div style={{ marginBottom: '1.25rem', textAlign: 'right' }}>
                <button
                  type="button"
                  onClick={() => { setUseOtp(!useOtp); setOtpSent(false); }}
                  style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '0.8rem', cursor: 'pointer' }}
                >
                  {useOtp ? 'Use Password Instead' : '🌾 Rural Friendly Mobile OTP Login'}
                </button>
              </div>

              <button type="submit" disabled={loading} className="scan-btn" style={{ width: '100%', padding: '12px', fontSize: '1rem' }}>
                {loading ? 'Logging in...' : useOtp && !otpSent ? 'Send Mobile OTP' : '🔑 Login'}
              </button>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegister}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>
                  Full Name:
                </label>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '8px', padding: '0 12px' }}>
                  <User size={16} style={{ color: '#9ca3af', marginRight: '8px' }} />
                  <input
                    type="text"
                    placeholder="Ramesh Patil"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    style={{ width: '100%', border: 'none', padding: '10px 0', outline: 'none', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>
                  I am a:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setRole('farmer')}
                    style={{
                      padding: '10px', borderRadius: '8px',
                      border: role === 'farmer' ? '2px solid var(--primary-green)' : '1px solid #d1d5db',
                      background: role === 'farmer' ? '#f0fdf4' : 'white',
                      fontWeight: role === 'farmer' ? 'bold' : 'normal',
                      color: role === 'farmer' ? 'var(--primary-green)' : '#4b5563',
                      cursor: 'pointer', fontSize: '0.9rem',
                    }}
                  >
                    🌾 Farmer (ખેડૂત)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('consumer')}
                    style={{
                      padding: '10px', borderRadius: '8px',
                      border: role === 'consumer' ? '2px solid #2563eb' : '1px solid #d1d5db',
                      background: role === 'consumer' ? '#eff6ff' : 'white',
                      fontWeight: role === 'consumer' ? 'bold' : 'normal',
                      color: role === 'consumer' ? '#2563eb' : '#4b5563',
                      cursor: 'pointer', fontSize: '0.9rem',
                    }}
                  >
                    🛒 Consumer (ગ્રાહક)
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>
                  Mobile Number:
                </label>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '8px', padding: '0 12px' }}>
                  <Phone size={16} style={{ color: '#9ca3af', marginRight: '8px' }} />
                  <input
                    type="tel"
                    placeholder="9822012345"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    style={{ width: '100%', border: 'none', padding: '10px 0', outline: 'none', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>
                  <MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  Taluka (Distribution Centre Area):
                </label>
                <select
                  value={taluka}
                  onChange={(e) => setTaluka(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.9rem', background: 'white' }}
                >
                  <option value="Gondal">Gondal (Rajkot District)</option>
                  <option value="Rajkot Rural">Rajkot Rural</option>
                  <option value="Talala (Gir)">Talala / Gir (Junagadh District)</option>
                  <option value="Junagadh Rural">Junagadh Rural</option>
                  <option value="Mahuva">Mahuva (Bhavnagar District)</option>
                  <option value="Amreli">Amreli District</option>
                  <option value="Jamnagar Rural">Jamnagar Rural</option>
                  <option value="Morbi">Morbi District</option>
                </select>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>
                  Set Password:
                </label>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '8px', padding: '0 12px' }}>
                  <Lock size={16} style={{ color: '#9ca3af', marginRight: '8px' }} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ width: '100%', border: 'none', padding: '10px 0', outline: 'none', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="scan-btn" style={{ width: '100%', padding: '12px', fontSize: '1rem' }}>
                {loading ? 'Creating Account...' : '✅ Create Account'}
              </button>
            </form>
          )}

          {/* Quick Demo Login */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #e5e7eb', textAlign: 'center' }}>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '8px', fontWeight: '600' }}>
              ⚡ Quick Demo Login (Saurashtra):
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => handleQuickLogin('farmer')}
                style={{
                  flex: 1, padding: '8px',
                  background: '#f0fdf4', border: '1px solid #86efac',
                  borderRadius: '8px', fontSize: '0.78rem',
                  color: '#166534', fontWeight: '600', cursor: 'pointer',
                }}
              >
                🌾 Demo Farmer (Mansukhbhai)
              </button>
              <button
                onClick={() => handleQuickLogin('consumer')}
                style={{
                  flex: 1, padding: '8px',
                  background: '#eff6ff', border: '1px solid #93c5fd',
                  borderRadius: '8px', fontSize: '0.78rem',
                  color: '#1e40af', fontWeight: '600', cursor: 'pointer',
                }}
              >
                🛒 Demo Consumer (Jigneshbhai)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
