import React, { useState, useEffect } from 'react';
import { ShoppingCart, Eye, MapPin, ShieldCheck, PlusCircle } from 'lucide-react';
import api from '../services/api';

export default function Marketplace({
  t,
  currentUser,
  onOpenTransparency,
  onOpenPaymentWithProduct,
  onOpenFarmerSell,
  selectedTaluka = '',
  customProducts = []
}) {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Oilseeds', 'Spices', 'Grains & Cereals', 'Pulses & Legumes', 'Cotton & Cash Crops'];

  // Helper to reliably match product categories across all formats
  const matchesCategory = (itemCat, selectedCat) => {
    if (!selectedCat || selectedCat === 'All') return true;
    const sel = selectedCat.toLowerCase().trim();
    const cat = (itemCat || '').toLowerCase().trim();

    if (sel.includes('oil') && cat.includes('oil')) return true;
    if (sel.includes('spice') && cat.includes('spice')) return true;
    if ((sel.includes('grain') || sel.includes('cereal') || sel.includes('wheat') || sel.includes('bajra') || sel.includes('jowar')) &&
        (cat.includes('grain') || cat.includes('cereal') || cat.includes('wheat') || cat.includes('bajra') || cat.includes('jowar'))) return true;
    if ((sel.includes('pulse') || sel.includes('legume') || sel.includes('dal') || sel.includes('chana') || sel.includes('moong')) &&
        (cat.includes('pulse') || cat.includes('legume') || cat.includes('dal') || cat.includes('chana') || cat.includes('moong'))) return true;
    if ((sel.includes('cotton') || sel.includes('cash')) && (cat.includes('cotton') || cat.includes('cash'))) return true;

    return cat === sel;
  };

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      const cat = activeCategory === 'All' ? '' : activeCategory;
      const data = await api.getProducts(selectedTaluka, cat);
      // Merge newly listed farmer products with catalog, exclude fruits & vegetables
      const merged = [...customProducts, ...data].filter(
        (p) => p.category !== 'Fruits' && p.category !== 'Vegetables'
      );
      // Apply strict client-side category matching so every category displays distinct produce
      const categoryFiltered = merged.filter((p) => matchesCategory(p.category, activeCategory));
      setProducts(categoryFiltered);
      setLoading(false);
    }
    loadProducts();
  }, [selectedTaluka, activeCategory, customProducts]);

  return (
    <div>
      {/* Header Bar with Sell Option & Categories */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '10px' }}>
        {/* Category Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: '500',
                border: activeCategory === cat ? '1px solid var(--primary-green)' : '1px solid var(--border-color)',
                backgroundColor: activeCategory === cat ? 'var(--primary-green)' : 'white',
                color: activeCategory === cat ? 'white' : '#4b5563',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Farmer Sell Option Button (Hidden for Consumers) */}
        {currentUser?.role !== 'consumer' && (
          <button
            onClick={onOpenFarmerSell}
            className="login-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#15803d',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: 'bold',
            }}
          >
            <PlusCircle size={18} />
            <span>🌾 Sell Produce (ખેડૂત વેચાણ)</span>
          </button>
        )}
      </div>

      {/* Produce Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
          Loading Saurashtra Mandi produce...
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <p style={{ color: '#4b5563' }}>No produce listings currently available for this category.</p>
          {currentUser?.role !== 'consumer' ? (
            <button
              onClick={onOpenFarmerSell}
              className="scan-btn"
              style={{ marginTop: '1rem' }}
            >
              Be the first farmer to list produce
            </button>
          ) : (
            <p style={{ fontSize: '0.85rem', color: '#166534', marginTop: '1rem', fontWeight: '500' }}>
              ✓ New harvest consignments arrive daily from Saurashtra APMC mandis. Please check other categories!
            </p>
          )}
        </div>
      ) : (
        <div className="marketplace-grid">
          {products.map((item) => {
            const farmerName = item.farmer?.fullName || item.farmer || 'Verified Farmer';
            const imageUrl = item.images?.[0]?.url || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=400';
            const isFarmerVerified = item.isVerified || item.farmer?.kycStatus === 'verified';

            return (
              <div key={item._id || item.id} className="product-card">
                {/* Produce photo seen by customer */}
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                  <img
                    src={imageUrl}
                    alt={item.name}
                    className="product-image"
                    loading="lazy"
                  />

                  {/* Aadhaar Verified Farmer Badge */}
                  {isFarmerVerified && (
                    <span className="verified-badge">
                      <ShieldCheck size={12} style={{ marginRight: '4px' }} /> Verified Farmer
                    </span>
                  )}

                  {/* AI Quality Tag */}
                  {item.aiGrading?.qualityGrade && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '8px',
                        left: '8px',
                        background: 'rgba(0, 0, 0, 0.75)',
                        color: '#4ade80',
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        backdropFilter: 'blur(4px)',
                      }}
                    >
                      ★ {item.aiGrading.qualityGrade} ({item.aiGrading.confidenceScore || '96%'})
                    </span>
                  )}
                </div>

                <div className="product-info">
                  <div className="product-header">
                    <div>
                      <h4 style={{ fontWeight: 'bold', fontSize: '1.05rem', color: '#111827' }}>
                        {item.name}
                      </h4>
                      <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>{farmerName}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p className="product-price">
                        ₹{item.price}
                        <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 'normal' }}>
                          /{item.unit || 'kg'}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="product-location">
                    <MapPin size={13} style={{ marginRight: '4px', flexShrink: 0 }} />
                    {item.locationTaluka || item.location || 'Gondal, Rajkot'}
                  </div>

                  {/* Action Buttons */}
                  <div className="product-actions">
                    <button
                      onClick={() => onOpenPaymentWithProduct(item)}
                      className="add-cart-btn"
                    >
                      <ShoppingCart size={16} style={{ marginRight: '6px' }} />
                      {t.addToCart}
                    </button>

                    {/* Consumer Transparency Audit View */}
                    <button
                      onClick={() => onOpenTransparency(item._id || item.id, item.name)}
                      className="icon-btn"
                      title={t.viewTransparency}
                      style={{ background: '#f0fdf4', borderColor: '#bbf7d0', color: 'var(--primary-green)' }}
                    >
                      <Eye size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
