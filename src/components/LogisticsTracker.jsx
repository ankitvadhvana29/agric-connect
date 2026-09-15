import React, { useState, useEffect } from 'react';
import { MapPin, Truck, CheckCircle2, Layers, ArrowRight } from 'lucide-react';
import api from '../services/api';

export default function LogisticsTracker({ t }) {
  const [hubs, setHubs] = useState([]);
  const [pooledInfo, setPooledInfo] = useState(null);
  const [selectedTaluka, setSelectedTaluka] = useState('Nashik');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLogisticsData() {
      setLoading(true);
      const [hubData, poolData] = await Promise.all([
        api.getHubs(),
        api.getPooledLogistics(selectedTaluka),
      ]);
      setHubs(hubData);
      setPooledInfo(poolData);
      setLoading(false);
    }
    loadLogisticsData();
  }, [selectedTaluka]);

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 className="card-title" style={{ margin: 0 }}>
          <MapPin size={20} /> {t.talukaHubs}
        </h3>
        <span style={{ fontSize: '0.75rem', background: '#dbeafe', color: '#1d4ed8', padding: '2px 8px', borderRadius: '12px', fontWeight: '600' }}>
          {hubs.length} Hubs Connected
        </span>
      </div>

      {/* Hubs Directory */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {hubs.map((hub, idx) => {
          const isActive = hub.status === 'Active';
          const loadPercent = hub.capacityKg ? Math.round((hub.currentLoadKg / hub.capacityKg) * 100) : 40;

          return (
            <div
              key={idx}
              onClick={() => setSelectedTaluka(hub.taluka)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem',
                backgroundColor: selectedTaluka === hub.taluka ? '#f0fdf4' : 'var(--light-gray)',
                border: selectedTaluka === hub.taluka ? '1px solid #86efac' : '1px solid transparent',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div
                  className={`status-dot ${isActive ? 'status-active' : 'status-maintenance'}`}
                  title={hub.status}
                ></div>
                <div>
                  <p style={{ fontWeight: '600', fontSize: '0.9rem', color: '#111827' }}>{hub.name}</p>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {hub.farmersConnected || 35} farmers connected • {hub.taluka}
                  </p>
                  {/* Capacity Bar */}
                  <div style={{ width: '120px', height: '4px', background: '#e5e7eb', borderRadius: '2px', marginTop: '4px' }}>
                    <div
                      style={{
                        width: `${loadPercent}%`,
                        height: '100%',
                        background: loadPercent > 80 ? '#ef4444' : '#10b981',
                        borderRadius: '2px',
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span className={`badge ${isActive ? 'badge-success' : 'badge-warning'}`}>
                  {hub.status}
                </span>
                <p style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: '4px' }}>
                  {loadPercent}% Capacity
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Feature 3: Pooled Logistics Cluster Banner */}
      <div
        style={{
          marginTop: '1rem',
          padding: '0.85rem',
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: '8px',
          fontSize: '0.875rem',
          color: '#1e40af',
        }}
      >
        <p style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Truck size={18} style={{ color: '#2563eb' }} /> {t.pooledLogistics}
        </p>
        <p style={{ marginTop: '4px', fontSize: '0.82rem', color: '#1e3a8a' }}>
          {pooledInfo?.message || `Your order will be pooled with 4 other orders in ${selectedTaluka} for zero-waste delivery.`}
        </p>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '8px',
            paddingTop: '6px',
            borderTop: '1px dashed #93c5fd',
            fontSize: '0.75rem',
            fontWeight: '600',
            color: '#1d4ed8',
          }}
        >
          <span>🌱 38% Transport Cost & Carbon Saved</span>
          <span>EV-Agri Van Dispatch</span>
        </div>
      </div>
    </div>
  );
}
