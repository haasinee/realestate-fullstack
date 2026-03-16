import React, { useEffect, useState } from 'react';
import { getMyBookings, cancelBooking } from '../services/api';
import { useToast } from '../components/Toast';
import { useNavigate } from 'react-router-dom';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const showToast = useToast();
  const navigate = useNavigate();

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      const res = await getMyBookings();
      setBookings(res.data);
    } catch (e) {
      showToast('Failed to load bookings', 'error');
    } finally { setLoading(false); }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await cancelBooking(id);
      setBookings(bookings.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b));
      showToast('Booking cancelled successfully');
    } catch (e) {
      showToast('Failed to cancel booking', 'error');
    }
  };

  const statusTag = (status) => {
    const map = { PENDING: 'tag-pending', CONFIRMED: 'tag-confirmed', CANCELLED: 'tag-cancelled', COMPLETED: 'tag-completed' };
    return <span className={`tag ${map[status] || ''}`}>{status}</span>;
  };

  if (loading) return <div className="spinner"><div className="spin"></div></div>;

  return (
    <div className="section">
      <div className="section-header">
        <h2 className="section-title">My Bookings</h2>
      </div>

      {bookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#999' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>📅</div>
          <p>You have no property visit bookings yet.</p>
          <button className="btn btn-dark" style={{ marginTop: '16px' }} onClick={() => navigate('/')}>Browse Properties</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {bookings.map(b => (
            <div key={b.id} className="card" style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 500, fontSize: '16px', marginBottom: '6px' }}>{b.propertyTitle}</div>
                <div style={{ fontSize: '13px', color: '#999', marginBottom: '8px' }}>📍 {b.propertyCity}</div>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '13px' }}>📅 {new Date(b.visitDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  <span style={{ fontSize: '13px' }}>🕐 {b.visitTime}</span>
                  <span style={{ fontSize: '13px' }}>👤 {b.visitorName}</span>
                  <span style={{ fontSize: '13px' }}>📞 {b.visitorPhone}</span>
                </div>
                {b.notes && <p style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>Note: {b.notes}</p>}
              </div>
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                {statusTag(b.status)}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn-sm" onClick={() => navigate(`/property/${b.propertyId}`)}>View Property</button>
                  {['PENDING', 'CONFIRMED'].includes(b.status) && (
                    <button className="btn-sm btn-danger" onClick={() => handleCancel(b.id)}>Cancel</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
