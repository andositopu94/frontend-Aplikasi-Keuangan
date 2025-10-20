import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import UangMasukList from './component/uang-masuk/uangMasukList';
import LaporanLapanganPage from './component/laporan-lapangan/LaporanLapanganPage';
import Dashboard from './component/Dashboard';
import BukuUtamaList from './component/buku-utama/BukuUtamaList';
import UangKeluarList from './component/uang-keluar/uangKeluarList';
import './component/layout/global.css';
import DashboardLayout from './component/layout/DashboardLayout';
// import ModernFinanceUI from './component/layout/ModernFinanceUI';
import AkunList from './component/Akun/AkunList';
import KegiatanList from './component/Kegiatan/KegiatanList';
import UangMasukRekapList from './component/uang-masuk/UangMasukRekapList';
import UangKeluarRekapList from './component/uang-keluar/UangKeluarRekapList';
import Login from './component/Login/login';

// const App: React.FC = () => {
//   const isAuthenticated = () => {
//     return !!localStorage.getItem('authToken');
//   };

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('authToken');
  const location = useLocation(); 

   if (isAuthenticated) {
    const from = location.state?.from?.pathname || "/"; 
    return <Navigate to={from} replace />; 
  }

  return <>{children}</>;
};

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthed = !!localStorage.getItem('authToken');
  return isAuthed ? children : <Navigate to="/login" replace />;
};
// const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const isAuthenticated = !!localStorage.getItem('authToken');
//   const location = useLocation();

//   if (!isAuthenticated) {
//     return <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />;
//   }

//   return <>{children}</>;
// };

const App: React.FC = () => {

// export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<PublicRoute> <Login/> </PublicRoute>} />

        <Route path="/" element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }>

          {/* Halaman utama dashboard */}
          <Route index element={<Dashboard/>} />
          <Route path="buku-utama" element={<BukuUtamaList />} />
          {/* <Route path="buku-utama" element={<ModernFinanceUI />} /> */}
          {/* <Route path="uang-masuk" element={<UangMasukList />} /> */}
          {/* <Route path="uang-keluar" element={<UangKeluarList />} /> */}
          <Route path="laporan-lapangan" element={<LaporanLapanganPage />} />
          <Route path="akun" element={<AkunList />} />
          <Route path="kegiatan" element={<KegiatanList />} />
          <Route path="uang-masuk" element={<UangMasukRekapList />} />
          <Route path="uang-keluar" element={<UangKeluarRekapList />} />
        </Route>
        
        {/* <Route path="*" element={
          <PrivateRoute>
            <Navigate to="/" replace /> 
          </PrivateRoute>
        } /> */}
      </Routes>
    </Router>
  );
};

export default App;
