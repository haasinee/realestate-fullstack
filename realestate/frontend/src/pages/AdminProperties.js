import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProperties, deleteProperty } from '../services/api';
import { useToast } from '../components/Toast';

function formatPrice(price) {
  const cr = price / 10000000;
  return cr >= 1 ? `₹${cr.toFixed(2)} Cr` : `₹${(price / 100000).toFixed(1)} L`;
}

export default function AdminProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const showToast = useToast();
  const navigate = useNavigate();

  useEffect(() => { fetchProps(); }, []);

  const fetchProps = async () => {
    try {
      const res = await getProperties();
      setProperties(res.data);
    } catch (e) {
      showToast('Failed to load properties', 'error');
    } finally { setLoading(false); }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await deleteProperty(id);
      setProperties(properties.filter(p => p.id !== id));
      showToast('Property deleted successfully');
    } catch (e) {
      showToast('Failed to delete property', 'error');
    }
  };

  if (loading) return <div className="spinner"><div className="spin"></div></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: 400 }}>Property Listings</h2>
          <p style={{ color: '#999', fontSize: '13px', marginTop: '4px' }}>{properties.length} total properties</p>
        </div>
        <button className="btn btn-dark" onClick={() => navigate('/admin/add-property')}>+ Add New Property</button>
      </div>

      <div className="admin-table">
        <table>
          <thead>
            <tr>
              <th>Property Name</th><th>Type</th><th>City</th><th>Price</th><th>Status</th><th>Rating</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.map(p => (
              <tr key={p.id}>
                <td><strong>{p.title}</strong></td>
                <td><span className="tag tag-active">{p.propertyType}</span></td>
                <td>{p.city}</td>
                <td>{formatPrice(p.price)}</td>
                <td><span className={`tag ${p.status === 'ACTIVE' ? 'tag-active' : p.status === 'SOLD' ? 'tag-sold' : 'tag-pending'}`}>{p.status}</span></td>
                <td>{p.averageRating ? `⭐ ${p.averageRating.toFixed(1)}` : 'No ratings'}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn-sm" onClick={() => navigate(`/property/${p.id}`)}>View</button>
                    <button className="btn-sm" onClick={() => navigate(`/admin/edit-property/${p.id}`)}>Edit</button>
                    <button className="btn-sm btn-danger" onClick={() => handleDelete(p.id, p.title)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {properties.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: 'center', color: '#999', padding: '40px' }}>No properties found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
