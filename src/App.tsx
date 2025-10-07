// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import UangMasukList from './component/uang-masuk/uangMasukList';
// import Dashboard from './component/Dashboard';
// import BukuUtamaList from './component/buku-utama/BukuUtamaList';
// import UangKeluarList from './component/uang-keluar/uangKeluarList';
// import LaporanLapanganPage from './component/laporan-lapangan/LaporanLapanganPage';

// function App() {
//     return (
//         <Router>
//             <Routes>
//                 <Route path="/" element={<Dashboard />} />
//                 <Route path="/uang-masuk" element={<UangMasukList />} />
//                 <Route path="/uang-keluar" element={<UangKeluarList />} />
//                 <Route path="/laporan-lapangan" element={<LaporanLapanganPage />} />
//                 <Route path="/buku-utama" element={<BukuUtamaList />} />
//                 {/* <Route path="/histori/cash" element={<HistoriSaldoLineChart />} /> */}
//             </Routes>
//         </Router>
//     );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import UangMasukList from './component/uang-masuk/uangMasukList';
import Dashboard from './component/Dashboard';
import BukuUtamaList from './component/buku-utama/BukuUtamaList';
import UangKeluarList from './component/uang-keluar/uangKeluarList';
import LaporanLapanganPage from './component/laporan-lapangan/LaporanLapanganPage';

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

const App = () => {
    return (
        <Router>
            <Sidebar />
            <div style={{ marginLeft: '220px', padding: '20px' }}>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/buku-utama" element={<BukuUtamaList />} />
                    <Route path="/uang-masuk" element={<UangMasukList />} />
                    <Route path="/uang-keluar" element={<UangKeluarList />} />
                    <Route path="/laporan-lapangan" element={<LaporanLapanganPage />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;