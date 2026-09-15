import React, { useState, useRef } from 'react';
import { Camera, CheckCircle2, TrendingUp, Upload, Sparkles, AlertTriangle } from 'lucide-react';
import api from '../services/api';

export default function AIPriceScanner({ t }) {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState('tomato');
  const fileInputRef = useRef(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create local preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Call backend AI prediction endpoint
    setScanning(true);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('cropHint', selectedCrop);

    const data = await api.scanCropImage(formData);
    setResult(data);
    setScanning(false);
  };

  const handleSimulatedScan = async () => {
    setScanning(true);
    const formData = new FormData();
    formData.append('cropHint', selectedCrop);

    const data = await api.scanCropImage(formData);
    setResult(data);
    setScanning(false);
  };

  const handleReset = () => {
    setResult(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 className="card-title" style={{ margin: 0 }}>
          <Camera size={20} /> {t.aiPrice}
        </h3>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            fontSize: '0.75rem',
            background: '#ecfdf5',
            color: '#047857',
            padding: '2px 8px',
            borderRadius: '9999px',
            border: '1px solid #a7f3d0',
            fontWeight: '600',
          }}
        >
          <Sparkles size={12} style={{ marginRight: '4px' }} /> Mandi AI 2.0
        </span>
      </div>

      {!result ? (
        <div className="scanner-area">
          {previewUrl ? (
            <div style={{ marginBottom: '1rem' }}>
              <img
                src={previewUrl}
                alt="Produce to scan"
                style={{ maxHeight: '180px', borderRadius: '8px', margin: '0 auto', objectFit: 'cover' }}
              />
            </div>
          ) : (
            <Camera size={44} style={{ color: '#9ca3af', margin: '0 auto 0.75rem' }} />
          )}

          <p style={{ color: '#4b5563', marginBottom: '1rem', fontSize: '0.875rem' }}>
            {t.scanDescription}
          </p>

          {/* Crop Selector */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
              Select Crop Category:
            </label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                fontSize: '0.85rem',
                background: 'white',
              }}
            >
              <option value="tomato">Tomatoes (Hybrid / Desi)</option>
              <option value="potato">Potatoes (Jyoti Natural)</option>
              <option value="onion">Red Onions (Nashik Lasalgaon)</option>
              <option value="mango">Alphonso Mangoes (Ratnagiri Hapus)</option>
              <option value="grape">Thompson Seedless Grapes</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={scanning}
              className="scan-btn"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Upload size={16} />
              {scanning ? t.analyzing : 'Upload Produce Photo'}
            </button>
            <button
              onClick={handleSimulatedScan}
              disabled={scanning}
              className="scan-btn"
              style={{ background: '#2563eb' }}
            >
              {scanning ? t.analyzing : 'Run Instant AI Test'}
            </button>
          </div>
        </div>
      ) : (
        <div className="scan-result">
          {previewUrl && (
            <div style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
              <img
                src={previewUrl}
                alt="Scanned produce"
                style={{ maxHeight: '140px', borderRadius: '6px', objectFit: 'cover' }}
              />
            </div>
          )}

          <div className="result-header">
            <div>
              <span className="badge">
                <CheckCircle2 size={12} style={{ marginRight: '4px' }} /> AI Verified Quality
              </span>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginTop: '6px' }}>
                {result.crop}
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#4b5563', marginTop: '2px' }}>
                {t.qualityGrade}: <span style={{ fontWeight: 'bold', color: '#047857' }}>{result.quality}</span>
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Confidence</p>
              <p style={{ fontWeight: 'bold', color: 'var(--primary-green)', fontSize: '1.1rem' }}>
                {result.confidence}
              </p>
            </div>
          </div>

          <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #a7f3d0' }}>
            <p style={{ fontSize: '0.8rem', color: '#4b5563' }}>{t.suggestedPrice}:</p>
            <p className="result-price">{result.suggestedPrice}</p>
            <p className="trend" style={{ marginTop: '2px' }}>
              <TrendingUp size={16} style={{ marginRight: '4px' }} /> {result.marketTrend}
            </p>
          </div>

          {result.qualityAssessment && (
            <div style={{ marginTop: '0.75rem', background: '#ffffff', padding: '8px', borderRadius: '6px', fontSize: '0.8rem', color: '#374151' }}>
              <p style={{ fontWeight: '600', marginBottom: '2px' }}>Quality Audit:</p>
              <p>{result.qualityAssessment}</p>
            </div>
          )}

          {result.harvestAdvisory && (
            <div style={{ marginTop: '0.5rem', background: '#eff6ff', padding: '8px', borderRadius: '6px', fontSize: '0.8rem', color: '#1e40af' }}>
              <p style={{ fontWeight: '600', marginBottom: '2px' }}>Farmer Advisory:</p>
              <p>{result.harvestAdvisory}</p>
            </div>
          )}

          <button
            onClick={handleReset}
            style={{
              marginTop: '1rem',
              color: 'var(--primary-green)',
              background: 'none',
              fontWeight: '600',
              fontSize: '0.875rem',
              cursor: 'pointer',
              border: 'none',
            }}
          >
            ← Scan another produce item
          </button>
        </div>
      )}
    </div>
  );
}
