import React, { useEffect, useState } from 'react';
import { getProfile } from '../services/api';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile().then(res => setProfile(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner"><div className="spin"></div></div>;
  if (!profile) return <div className="section">Unable to load profile.</div>;

  return (
    <div className="section">
      <h2 className="section-title" style={{ marginBottom: '16px' }}>My Profile</h2>
      <div className="card" style={{ padding: '18px', marginBottom: '18px' }}>
        <p><strong>Name:</strong> {profile.firstName} {profile.lastName}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Phone:</strong> {profile.phone || 'N/A'}</p>
      </div>

      <div className="grid-2">
        <div className="card" style={{ padding: '18px' }}>
          <h3 style={{ marginBottom: '10px' }}>My Bookings ({profile.bookings?.length || 0})</h3>
          {(profile.bookings || []).slice(0, 5).map(b => (
            <div key={b.id} style={{ borderTop: '1px solid var(--border)', padding: '10px 0' }}>
              <div style={{ fontWeight: 500 }}>{b.propertyTitle}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>{b.visitDate} at {b.visitTime} · {b.status}</div>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: '18px' }}>
          <h3 style={{ marginBottom: '10px' }}>My Reviews ({profile.reviews?.length || 0})</h3>
          {(profile.reviews || []).slice(0, 5).map(r => (
            <div key={r.id} style={{ borderTop: '1px solid var(--border)', padding: '10px 0' }}>
              <div style={{ fontWeight: 500 }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>{r.comment}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
