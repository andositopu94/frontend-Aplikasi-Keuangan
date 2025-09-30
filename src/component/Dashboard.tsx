import React, { useEffect, useState } from 'react';
import apiClient from '../services/api';
import { MultiAccountHistoriSaldoChart } from './MultiAccountHistoriSaldoChart';
import LaporanGroupByAkun from './laporan group/LaporanGroupByAkun';
import { GroupedLaporanChart } from './laporan group/GroupLaporanChart';
import { Link } from 'react-router-dom';
import { SaldoChart } from './SaldoChart';

interface SaldoData {
  Cash?:number;
  MainBCA?: number;
  BCA_Dir?: number;
  PCU?: number;
}

export default function Dashboard() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [saldoData, setSaldoData] = useState<SaldoData>({});

  const fetchSaldo = async () => {
    try {
      const res = await apiClient.get('/buku-utama/saldo');
      setSaldoData(res.data);
    }catch (err) {
      console.error('Gagal Ambil Data Saldo:', err);
    }
  };

  useEffect(() => {
    fetchSaldo();
  }, []);

  const handleDateApply = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  };

  return (
    
    <div style={{ padding: '20px' }}>
      <h2>Dashboard Keuangan</h2>
      <Link to={"/buku-utama"}>
      <button style={buttonStyle}>Ke Buku Utama</button></Link>

      {/* Tombol ke Laporan Lapangan */}
      <div style={{ marginBottom: '30px' }}>
        <Link to="/laporan-lapangan">
          <button style={buttonStyle}>+ Tambah Laporan Lapangan</button>
        </Link>
      </div>

      {/* Tombol Export */}
      {/* <LaporanExportButton startDate={startDate} endDate={endDate} /> */}
      
      {/* Filter Tanggal */}
      {/* <DateRangeFilter onApply={handleDateApply} /> */}
      {/* <div style={{ marginBottom: '20px' }}>
        <label>Tanggal Awal: </label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <label style={{ marginLeft: '10px' }}>Tanggal Akhir: </label>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </div> */}
      
      <LaporanGroupByAkun/>

      {/* Grafik Histori Saldo Keseluruhan */}
      <div style={{ marginTop: '40px' }}>
        <h3>Histori Saldo Semua Rekening</h3>
        <MultiAccountHistoriSaldoChart startDate={startDate} endDate={endDate} />
      </div>

      <div style={{ marginTop: '40px' }}>
        <h3>Grafik Saldo Terkini</h3>
        <SaldoChart />
      </div>
      
      {/* Grafik Grouping Per Akun */}
      <div style={{ marginTop: '40px' }}>
        <h3>Grafik Saldo Per Akun</h3>
        <GroupedLaporanChart groupType="akun" startDate={startDate} endDate={endDate} />
      </div>
      
    </div>
  );
}

  const buttonStyle = {
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '4px',
  cursor: 'pointer'
};