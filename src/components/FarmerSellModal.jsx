import React, { useState, useRef } from 'react';
import {
  Leaf, CheckCircle2, AlertCircle, X,
  MapPin, Package, Camera, Upload, Trash2
} from 'lucide-react';


import api from '../services/api';

const SAURASHTRA_TALUKAS = [
  { taluka: 'Gondal', district: 'Rajkot', hub: 'Gondal APMC Hub' },
  { taluka: 'Rajkot Rural', district: 'Rajkot', hub: 'Rajkot Mandi Hub' },
  { taluka: 'Talala (Gir)', district: 'Junagadh', hub: 'Gir Kesar Hub' },
  { taluka: 'Junagadh Rural', district: 'Junagadh', hub: 'Junagadh Hub' },
  { taluka: 'Mahuva', district: 'Bhavnagar', hub: 'Mahuva Onion Hub' },
  { taluka: 'Bhavnagar Rural', district: 'Bhavnagar', hub: 'Bhavnagar Hub' },
  { taluka: 'Amreli', district: 'Amreli', hub: 'Amreli Agro Centre' },
  { taluka: 'Jamnagar Rural', district: 'Jamnagar', hub: 'Jamnagar Spices Hub' },
  { taluka: 'Morbi', district: 'Morbi', hub: 'Morbi Agro Hub' },
  { taluka: 'Chotila / Wadhwan', district: 'Surendranagar', hub: 'Surendranagar Hub' },
  { taluka: 'Botad / Gadhada', district: 'Botad', hub: 'Botad Agro Hub' },
];

