import React, { useState, useEffect } from 'react';
import { ShoppingCart, Eye, MapPin, ShieldCheck, PlusCircle, Package, LogIn } from 'lucide-react';


export default function Marketplace({
  t,
  currentUser,
  onOpenTransparency,
  onOpenPaymentWithProduct,
  onOpenFarmerSell,
  onOpenLogin,
  selectedTaluka = '',
  customProducts = []
}) {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  // Per-product quantity selection: { [productId]: number }
  const [quantities, setQuantities] = useState({});

  const categories = ['All', 'Oilseeds', 'Spices', 'Grains & Cereals', 'Pulses & Legumes', 'Cotton & Cash Crops'];

  const getQty = (id) => quantities[id] || 1;
  const setQty = (id, val) => {
    const v = Math.max(1, parseInt(val) || 1);
    setQuantities((prev) => ({ ...prev, [id]: v }));
  };

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
    setLoading(true);
    // Only show farmer-listed products — no pre-loaded API catalog
    const filtered = customProducts.filter((p) => matchesCategory(p.category, activeCategory));

    // Deduplicate by _id or id
    const seen = new Set();
    const deduped = filtered.filter((p) => {
      const key = p._id || p.id;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    setProducts(deduped);
    setLoading(false);
  }, [activeCategory, customProducts]);


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

        {/* Sell / Login button */}
        {!currentUser ? (
          <button
            onClick={onOpenLogin}
            className="login-btn"
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              backgroundColor: '#2563eb',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold',
            }}
          >
            <LogIn size={16} />
            <span>Login to Sell / Buy</span>
          </button>
        ) : currentUser?.role !== 'consumer' && (
          <button
            onClick={onOpenFarmerSell}
            className="login-btn"
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              backgroundColor: '#15803d',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold',
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
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌾</div>
          <p style={{ color: '#4b5563', fontWeight: '600', fontSize: '1rem' }}>
            {activeCategory === 'All'
              ? 'No produce listed yet in the marketplace.'
              : `No ${activeCategory} listed yet.`}
          </p>
          <p style={{ color: '#6b7280', fontSize: '0.85rem', marginTop: '6px' }}>
            Farmers can list their produce using the "Sell Produce" button.
          </p>
          {!currentUser ? (
            <button onClick={onOpenLogin} className="scan-btn" style={{ marginTop: '1rem' }}>
              Login to list or buy produce
            </button>
          ) : currentUser?.role !== 'consumer' ? (
            <button onClick={onOpenFarmerSell} className="scan-btn" style={{ marginTop: '1rem' }}>
              🌾 List Your Produce Now
            </button>
          ) : (
            <p style={{ fontSize: '0.85rem', color: '#166534', marginTop: '1rem', fontWeight: '500' }}>
              ✓ Check back soon — farmers are adding fresh produce daily!
            </p>
          )}
        </div>

      ) : (
        <div className="marketplace-grid">
          {products.map((item) => {
            const productId = item._id || item.id;
            const farmerName = item.farmer?.fullName || item.farmer || 'Verified Farmer';
            // Use uploaded image URL (blob or remote), fallback to Unsplash only if none
            const imageUrl =
              item.images?.[0]?.url ||
              item.image ||
              'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=400';
            const isFarmerVerified = item.isVerified || item.farmer?.kycStatus === 'verified';
            const qty = getQty(productId);
            const totalPrice = (item.price * qty).toFixed(2);

            return (
              <div key={productId} className="product-card">
                {/* Produce photo */}
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                  <img
                    src={imageUrl}
                    alt={item.name}
                    className="product-image"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=400';
                    }}
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
                      {/* Product description if available */}
                      {item.description && (
                        <p style={{ fontSize: '0.75rem', color: '#4b5563', marginTop: '2px', lineHeight: '1.3' }}>
                          {item.description}
                        </p>
                      )}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p className="product-price">
                        ₹{item.price}
                        <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 'normal' }}>
                          /{item.unit || 'kg'}
                        </span>
                      </p>
                      {item.availableQuantity && (
                        <p style={{ fontSize: '0.7rem', color: '#059669', fontWeight: '500' }}>
                          <Package size={10} style={{ display: 'inline', marginRight: '2px' }} />
                          {item.availableQuantity} {item.unit || 'kg'} avail.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="product-location">
                    <MapPin size={13} style={{ marginRight: '4px', flexShrink: 0 }} />
                    {item.locationTaluka || item.location || 'Gondal, Rajkot'}
                  </div>

                  {/* Quantity Selector */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    margin: '8px 0', padding: '6px 8px',
                    background: '#f9fafb', borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                  }}>
                    <span style={{ fontSize: '0.78rem', color: '#374151', fontWeight: '600', whiteSpace: 'nowrap' }}>
                      Qty ({item.unit || 'kg'}):
                    </span>
                    <button
                      onClick={() => setQty(productId, qty - 1)}
                      style={{
                        width: '24px', height: '24px', border: '1px solid #d1d5db',
                        borderRadius: '4px', background: 'white', cursor: 'pointer',
                        fontSize: '1rem', lineHeight: '1', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}
                    >−</button>
                    <input
                      type="number"
                      min="1"
                      value={qty}
                      onChange={(e) => setQty(productId, e.target.value)}
                      style={{
                        width: '50px', textAlign: 'center', border: '1px solid #d1d5db',
                        borderRadius: '4px', padding: '2px 4px', fontSize: '0.875rem',
                      }}
                    />
                    <button
                      onClick={() => setQty(productId, qty + 1)}
                      style={{
                        width: '24px', height: '24px', border: '1px solid #d1d5db',
                        borderRadius: '4px', background: 'white', cursor: 'pointer',
                        fontSize: '1rem', lineHeight: '1', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}
                    >+</button>
                    <span style={{ fontSize: '0.78rem', color: '#15803d', fontWeight: '700', marginLeft: 'auto' }}>
                      = ₹{totalPrice}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="product-actions">
                    <button
                      onClick={() => {
                        if (!currentUser) {
                          onOpenLogin?.();
                          return;
                        }
                        onOpenPaymentWithProduct(item, qty);
                      }}
                      className="add-cart-btn"
                    >
                      <ShoppingCart size={16} style={{ marginRight: '6px' }} />
                      {currentUser ? t.addToCart : 'Login to Buy'}
                    </button>

                    {/* Consumer Transparency Audit View */}
                    <button
                      onClick={() => onOpenTransparency(productId, item.name)}
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
