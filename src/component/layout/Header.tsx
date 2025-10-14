import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../layout/global.css';

interface HeaderProps {
  onMenuToggle: () => void;
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle, title }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/buku-utama', label: 'Buku Utama', icon: '📖' },
    { path: '/uang-masuk', label: 'Uang Masuk', icon: '💰' },
    { path: '/uang-keluar', label: 'Uang Keluar', icon: '💸' },
    { path: '/laporan-lapangan', label: 'Laporan Lapangan', icon: '📋' },
  ];

  return (
    <header>
      {/* Top Bar */}
      <div className="header-top">
        <div className="header-left">
          <button
            onClick={onMenuToggle}
            className="menu-toggle"
            title="Toggle Menu"
          >
            ☰
          </button>
          
          {title && (
            <h1 className="header-title">
              {title}
            </h1>
          )}
        </div>

        <div className="header-right">
          {/* Notifications */}
          <button className="notification-btn">
            <span>🔔</span>
            <span className="notification-badge"></span>
          </button>

          {/* User Menu */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="user-menu-btn"
            >
              <div className="flex gap-3 items-center">
                <div className="user-avatar">
                  U
                </div>
                <div className="user-info">
                  <div className="user-name">User Admin</div>
                  <div className="user-role">Administrator</div>
                </div>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>▼</span>
              </div>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="card" style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                minWidth: '200px',
                marginTop: '8px',
                zIndex: 1000
              }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)' }}>
                  <div className="user-name">User Administrator</div>
                  <div className="user-role">admin@finance.com</div>
                </div>
                <Link 
                  to="/profile" 
                  className="sidebar-item"
                  style={{ margin: '4px 0', borderRadius: '8px' }}
                >
                  👤 Profile Settings
                </Link>
                <Link 
                  to="/settings" 
                  className="sidebar-item"
                  style={{ margin: '4px 0', borderRadius: '8px' }}
                >
                  ⚙️ System Settings
                </Link>
                <button className="logout-btn" style={{ margin: '8px 0', width: '100%' }}>
                  🚪 Logout System
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="header-nav">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <span style={{ fontSize: '16px' }}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
};