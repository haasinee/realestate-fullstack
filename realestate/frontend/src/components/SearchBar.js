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
    <form onSubmit={handleSubmit} className="search-bar">
      <input
        className="search-field search-grow"
        placeholder="Property name"
        value={filters.name}
        onChange={update('name')}
      />
      <input
        className="search-field"
        placeholder="Location"
        value={filters.location}
        onChange={update('location')}
      />

      <select
        className="search-field"
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
        className="search-field"
        value={filters.minPrice}
        onChange={update('minPrice')}
      />
      <input
        type="number"
        placeholder="Max ₹"
        className="search-field"
        value={filters.maxPrice}
        onChange={update('maxPrice')}
      />
      <button type="submit" className="btn btn-gold" disabled={loading}>{loading ? '...' : 'Search'}</button>
      <button type="button" className="btn btn-outline" onClick={clearFilters} disabled={loading}>Clear</button>
    </form>
  );
}
