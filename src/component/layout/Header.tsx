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
    <header style={{
      backgroundColor: 'white',
      borderBottom: '1px solid var(--border-color)',
      padding: '0',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: 'var(--shadow)'
    }}>
      {/* Top Bar */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '16px 24px',
        borderBottom: '1px solid var(--border-color)'
      }}>
        {/* Left Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={onMenuToggle}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px',
              display: 'none'
            }}
            className="mobile-only"
          >
            ☰
          </button>
          
          {title && (
            <h1 style={{ 
              fontSize: '24px', 
              fontWeight: '700',
              color: 'var(--text-primary)'
            }}>
              {title}
            </h1>
          )}
        </div>

        {/* Right Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Notifications */}
          <button style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '8px',
            position: 'relative',
            transition: 'background-color 0.2s ease'
          }}>
            🔔
            <span style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '8px',
              height: '8px',
              backgroundColor: 'var(--error-color)',
              borderRadius: '50%'
            }} />
          </button>

          {/* User Menu */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                borderRadius: '8px',
                transition: 'background-color 0.2s ease'
              }}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '14px'
              }}>
                U
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: '600', fontSize: '14px' }}>User Admin</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Administrator</div>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>▼</span>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                backgroundColor: 'white',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                boxShadow: 'var(--shadow-lg)',
                padding: '8px 0',
                minWidth: '200px',
                marginTop: '8px'
              }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)' }}>
                  <div style={{ fontWeight: '600', fontSize: '14px' }}>User Administrator</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>admin@finance.com</div>
                </div>
                <Link 
                  to="/profile" 
                  style={{
                    display: 'block',
                    padding: '12px 16px',
                    textDecoration: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--background-color)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  👤 Profile Settings
                </Link>
                <Link 
                  to="/settings" 
                  style={{
                    display: 'block',
                    padding: '12px 16px',
                    textDecoration: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--background-color)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  ⚙️ System Settings
                </Link>
                <button style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '12px 16px',
                  background: 'none',
                  border: 'none',
                  borderTop: '1px solid var(--border-color)',
                  color: 'var(--error-color)',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--background-color)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  🚪 Logout System
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div style={{
        padding: '0 24px',
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}>
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                textDecoration: 'none',
                color: isActive ? 'var(--primary-color)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
                borderRadius: '8px',
                fontWeight: isActive ? '600' : '500',
                fontSize: '14px',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                border: isActive ? '1px solid var(--primary-color)' : '1px solid transparent',
                margin: '8px 0'
              }}
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