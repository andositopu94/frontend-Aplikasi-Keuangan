  import React from 'react';
  import { DynamicTable } from '../shared/DynamicTable';
  import { UangKeluarDto } from '../../types/UangKeluarDto';
  import { TableColumn } from '../../types/TableColumn';

  const columns : TableColumn<UangKeluarDto>[]= [
    { key: 'tanggal', label: 'Tanggal', sortable: true },
    { key: 'kodeTransaksi', label: 'Kode Transaksi' },
    { key: 'rekeningTujuan', label: 'Rekening Tujuan' },
    {
      key: 'nominal',
      label: 'Nominal',
      render: (item: UangKeluarDto) => `Rp${item.nominal.toLocaleString()}`
    },
    { key: 'deskripsi', label: 'Deskripsi' },
  ];

  export default function UangKeluarList() {
    return (
      <div>
        <h2>Daftar Uang Keluar</h2>
        <DynamicTable<UangKeluarDto>
          fetchUrl="http://localhost:8080/api/uang-keluar"
          columns={columns}
        />
      </div>
    );
  }