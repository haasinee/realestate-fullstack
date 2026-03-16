import React from 'react';
import PropertyCard from './PropertyCard';

export default function PropertyList({ properties, loading }) {
  if (loading) {
    return <div className="spinner"><div className="spin"></div></div>;
  }

  if (!properties.length) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: '#999' }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</div>
        <p>No properties match your search criteria.</p>
      </div>
    );
  }

  return (
    <div className="prop-grid">
      {properties.map((p, i) => <PropertyCard key={p.id} property={p} index={i} />)}
    </div>
  );
}
