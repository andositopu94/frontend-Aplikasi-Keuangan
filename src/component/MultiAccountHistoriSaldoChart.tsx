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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface HistoriSaldoDto {
  tanggal: string;
  saldo: number;
}

interface MultiAccountHistoriSaldoChartProps {
  startDate: string;
  endDate: string;
}

export const MultiAccountHistoriSaldoChart: React.FC<MultiAccountHistoriSaldoChartProps> = ({ startDate, endDate }) => {
  const [labels, setLabels] = useState<string[]>([]);
  const [cashData, setCashData] = useState<number[]>([]);
  const [mainBcaData, setMainBcaData] = useState<number[]>([]);
  const [bcaDirData, setBcaDirData] = useState<number[]>([]);
  const [pcuData, setPcuData] = useState<number[]>([]);

  useEffect(() => {
    if (!startDate || !endDate) return;
      axios.get(`/buku-utama/histori/all?tanggalAwal=${startDate}&tanggalAkhir=${endDate}`)
      .then((res) => {
        const data = res.data;
      setLabels(data.cash.map((item: any) => item.tanggal));
      setCashData(data.cash.map((item: any) => item.saldoCash || 0));
      setMainBcaData(data.mainBca.map((item: any) => item.saldoMainBCA || 0));
      setBcaDirData(data.bcaDir.map((item: any) => item.saldoBCADir || 0));
      setPcuData(data.pcu.map((item: any) => item.saldoPCU || 0));
    })
    .catch(err => console.error('Gagal ambil data histori:', err));
  }, [startDate, endDate]);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Saldo Cash',
         data: cashData,
        borderColor: 'rgba(122, 122, 197, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: false,
        tension: 0.1
      },
      {
        label: 'Saldo Main BCA',
         data: mainBcaData,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: false,
        tension: 0.1
      },
      {
        label: 'Saldo BCA Dir',
         data: bcaDirData,
        borderColor: 'rgb(255, 206, 86)',
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        fill: false,
        tension: 0.1
      },
      {
        label: 'Saldo PCU',
         data: pcuData,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.2)',
        fill: false,
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'bottom' as const },
      title: { display: true, text: 'Histori Saldo Keseluruhan' }
    },
    scales: {
      y: {
        ticks: {
          callback: (tickValue: string | number) => {
            const value=typeof tickValue === 'string' ? parseFloat(tickValue) : tickValue;
           return `Rp${value.toLocaleString()}`;
        }
        }
      }
    }
  };

  return <Line data={chartData} options={options} />;
};