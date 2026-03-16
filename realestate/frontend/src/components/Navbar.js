import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);
  const [authTab, setAuthTab] = useState('login');

  const openLogin = () => { setAuthTab('login'); setShowAuth(true); };

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="navbar-brand">PREMI<span>UM</span> ESTATES</Link>

        <div className="navbar-links">
          <Link to="/properties" className="nav-link">Properties</Link>
          {user && <Link to="/bookings" className="nav-link">My Bookings</Link>}
          {user && <Link to="/profile" className="nav-link">Profile</Link>}
          {user?.role === 'ADMIN' && <Link to="/admin" className="nav-link">Admin</Link>}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {user ? (
            <>
              <div className="avatar">{user.firstName?.[0]}{user.lastName?.[0]}</div>
              <span style={{ color: '#ccc', fontSize: '13px' }}>{user.firstName}</span>
              <button className="btn btn-outline" style={{ color: '#aaa', borderColor: '#444', padding: '8px 16px' }} onClick={logout}>Logout</button>
            </>
          ) : (
            <button className="btn btn-gold" onClick={openLogin}>Sign In</button>
          )}
        </div>
      </nav>

      {showAuth && <AuthModal initialTab={authTab} onClose={() => setShowAuth(false)} />}
    </>
  );
}
