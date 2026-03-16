import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProperty, getReviews, createReview, createBooking } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import AuthModal from '../components/AuthModal';

const GRADIENTS = [
  'linear-gradient(135deg,#8B7355,#5C4A32)',
  'linear-gradient(135deg,#4A6B8A,#2C4A6E)',
  'linear-gradient(135deg,#6B4A8A,#4A2C6E)',
  'linear-gradient(135deg,#4A8A6B,#2C6E4A)',
  'linear-gradient(135deg,#8A6B4A,#6E4A2C)',
  'linear-gradient(135deg,#4A4A8A,#2C2C6E)',
];

function formatPrice(price) {
  const cr = price / 10000000;
  return cr >= 1 ? `₹${cr.toFixed(2)} Cr` : `₹${(price / 100000).toFixed(1)} L`;
}

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const showToast = useToast();

  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);

  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  const [bookingForm, setBookingForm] = useState({ visitorName: '', visitorPhone: '', visitDate: '', visitTime: '10:00', notes: '' });
  const [bookingLoading, setBookingLoading] = useState(false);

  const gradient = GRADIENTS[Number(id) % GRADIENTS.length];

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [propRes, revRes] = await Promise.all([getProperty(id), getReviews(id)]);
      setProperty(propRes.data);
      setReviews(revRes.data);
    } catch (e) {
      navigate('/');
    } finally { setLoading(false); }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) { setShowAuth(true); return; }
    if (!reviewRating) { showToast('Please select a star rating', 'error'); return; }
    setReviewLoading(true);
    try {
      const res = await createReview({ propertyId: Number(id), rating: reviewRating, comment: reviewComment });
      setReviews([...reviews, res.data]);
      setReviewRating(0); setReviewComment('');
      showToast('Review submitted successfully!');
    } catch (e) {
      showToast(e.response?.data?.error || 'Could not submit review', 'error');
    } finally { setReviewLoading(false); }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) { setShowAuth(true); return; }
    setBookingLoading(true);
    try {
      await createBooking({
        propertyId: Number(id),
        visitDate: bookingForm.visitDate,
        visitTime: bookingForm.visitTime + ':00',
        visitorName: bookingForm.visitorName,
        visitorPhone: bookingForm.visitorPhone,
        notes: bookingForm.notes,
      });
      showToast('Visit booked successfully! We will confirm shortly.');
      setBookingForm({ visitorName: '', visitorPhone: '', visitDate: '', visitTime: '10:00', notes: '' });
    } catch (e) {
      showToast(e.response?.data?.error || 'Booking failed', 'error');
    } finally { setBookingLoading(false); }
  };

  if (loading) return <div className="spinner"><div className="spin"></div></div>;
  if (!property) return null;

  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : 'N/A';
  const amenitiesList = property.amenities ? property.amenities.split(',').map(a => a.trim()) : [];

  return (
    <>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}

      {/* Back */}
      <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '14px 2rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', color: '#999', fontFamily: 'DM Sans,sans-serif' }}>
        ← Back to Listings
      </button>

      {/* Hero Image */}
      <div style={{ height: '420px', position: 'relative', overflow: 'hidden' }}>
        {property.imageUrls?.length > 0 ? (
          <img src={property.imageUrls[0]} alt={property.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ background: gradient, width: '100%', height: '100%' }} />
        )}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top,rgba(0,0,0,.75),transparent)', padding: '32px 2rem' }}>
          <span style={{ display: 'inline-block', background: 'var(--gold)', color: 'var(--dark)', fontSize: '10px', letterSpacing: '1.5px', padding: '4px 10px', marginBottom: '8px', fontWeight: 500 }}>
            {property.isFeatured ? 'Featured' : property.propertyType} · {property.status}
          </span>
          <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: '40px', color: '#fff', fontWeight: 300 }}>{property.title}</h1>
          <p style={{ color: '#ccc', fontSize: '13px', marginTop: '6px' }}>📍 {property.address}, {property.city} · Agent: {property.agentName}</p>
        </div>
      </div>

      {/* Body */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '32px', padding: '32px 2rem', maxWidth: '1200px', margin: '0 auto' }}>

        {/* Main */}
        <div>
          {/* Price + Description */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '16px' }}>
              <span style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: '42px', fontWeight: 400 }}>{formatPrice(property.price)}</span>
              {property.areaSqft && <span style={{ fontSize: '13px', color: '#999' }}>₹{Math.round((property.price) / property.areaSqft).toLocaleString()}/sqft</span>}
            </div>
            <p style={{ fontSize: '14px', color: 'var(--slate)', lineHeight: 1.8 }}>{property.description}</p>
          </div>

          {/* Specs */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 500, marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid var(--border)' }}>Property Specifications</h3>
            <div className="grid-2" style={{ gap: '12px' }}>
              {[
                property.bedrooms > 0 && ['Bedrooms', property.bedrooms],
                ['Bathrooms', property.bathrooms],
                property.areaSqft && ['Total Area', `${property.areaSqft.toLocaleString()} sqft`],
                property.floorNumber && ['Floor', `${property.floorNumber}${property.propertyType === 'COMMERCIAL' ? ' Floors' : 'th Floor'}`],
                property.yearBuilt && ['Year Built', property.yearBuilt],
                ['Property Type', property.propertyType],
                ['Status', property.status],
                property.pincode && ['Pincode', property.pincode],
              ].filter(Boolean).map(([label, value]) => (
                <div key={label} style={{ background: 'var(--mist)', padding: '14px', borderLeft: '3px solid var(--gold)' }}>
                  <div style={{ fontSize: '11px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>{label}</div>
                  <div style={{ fontSize: '15px', fontWeight: 500 }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Amenities */}
          {amenitiesList.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 500, marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid var(--border)' }}>Amenities & Features</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {amenitiesList.map(a => (
                  <span key={a} style={{ background: 'var(--mist)', border: '1px solid var(--border)', padding: '6px 14px', fontSize: '12px', color: 'var(--slate)' }}>{a}</span>
                ))}
              </div>
            </div>
          )}



          {/* Location Map */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '26px', fontWeight: 400, marginBottom: '14px' }}>Location</h3>
            <div className="card" style={{ overflow: 'hidden' }}>
              <iframe
                title="Property Location"
                width="100%"
                height="320"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${property.latitude && property.longitude ? `${property.latitude},${property.longitude}` : encodeURIComponent(`${property.address || ''} ${property.city || ''}`)}&output=embed`}
              />
            </div>
          </div>

          {/* Reviews */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 500, marginBottom: '20px', paddingBottom: '8px', borderBottom: '1px solid var(--border)' }}>Reviews & Ratings</h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '32px', marginBottom: '24px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: '52px', color: 'var(--gold)', lineHeight: 1 }}>{avgRating}</div>
                <div style={{ color: 'var(--gold)', fontSize: '18px', marginTop: '4px' }}>
                  {'★'.repeat(Math.round(Number(avgRating) || 0))}
                </div>
                <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>{reviews.length} reviews</div>
              </div>
              <div style={{ flex: 1 }}>
                {[5,4,3,2,1].map(s => {
                  const count = reviews.filter(r => r.rating === s).length;
                  const pct = reviews.length ? (count / reviews.length) * 100 : 0;
                  return (
                    <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '12px', color: '#999', width: '12px' }}>{s}</span>
                      <div style={{ flex: 1, height: '6px', background: 'var(--border)', borderRadius: '3px' }}>
                        <div style={{ height: '100%', background: 'var(--gold)', width: `${pct}%`, borderRadius: '3px', transition: 'width 0.5s' }} />
                      </div>
                      <span style={{ fontSize: '11px', color: '#999', width: '20px' }}>{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {reviews.map(r => (
              <div key={r.id} style={{ background: '#fff', border: '1px solid var(--border)', padding: '20px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                  <div className="avatar" style={{ width: '38px', height: '38px', background: 'var(--gold-light)', color: 'var(--dark)' }}>
                    {r.userName?.split(' ').map(n => n[0]).join('').slice(0,2)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '13px' }}>{r.userName}</div>
                    <div style={{ fontSize: '12px', color: '#999' }}>
                      <span style={{ color: 'var(--gold)' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</span>
                      {' · '}{new Date(r.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--slate)', lineHeight: 1.7 }}>{r.comment}</p>
              </div>
            ))}

            {/* Add Review */}
            <div style={{ background: 'var(--mist)', border: '1px dashed var(--border)', padding: '24px', marginTop: '16px' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 500, marginBottom: '16px' }}>Write a Review</h4>
              <form onSubmit={handleReview}>
                <div style={{ marginBottom: '14px' }}>
                  <label className="form-label" style={{ display: 'block', marginBottom: '8px' }}>Your Rating</label>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {[1,2,3,4,5].map(s => (
                      <span key={s} onClick={() => setReviewRating(s)}
                        onMouseEnter={() => setReviewHover(s)} onMouseLeave={() => setReviewHover(0)}
                        style={{ fontSize: '28px', cursor: 'pointer', color: s <= (reviewHover || reviewRating) ? 'var(--gold)' : '#ddd', transition: 'color 0.1s' }}>★</span>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Your Review</label>
                  <textarea className="form-control" rows={3} required
                    placeholder="Share your experience with this property..."
                    value={reviewComment} onChange={e => setReviewComment(e.target.value)} />
                </div>
                <button className="btn btn-outline" type="submit" disabled={reviewLoading}
                  style={{ padding: '10px 24px' }}>
                  {reviewLoading ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          {/* Price + Booking */}
          <div className="card" style={{ padding: '24px', marginBottom: '16px', position: 'sticky', top: '80px' }}>
            <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: '38px', fontWeight: 400 }}>{formatPrice(property.price)}</div>
            <div style={{ fontSize: '12px', color: '#999', marginBottom: '20px' }}>All-inclusive · GST applicable</div>

            <form onSubmit={handleBooking} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Your Full Name</label>
                <input className="form-control" required placeholder="Full name"
                  value={bookingForm.visitorName} onChange={e => setBookingForm({...bookingForm, visitorName: e.target.value})} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Phone Number</label>
                <input className="form-control" required placeholder="+91 98765 00000"
                  value={bookingForm.visitorPhone} onChange={e => setBookingForm({...bookingForm, visitorPhone: e.target.value})} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Preferred Visit Date</label>
                <input className="form-control" type="date" required
                  min={new Date().toISOString().split('T')[0]}
                  value={bookingForm.visitDate} onChange={e => setBookingForm({...bookingForm, visitDate: e.target.value})} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Preferred Time</label>
                <select className="form-control" value={bookingForm.visitTime} onChange={e => setBookingForm({...bookingForm, visitTime: e.target.value})}>
                  {['09:00','10:00','11:00','12:00','14:00','15:00','16:00','17:00'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Notes (optional)</label>
                <textarea className="form-control" rows={2} placeholder="Any special requests..."
                  value={bookingForm.notes} onChange={e => setBookingForm({...bookingForm, notes: e.target.value})} />
              </div>
              <button className="btn btn-dark" type="submit" disabled={bookingLoading} style={{ width: '100%', marginTop: '4px' }}>
                {bookingLoading ? 'Booking...' : 'Book Property Visit'}
              </button>
            </form>
          </div>

          {/* Agent Card */}
          <div className="card" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 500, marginBottom: '14px' }}>Contact Agent</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="avatar" style={{ width: '44px', height: '44px', fontSize: '14px' }}>
                {property.agentName?.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div style={{ fontWeight: 500, fontSize: '14px' }}>{property.agentName}</div>
                <div style={{ fontSize: '12px', color: '#999' }}>Senior Property Consultant</div>
                <div style={{ fontSize: '13px', color: 'var(--gold)', marginTop: '2px' }}>{property.agentPhone}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
