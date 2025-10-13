import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UangMasukList from './component/uang-masuk/uangMasukList';
import LaporanLapanganPage from './component/laporan-lapangan/LaporanLapanganPage';
import Dashboard from './component/Dashboard';
import BukuUtamaList from './component/buku-utama/BukuUtamaList';
import UangKeluarList from './component/uang-keluar/uangKeluarList';
import './component/layout/global.css';
import DashboardLayout from './component/layout/DashboardLayout';
import ModernFinanceUI from './component/layout/ModernFinanceUI';


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          {/* Halaman utama dashboard */}
          <Route index element={<Dashboard/>} />
          <Route path="buku-utama" element={<BukuUtamaList />} />
          {/* <Route path="buku-utama" element={<ModernFinanceUI />} /> */}
          <Route path="uang-masuk" element={<UangMasukList />} />
          <Route path="uang-keluar" element={<UangKeluarList />} />
          <Route path="laporan-lapangan" element={<LaporanLapanganPage />} />
        </Route>
      </Routes>
    </Router>
  );
}