export default function FarmerSellModal({ isOpen, onClose, onProductCreated, currentUser, t }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Oilseeds');
  const [variety, setVariety] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('kg');
  const [quantity, setQuantity] = useState('');
  const [taluka, setTaluka] = useState('Gondal');
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);


  if (!isOpen) return null;

  if (currentUser?.role === 'consumer') {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px', textAlign: 'center', padding: '2rem' }}>
          <div style={{ width: '56px', height: '56px', background: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <span style={{ fontSize: '1.8rem' }}>🛒</span>
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1e3a8a', marginBottom: '0.5rem' }}>
            Consumer Account Detected
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#4b5563', lineHeight: '1.5', marginBottom: '1.5rem' }}>
            Selling produce is reserved for verified Saurashtra farmers. Your account is currently logged in as a <strong>Consumer (Buyer)</strong>.
          </p>
          <button onClick={onClose} className="scan-btn" style={{ width: '100%', backgroundColor: '#2563eb' }}>
            Browse Marketplace to Buy
          </button>
        </div>
      </div>
    );
  }

  // Auto-assign category-based image (no manual upload needed)
  const getCategoryImage = (cat, productName) => {
    const n = (productName || '').toLowerCase();
    const c = (cat || '').toLowerCase();

    if (n.includes('chilli') || n.includes('mircha') || n.includes('મરચ')) return 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&q=80&w=600';
    if (n.includes('cumin') || n.includes('jeera') || n.includes('જીરૂ')) return 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=600';
    if (n.includes('groundnut') || n.includes('peanut') || n.includes('મગફળ')) return 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&q=80&w=600';
    if (n.includes('cotton') || n.includes('kapas') || n.includes('કપાસ')) return 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&q=80&w=600';
    if (n.includes('wheat') || n.includes('ghau') || n.includes('ઘઉ')) return 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=600';
    if (n.includes('sesame') || n.includes('til') || n.includes('તલ')) return 'https://images.unsplash.com/photo-1612187029216-e4c0b3424d77?auto=format&fit=crop&q=80&w=600';
    if (n.includes('mustard') || n.includes('sarson') || n.includes('સરસ')) return 'https://images.unsplash.com/photo-1599909631359-a4ee6a5c6c00?auto=format&fit=crop&q=80&w=600';
    if (n.includes('coriander') || n.includes('dhana') || n.includes('ધાણ')) return 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&q=80&w=600';
    if (n.includes('bajra') || n.includes('bajri') || n.includes('બાજર')) return 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=600';
    if (n.includes('jowar') || n.includes('jwari') || n.includes('જુવ')) return 'https://images.unsplash.com/photo-1651956164453-7da9c7e1a7a5?auto=format&fit=crop&q=80&w=600';
    if (n.includes('tuvar') || n.includes('toor') || n.includes('dal') || n.includes('તુ')) return 'https://images.unsplash.com/photo-1585136917228-a2e1e65b7ef7?auto=format&fit=crop&q=80&w=600';
    if (n.includes('moong') || n.includes('mung') || n.includes('મગ')) return 'https://images.unsplash.com/photo-1619896482999-8f97ebfe9c3f?auto=format&fit=crop&q=80&w=600';
    if (n.includes('garlic') || n.includes('lasun') || n.includes('લસ')) return 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=600';

    // Category fallback images
    if (c.includes('spice')) return 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&q=80&w=600';
    if (c.includes('oil')) return 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&q=80&w=600';
    if (c.includes('grain') || c.includes('cereal')) return 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=600';
    if (c.includes('pulse') || c.includes('legume')) return 'https://images.unsplash.com/photo-1585136917228-a2e1e65b7ef7?auto=format&fit=crop&q=80&w=600';
    if (c.includes('cotton') || c.includes('cash')) return 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&q=80&w=600';

    return 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=600';
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size exceeds 5MB. Please choose a smaller photo.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!name || !price || !quantity) {
      setError('Please fill in produce name, price, and available quantity.');
      return;
    }

    setLoading(true);

    const selectedTalukaObj = SAURASHTRA_TALUKAS.find((t) => t.taluka === taluka);
    const finalProduceImage = imagePreview || getCategoryImage(category, name);

    const newProduct = {
      name,
      category,
      variety: variety || 'Saurashtra Farm Fresh',
      price: parseFloat(price),
      unit,
      availableQuantity: parseFloat(quantity),
      locationTaluka: `${taluka}, ${selectedTalukaObj?.district || 'Saurashtra'}`,
      farmerId: currentUser?._id || currentUser?.id || undefined,
      farmerPhone: currentUser?.phone || undefined,
      farmerName: currentUser?.fullName || undefined,
      images: [
        {
          url: finalProduceImage,
          caption: `${name} harvested at ${taluka}`,
          isPrimary: true,
        },
      ],
      aiGrading: {
        qualityGrade: 'Grade A',
        confidenceScore: '96%',
        suggestedPriceRange: { min: Math.round(parseFloat(price) * 0.95), max: Math.round(parseFloat(price) * 1.1) },
        marketTrend: '+8% steady Saurashtra APMC Mandi demand',
      },
      isVerified: true,
      status: 'Available',
    };


    // Attempt backend save
  try {
      const res = await api.addProduct(newProduct);

      if (res?.success === false) {
        setLoading(false);
        setError(res.message || 'Product save failed. Please try again.');
        return;
      }

      setLoading(false);
      setSuccess(true);

      if (onProductCreated) {
        onProductCreated(res?.product || newProduct);
      }
    } catch (err) {
      setLoading(false);
      setError('Backend connection failed. Please try again.');
      return;
    }

    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 2000);
  };


  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '540px', maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '36px', height: '36px', background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Leaf size={20} style={{ color: '#16a34a' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0, color: '#111827' }}>
                🌾 Sell Produce (ખેડૂત પાક વેચાણ)
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                Direct APMC Mandi Listing for Saurashtra Farmers
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ width: '64px', height: '64px', background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', border: '2px solid #22c55e' }}>
              <CheckCircle2 size={36} style={{ color: '#16a34a' }} />
            </div>
            <h4 style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#166534' }}>
              Produce Listed Successfully!
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#4b5563', marginTop: '6px' }}>
              Your <span style={{ fontWeight: 'bold' }}>{name}</span> is now live in the Saurashtra Direct Marketplace.
            </p>
            <p style={{ fontSize: '0.75rem', color: '#16a34a', marginTop: '4px', fontWeight: '500' }}>
              Connected to {taluka} APMC Hub for pooled dispatch.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>

            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fef2f2', color: '#dc2626', padding: '8px', borderRadius: '6px', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
                <AlertCircle size={14} /> {error}
              </div>
            )}

            {/* Produce Name */}
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '2px' }}>
                Produce Name / પાકનું નામ *:
              </label>
              <input
                type="text"
                placeholder="e.g. Saurashtra Bold Groundnut (મગફળી)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem' }}
              />
            </div>

            {/* Category & Variety */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '2px' }}>
                  Category (વર્ગ):
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem', background: 'white' }}
                >
                  <option value="Oilseeds">Oilseeds (મગફળી, તલ, સરસવ)</option>
                  <option value="Spices">Spices (જીરું, મરચાં, ધાણા, લસણ)</option>
                  <option value="Grains & Cereals">Grains & Cereals (ઘઉં, બાજરો, જુવાર)</option>
                  <option value="Pulses & Legumes">Pulses & Legumes (તુવેર, ચણા, મગ)</option>
                  <option value="Cotton & Cash Crops">Cotton & Cash Crops (કપાસ, દીવેલા)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '2px' }}>
                  Variety / જાત:
                </label>
                <input
                  type="text"
                  placeholder="e.g. GG-20, Resham Patti"
                  value={variety}
                  onChange={(e) => setVariety(e.target.value)}
                  style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem' }}
                />
              </div>
            </div>

            {/* Price & Unit */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '2px' }}>
                  Price (₹) *:
                </label>
                <input
                  type="number"
                  placeholder="75"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '2px' }}>
                  Per Unit:
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem', background: 'white' }}
                >
                  <option value="kg">kg (કિલો)</option>
                  <option value="20kg mann">20kg મણ</option>
                  <option value="quintal">quintal (ક્વિન્ટલ)</option>
                  <option value="box (10kg)">box (10kg પેટી)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '2px' }}>
                  Available Qty *:
                </label>
                <input
                  type="number"
                  placeholder="500"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                  style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem' }}
                />
              </div>
            </div>

            {/* Saurashtra Taluka Selection */}
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '2px' }}>
                <MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} />
                Saurashtra Taluka / APMC Hub *:
              </label>
              <select
                value={taluka}
                onChange={(e) => setTaluka(e.target.value)}
                style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem', background: 'white' }}
              >
                {SAURASHTRA_TALUKAS.map((item, idx) => (
                  <option key={idx} value={item.taluka}>
                    {item.taluka} — {item.district} District ({item.hub})
                  </option>
                ))}
              </select>
            </div>

            {/* Produce Photo Upload Option */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Camera size={14} style={{ color: '#16a34a' }} />
                  પાકનો ફોટો ઉમેરો (Produce Photo):
                </span>
                <span style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 'normal' }}>
                  (વૈકલ્પિક / Optional)
                </span>
              </label>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageFileChange}
                style={{ display: 'none' }}
              />

              {imagePreview ? (
                <div style={{
                  position: 'relative',
                  borderRadius: '8px',
                  border: '1px solid #86efac',
                  background: '#f0fdf4',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}>
                  <img
                    src={imagePreview}
                    alt="Produce preview"
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '6px',
                      objectFit: 'cover',
                      border: '1px solid #d1d5db'
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: '600', color: '#166534', margin: 0 }}>
                      ✓ ફોટો પસંદ થયો (Photo selected)
                    </p>
                    <p style={{ fontSize: '0.7rem', color: '#6b7280', margin: '2px 0 0' }}>
                      ગ્રાહક આ ફોટો જોઈ શકશે
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setImagePreview(null)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: '#fee2e2',
                      color: '#dc2626',
                      border: '1px solid #fca5a5',
                      borderRadius: '6px',
                      padding: '4px 8px',
                      fontSize: '0.72rem',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                    title="Remove Photo"
                  >
                    <Trash2 size={13} /> કાઢો
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: '2px dashed #86efac',
                    borderRadius: '8px',
                    padding: '0.85rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: '#f0fdf4',
                    transition: 'all 0.2s',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.borderColor = '#16a34a')}
                  onMouseOut={(e) => (e.currentTarget.style.borderColor = '#86efac')}
                >
                  <Upload size={22} style={{ color: '#16a34a', margin: '0 auto 4px' }} />
                  <p style={{ fontSize: '0.82rem', color: '#166534', fontWeight: '600', margin: 0 }}>
                    ફોટો અપલોડ કરવા અહીં ક્લિક કરો (Upload Crop Photo)
                  </p>
                  <p style={{ fontSize: '0.7rem', color: '#6b7280', margin: '2px 0 0' }}>
                    JPG, PNG, WEBP (જો ફોટો નહિ નાખો તો પાક મુજબ ઓટોમેટિક ફોટો આવશે)
                  </p>
                </div>
              )}
            </div>

            {/* Submit Button */}

            <div className="modal-actions">
              <button type="button" onClick={onClose} className="modal-btn btn-outline">
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="modal-btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <Package size={16} />
                {loading ? 'Publishing...' : 'List Produce in Marketplace'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
