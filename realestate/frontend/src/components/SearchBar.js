import React from 'react';

export default function SearchBar({ filters, setFilters, onSearch, loading }) {
  const update = (field) => (e) => setFilters((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  const clearFilters = () => {
    setFilters({ name: '', location: '', minPrice: '', maxPrice: '', propertyType: '' });
    onSearch({ name: '', location: '', minPrice: '', maxPrice: '', propertyType: '' });
  };

  return (
    <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: '2px', padding: '6px', display: 'inline-flex', gap: '6px', maxWidth: '900px', width: '100%', boxShadow: '0 4px 40px rgba(0,0,0,.3)' }}>
      <input
        style={{ border: 'none', outline: 'none', padding: '10px 16px', fontFamily: 'DM Sans,sans-serif', fontSize: '13px', color: 'var(--dark)', flex: 1, minWidth: 0 }}
        placeholder="Property name"
        value={filters.name}
        onChange={update('name')}
      />
      <input
        style={{ border: 'none', borderLeft: '1px solid var(--border)', outline: 'none', padding: '10px 12px', fontFamily: 'DM Sans,sans-serif', fontSize: '13px', width: '180px' }}
        placeholder="Location"
        value={filters.location}
        onChange={update('location')}
      />

      <select
        style={{ border: 'none', borderLeft: '1px solid var(--border)', outline: 'none', padding: '10px 12px', fontFamily: 'DM Sans,sans-serif', fontSize: '13px', width: '150px' }}
        value={filters.propertyType}
        onChange={update('propertyType')}
      >
        <option value="">All Types</option>
        <option value="APARTMENT">Apartment</option>
        <option value="VILLA">Villa</option>
        <option value="PENTHOUSE">Penthouse</option>
        <option value="COMMERCIAL">Commercial</option>
      </select>
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
      <button type="submit" className="btn btn-gold" disabled={loading}>{loading ? '...' : 'Search'}</button>
      <button type="button" className="btn btn-outline" onClick={clearFilters} disabled={loading}>Clear</button>
    </form>
  );
}
