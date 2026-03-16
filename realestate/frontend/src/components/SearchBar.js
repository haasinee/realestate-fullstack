import React from 'react';

export default function SearchBar({ filters, setFilters, onSearch, loading }) {
  const update = (field) => (e) => setFilters((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div style={{ background: '#fff', borderRadius: '2px', padding: '6px', display: 'inline-flex', gap: '6px', maxWidth: '760px', width: '100%', boxShadow: '0 4px 40px rgba(0,0,0,.3)' }}>
      <input
        style={{ border: 'none', outline: 'none', padding: '10px 16px', fontFamily: 'DM Sans,sans-serif', fontSize: '13px', color: 'var(--dark)', flex: 1, minWidth: 0 }}
        placeholder="Property name"
        value={filters.name}
        onChange={update('name')}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()}
      />
      <input
        style={{ border: 'none', borderLeft: '1px solid var(--border)', outline: 'none', padding: '10px 12px', fontFamily: 'DM Sans,sans-serif', fontSize: '13px', width: '180px' }}
        placeholder="Location"
        value={filters.location}
        onChange={update('location')}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()}
      />
      <input
        type="number"
        placeholder="Min ₹"
        style={{ border: 'none', borderLeft: '1px solid var(--border)', outline: 'none', padding: '10px 12px', fontFamily: 'DM Sans,sans-serif', fontSize: '13px', width: '100px' }}
        value={filters.minPrice}
        onChange={update('minPrice')}
      />
      <input
        type="number"
        placeholder="Max ₹"
        style={{ border: 'none', borderLeft: '1px solid var(--border)', outline: 'none', padding: '10px 12px', fontFamily: 'DM Sans,sans-serif', fontSize: '13px', width: '100px' }}
        value={filters.maxPrice}
        onChange={update('maxPrice')}
      />
      <button className="btn btn-gold" onClick={onSearch} disabled={loading}>{loading ? '...' : 'Search'}</button>
    </div>
  );
}
