import React, { useState, useEffect } from 'react';
import { CreditCard, ShieldCheck, CheckCircle2, QrCode, X, Lock, ExternalLink } from 'lucide-react';
import api from '../services/api';

export default function UPIPaymentModal({ isOpen, onClose, amount = 450, note = 'Fresh Produce Order', t }) {
  const [upiData, setUpiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPaid, setIsPaid] = useState(false);
  const [selectedApp, setSelectedApp] = useState('gpay');

  useEffect(() => {
    if (!isOpen) {
      setIsPaid(false);
      return;
    }

    async function loadUPI() {
      setLoading(true);
      const data = await api.generateUPI(amount, note);
      setUpiData(data);
      setLoading(false);
    }
    loadUPI();
  }, [isOpen, amount, note]);

  const handleSimulatePayment = () => {
    setIsPaid(true);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 className="card-title" style={{ margin: 0 }}>
            <CreditCard size={20} /> {t.secureEscrow}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
            <X size={20} />
          </button>
        </div>

        {isPaid ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{ width: '60px', height: '60px', background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', border: '2px solid #22c55e' }}>
              <CheckCircle2 size={36} style={{ color: '#16a34a' }} />
            </div>
            <h4 style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#166534' }}>
              Payment Secured in Escrow!
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#4b5563', marginTop: '6px' }}>
              Amount: <span style={{ fontWeight: 'bold' }}>₹{amount.toFixed(2)}</span>
            </p>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>
              Ref: {upiData?.transactionRef || `TXN_${Date.now()}`}
            </p>

            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '10px', borderRadius: '8px', marginTop: '1rem', fontSize: '0.8rem', color: '#15803d' }}>
              <Lock size={14} style={{ display: 'inline', marginRight: '4px' }} />
              Funds are held safely in AgriConnect Escrow. Farmer will now dispatch the fresh harvest to the Taluka Hub.
            </div>

            <button
              onClick={onClose}
              className="scan-btn"
              style={{ width: '100%', marginTop: '1.25rem' }}
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            {/* Amount Banner */}
            <div style={{ backgroundColor: 'var(--light-gray)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center' }}>
              <p style={{ fontSize: '0.8rem', color: '#4b5563' }}>{t.payingTo}</p>
              <p style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--primary-green)', marginTop: '2px' }}>
                ₹{amount.toFixed(2)}
              </p>
              <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>{note}</p>
            </div>

            {/* Dynamic UPI QR Code */}
            <div style={{ textAlign: 'center', marginBottom: '1rem', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px', background: '#fafafa' }}>
              {loading ? (
                <div style={{ padding: '2rem 0', color: '#6b7280' }}>Generating NPCI UPI QR...</div>
              ) : upiData?.qrCodeDataUrl ? (
                <img
                  src={upiData.qrCodeDataUrl}
                  alt="UPI Payment QR"
                  style={{ width: '160px', height: '160px', margin: '0 auto', display: 'block', borderRadius: '4px' }}
                />
              ) : (
                <div style={{ width: '160px', height: '160px', background: '#e2e8f0', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px' }}>
                  <QrCode size={64} style={{ color: '#64748b' }} />
                </div>
              )}
              <p style={{ fontSize: '0.75rem', color: '#4b5563', marginTop: '6px', fontWeight: '500' }}>
                {t.scanQR}
              </p>
              <p style={{ fontSize: '0.7rem', color: '#6b7280' }}>
                VPA: {upiData?.payeeVpa || 'agriconnect.escrow@okhdfcbank'}
              </p>
            </div>

            {/* UPI App Options */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
              <div
                onClick={() => setSelectedApp('gpay')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.5rem',
                  border: selectedApp === 'gpay' ? '2px solid #2563eb' : '1px solid var(--border-color)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  background: selectedApp === 'gpay' ? '#eff6ff' : 'white',
                }}
              >
                <div style={{ width: '24px', height: '24px', backgroundColor: '#dbeafe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '8px', fontSize: '0.65rem', fontWeight: 'bold', color: '#2563eb' }}>
                  G
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: '500' }}>Google Pay</span>
              </div>

              <div
                onClick={() => setSelectedApp('phonepe')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.5rem',
                  border: selectedApp === 'phonepe' ? '2px solid #7e22ce' : '1px solid var(--border-color)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  background: selectedApp === 'phonepe' ? '#faf5ff' : 'white',
                }}
              >
                <div style={{ width: '24px', height: '24px', backgroundColor: '#f3e8ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '8px', fontSize: '0.65rem', fontWeight: 'bold', color: '#7e22ce' }}>
                  P
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: '500' }}>PhonePe</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="modal-actions">
              <button onClick={onClose} className="modal-btn btn-outline">
                {t.cancel}
              </button>
              <button
                onClick={handleSimulatePayment}
                className="modal-btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <Lock size={14} />
                {t.payNow}
              </button>
            </div>

            {/* Escrow Guarantee Disclaimer */}
            <p style={{ fontSize: '0.7rem', textAlign: 'center', color: '#6b7280', marginTop: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <ShieldCheck size={14} style={{ color: '#16a34a' }} />
              {t.escrowNote}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
