import React, { useEffect, useState } from 'react';
import { getAllBookings, updateBookingStatus } from '../services/api';
import { useToast } from '../components/Toast';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const showToast = useToast();

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      const res = await getAllBookings();
      setBookings(res.data);
    } catch (e) {
      showToast('Failed to load bookings', 'error');
    } finally { setLoading(false); }
  };

  const handleStatus = async (id, status) => {
    try {
      const res = await updateBookingStatus(id, status);
      setBookings(bookings.map(b => b.id === id ? res.data : b));
      showToast(`Booking ${status.toLowerCase()} successfully`);
    } catch (e) {
      showToast('Failed to update booking', 'error');
    }
  };

  const statusTag = (s) => {
    const map = { PENDING: 'tag-pending', CONFIRMED: 'tag-confirmed', CANCELLED: 'tag-cancelled', COMPLETED: 'tag-completed' };
    return <span className={`tag ${map[s]||''}`}>{s}</span>;
  };

  const filtered = filter ? bookings.filter(b => b.status === filter) : bookings;

  if (loading) return <div className="spinner"><div className="spin"></div></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: 400 }}>Property Bookings</h2>
          <p style={{ color: '#999', fontSize: '13px', marginTop: '4px' }}>{bookings.length} total bookings</p>
        </div>
        <select className="form-control" style={{ width: 'auto', padding: '8px 14px' }}
          value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="">All Statuses</option>
          {['PENDING','CONFIRMED','CANCELLED','COMPLETED'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="admin-table">
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Property</th><th>Client</th><th>Phone</th><th>Visit Date</th><th>Time</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(b => (
              <tr key={b.id}>
                <td style={{ color: '#999', fontSize: '12px' }}>#{b.id}</td>
                <td><strong>{b.propertyTitle}</strong><br /><span style={{ fontSize: '11px', color: '#999' }}>{b.propertyCity}</span></td>
                <td>{b.visitorName}<br /><span style={{ fontSize: '11px', color: '#999' }}>{b.userName}</span></td>
                <td>{b.visitorPhone}</td>
                <td>{new Date(b.visitDate).toLocaleDateString('en-IN')}</td>
                <td>{b.visitTime}</td>
                <td>{statusTag(b.status)}</td>
                <td>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {b.status === 'PENDING' && (
                      <button className="btn-sm btn-success" onClick={() => handleStatus(b.id, 'CONFIRMED')}>Confirm</button>
                    )}
                    {b.status === 'CONFIRMED' && (
                      <button className="btn-sm btn-success" onClick={() => handleStatus(b.id, 'COMPLETED')}>Complete</button>
                    )}
                    {['PENDING','CONFIRMED'].includes(b.status) && (
                      <button className="btn-sm btn-danger" onClick={() => handleStatus(b.id, 'CANCELLED')}>Cancel</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8} style={{ textAlign: 'center', color: '#999', padding: '40px' }}>No bookings found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
