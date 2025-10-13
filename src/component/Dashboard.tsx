import React, { useEffect, useState } from "react";
import apiClient from "../services/api";
import { SaldoChart } from "./SaldoChart";
import { GroupedLaporanChart } from "./laporan group/GroupLaporanChart";
import { MultiAccountHistoriSaldoChart } from "./MultiAccountHistoriSaldoChart";
import LaporanGroupByAkun from "./laporan group/LaporanGroupByAkun";

interface SaldoData {
  Cash?: number;
  MainBCA?: number;
  BCA_Dir?: number;
  PCU?: number;
}

const QuickActionCard: React.FC<{
  title: string;
  description: string;
  icon: string;
  link: string;
  color: string;
  count?: number;
  }> = ({ title, description, icon, link, color, count }) => (
  <a href={link} style={{ textDecoration: 'none', color: 'inherit' }}>
    <div className="card card-hover" style={{ height: '160px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ 
          width: '56px', 
          height: '56px', 
          borderRadius: '16px', 
          background: color,
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          fontSize: '24px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          {icon}
        </div>
        {count !== undefined && (
          <div style={{
            background: 'var(--primary-color)',
            color: 'white',
            borderRadius: '20px',
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: '600',
            boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
          }}>
            {count} Data
          </div>
        )}
      </div>

      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
        {title}
      </h3>

      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
        {description}
      </p>
    </div>
  </a>
);

export default function Dashboard() {
  const [saldoData, setSaldoData] = useState<SaldoData>({});
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const today = new Date().toISOString().split("T")[0];
  const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const [startDate, setStartDate] = useState(lastWeek);
  const [endDate, setEndDate] = useState(today);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSaldo();
    fetchRecentActivity();
  }, []);

  const fetchSaldo = async () => {
    try {
      const res = await apiClient.get("/buku-utama/saldo");
      setSaldoData(res.data);
    } catch (err) {
      console.error("Gagal Ambil Data Saldo:", err);
    }finally {
      setLoading(false);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const res = await apiClient.get("/buku-utama?page=0&size=5");
      setRecentActivity(res.data.content || []);
    } catch (err) {
      console.error("Gagal mengambil aktivitas terbaru:", err);
    }
  };

  const totalSaldo = Object.values(saldoData).reduce(
    (sum, val) => sum + (val || 0),
    0
  );

  const quickActions = [
    {
      title: "Buku Utama",
      description: "Kelola transaksi keuangan dan lihat saldo terkini",
      icon: "📖",
      link: "/buku-utama",
      color: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
      count: recentActivity.length,
    },
    {
      title: "Uang Masuk",
      description: "Catat pemasukan dari berbagai sumber rekening",
      icon: "💰",
      link: "/uang-masuk",
      color: "linear-gradient(135deg, #10b981, #059669)",
    },
    {
      title: "Uang Keluar",
      description: "Kelola pengeluaran, pembayaran, dan transfer",
      icon: "💸",
      link: "/uang-keluar",
      color: "linear-gradient(135deg, #f59e0b, #d97706)",
    },
    {
      title: "Laporan Lapangan",
      description: "Input laporan aktivitas lapangan dengan bukti foto",
      icon: "📋",
      link: "/laporan-lapangan",
      color: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
    },
  ];

  if (loading) {
    return (
      <div className="flex-center" style={{ height: '50vh' }}>
        <div className="card text-center">
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <h3>Memuat Dashboard...</h3>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "0", margin: "0" }} className="fade-in">
      {/* Banner Selamat Datang */}
      <div
        className="card mb-6"
        style={{
          background:
            "linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%)",
          color: "white",
          position: "relative",
          overflow: "hidden"
          // marginBottom: "16px",
          // padding: "20px",
        }}
      >
        <div className="flex-between">
          <div>
            <h1
              style={{ fontSize: "28px", fontWeight: "700", marginBottom: "8px" }}
            >
              Selamat Datang 👋
            </h1>
            <p style={{ opacity: 0.9, fontSize: "16px" }}>
              Kelola keuangan Anda dengan mudah dan efisien
            </p>
          </div>
          <div style={{ fontSize: "64px", opacity: 0.8 }}>💼</div>
        </div>
        <div style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '120px',
          height: '120px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%'
        }}>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="card text-center card-hover">
          <div className="text-gray-500 text-sm mb-2">Total Saldo</div>
          <div className="text-2xl font-bold text-blue-600">
            Rp{totalSaldo.toLocaleString("id-ID")}
          </div>
        </div>
        <div className="card text-center card-hover">
          <div className="text-gray-500 text-sm mb-2">Cash</div>
          <div className="text-2xl font-bold text-green-600">
            Rp{(saldoData.Cash || 0).toLocaleString("id-ID")}
          </div>
        </div>
        <div className="card text-center card-hover">
          <div className="text-gray-500 text-sm mb-2">Main BCA</div>
          <div className="text-2xl font-bold text-blue-600">
            Rp{(saldoData.MainBCA || 0).toLocaleString("id-ID")}
          </div>
        </div>
        <div className="card text-center card-hover">
          <div className="text-gray-500 text-sm mb-2">Transaksi</div>
          <div className="text-2xl font-bold text-purple-600">
            {recentActivity.length}
          </div>
        </div>
      </div>

      {/* Menu Utama */}
      <div className="mb-8">
      <div style={{ marginBottom: "16px" }}>
        <h2
          style={{ fontSize: "24px", fontWeight: "600", marginBottom: "20px" }}
        >
          Menu Utama
        </h2>
        <div className="grid grid-cols-4 gap-6">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
          }}
          >
            {quickActions.map((item, index) => (
            <QuickActionCard key={index} {...item} />
          ))}
          </div>
          
        
          <div className="card p-4 text-center">
            <h3>Buku Utama</h3>
            <p>Kelola transaksi keuangan dan lihat saldo terkini</p>
          </div>
          <div className="card p-4 text-center">
            <h3>Uang Masuk</h3>
            <p>Catat pemasukan dari berbagai sumber</p>
          </div>
          <div className="card p-4 text-center">
            <h3>Uang Keluar</h3>
            <p>Catat pengeluaran, pembayaran, dan transfer</p>
          </div>
          <div className="card p-4 text-center">
            <h3>Laporan Lapangan</h3>
            <p>Input aktivitas lapangan dengan bukti foto</p>
          </div>
        </div>
      </div>

      {/* Statistik Saldo */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
          marginBottom: "16px",
        }}
      >

        <div className="grid grid-cols-2 gap-6 mb-8"></div>
        <div className="card">
          <h3 style={{ marginBottom: "12px" , fontSize: '18px', fontWeight: '600' }}>Saldo Terkini</h3>
          <SaldoChart />
        </div>
        
        <div className="card">
          <h3 style={{ marginBottom: "12px" }}>Grafik Saldo per Akun</h3>
          {/* ✅ Fix: tambahkan props startDate & endDate */}
          <GroupedLaporanChart
            groupType="akun"
            startDate={startDate}
            endDate={endDate}
          />
        </div>
      </div>

      {/* Histori Saldo */}
      <div className="card mb-8" style={{ marginBottom: "16px" }}>
        <h3 style={{ marginBottom: "12px", fontSize: "18px", fontWeight: '600' }}>Histori Saldo Semua Rekening</h3>
        {/* ✅ Fix: tambahkan props startDate & endDate */}
        <MultiAccountHistoriSaldoChart
          startDate={startDate}
          endDate={endDate}
        />
      </div>

      {/* Laporan Akun */}
      <div className="card">
        <LaporanGroupByAkun />
      </div>
    </div>
  </div>
  );
}

