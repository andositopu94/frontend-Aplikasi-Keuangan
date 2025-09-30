import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UangMasukList from './component/uang-masuk/uangMasukList';
import Dashboard from './component/Dashboard';
import BukuUtamaList from './component/buku-utama/BukuUtamaList';
import UangKeluarList from './component/uang-keluar/uangKeluarList';
import LaporanLapanganPage from './component/laporan-lapangan/LaporanLapanganPage';




function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/uang-masuk" element={<UangMasukList />} />
                <Route path="/uang-keluar" element={<UangKeluarList />} />
                <Route path="/laporan-lapangan" element={<LaporanLapanganPage />} />
                <Route path="/buku-utama" element={<BukuUtamaList />} />
                {/* <Route path="/histori/cash" element={<HistoriSaldoLineChart />} /> */}
            </Routes>
        </Router>
    );
}

export default App;