import React from 'react';

const TYPES = ['APARTMENT', 'VILLA', 'PENTHOUSE', 'COMMERCIAL'];

export default function AddPropertyForm({ form, setForm, onSubmit, loading, imageFiles, setImageFiles, submitLabel }) {
  const set = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: val }));
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="admin-card" style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 500, marginBottom: '18px' }}>Property Details</h3>
        <div className="grid-2" style={{ gap: '14px' }}>
          <div className="form-group" style={{ gridColumn: '1/-1' }}>
            <label className="form-label">Property Name *</label>
            <input className="form-control" required value={form.propertyName} onChange={set('propertyName')} />
          </div>
          <div className="form-group">
            <label className="form-label">Location *</label>
            <input className="form-control" required value={form.location} onChange={set('location')} />
          </div>
          <div className="form-group">
            <label className="form-label">Price (₹) *</label>
            <input className="form-control" type="number" required value={form.price} onChange={set('price')} />
          </div>
          <div className="form-group">
            <label className="form-label">Latitude</label>
            <input className="form-control" type="number" value={form.latitude} onChange={set('latitude')} />
          </div>
          <div className="form-group">
            <label className="form-label">Longitude</label>
            <input className="form-control" type="number" value={form.longitude} onChange={set('longitude')} />
          </div>
          <div className="form-group">
            <label className="form-label">Property Type</label>
            <select className="form-control" value={form.propertyType} onChange={set('propertyType')}>
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" checked={form.isFeatured} onChange={set('isFeatured')} id="featuredProperty" />
            <label htmlFor="featuredProperty">Featured</label>
          </div>
          <div className="form-group" style={{ gridColumn: '1/-1' }}>
            <label className="form-label">Description</label>
            <textarea className="form-control" rows={4} value={form.description} onChange={set('description')} />
          </div>
        </div>
      </div>

      <div className="admin-card" style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 500, marginBottom: '18px' }}>Images</h3>
        <input type="file" multiple accept="image/*" onChange={(e) => setImageFiles(Array.from(e.target.files || []))} />
        {imageFiles.length > 0 && <p style={{ marginTop: 8, color: '#999' }}>{imageFiles.length} image(s) selected.</p>}
      </div>

      <button type="submit" className="btn btn-dark" disabled={loading}>{loading ? 'Saving...' : submitLabel}</button>
    </form>
  );
}
