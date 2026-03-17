import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/properties', label: 'Properties' },
    ...(user ? [{ to: '/bookings', label: 'Booking' }, { to: '/profile', label: 'Profile' }] : []),
    ...(user?.role === 'ADMIN' ? [{ to: '/admin', label: 'Admin' }] : []),
    ...(!user ? [{ to: '/auth', label: 'Login/Register' }] : []),
  ];

  return (
    <>
      <button className="sidebar-toggle" onClick={() => setOpen(!open)}>☰</button>
      <aside className={`app-sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-title">Navigate</div>
        {links.map(link => (
          <NavLink key={link.to} to={link.to} className="sidebar-link" onClick={() => setOpen(false)}>
            {link.label}
          </NavLink>
        ))}
      </aside>
    </>
  );
}
