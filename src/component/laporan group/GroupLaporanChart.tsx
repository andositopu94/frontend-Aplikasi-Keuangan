import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import apiClient from '../../services/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface GroupedLaporanChartProps {
  groupType: 'akun' | 'kegiatan';
  // startDate: string;
  // endDate: string;
}

export const GroupedLaporanChart: React.FC<GroupedLaporanChartProps> = ({ groupType}) => {
  const [labels, setLabels] = useState<string[]>([]);
  const [saldoData, setSaldoData] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // if (!startDate || !endDate) return;

    setLoading(true);
    apiClient.get(`/laporan/group/${groupType}`) 
      .then(res => {
        const result = res.data as any[];
        console.log("DATA API:", result); 
        setLabels(result.map(item => item.nama));
        setSaldoData(result.map(item => item.saldo));
      })
      .catch(err => {
        console.error('Gagal ambil data:', err);
        setLabels([]);
        setSaldoData([]);
      })
      .finally(() => setLoading(false));
  }, [groupType]);

  const chartData = {
    labels,
    datasets: [{
      label: 'Saldo',
      data: saldoData,
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
      borderColor: 'rgba(53, 162, 235, 1)',
      borderWidth: 1
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: `Grafik Saldo Per ${groupType === 'akun' ? 'Akun' : 'Kegiatan'}`
      }
    },
    scales: {
      y: {
        ticks: {
          callback: function(this: any, value: string | number) {
            const numValue = typeof value === 'string' ? parseFloat(value) : value;
            return `Rp${numValue.toLocaleString('id-ID')}`;
          }
        }
      }
    }
  };

  return (
    <div>
      {loading && <div>Memuat data...</div>}
      <Bar data={chartData} options={options} />
      {!loading && saldoData.length === 0 && (
        <div style={{color:"red", marginTop:12}}>Tidak ada data untuk grafik ini.</div>
      )}
    </div>
  );
};