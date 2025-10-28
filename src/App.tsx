import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import UangMasukList from './component/uang-masuk/uangMasukList';
import LaporanLapanganPage from './component/laporan-lapangan/LaporanLapanganPage';
import Dashboard from './component/Dashboard';
import BukuUtamaList from './component/buku-utama/BukuUtamaList';
import UangKeluarList from './component/uang-keluar/uangKeluarList';
import './component/layout/global.css';
import DashboardLayout from './component/layout/DashboardLayout';
import AkunList from './component/Akun/AkunList';
import KegiatanList from './component/Kegiatan/KegiatanList';
import UangMasukRekapList from './component/uang-masuk/UangMasukRekapList';
import UangKeluarRekapList from './component/uang-keluar/UangKeluarRekapList';
import Login from './component/Login/login';
import {jwtDecode} from 'jwt-decode';
import Register from './component/Login/Register';

const isTokenValid = (token: string): boolean => {
  try {
    const decoded: any = jwtDecode(token);
    if (!decoded.exp) return false;
    const now = Date.now() / 1000;
    return decoded.exp > now; 
  } catch {
    return false;
  }
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('authToken');
  const isAuthenticated = token && isTokenValid(token);
  const location = useLocation();

  if (isAuthenticated) {
    const from = (location.state as any)?.from?.pathname || "/";
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};


const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('authToken');
  const isAuthenticated = token && isTokenValid(token);
  const location = useLocation();

  if (!isAuthenticated) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    return <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />;
  }

  return <>{children}</>;
};


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
      
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route path='/register' element={<PublicRoute><Register/></PublicRoute>} />

        
        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          
          <Route index element={<Dashboard />} />
          <Route path="buku-utama" element={<BukuUtamaList />} />
          <Route path="laporan-lapangan" element={<LaporanLapanganPage />} />
          <Route path="akun" element={<AkunList />} />
          <Route path="kegiatan" element={<KegiatanList />} />
          <Route path="uang-masuk" element={<UangMasukRekapList />} />
          <Route path="uang-keluar" element={<UangKeluarRekapList />} />
          {/* <Route path='/register' element={<PublicRoute><Register /></PublicRoute>} /> */}
        </Route>

        
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </Router>
  );
};

export default App;