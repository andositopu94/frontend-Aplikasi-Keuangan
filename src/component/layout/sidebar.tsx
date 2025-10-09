import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../layout/global.css';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/buku-utama', label: 'Buku Utama', icon: '📖' },
    { path: '/uang-masuk', label: 'Uang Masuk', icon: '💰' },
    { path: '/uang-keluar', label: 'Uang Keluar', icon: '💸' },
    { path: '/laporan-lapangan', label: 'Laporan Lapangan', icon: '📋' },
  ];

  const sidebarStyle: React.CSSProperties = {
    width: '280px',
    height: '100vh',
    backgroundColor: 'white',
    borderRight: '1px solid var(--border-color)',
    padding: '24px 0',
    position: 'fixed',
    left: 0,
    top: 0,
    overflowY: 'auto',
    transition: 'transform 0.3s ease',
    zIndex: 1000,
    boxShadow: 'var(--shadow)'
  };

  const mobileSidebarStyle: React.CSSProperties = {
    ...sidebarStyle,
    transform: isOpen ? 'translateX(0)' : 'translateX(-100%)'
  };

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
    display: isOpen ? 'block' : 'none'
  };

  return (
    <>
      {/* Mobile Overlay */}
      {onClose && <div style={overlayStyle} onClick={onClose} />}
      
      {/* Sidebar */}
      <div style={onClose ? mobileSidebarStyle : sidebarStyle}>
        {/* Logo */}
        <div style={{ 
          padding: '0 24px 32px', 
          borderBottom: '1px solid var(--border-color)',
          textAlign: 'center'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '8px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: 'var(--primary-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              color: 'white'
            }}>
              💼
            </div>
          </div>
          <h2 style={{ 
            color: 'var(--primary-color)', 
            fontSize: '20px', 
            fontWeight: 'bold',
            marginBottom: '4px'
          }}>
            Finance App
          </h2>
          <p style={{ 
            color: 'var(--text-secondary)', 
            fontSize: '12px',
            fontWeight: '500'
          }}>
            Management System
          </p>
        </div>

        {/* Navigation Header */}
        <div style={{ 
          padding: '16px 24px 8px',
          marginTop: '16px'
        }}>
          <div style={{
            fontSize: '12px',
            fontWeight: '600',
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Navigasi Utama
          </div>
        </div>

        {/* Menu Items */}
        <nav style={{ padding: '8px 0' }}>
          <ul style={{ listStyle: 'none' }}>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path} style={{ marginBottom: '4px' }}>
                  <Link
                    to={item.path}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '14px 24px',
                      textDecoration: 'none',
                      color: isActive ? 'var(--primary-color)' : 'var(--text-secondary)',
                      backgroundColor: isActive ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
                      borderRight: isActive ? '4px solid var(--primary-color)' : 'none',
                      fontWeight: isActive ? '600' : '500',
                      transition: 'all 0.2s ease',
                      fontSize: '15px'
                    }}
                    onClick={onClose}
                  >
                    <span style={{ 
                      fontSize: '18px',
                      width: '24px',
                      textAlign: 'center'
                    }}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                    {isActive && (
                      <div style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary-color)',
                        marginLeft: 'auto'
                      }} />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Quick Stats */}
        <div style={{ 
          padding: '20px 24px',
          margin: '20px 24px',
          backgroundColor: 'var(--background-color)',
          borderRadius: '12px',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ 
            fontSize: '12px', 
            fontWeight: '600', 
            color: 'var(--text-secondary)',
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Ringkasan Cepat
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Transaksi Hari Ini:</span>
            <span style={{ fontSize: '13px', fontWeight: '600' }}>12</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Total Saldo:</span>
            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--success-color)' }}>Active</span>
          </div>
        </div>

        {/* User Info */}
        <div style={{ 
          padding: '20px 24px', 
          borderTop: '1px solid var(--border-color)',
          marginTop: 'auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '16px'
            }}>
              U
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', fontSize: '14px' }}>User Administrator</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>admin@finance.com</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};