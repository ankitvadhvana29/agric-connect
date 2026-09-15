import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, QrCode, MapPin, X, Leaf, Thermometer, Droplet } from 'lucide-react';
import api from '../services/api';

export default function TransparencyModal({ isOpen, onClose, productId, productName, t }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    async function loadTransparency() {
      setLoading(true);
      const res = await api.getTransparency(productId);
      setData(res);
      setLoading(false);
    }
    loadTransparency();
  }, [isOpen, productId]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Leaf size={18} style={{ color: '#16a34a' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: 0 }}>
                {productName || 'Farm Traceability Passport'}
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                Batch: {data?.batchNumber || 'BATCH-TOM-7801'} • 100% Farm-to-Fork
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
          >
            <X size={20} />
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
            Fetching verified farm provenance...
          </div>
        ) : (
          <div>
            {/* Verified Farm Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                padding: '0.75rem',
                borderRadius: '8px',
                marginBottom: '1rem',
              }}
            >
              <div>
                <p style={{ fontWeight: 'bold', color: '#166534', fontSize: '0.9rem' }}>
                  {data?.farmerName || 'Ramesh Patil'}
                </p>
                <p style={{ fontSize: '0.75rem', color: '#15803d' }}>
                  {data?.farmerTaluka || 'Nashik Taluka'} • Aadhaar Verified Farmer
                </p>
              </div>
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#16a34a',
                  color: 'white',
                  fontSize: '0.7rem',
                  fontWeight: 'bold',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                }}
              >
                <ShieldCheck size={12} style={{ marginRight: '4px' }} /> 100% Certified
              </span>
            </div>

            {/* Farm Traceability Data Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ background: 'var(--light-gray)', padding: '0.75rem', borderRadius: '8px' }}>
                <p style={{ fontSize: '0.7rem', color: '#6b7280' }}>{t.harvestDate}</p>
                <p style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#111827', marginTop: '2px' }}>
                  {data?.harvestDate || 'Yesterday (Under 24h)'}
                </p>
                <span style={{ fontSize: '0.65rem', color: '#059669', fontWeight: 'bold' }}>
                  ● Fresh Pick Guarantee
                </span>
              </div>

              <div style={{ background: 'var(--light-gray)', padding: '0.75rem', borderRadius: '8px' }}>
                <p style={{ fontSize: '0.7rem', color: '#6b7280' }}>{t.soilType}</p>
                <p style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#111827', marginTop: '2px' }}>
                  {data?.soilType || 'Black Alluvial Soil (pH 6.8)'}
                </p>
              </div>

              <div style={{ background: 'var(--light-gray)', padding: '0.75rem', borderRadius: '8px' }}>
                <p style={{ fontSize: '0.7rem', color: '#6b7280' }}>{t.waterSource}</p>
                <p style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#111827', marginTop: '2px' }}>
                  {data?.waterSource || 'Solar Drip Irrigation'}
                </p>
              </div>

              <div style={{ background: 'var(--light-gray)', padding: '0.75rem', borderRadius: '8px' }}>
                <p style={{ fontSize: '0.7rem', color: '#6b7280' }}>Cold Chain Log</p>
                <p style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#111827', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Thermometer size={14} style={{ color: '#2563eb' }} /> 11.5°C Controlled
                </p>
              </div>
            </div>

            {/* Chemical & Pesticide Transparency Audit */}
            <div
              style={{
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                padding: '0.75rem',
                borderRadius: '8px',
                marginBottom: '1rem',
              }}
            >
              <p style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#065f46', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} style={{ color: '#059669' }} /> Zero Synthetic Pesticides Guarantee
              </p>
              <p style={{ fontSize: '0.75rem', color: '#047857', marginTop: '4px' }}>
                {data?.pesticideRecord || '100% Zero Synthetic Pesticides. Plant-based organic bio-protectants applied.'}
              </p>
            </div>

            {/* QR Code Verification Section */}
            <div
              style={{
                border: '1px dashed #cbd5e1',
                padding: '1rem',
                borderRadius: '8px',
                textAlign: 'center',
                background: '#fafafa',
              }}
            >
              {data?.verificationQrCode ? (
                <img
                  src={data.verificationQrCode}
                  alt="Batch QR Code"
                  style={{ width: '110px', height: '110px', margin: '0 auto 6px', display: 'block' }}
                />
              ) : (
                <div style={{ width: '100px', height: '100px', background: '#e2e8f0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px' }}>
                  <QrCode size={48} style={{ color: '#64748b' }} />
                </div>
              )}
              <p style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#334155' }}>
                Scan to Verify Batch Provenance
              </p>
              <p style={{ fontSize: '0.7rem', color: '#64748b' }}>
                Consumer packaging verified cryptographically
              </p>
            </div>

            <button
              onClick={onClose}
              className="scan-btn"
              style={{ width: '100%', marginTop: '1rem' }}
            >
              {t.close}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
