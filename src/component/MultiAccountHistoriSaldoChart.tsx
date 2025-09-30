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
  saldoCash?: number;
  saldoMainBCA?: number;
  saldoBCADir?: number;
  saldoPCU?: number;
}

interface MultiAccountHistoriSaldoChartProps {
  startDate: string;
  endDate: string;
}

export const MultiAccountHistoriSaldoChart: React.FC<MultiAccountHistoriSaldoChartProps> = ({ startDate, endDate }) => {
  const [data, setData] = useState<HistoriSaldoDto[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [cashData, setCashData] = useState<number[]>([]);
  const [mainBcaData, setMainBcaData] = useState<number[]>([]);
  const [bcaDirData, setBcaDirData] = useState<number[]>([]);
  const [pcuData, setPcuData] = useState<number[]>([]);

  useEffect(() => {
    if (!startDate || !endDate) return;

    Promise.all([
      axios.get(`/buku-utama/histori/cash?tanggalAwal=${startDate}&tanggalAkhir=${endDate}`),
      axios.get(`/buku-utama/histori/main-bca?tanggalAwal=${startDate}&tanggalAkhir=${endDate}`),
      axios.get(`/buku-utama/histori/bca-dir?tanggalAwal=${startDate}&tanggalAkhir=${endDate}`),
      axios.get(`/buku-utama/histori/pcu?tanggalAwal=${startDate}&tanggalAkhir=${endDate}`)
    ]).then(([cashRes, mainBcaRes, bcaDirRes, pcuRes]) => {
      const cash = cashRes.data as HistoriSaldoDto[];
      const mainBca = mainBcaRes.data as HistoriSaldoDto[];
      const bcaDir = bcaDirRes.data as HistoriSaldoDto[];
      const pcu = pcuRes.data as HistoriSaldoDto[];

      setLabels(cash.map(item => item.tanggal));
      setCashData(cash.map(item => item.saldoCash || 0));
      setMainBcaData(mainBca.map(item => item.saldoMainBCA || 0));
      setBcaDirData(bcaDir.map(item => item.saldoBCADir || 0));
      setPcuData(pcu.map(item => item.saldoPCU || 0));
    }).catch(err => console.error('Gagal ambil data histori:', err));
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