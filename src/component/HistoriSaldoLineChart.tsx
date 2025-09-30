import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface HistoriSaldoDto {
  tanggal: string;
  saldoCash: number;
}

interface HistoriSaldoLineChartProps {
  startDate: string;
  endDate: string;
}

export const HistoriSaldoLineChart: React.FC<HistoriSaldoLineChartProps> = ({ startDate, endDate }) => {
  const [data, setData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);

  useEffect(() => {
    if (!startDate || !endDate) return;

    axios.get(`/api/buku-utama/histori/cash?tanggalAwal=${startDate}&tanggalAkhir=${endDate}`)
      .then(res => {
        const result = res.data as HistoriSaldoDto[];
        setLabels(result.map(item => item.tanggal));
        setData(result.map(item => item.saldoCash));
      })
      .catch(err => console.error('Gagal ambil data histori:', err));
  }, [startDate, endDate]);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Saldo Cash',
         data,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Grafik Histori Saldo Cash'
      }
    },
    scales: {
      y: {
        ticks: {
          callback: (tickValue: string | number) => {
            const value = typeof tickValue === 'string' ? parseFloat(tickValue) : tickValue;
            return `Rp${value.toLocaleString()}`;
          }
        }
      }
    }
  };

  return <Line data={chartData} options={options} />;
};