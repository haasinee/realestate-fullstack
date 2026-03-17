import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginRegister() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [tab, setTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (tab === 'login') {
        await login(form.email, form.password);
      } else {
        await register(form);
      }
      navigate('/profile');
    } catch (err) {
      alert(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section" style={{ maxWidth: 520 }}>
      <h1 className="section-title">{tab === 'login' ? 'Login' : 'Register'}</h1>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button className="btn btn-outline" onClick={() => setTab('login')}>Login</button>
        <button className="btn btn-outline" onClick={() => setTab('register')}>Register</button>
      </div>
      <form onSubmit={submit} className="card" style={{ padding: 16 }}>
        {tab === 'register' && (
          <>
            <input className="form-control" placeholder="First Name" style={{ marginBottom: 10 }} value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            <input className="form-control" placeholder="Last Name" style={{ marginBottom: 10 }} value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
          </>
        )}
        <input className="form-control" type="email" required placeholder="Email" style={{ marginBottom: 10 }} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="form-control" type="password" required placeholder="Password" style={{ marginBottom: 10 }} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="btn btn-dark" disabled={loading}>{loading ? 'Please wait...' : (tab === 'login' ? 'Login' : 'Create account')}</button>
      </form>
    </div>
  );
}
