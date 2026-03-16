import React, { useEffect, useState } from 'react';
import { getProperties, searchProperties, keywordSearch } from '../services/api';
import PropertyCard from '../components/PropertyCard';

const TYPES = ['', 'APARTMENT', 'VILLA', 'PENTHOUSE', 'COMMERCIAL'];
const TYPE_LABELS = { '': 'All', APARTMENT: 'Apartments', VILLA: 'Villas', PENTHOUSE: 'Penthouses', COMMERCIAL: 'Commercial' };

export default function Home() {
  const [properties, setProperties] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState('');
  const [keyword, setKeyword] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const res = await getProperties();
      setProperties(res.data);
      setFiltered(res.data);
    } catch (e) {
      console.error(e);
    } finally { setLoading(false); }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      if (keyword.trim()) {
        const res = await keywordSearch(keyword.trim());
        setFiltered(res.data);
      } else {
        const params = {};
        if (activeType) params.type = activeType;
        if (minPrice) params.minPrice = Number(minPrice) * 10000000;
        if (maxPrice) params.maxPrice = Number(maxPrice) * 10000000;
        const res = await searchProperties(params);
        setFiltered(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally { setLoading(false); }
  };

  const handleTypeFilter = (type) => {
    setActiveType(type);
    if (type === '') { setFiltered(properties); return; }
    setFiltered(properties.filter(p => p.propertyType === type));
  };

  const getSorted = () => {
    const list = [...filtered];
    if (sortBy === 'price-asc') list.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') list.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') list.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
    return list;
  };

  return (
    <div>
      {/* Hero */}
      <div style={{ background: 'var(--dark)', padding: '80px 2rem 60px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(201,169,110,.07) 0%,transparent 60%)' }} />
        <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: '52px', color: '#fff', fontWeight: 300, lineHeight: 1.1, marginBottom: '16px' }}>
          Find Your <em style={{ color: 'var(--gold)' }}>Perfect</em><br />Property
        </h1>
        <p style={{ color: '#888', fontSize: '15px', maxWidth: '480px', margin: '0 auto 40px' }}>
          Discover premium estates, luxury apartments, and exclusive commercial spaces curated for discerning clients.
        </p>

        {/* Search Bar */}
        <div style={{ background: '#fff', borderRadius: '2px', padding: '6px', display: 'inline-flex', gap: '6px', maxWidth: '680px', width: '100%', boxShadow: '0 4px 40px rgba(0,0,0,.3)' }}>
          <input style={{ border: 'none', outline: 'none', padding: '10px 16px', fontFamily: 'DM Sans,sans-serif', fontSize: '13px', color: 'var(--dark)', flex: 1, minWidth: 0 }}
            placeholder="Search by location, property name..."
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()} />
          <input type="number" placeholder="Min ₹ Cr"
            style={{ border: 'none', borderLeft: '1px solid var(--border)', outline: 'none', padding: '10px 12px', fontFamily: 'DM Sans,sans-serif', fontSize: '13px', width: '90px' }}
            value={minPrice} onChange={e => setMinPrice(e.target.value)} />
          <input type="number" placeholder="Max ₹ Cr"
            style={{ border: 'none', borderLeft: '1px solid var(--border)', outline: 'none', padding: '10px 12px', fontFamily: 'DM Sans,sans-serif', fontSize: '13px', width: '90px' }}
            value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
          <button className="btn btn-gold" onClick={handleSearch}>Search</button>
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{ background: 'var(--charcoal)', padding: '16px 2rem', display: 'flex', justifyContent: 'center', gap: '60px', flexWrap: 'wrap' }}>
        {[['248', 'Properties Listed'], ['1,890', 'Happy Clients'], ['12', 'Cities'], ['₹890Cr+', 'Properties Sold']].map(([num, label]) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: '28px', color: 'var(--gold)', fontWeight: 500 }}>{num}</div>
            <div style={{ fontSize: '11px', color: '#888', letterSpacing: '1px', textTransform: 'uppercase' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Listings */}
      <div className="section">
        <div className="section-header">
          <h2 className="section-title">
            {filtered.length} Properties Available
          </h2>
          <select className="form-control" style={{ width: 'auto', padding: '8px 14px' }}
            value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="">Sort by Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        {/* Type Filters */}
        <div className="filters">
          {TYPES.map(t => (
            <button key={t} className={`filter-btn ${activeType === t ? 'active' : ''}`}
              onClick={() => handleTypeFilter(t)}>
              {TYPE_LABELS[t]}
            </button>
          ))}
          {(keyword || minPrice || maxPrice) && (
            <button className="filter-btn" onClick={() => { setKeyword(''); setMinPrice(''); setMaxPrice(''); setActiveType(''); setFiltered(properties); }}>
              ✕ Clear Filters
            </button>
          )}
        </div>

        {loading ? (
          <div className="spinner"><div className="spin"></div></div>
        ) : getSorted().length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#999' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</div>
            <p>No properties match your search criteria.</p>
            <button className="btn btn-outline" style={{ marginTop: '16px' }} onClick={() => { setFiltered(properties); setKeyword(''); }}>
              View All Properties
            </button>
          </div>
        ) : (
          <div className="prop-grid">
            {getSorted().map((p, i) => <PropertyCard key={p.id} property={p} index={i} />)}
          </div>
        )}
      </div>
    </div>
  );
}
