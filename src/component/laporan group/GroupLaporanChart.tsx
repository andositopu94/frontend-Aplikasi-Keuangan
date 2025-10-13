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
// import { data } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface GroupedLaporanChartProps {
  groupType: 'akun' | 'kegiatan';
  startDate: string;
  endDate: string;
}

export const GroupedLaporanChart: React.FC<GroupedLaporanChartProps> = ({ groupType, startDate, endDate }) => {
  const [labels, setLabels] = useState<string[]>([]);
  const [saldoData, setSaldoData] = useState<number[]>([]);

  useEffect(() => {
    if(!startDate || !endDate) return;

    axios.get(`/api/laporan/group/${groupType}?tanggalAwal=${startDate}&tanggalAkhir=${endDate}`)
      .then(res => {
        const result = res.data as any[];
        setLabels(result.map(item => item.nama));
        setSaldoData(result.map(item => item.saldo)|| 0);
      })
      .catch(err => console.error('Gagal ambil data:', err));
  }, [groupType, startDate, endDate]);

  const chartData = {
    labels: labels,
    datasets: [{
      label: 'saldoData',
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
          // callback: (value: string | number) => `Rp${value.toLocaleString()}`
          callback: function(this: any, value: string | number) {
            const numValue = typeof value === 'string' ? parseFloat(value) : value;
            return `Rp${numValue.toLocaleString('id-ID')}`;
          }
        }
      }
    }
  };

  return <Bar data={chartData} options={options} />;
};