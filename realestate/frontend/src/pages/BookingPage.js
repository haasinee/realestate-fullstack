import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createBooking, getProperty } from '../services/api';

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [form, setForm] = useState({ visitorName: '', visitorPhone: '', visitDate: '', visitTime: '10:00', notes: '' });

  useEffect(() => {
    getProperty(id).then((res) => setProperty(res.data));
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    await createBooking({ propertyId: Number(id), ...form });
    navigate('/bookings');
  };

  return (
    <div className="section" style={{ maxWidth: 720 }}>
      <h1 className="section-title">Book a Visit</h1>
      {property && <p style={{ marginBottom: 16 }}>Property: <strong>{property.propertyName}</strong> · {property.location}</p>}
      <form onSubmit={submit} className="card" style={{ padding: 16 }}>
        <input className="form-control" required placeholder="Your Name" style={{ marginBottom: 10 }} value={form.visitorName} onChange={(e) => setForm({ ...form, visitorName: e.target.value })} />
        <input className="form-control" required placeholder="Phone" style={{ marginBottom: 10 }} value={form.visitorPhone} onChange={(e) => setForm({ ...form, visitorPhone: e.target.value })} />
        <input className="form-control" required type="date" style={{ marginBottom: 10 }} value={form.visitDate} onChange={(e) => setForm({ ...form, visitDate: e.target.value })} />
        <input className="form-control" required type="time" style={{ marginBottom: 10 }} value={form.visitTime} onChange={(e) => setForm({ ...form, visitTime: e.target.value })} />
        <textarea className="form-control" rows={3} placeholder="Notes" style={{ marginBottom: 10 }} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        <button className="btn btn-dark">Confirm Booking</button>
      </form>
    </div>
  );
}
