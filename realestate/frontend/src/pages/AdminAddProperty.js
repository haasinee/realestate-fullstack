import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProperty, updateProperty, getProperty, uploadImage } from '../services/api';
import { useToast } from '../components/Toast';

const EMPTY = {
  title: '', description: '', propertyType: 'APARTMENT', price: '',
  areaSqft: '', bedrooms: '', bathrooms: '', floorNumber: '', yearBuilt: '',
  address: '', city: '', state: '', pincode: '',
  amenities: '', isFeatured: false, agentName: '', agentPhone: '',
};

export default function AdminAddProperty() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const showToast = useToast();

  const [form, setForm] = useState(EMPTY);
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      getProperty(id).then(res => {
        const p = res.data;
        setForm({
          title: p.title || '', description: p.description || '',
          propertyType: p.propertyType || 'APARTMENT', price: p.price || '',
          areaSqft: p.areaSqft || '', bedrooms: p.bedrooms || '',
          bathrooms: p.bathrooms || '', floorNumber: p.floorNumber || '',
          yearBuilt: p.yearBuilt || '', address: p.address || '',
          city: p.city || '', state: p.state || '', pincode: p.pincode || '',
          amenities: p.amenities || '', isFeatured: p.isFeatured || false,
          agentName: p.agentName || '', agentPhone: p.agentPhone || '',
        });
        setFetching(false);
      }).catch(() => { showToast('Failed to load property', 'error'); navigate('/admin/properties'); });
    }
  }, [id]);

  const set = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(prev => ({ ...prev, [field]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price) * 10000000,
        areaSqft: Number(form.areaSqft) || null,
        bedrooms: Number(form.bedrooms) || 0,
        bathrooms: Number(form.bathrooms) || 0,
        floorNumber: Number(form.floorNumber) || null,
        yearBuilt: Number(form.yearBuilt) || null,
      };
      let savedId;
      if (isEdit) {
        const res = await updateProperty(id, payload);
        savedId = res.data.id;
        showToast('Property updated successfully!');
      } else {
        const res = await createProperty(payload);
        savedId = res.data.id;
        showToast('Property created successfully!');
      }
      // Upload images if any
      for (let i = 0; i < imageFiles.length; i++) {
        const fd = new FormData();
        fd.append('file', imageFiles[i]);
        fd.append('isPrimary', i === 0);
        await uploadImage(savedId, fd);
      }
      navigate('/admin/properties');
    } catch (e) {
      showToast(e.response?.data?.error || 'Failed to save property', 'error');
    } finally { setLoading(false); }
  };

  const F = ({ label, field, type = 'text', placeholder = '', required = false, half = false }) => (
    <div className="form-group" style={{ marginBottom: 0, gridColumn: half ? 'auto' : 'auto' }}>
      <label className="form-label">{label}</label>
      <input className="form-control" type={type} placeholder={placeholder} required={required}
        value={form[field]} onChange={set(field)} />
    </div>
  );

  if (fetching) return <div className="spinner"><div className="spin"></div></div>;

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: 400 }}>{isEdit ? 'Edit Property' : 'Add New Property'}</h2>
          <p style={{ color: '#999', fontSize: '13px', marginTop: '4px' }}>Fill in all the property details</p>
        </div>
      </div>

      {/* Basic Info */}
      <div className="admin-card" style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 500, marginBottom: '18px', paddingBottom: '10px', borderBottom: '1px solid var(--border)' }}>Basic Information</h3>
        <div className="grid-2" style={{ gap: '14px' }}>
          <div className="form-group" style={{ marginBottom: 0, gridColumn: '1/-1' }}>
            <label className="form-label">Property Title *</label>
            <input className="form-control" required placeholder="e.g. The Grand Residency" value={form.title} onChange={set('title')} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Property Type *</label>
            <select className="form-control" required value={form.propertyType} onChange={set('propertyType')}>
              {['APARTMENT','VILLA','PENTHOUSE','COMMERCIAL'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Featured Property</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 0' }}>
              <input type="checkbox" id="featured" checked={form.isFeatured} onChange={set('isFeatured')} />
              <label htmlFor="featured" style={{ fontSize: '13px', cursor: 'pointer' }}>Mark as Featured</label>
            </div>
          </div>
          <div className="form-group" style={{ marginBottom: 0, gridColumn: '1/-1' }}>
            <label className="form-label">Description</label>
            <textarea className="form-control" rows={4} placeholder="Detailed property description..." value={form.description} onChange={set('description')} />
          </div>
        </div>
      </div>

      {/* Pricing & Area */}
      <div className="admin-card" style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 500, marginBottom: '18px', paddingBottom: '10px', borderBottom: '1px solid var(--border)' }}>Pricing & Area</h3>
        <div className="grid-2" style={{ gap: '14px' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Price (₹ Crores) *</label>
            <input className="form-control" type="number" required step="0.01" placeholder="e.g. 2.5 for ₹2.5 Cr" value={form.price} onChange={set('price')} />
          </div>
          <F label="Area (sqft)" field="areaSqft" type="number" placeholder="2500" />
        </div>
      </div>

      {/* Property Details */}
      <div className="admin-card" style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 500, marginBottom: '18px', paddingBottom: '10px', borderBottom: '1px solid var(--border)' }}>Property Details</h3>
        <div className="grid-3" style={{ gap: '14px' }}>
          <F label="Bedrooms" field="bedrooms" type="number" placeholder="3" />
          <F label="Bathrooms" field="bathrooms" type="number" placeholder="2" />
          <F label="Floor Number" field="floorNumber" type="number" placeholder="5" />
          <F label="Year Built" field="yearBuilt" type="number" placeholder="2023" />
          <F label="Agent Name" field="agentName" placeholder="John Smith" />
          <F label="Agent Phone" field="agentPhone" placeholder="+91 98765 00000" />
        </div>
      </div>

      {/* Location */}
      <div className="admin-card" style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 500, marginBottom: '18px', paddingBottom: '10px', borderBottom: '1px solid var(--border)' }}>Location Details</h3>
        <div className="grid-2" style={{ gap: '14px' }}>
          <div className="form-group" style={{ marginBottom: 0, gridColumn: '1/-1' }}>
            <label className="form-label">Address</label>
            <input className="form-control" placeholder="Street address" value={form.address} onChange={set('address')} />
          </div>
          <F label="City" field="city" placeholder="Hyderabad" />
          <F label="State" field="state" placeholder="Telangana" />
          <F label="Pincode" field="pincode" placeholder="500034" />
          <div className="form-group" style={{ marginBottom: 0, gridColumn: '1/-1' }}>
            <label className="form-label">Amenities (comma-separated)</label>
            <input className="form-control" placeholder="Pool, Gym, Parking, Gym, Smart Home" value={form.amenities} onChange={set('amenities')} />
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="admin-card" style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 500, marginBottom: '18px', paddingBottom: '10px', borderBottom: '1px solid var(--border)' }}>Property Images</h3>
        <label className="upload-zone" htmlFor="imgUpload">
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>📷</div>
          <div style={{ fontSize: '13px', color: '#999' }}>Click to upload images or drag and drop</div>
          <div style={{ fontSize: '11px', color: '#bbb', marginTop: '4px' }}>PNG, JPG, WEBP up to 10MB each</div>
        </label>
        <input id="imgUpload" type="file" accept="image/*" multiple style={{ display: 'none' }}
          onChange={e => setImageFiles(Array.from(e.target.files))} />
        {imageFiles.length > 0 && (
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '12px' }}>
            {imageFiles.map((f, i) => (
              <div key={i} style={{ background: 'var(--charcoal)', padding: '8px 14px', fontSize: '12px', color: '#ccc', borderRadius: '2px' }}>
                {f.name} {i === 0 && '(Primary)'}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <button type="button" className="btn btn-outline" style={{ padding: '14px 32px' }} onClick={() => navigate('/admin/properties')}>Cancel</button>
        <button type="submit" className="btn btn-dark" style={{ padding: '14px 32px' }} disabled={loading}>
          {loading ? 'Saving...' : isEdit ? 'Update Property' : 'Create Property'}
        </button>
      </div>
    </form>
  );
}
