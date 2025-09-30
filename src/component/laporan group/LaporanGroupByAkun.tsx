import { useEffect, useState } from "react";
import { LaporanGroupDto } from "../../types/LaporanGroupDto";
import apiClient from "../../services/api";
import { DynamicTable } from "../shared/DynamicTable";
import { TableColumn } from "../../types/TableColumn";

export default function LaporanGroupByAkun(){
    const [data, setData] = useState<LaporanGroupDto[]>([]);
    const [startData, setStartDate ] = useState(new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      if (!startData || !endDate) return;

      const start = new Date(startData);
      const end = new Date(endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) return;
      setLoading(true);
        apiClient.get(`/laporan/group/akun?tanggalAwal=${startData}&tanggalAkhir=${endDate}`)
        .then(res => setData(res.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }, [startData, endDate]);

    const columns = [
    { key: 'kode', label: 'Kode Akun' },
    { key: 'nama', label: 'Nama Akun' },
    {
      key: 'totalMasuk',
      label: 'Total Masuk',
      render: (item: LaporanGroupDto) => `Rp${item.totalMasuk?.toLocaleString() || '0'}`
    },
    {
      key: 'totalKeluar',
      label: 'Total Keluar',
      render: (item: LaporanGroupDto) => `Rp${item.totalKeluar?.toLocaleString() || '0'}`
    },
    {
      key: 'saldo',
      label: 'Saldo',
      render: (item: LaporanGroupDto) => `Rp${item.saldo?.toLocaleString() || '0'}`
    }
  ]satisfies TableColumn<LaporanGroupDto>[];

  return (
    <div>
      <h2>Laporan Per Akun</h2>

      {loading ? (
        <p>Memuat data...</p>
      ) : (
      <DynamicTable<LaporanGroupDto>
        fetchUrl="http://localhost:8080/api/laporan/group/akun"
        columns={columns}
        pageSize={10}
      />
      )}
    </div>
  );
}