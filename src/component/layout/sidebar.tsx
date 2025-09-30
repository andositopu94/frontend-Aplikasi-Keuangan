import React from 'react';
import { Link } from 'react-router-dom';

export const Sidebar = () => {
  return (
    <div style={sidebarStyle}>
      <h3>Menu</h3>
      <ul style={menuListStyle}>
        <li><Link to="/" style={linkStyle}>Dashboard</Link></li>
        <li><Link to="/buku-utama" style={linkStyle}>Buku Utama</Link></li>
        <li><Link to="/uang-masuk" style={linkStyle}>Uang Masuk</Link></li>
        <li><Link to="/uang-keluar" style={linkStyle}>Uang Keluar</Link></li>
        <li><Link to="/laporan-lapangan" style={linkStyle}>Laporan Lapangan</Link></li> {/* ✅ Menu baru */}
      </ul>
    </div>
  );
};

// Styling
const sidebarStyle: React.CSSProperties = {
  width: '200px',
  padding: '20px',
  backgroundColor: '#f4f4f4',
  height: '100vh',
  position: 'fixed'
};

const menuListStyle = {
  listStyle: 'none',
  padding: 0
};

const linkStyle = {
  textDecoration: 'none',
  color: '#333',
  display: 'block',
  padding: '10px 0'
};