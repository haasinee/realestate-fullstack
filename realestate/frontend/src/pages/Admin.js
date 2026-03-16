import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { getPropertyStats, getAllBookings, getProperties } from '../services/api';
import AdminProperties from './AdminProperties';
import AdminAddProperty from './AdminAddProperty';
import AdminBookings from './AdminBookings';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    getPropertyStats().then(r => setStats(r.data)).catch(() => {});
    getAllBookings().then(r => setRecentBookings(r.data.slice(0, 5))).catch(() => {});
  }, []);

  const statusTag = (s) => {
    const map = { PENDING: 'tag-pending', CONFIRMED: 'tag-confirmed', CANCELLED: 'tag-cancelled', COMPLETED: 'tag-completed' };
    return <span className={`tag ${map[s]||''}`}>{s}</span>;
  };

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 400 }}>Dashboard Overview</h2>
        <p style={{ color: '#999', fontSize: '13px', marginTop: '4px' }}>Welcome back — here's what's happening today</p>
      </div>

      <div className="grid-4" style={{ marginBottom: '32px' }}>
        {[
          ['Total Properties', stats?.totalProperties ?? '—', '⌂'],
          ['Active Listings', stats?.activeProperties ?? '—', '✓'],
          ['Sold Properties', stats?.soldProperties ?? '—', '🏷'],
          ['Pending Bookings', recentBookings.filter(b=>b.status==='PENDING').length, '📅'],
        ].map(([label, value, icon]) => (
          <div key={label} className="admin-card">
            <div style={{ fontSize: '22px', marginBottom: '8px' }}>{icon}</div>
            <div className="admin-stat-num">{value}</div>
            <div className="admin-stat-label">{label}</div>
          </div>
        ))}
      </div>

      <div className="admin-table">
        <div className="table-header">
          <h3 style={{ fontSize: '15px', fontWeight: 500 }}>Recent Bookings</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>Property</th><th>Client</th><th>Visit Date</th><th>Time</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentBookings.map(b => (
              <tr key={b.id}>
                <td><strong>{b.propertyTitle}</strong></td>
                <td>{b.visitorName}</td>
                <td>{new Date(b.visitDate).toLocaleDateString('en-IN')}</td>
                <td>{b.visitTime}</td>
                <td>{statusTag(b.status)}</td>
              </tr>
            ))}
            {recentBookings.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: '#999', padding: '32px' }}>No bookings yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const NAV_ITEMS = [
  { path: '', label: '⊞  Dashboard' },
  { path: 'properties', label: '⌂  Properties' },
  { path: 'add-property', label: '+  Add Property' },
  { path: 'bookings', label: '📅  Bookings' },
];

export default function Admin() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname.split('/admin/')[1] || '';

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,.06)', marginBottom: '8px' }}>
          <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: '16px', color: 'var(--gold)' }}>Admin Panel</div>
          <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>Premium Estates</div>
        </div>
        {NAV_ITEMS.map(item => (
          <div key={item.path}
            className={`admin-nav-item ${currentPath === item.path ? 'active' : ''}`}
            onClick={() => navigate(`/admin${item.path ? '/' + item.path : ''}`)}>
            {item.label}
          </div>
        ))}
      </div>

      <div className="admin-main">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="properties" element={<AdminProperties />} />
          <Route path="add-property" element={<AdminAddProperty />} />
          <Route path="edit-property/:id" element={<AdminAddProperty />} />
          <Route path="bookings" element={<AdminBookings />} />
        </Routes>
      </div>
    </div>
  );
}
