import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../store/AuthContext';
import {
  RiHome4Line, RiInboxLine, RiUserLine, RiSendPlaneLine,
  RiShieldLine, RiLogoutBoxLine, RiMenuLine, RiCloseLine,
  RiSparklingLine
} from 'react-icons/ri';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/dashboard', icon: <RiHome4Line />, label: 'Dashboard' },
  { to: '/inbox', icon: <RiInboxLine />, label: 'Inbox' },
  { to: '/profile', icon: <RiUserLine />, label: 'Profile' },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out!');
    navigate('/login');
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="page-layout">
      <div className="aurora-bg" />

      {/* Mobile Topbar */}
      <div className="mobile-topbar">
        <button className="hamburger-btn" onClick={() => setSidebarOpen(true)} id="mobile-menu-btn">
          <RiMenuLine />
        </button>
        <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem',
          background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Compliment Exchange
        </div>
        <div style={{ width: 40 }} />
      </div>

      {/* Overlay */}
      <div
        className={`mobile-overlay ${sidebarOpen ? 'visible' : ''}`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <nav className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-text">✨ Compliment Exchange</div>
          <div className="logo-sub">Spread positivity anonymously</div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={closeSidebar}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}

          {user?.is_staff && (
            <NavLink
              to="/admin"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={closeSidebar}
            >
              <span className="nav-icon"><RiShieldLine /></span>
              Admin Panel
            </NavLink>
          )}
        </div>

        {/* User bottom section */}
        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 16, margin: '0 12px' }}>
          <div style={{ padding: '12px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'var(--gradient-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.9rem', fontWeight: 700, color: 'white', flexShrink: 0
            }}>
              {user?.username?.[0]?.toUpperCase() || '?'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-text)',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.username}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.email}
              </div>
            </div>
          </div>
          <button className="nav-item" onClick={handleLogout} style={{ width: '100%', border: 'none', background: 'none', color: 'var(--color-text-muted)' }}>
            <span className="nav-icon"><RiLogoutBoxLine /></span>
            Sign Out
          </button>
        </div>
      </nav>

      {/* Main content */}
      <main className="main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
