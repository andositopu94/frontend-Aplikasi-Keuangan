import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import apiClient from '../services/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface SaldoData {
  Cash: number;
  MainBCA: number;
  BCADir: number;
  PCU: number;
}

export const SaldoChart = () => {
  const [saldoData, setSaldoData] = useState<SaldoData>({
    Cash: 0,
    MainBCA: 0,
    BCADir: 0,
    PCU: 0
  });

  useEffect(() => {
    apiClient.get('/buku-utama/saldo')
      .then(res => setSaldoData(res.data))
      .catch(err => console.error(err));
  }, []);

  const chartData = {
    labels: ['Cash', 'Main BCA', 'BCA Dir', 'PCU'],
    datasets: [
      {
        label: 'Saldo (Rp)',
        data: [
          saldoData.Cash || 0,
          saldoData.MainBCA || 0,
          saldoData.BCADir || 0,
          saldoData.PCU || 0
        ],
        backgroundColor: 'rgba(53,162,235,0.5)',
        borderColor: 'rgba(53,162,235,1)',
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Grafik Saldo Terkini'
      }
    },
    scales: {
      y: {
        ticks: {
          callback: (tickValue: string | number) => {
            const value = typeof tickValue === 'string' ? parseInt(tickValue) : tickValue;
            return `Rp${value?.toLocaleString('id-ID')}`;
          }
        }
      }
    }
  };

  return <Bar data={chartData} options={options} />;
};