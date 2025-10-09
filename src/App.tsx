import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './component/layout/sidebar';
import UangMasukList from './component/uang-masuk/uangMasukList';
import LaporanLapanganPage from './component/laporan-lapangan/LaporanLapanganPage';
import Dashboard from './component/Dashboard';
import BukuUtamaList from './component/buku-utama/BukuUtamaList';
import UangKeluarList from './component/uang-keluar/uangKeluarList';
import './component/layout/global.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="app-container">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div style={{ 
          flex: 1, 
          marginLeft: '280px',
          minHeight: '100vh'
        }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/uang-masuk" element={<UangMasukList />} />
            <Route path="/uang-keluar" element={<UangKeluarList />} />
            <Route path="/laporan-lapangan" element={<LaporanLapanganPage />} />
            <Route path="/buku-utama" element={<BukuUtamaList />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;