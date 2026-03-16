import React from 'react';
import { useNavigate } from 'react-router-dom';

const GRADIENTS = [
  'linear-gradient(135deg,#8B7355,#5C4A32)',
  'linear-gradient(135deg,#4A6B8A,#2C4A6E)',
  'linear-gradient(135deg,#6B4A8A,#4A2C6E)',
  'linear-gradient(135deg,#4A8A6B,#2C6E4A)',
  'linear-gradient(135deg,#8A6B4A,#6E4A2C)',
  'linear-gradient(135deg,#4A4A8A,#2C2C6E)',
];

export default function PropertyCard({ property, index = 0 }) {
  const navigate = useNavigate();
  const gradient = GRADIENTS[index % GRADIENTS.length];
  const rating = property.averageRating ? property.averageRating.toFixed(1) : 'N/A';
  const stars = property.averageRating ? Math.round(property.averageRating) : 0;

  const formatPrice = (price) => {
    const cr = price / 10000000;
    return cr >= 1 ? `₹${cr.toFixed(2)} Cr` : `₹${(price / 100000).toFixed(1)} L`;
  };

  return (
    <div className="prop-card" onClick={() => navigate(`/property/${property.id}`)}>
      <div className="prop-img">
        {property.imageUrls?.length > 0 ? (
          <img src={property.imageUrls[0]} alt={property.propertyName || property.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ background: gradient, width: '100%', height: '100%',
            display: 'flex', alignItems: 'flex-end', padding: '16px' }}>
            <span style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: '13px',
              color: 'rgba(255,255,255,0.6)', fontWeight: 300 }}>{property.location || property.city}</span>
          </div>
        )}
        <div className="prop-badge">{property.isFeatured ? 'Featured' : property.propertyType}</div>
      </div>
      <div className="prop-body">
        <div className="prop-price">{formatPrice(property.price)}</div>
        <div className="prop-name">{property.propertyName || property.title}</div>
        <div className="prop-loc">📍 {property.location || property.city}, {property.state}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <span className="stars">{'★'.repeat(stars)}{'☆'.repeat(5 - stars)}</span>
          <span style={{ fontSize: '12px', color: '#999' }}>{rating} ({property.reviewCount || 0})</span>
        </div>
        <div className="prop-features">
          {property.bedrooms > 0 && <span className="prop-feat">🛏 {property.bedrooms} Beds</span>}
          <span className="prop-feat">🚿 {property.bathrooms} Baths</span>
          {property.areaSqft && <span className="prop-feat">📐 {property.areaSqft.toLocaleString()} sqft</span>}
          <span style={{ marginLeft: 'auto' }}>
            <span className="tag tag-active">{property.propertyType}</span>
          </span>
        </div>
        <button className="btn btn-outline" style={{ width: '100%', marginTop: '10px' }} onClick={(e) => { e.stopPropagation(); navigate(`/property/${property.id}`); }}>
          View Details
        </button>
      </div>
    </div>
  );
}
