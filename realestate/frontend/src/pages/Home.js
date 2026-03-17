import React, { useEffect, useMemo, useState } from 'react';
import { getProperties, searchProperties } from '../services/api';
import SearchBar from '../components/SearchBar';
import PropertyList from '../components/PropertyList';

export default function Home() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', location: '', minPrice: '', maxPrice: '', propertyType: '' });
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    getProperties()
      .then((res) => setProperties(res.data))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.name.trim()) params.name = filters.name.trim();
      if (filters.location.trim()) params.location = filters.location.trim();
      if (filters.minPrice) params.minPrice = Number(filters.minPrice);
      if (filters.maxPrice) params.maxPrice = Number(filters.maxPrice);
      if (filters.propertyType) params.propertyType = filters.propertyType;
      const res = await searchProperties(params);
      setProperties(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const sortedProperties = useMemo(() => {
    const list = [...properties];
    if (sortBy === 'price-asc') list.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') list.sort((a, b) => b.price - a.price);
    return list;
  }, [properties, sortBy]);

  return (
    <div>
      <div style={{ background: 'var(--dark)', padding: '80px 2rem 60px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: '52px', color: '#fff', fontWeight: 300, lineHeight: 1.1, marginBottom: '16px' }}>
          Find Your <em style={{ color: 'var(--gold)' }}>Perfect</em><br />Property
        </h1>
        <SearchBar filters={filters} setFilters={setFilters} onSearch={handleSearch} loading={loading} />
      </div>

      <div className="section">
        <div className="section-header">
          <h2 className="section-title">{sortedProperties.length} Properties Available</h2>
          <select className="form-control" style={{ width: 'auto', padding: '8px 14px' }} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="">Sort by Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>

        <PropertyList properties={sortedProperties} loading={loading} />
      </div>
    </div>
  );
}
