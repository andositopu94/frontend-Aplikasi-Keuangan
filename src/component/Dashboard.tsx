import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../services/api';
import { MultiAccountHistoriSaldoChart } from './MultiAccountHistoriSaldoChart';
import LaporanGroupByAkun from './laporan group/LaporanGroupByAkun';
import { GroupedLaporanChart } from './laporan group/GroupLaporanChart';
import { SaldoChart } from './SaldoChart';
import { Header } from './layout/Header';
import { Sidebar } from './layout/sidebar';
import './layout/global.css';

interface SaldoData {
  Cash?: number;
  MainBCA?: number;
  BCA_Dir?: number;
  PCU?: number;
}

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: string;
  link: string;
  color: string;
  count?: number;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({ 
  title, 
  description, 
  icon, 
  link, 
  color,
  count 
}) => (
  <Link 
    to={link} 
    style={{ 
      textDecoration: 'none',
      color: 'inherit'
    }}
  >
    <div className="card" style={{ 
      height: '140px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      border: `2px solid transparent`
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.borderColor = color;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.borderColor = 'transparent';
    }}
    >
      <div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: '12px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px'
          }}>
            {icon}
          </div>
          {count !== undefined && (
            <div style={{
              backgroundColor: 'var(--primary-color)',
              color: 'white',
              borderRadius: '20px',
              padding: '4px 12px',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              {count}
            </div>
          )}
        </div>
        
        <h3 style={{ 
          fontSize: '18px', 
          fontWeight: '600',
          marginBottom: '8px',
          color: 'var(--text-primary)'
        }}>
          {title}
        </h3>
        
        <p style={{ 
          fontSize: '14px', 
          color: 'var(--text-secondary)',
          lineHeight: '1.4'
        }}>
          {description}
        </p>
      </div>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '12px'
      }}>
        <span style={{
          fontSize: '12px',
          color: 'var(--primary-color)',
          fontWeight: '600'
        }}>
          Akses Modul →
        </span>
      </div>
    </div>
  </Link>
);

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, trend, icon, color }) => (
  <div className="card" style={{ flex: 1, minWidth: '200px' }}>
    <div className="flex-between">
      <div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>
          {title}
        </div>
        <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>
          {value}
        </div>
        <div style={{ 
          fontSize: '12px', 
          color: trend === 'up' ? 'var(--success-color)' : trend === 'down' ? 'var(--error-color)' : 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'} {change}
        </div>
      </div>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        backgroundColor: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px'
      }}>
        {icon}
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [saldoData, setSaldoData] = useState<SaldoData>({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  const fetchSaldo = async () => {
    try {
      const res = await apiClient.get('/buku-utama/saldo');
      setSaldoData(res.data);
    } catch (err) {
      console.error('Gagal Ambil Data Saldo:', err);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const res = await apiClient.get('/buku-utama?page=0&size=5');
      setRecentActivity(res.data.content || []);
    } catch (err) {
      console.error('Gagal mengambil aktivitas terbaru:', err);
    }
  };

  useEffect(() => {
    fetchSaldo();
    fetchRecentActivity();
  }, []);

  const totalSaldo = Object.values(saldoData).reduce((sum, val) => sum + (val || 0), 0);

  const quickActions = [
    {
      title: 'Buku Utama',
      description: 'Kelola semua transaksi keuangan dan lihat saldo terkini',
      icon: '📖',
      link: '/buku-utama',
      color: '#dbeafe',
      count: recentActivity.length
    },
    {
      title: 'Uang Masuk',
      description: 'Catat pemasukan dan pendapatan dari berbagai sumber',
      icon: '💰',
      link: '/uang-masuk',
      color: '#dcfce7'
    },
    {
      title: 'Uang Keluar',
      description: 'Keluar pengeluaran, transfer, dan pembayaran',
      icon: '💸',
      link: '/uang-keluar',
      color: '#fef3c7'
    },
    {
      title: 'Laporan Lapangan',
      description: 'Input laporan aktivitas lapangan dengan bukti foto',
      icon: '📋',
      link: '/laporan-lapangan',
      color: '#f3e8ff'
    }
  ];

  const menuItems = [
    {
      title: 'Dashboard',
      description: 'Overview keuangan',
      icon: '📊',
      link: '/',
      color: '#e0f2fe'
    },
    ...quickActions
  ];

  return (
    <div className="app-container">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} title="Dashboard" />
      
      <div className="main-content">
        {/* Welcome Section */}
        <div className="card mb-6" style={{ 
          background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%)',
          color: 'white'
        }}>
          <div className="flex-between">
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
                Selamat Datang! 👋
              </h1>
              <p style={{ fontSize: '16px', opacity: 0.9 }}>
                Kelola keuangan Anda dengan mudah dan efisien
              </p>
            </div>
            <div style={{
              fontSize: '48px',
              opacity: 0.8
            }}>
              💼
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="mb-6">
          <div className="flex-between mb-4">
            <h2 style={{ fontSize: '24px', fontWeight: '600' }}>Menu Utama</h2>
            <span style={{ 
              color: 'var(--text-secondary)', 
              fontSize: '14px' 
            }}>
              Akses cepat ke semua modul
            </span>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '20px' 
          }}>
            {menuItems.map((item, index) => (
              <QuickActionCard
                key={index}
                title={item.title}
                description={item.description}
                icon={item.icon}
                link={item.link}
                color={item.color}
                count={item.count}
              />
            ))}
          </div>
        </div>

        {/* Stat Cards */}
        <div className="flex gap-4 mb-6" style={{ flexWrap: 'wrap' }}>
          <StatCard
            title="Total Saldo"
            value={`Rp${totalSaldo.toLocaleString('id-ID')}`}
            change="+12.5%"
            trend="up"
            icon="💰"
            color="#dbeafe"
          />
          <StatCard
            title="Transaksi Bulan Ini"
            value="247"
            change="+8.2%"
            trend="up"
            icon="📊"
            color="#dcfce7"
          />
          <StatCard
            title="Rata-rata Transaksi"
            value="Rp2.4Jt"
            change="-3.1%"
            trend="down"
            icon="📈"
            color="#fef3c7"
          />
          <StatCard
            title="Akun Aktif"
            value="15"
            change="+2"
            trend="up"
            icon="👥"
            color="#f3e8ff"
          />
        </div>

        {/* Recent Activity */}
        <div className="card mb-6">
          <h3 style={{ marginBottom: '16px' }}>Aktivitas Terbaru</h3>
          {recentActivity.length > 0 ? (
            <div>
              {recentActivity.slice(0, 5).map((activity, index) => (
                <div 
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 0',
                    borderBottom: index < recentActivity.length - 1 ? '1px solid var(--border-color)' : 'none'
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: activity.nominalMasuk ? '#dcfce7' : '#fee2e2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    marginRight: '12px'
                  }}>
                    {activity.nominalMasuk ? '⬇️' : '⬆️'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', fontSize: '14px' }}>
                      {activity.deskripsi || 'Transaksi'}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {new Date(activity.tanggal).toLocaleDateString('id-ID')} • {activity.kodeTransaksi}
                    </div>
                  </div>
                  <div style={{ 
                    fontWeight: '600',
                    color: activity.nominalMasuk ? 'var(--success-color)' : 'var(--error-color)',
                    textAlign: 'right'
                  }}>
                    {activity.nominalMasuk ? 
                      `+Rp${activity.nominalMasuk.toLocaleString('id-ID')}` : 
                      `-Rp${activity.nominalKeluar.toLocaleString('id-ID')}`
                    }
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px',
              color: 'var(--text-secondary)'
            }}>
              Tidak ada aktivitas terbaru
            </div>
          )}
        </div>

        {/* Charts Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          <div className="card">
            <h3 style={{ marginBottom: '16px' }}>Saldo Terkini</h3>
            <SaldoChart />
          </div>
          <div className="card">
            <h3 style={{ marginBottom: '16px' }}>Grafik Saldo Per Akun</h3>
            <GroupedLaporanChart groupType="akun" startDate={startDate} endDate={endDate} />
          </div>
        </div>

        {/* Full Width Charts */}
        <div className="card mb-6">
          <h3 style={{ marginBottom: '16px' }}>Histori Saldo Semua Rekening</h3>
          <MultiAccountHistoriSaldoChart startDate={startDate} endDate={endDate} />
        </div>

        {/* Laporan Group */}
        <div className="card">
          <LaporanGroupByAkun />
        </div>
      </div>
    </div>
  );
}