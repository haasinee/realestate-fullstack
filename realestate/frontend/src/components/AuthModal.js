import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AuthModal({ initialTab = 'login', onClose }) {
  const [tab, setTab] = useState(initialTab);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [regForm, setRegForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const user = await login(loginForm.email, loginForm.password);
      onClose();
      if (user.role === 'ADMIN') navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally { setLoading(false); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await register(regForm);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>

        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '24px' }}>
          {['login', 'register'].map(t => (
            <button key={t} onClick={() => { setTab(t); setError(''); }}
              style={{ flex: 1, padding: '10px', background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif', fontSize: '13px',
                color: tab === t ? 'var(--dark)' : '#999',
                borderBottom: tab === t ? '2px solid var(--gold)' : '2px solid transparent',
                marginBottom: '-1px', transition: 'all 0.2s' }}>
              {t === 'login' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>

        {error && (
          <div style={{ background: '#fce8e8', color: 'var(--danger)', padding: '10px 14px', fontSize: '13px', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        {tab === 'login' ? (
          <form onSubmit={handleLogin}>
            <h2 style={{ fontSize: '26px', fontWeight: 400, marginBottom: '6px' }}>Welcome Back</h2>
            <p style={{ color: '#999', fontSize: '13px', marginBottom: '24px' }}>Sign in to your account</p>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-control" type="email" required placeholder="your@email.com"
                value={loginForm.email} onChange={e => setLoginForm({...loginForm, email: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-control" type="password" required placeholder="••••••••"
                value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} />
            </div>
            <button className="btn btn-dark" type="submit" disabled={loading} style={{ width: '100%', marginTop: '8px' }}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <h2 style={{ fontSize: '26px', fontWeight: 400, marginBottom: '6px' }}>Create Account</h2>
            <p style={{ color: '#999', fontSize: '13px', marginBottom: '24px' }}>Join thousands of satisfied clients</p>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input className="form-control" required placeholder="First name"
                  value={regForm.firstName} onChange={e => setRegForm({...regForm, firstName: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input className="form-control" required placeholder="Last name"
                  value={regForm.lastName} onChange={e => setRegForm({...regForm, lastName: e.target.value})} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-control" type="email" required placeholder="your@email.com"
                value={regForm.email} onChange={e => setRegForm({...regForm, email: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input className="form-control" placeholder="+91 98765 00000"
                value={regForm.phone} onChange={e => setRegForm({...regForm, phone: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-control" type="password" required minLength={6} placeholder="Minimum 6 characters"
                value={regForm.password} onChange={e => setRegForm({...regForm, password: e.target.value})} />
            </div>
            <button className="btn btn-dark" type="submit" disabled={loading} style={{ width: '100%', marginTop: '8px' }}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
