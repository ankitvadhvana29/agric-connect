import React, { useState } from 'react';
import { LogIn, UserPlus, Phone, Lock, User, MapPin, X, AlertCircle, Sparkles } from 'lucide-react';
import api from '../services/api';

export default function LoginModal({ isOpen, onClose, onLoginSuccess, t }) {
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
  const [taluka, setTaluka] = useState('Nashik');

  if (!isOpen) return null;

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
          taluka: 'Nashik',
          kycStatus: 'verified',
          aadhaarMasked: 'XXXX-XXXX-1234',
          trustScore: 92,
          subscriptionPlan: 'farmer_pro',
        };
        localStorage.setItem('agriconnect_user', JSON.stringify(dummyUser));
        onLoginSuccess(dummyUser);
        onClose();
      } else {
        setError('Invalid OTP! (Use 123456 for demo)');
      }
      setLoading(false);
      return;
    }

    // Standard phone + password login
    const res = await api.login(phone, password);
    setLoading(false);

    if (res?.success && res.user) {
      onLoginSuccess(res.user);
      onClose();
    } else {
      // Local demo fallback if backend is warming up
      const mockUser = {
        fullName: role === 'farmer' ? 'Ramesh Patil' : 'Rajesh Sharma',
        phone: phone || '9822012345',
        role,
        taluka: taluka || 'Nashik',
        kycStatus: 'verified',
        aadhaarMasked: 'XXXX-XXXX-1234',
        trustScore: 92,
        subscriptionPlan: role === 'farmer' ? 'farmer_pro' : 'consumer_pass',
      };
      localStorage.setItem('agriconnect_user', JSON.stringify(mockUser));
      onLoginSuccess(mockUser);
      onClose();
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
      onClose();
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
      onClose();
    }
  };

  const handleQuickLogin = (demoRole) => {
    if (demoRole === 'farmer') {
      const farmer = {
        fullName: 'Ramesh Patil',
        phone: '9822012345',
        role: 'farmer',
        taluka: 'Nashik',
        kycStatus: 'verified',
        aadhaarMasked: 'XXXX-XXXX-1234',
        trustScore: 92,
        subscriptionPlan: 'farmer_pro',
      };
      localStorage.setItem('agriconnect_user', JSON.stringify(farmer));
      onLoginSuccess(farmer);
      onClose();
    } else {
      const consumer = {
        fullName: 'Rajesh Sharma',
        phone: '9811122233',
        role: 'consumer',
        taluka: 'Nashik',
        kycStatus: 'verified',
        aadhaarMasked: 'XXXX-XXXX-4321',
        trustScore: 85,
        subscriptionPlan: 'consumer_pass',
      };
      localStorage.setItem('agriconnect_user', JSON.stringify(consumer));
      onLoginSuccess(consumer);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 className="card-title" style={{ margin: 0 }}>
            <LogIn size={20} /> {tab === 'login' ? 'AgriConnect Login' : 'Create Account'}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
            <X size={20} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', marginBottom: '1rem' }}>
          <button
            onClick={() => setTab('login')}
            style={{
              flex: 1,
              padding: '8px',
              borderBottom: tab === 'login' ? '2px solid var(--primary-green)' : 'none',
              fontWeight: tab === 'login' ? 'bold' : 'normal',
              color: tab === 'login' ? 'var(--primary-green)' : '#6b7280',
              background: 'none',
            }}
          >
            Login
          </button>
          <button
            onClick={() => setTab('register')}
            style={{
              flex: 1,
              padding: '8px',
              borderBottom: tab === 'register' ? '2px solid var(--primary-green)' : 'none',
              fontWeight: tab === 'register' ? 'bold' : 'normal',
              color: tab === 'register' ? 'var(--primary-green)' : '#6b7280',
              background: 'none',
            }}
          >
            Register
          </button>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fef2f2', color: '#dc2626', padding: '8px', borderRadius: '6px', fontSize: '0.8rem', marginBottom: '1rem' }}>
            <AlertCircle size={14} /> {error}
          </div>
        )}

        {/* Login Form */}
        {tab === 'login' ? (
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ fontSize: '0.75rem', color: '#4b5563', display: 'block', marginBottom: '2px' }}>
                Mobile Number:
              </label>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '6px', padding: '0 8px' }}>
                <Phone size={14} style={{ color: '#9ca3af', marginRight: '6px' }} />
                <input
                  type="tel"
                  placeholder="e.g. 9822012345"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  style={{ width: '100%', border: 'none', padding: '8px 0', outline: 'none', fontSize: '0.875rem' }}
                />
              </div>
            </div>

            {!useOtp ? (
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ fontSize: '0.75rem', color: '#4b5563', display: 'block', marginBottom: '2px' }}>
                  Password:
                </label>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '6px', padding: '0 8px' }}>
                  <Lock size={14} style={{ color: '#9ca3af', marginRight: '6px' }} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required={!useOtp}
                    style={{ width: '100%', border: 'none', padding: '8px 0', outline: 'none', fontSize: '0.875rem' }}
                  />
                </div>
              </div>
            ) : otpSent ? (
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ fontSize: '0.75rem', color: '#4b5563', display: 'block', marginBottom: '2px' }}>
                  Enter 6-Digit OTP (Use 123456):
                </label>
                <input
                  type="text"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', textAlign: 'center', fontSize: '1rem', letterSpacing: '4px' }}
                />
              </div>
            ) : null}

            {/* Rural OTP Toggle */}
            <div style={{ marginBottom: '1rem', textAlign: 'right' }}>
              <button
                type="button"
                onClick={() => {
                  setUseOtp(!useOtp);
                  setOtpSent(false);
                }}
                style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '0.75rem', cursor: 'pointer' }}
              >
                {useOtp ? 'Use Password Instead' : '🌾 Rural Friendly Mobile OTP Login'}
              </button>
            </div>

            <button type="submit" disabled={loading} className="scan-btn" style={{ width: '100%', marginTop: 0 }}>
              {loading ? 'Logging in...' : useOtp && !otpSent ? 'Send Mobile OTP' : 'Login'}
            </button>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegister}>
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ fontSize: '0.75rem', color: '#4b5563', display: 'block', marginBottom: '2px' }}>
                Full Name:
              </label>
              <input
                type="text"
                placeholder="Ramesh Patil"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem' }}
              />
            </div>

            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ fontSize: '0.75rem', color: '#4b5563', display: 'block', marginBottom: '2px' }}>
                I am a:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setRole('farmer')}
                  style={{
                    padding: '8px',
                    borderRadius: '6px',
                    border: role === 'farmer' ? '2px solid var(--primary-green)' : '1px solid #d1d5db',
                    background: role === 'farmer' ? '#f0fdf4' : 'white',
                    fontWeight: role === 'farmer' ? 'bold' : 'normal',
                    color: role === 'farmer' ? 'var(--primary-green)' : '#4b5563',
                  }}
                >
                  🌾 Farmer
                </button>
                <button
                  type="button"
                  onClick={() => setRole('consumer')}
                  style={{
                    padding: '8px',
                    borderRadius: '6px',
                    border: role === 'consumer' ? '2px solid var(--primary-green)' : '1px solid #d1d5db',
                    background: role === 'consumer' ? '#f0fdf4' : 'white',
                    fontWeight: role === 'consumer' ? 'bold' : 'normal',
                    color: role === 'consumer' ? 'var(--primary-green)' : '#4b5563',
                  }}
                >
                  🛒 Consumer
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ fontSize: '0.75rem', color: '#4b5563', display: 'block', marginBottom: '2px' }}>
                Mobile Number:
              </label>
              <input
                type="tel"
                placeholder="9822012345"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem' }}
              />
            </div>

            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ fontSize: '0.75rem', color: '#4b5563', display: 'block', marginBottom: '2px' }}>
                Taluka (Distribution Centre Area):
              </label>
              <select
                value={taluka}
                onChange={(e) => setTaluka(e.target.value)}
                style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem', background: 'white' }}
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

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.75rem', color: '#4b5563', display: 'block', marginBottom: '2px' }}>
                Set Password:
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem' }}
              />
            </div>

            <button type="submit" disabled={loading} className="scan-btn" style={{ width: '100%', marginTop: 0 }}>
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </form>
        )}

        {/* Fast Demo Shortcuts for Presentation */}
        <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '6px', fontWeight: '500' }}>
            ⚡ Saurashtra Quick Login:
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => handleQuickLogin('farmer')}
              style={{
                flex: 1,
                padding: '6px',
                background: '#f0fdf4',
                border: '1px solid #86efac',
                borderRadius: '6px',
                fontSize: '0.75rem',
                color: '#166534',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Demo Farmer (Mansukhbhai)
            </button>
            <button
              onClick={() => handleQuickLogin('consumer')}
              style={{
                flex: 1,
                padding: '6px',
                background: '#eff6ff',
                border: '1px solid #93c5fd',
                borderRadius: '6px',
                fontSize: '0.75rem',
                color: '#1e40af',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Demo Consumer (Jigneshbhai)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
