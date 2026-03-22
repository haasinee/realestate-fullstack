import React, { useEffect, useMemo, useState } from 'react';
import { getProperties, searchProperties } from '../services/api';
import SearchBar from '../components/SearchBar';
import PropertyList from '../components/PropertyList';

const VALUE_PROPS = [
  {
    title: 'Verified Listings',
    description: 'Every listing is reviewed for authenticity, pricing transparency, and complete documentation.',
  },
  {
    title: 'Local Market Experts',
    description: 'Our specialists know every neighborhood and help you negotiate with confidence.',
  },
  {
    title: 'End-to-End Support',
    description: 'From first visit to final handover, we guide you through each milestone smoothly.',
  },
];

const BUYING_STEPS = [
  'Share your budget and preferred neighborhood.',
  'Get curated tours from our verified shortlist.',
  'Close your deal with legal and financing support.',
];

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

  const handleSearch = async (overrideFilters) => {
    const effectiveFilters = overrideFilters || filters;
    setLoading(true);
    try {
      const params = {};
      if ((effectiveFilters.name || '').trim()) params.name = effectiveFilters.name.trim();
      if ((effectiveFilters.location || '').trim()) params.location = effectiveFilters.location.trim();
      if (effectiveFilters.minPrice !== '' && effectiveFilters.minPrice !== null) params.minPrice = Number(effectiveFilters.minPrice);
      if (effectiveFilters.maxPrice !== '' && effectiveFilters.maxPrice !== null) params.maxPrice = Number(effectiveFilters.maxPrice);
      if (effectiveFilters.propertyType) params.propertyType = effectiveFilters.propertyType;
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

  const marketplaceStats = useMemo(() => {
    const totalProperties = sortedProperties.length;
    const featured = sortedProperties.filter((property) => property.isFeatured).length;
    const avgPrice = totalProperties
      ? Math.round(sortedProperties.reduce((sum, property) => sum + Number(property.price || 0), 0) / totalProperties)
      : 0;

    const cityCount = new Set(
      sortedProperties
        .map((property) => property.city || property.location)
        .filter(Boolean)
    ).size;

    return [
      { label: 'Active listings', value: totalProperties || '0' },
      { label: 'Featured homes', value: featured || '0' },
      { label: 'Cities covered', value: cityCount || '0' },
      { label: 'Average value', value: avgPrice ? `₹${(avgPrice / 10000000).toFixed(2)} Cr` : '—' },
    ];
  }, [sortedProperties]);

  return (
    <div>
      <section className="hero-section">
        <p className="hero-eyebrow">Luxury Real Estate Advisory</p>
        <h1 className="hero-title">
          Buy, Sell, and Invest with <em>Confidence</em>
        </h1>
        <p className="hero-subtitle">
          Discover premium homes, modern apartments, and investment-ready properties with expert guidance from first visit to final closing.
        </p>

        <SearchBar filters={filters} setFilters={setFilters} onSearch={handleSearch} loading={loading} />

        <div className="hero-stats">
          {marketplaceStats.map((stat) => (
            <div key={stat.label} className="hero-stat-card">
              <p className="hero-stat-value">{stat.value}</p>
              <p className="hero-stat-label">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section section-soft">
        <div className="section-header-stack">
          <h2 className="section-title">Why clients choose Premium Estates</h2>
          <p className="section-subtitle">A polished buying experience that combines design, data, and dedicated support.</p>
        </div>

        <div className="value-grid">
          {VALUE_PROPS.map((item) => (
            <article key={item.title} className="value-card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">{sortedProperties.length} Properties Available</h2>
          <select className="form-control" style={{ width: 'auto', padding: '8px 14px' }} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="">Sort by Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>

        <PropertyList properties={sortedProperties} loading={loading} />
      </section>

      <section className="section section-soft">
        <div className="section-header-stack">
          <h2 className="section-title">How we help you close faster</h2>
        </div>
        <ol className="process-list">
          {BUYING_STEPS.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>
    </div>
  );
}
