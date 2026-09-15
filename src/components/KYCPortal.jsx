import React, { useState } from 'react';
import { ShieldCheck, UserCheck, AlertCircle, CheckCircle, Award } from 'lucide-react';
import api from '../services/api';

export default function KYCPortal({ t, currentUser, onKycVerified }) {
  const [aadhaarInput, setAadhaarInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [verifiedData, setVerifiedData] = useState(
    currentUser?.kycStatus === 'verified'
      ? {
          status: 'verified',
          maskedId: currentUser.aadhaarMasked || 'XXXX-XXXX-1234',
          trustScore: currentUser.trustScore || 92,
          trustRating: 'Excellent (Aadhaar Verified)',
        }
      : null
  );

  const handleVerify = async (e) => {
    e?.preventDefault();
    if (!aadhaarInput || aadhaarInput.replace(/\s/g, '').length !== 12) {
      setError('Please enter a valid 12-digit Aadhaar number.');
      return;
    }

    setLoading(true);
    setError(null);

    const res = await api.verifyAadhaar(aadhaarInput);
    setLoading(false);

    if (res?.success) {
      setVerifiedData(res.kyc);
      if (onKycVerified) onKycVerified(res.kyc);
    } else {
      setError(res?.message || 'Verification failed. Please check Aadhaar number.');
    }
  };

  const handleFillDemoAadhaar = () => {
    setAadhaarInput('999941057058'); // Valid Verhoeff checksum Aadhaar
    setError(null);
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 className="card-title" style={{ margin: 0 }}>
          <ShieldCheck size={20} /> {t.kyc}
        </h3>
        <span style={{ fontSize: '0.75rem', background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '12px', fontWeight: '600' }}>
          UIDAI Standard
        </span>
      </div>

      <div className="scanner-area" style={{ padding: '1.5rem' }}>
        {verifiedData ? (
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                backgroundColor: '#d1fae5',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.75rem',
                border: '2px solid #34d399',
              }}
            >
              <UserCheck size={36} style={{ color: '#059669' }} />
            </div>

            <h4 style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#065f46' }}>
              Aadhaar KYC Verified
            </h4>
            <p style={{ fontSize: '0.9rem', color: '#4b5563', marginTop: '4px', fontWeight: '500' }}>
              ID: {verifiedData.maskedId}
            </p>

            {/* Trust Score Rating */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#f0fdf4',
                border: '1px solid #86efac',
                padding: '6px 14px',
                borderRadius: '20px',
                marginTop: '10px',
              }}
            >
              <Award size={16} style={{ color: '#16a34a' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#166534' }}>
                Trust Score: {verifiedData.trustScore} / 100
              </span>
            </div>

            <p style={{ fontSize: '0.75rem', color: '#059669', marginTop: '8px', fontWeight: '500' }}>
              ✓ Full marketplace privileges unlocked (Direct selling, Escrow payouts)
            </p>

            <button
              onClick={() => {
                setVerifiedData(null);
                setAadhaarInput('');
              }}
              style={{
                marginTop: '1rem',
                fontSize: '0.75rem',
                color: '#6b7280',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Verify another Aadhaar card
            </button>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <ShieldCheck size={44} style={{ color: '#9ca3af', margin: '0 auto 0.75rem' }} />
            <p style={{ color: '#4b5563', marginBottom: '1rem', fontSize: '0.85rem' }}>
              Verify your Aadhaar card using UIDAI Verhoeff algorithm to unlock direct farm trade and high trust score.
            </p>

            <form onSubmit={handleVerify} style={{ maxWidth: '320px', margin: '0 auto' }}>
              <div style={{ marginBottom: '0.75rem' }}>
                <input
                  type="text"
                  placeholder="12-digit Aadhaar (e.g. 9999 4105 7058)"
                  value={aadhaarInput}
                  onChange={(e) => setAadhaarInput(e.target.value)}
                  maxLength={14}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: error ? '1px solid #ef4444' : '1px solid #d1d5db',
                    textAlign: 'center',
                    fontSize: '0.9rem',
                    letterSpacing: '1px',
                  }}
                />
              </div>

              {error && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: '#dc2626', fontSize: '0.75rem', marginBottom: '0.75rem' }}>
                  <AlertCircle size={14} /> {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="scan-btn"
                style={{ width: '100%', marginTop: 0 }}
              >
                {loading ? t.verifying : t.verifyAadhaarNow}
              </button>
            </form>

            <button
              onClick={handleFillDemoAadhaar}
              style={{
                marginTop: '0.75rem',
                fontSize: '0.75rem',
                color: '#2563eb',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Click to autofill valid test Aadhaar (999941057058)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
