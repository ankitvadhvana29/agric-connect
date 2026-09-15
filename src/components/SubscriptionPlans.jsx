import React, { useState } from 'react';
import { CreditCard, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import api from '../services/api';

export default function SubscriptionPlans({ t, currentUser, onPlanSubscribed }) {
  const [subscribing, setSubscribing] = useState(false);
  const [activePlan, setActivePlan] = useState(currentUser?.subscriptionPlan || 'free');
  const [message, setMessage] = useState(null);

  const handleSubscribe = async (planId, planName) => {
    setSubscribing(true);
    const res = await api.subscribe(planId);
    setSubscribing(false);

    if (res?.success) {
      setActivePlan(planId);
      setMessage(`Successfully subscribed to ${planName}!`);
      if (onPlanSubscribed) onPlanSubscribed(planId);
    } else {
      setActivePlan(planId);
      setMessage(`Activated ${planName} demo pass!`);
    }

    setTimeout(() => setMessage(null), 4000);
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 className="card-title" style={{ margin: 0 }}>
          <CreditCard size={20} /> {t.subscription}
        </h3>
        <span style={{ fontSize: '0.75rem', background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
          AgriConnect Passes
        </span>
      </div>

      {message && (
        <div style={{ background: '#dcfce7', color: '#15803d', padding: '8px 12px', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }}>
          {message}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* Farmer Pro Plan */}
        <div
          style={{
            border: activePlan === 'farmer_pro' ? '2px solid var(--primary-green)' : '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '1rem',
            background: activePlan === 'farmer_pro' ? '#f0fdf4' : 'white',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ fontWeight: 'bold', color: '#1f2937' }}>Farmer Pro</h4>
              {activePlan === 'farmer_pro' && (
                <span style={{ fontSize: '0.65rem', background: '#16a34a', color: 'white', padding: '1px 6px', borderRadius: '9999px', fontWeight: 'bold' }}>
                  ACTIVE
                </span>
              )}
            </div>
            <p style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--primary-green)', marginTop: '4px' }}>
              ₹99<span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 'normal' }}>/month</span>
            </p>
            <ul style={{ marginTop: '10px', fontSize: '0.8rem', color: '#4b5563', listStyle: 'none' }}>
              <li style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
                <CheckCircle2 size={14} style={{ color: '#10b981', marginRight: '6px', flexShrink: 0 }} /> Unlimited AI Crop Health Scans
              </li>
              <li style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
                <CheckCircle2 size={14} style={{ color: '#10b981', marginRight: '6px', flexShrink: 0 }} /> Priority Taluka Hub Logistics
              </li>
              <li style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
                <CheckCircle2 size={14} style={{ color: '#10b981', marginRight: '6px', flexShrink: 0 }} />
                <span style={{ fontWeight: 'bold', color: '#15803d' }}>Direct Mandi Price Intelligence</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleSubscribe('farmer_pro', 'Farmer Pro Pass')}
            disabled={subscribing || activePlan === 'farmer_pro'}
            className="scan-btn"
            style={{ width: '100%', marginTop: '0.75rem', padding: '6px', fontSize: '0.8rem' }}
          >
            {activePlan === 'farmer_pro' ? 'Current Plan' : 'Subscribe ₹99'}
          </button>
        </div>

        {/* Consumer Pass Plan */}
        <div
          style={{
            border: activePlan === 'consumer_pass' ? '2px solid var(--primary-green)' : '2px solid #86efac',
            borderRadius: '8px',
            padding: '1rem',
            backgroundColor: activePlan === 'consumer_pass' ? '#dcfce7' : 'var(--light-green)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: '-10px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'var(--gold)',
              color: 'white',
              fontSize: '0.7rem',
              fontWeight: 'bold',
              padding: '2px 8px',
              borderRadius: '9999px',
            }}
          >
            POPULAR
          </span>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ fontWeight: 'bold', color: '#1f2937' }}>Consumer Pass</h4>
              {activePlan === 'consumer_pass' && (
                <span style={{ fontSize: '0.65rem', background: '#16a34a', color: 'white', padding: '1px 6px', borderRadius: '9999px', fontWeight: 'bold' }}>
                  ACTIVE
                </span>
              )}
            </div>
            <p style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--primary-green)', marginTop: '4px' }}>
              ₹199<span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 'normal' }}>/month</span>
            </p>
            <ul style={{ marginTop: '10px', fontSize: '0.8rem', color: '#4b5563', listStyle: 'none' }}>
              <li style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
                <CheckCircle2 size={14} style={{ color: '#10b981', marginRight: '6px', flexShrink: 0 }} /> Free Taluka Delivery
              </li>
              <li style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
                <CheckCircle2 size={14} style={{ color: '#10b981', marginRight: '6px', flexShrink: 0 }} /> Farm Transparency Pass
              </li>
              <li style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
                <CheckCircle2 size={14} style={{ color: '#10b981', marginRight: '6px', flexShrink: 0 }} /> 5% Produce Cashback
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleSubscribe('consumer_pass', 'Consumer Pass')}
            disabled={subscribing || activePlan === 'consumer_pass'}
            className="scan-btn"
            style={{ width: '100%', marginTop: '0.75rem', padding: '6px', fontSize: '0.8rem' }}
          >
            {activePlan === 'consumer_pass' ? 'Current Plan' : 'Subscribe ₹199'}
          </button>
        </div>
      </div>
    </div>
  );
}
