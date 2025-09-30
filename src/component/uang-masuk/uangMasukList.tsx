import React from 'react';
import { DynamicTable } from '../shared/DynamicTable';
import { UangMasukDto } from '../../types/UangMasukDto';
import { TableColumn } from '../../types/TableColumn';

const columns : TableColumn<UangMasukDto>[]= [
  { key: 'tanggal', label: 'Tanggal', sortable: true },
  { key: 'kodeTransaksi', label: 'Kode Transaksi', sortable: false },
  { key: 'sumberRekening', label: 'Sumber Rekening', sortable: false },
  {
    key: 'nominal',
    label: 'Nominal',
    render: (item: UangMasukDto) => `Rp${item.nominal.toLocaleString()}`
  },
  { key: 'deskripsi', label: 'Deskripsi' },
];

export default function UangMasukList() {
  return (
    <div>
      <h2>Daftar Uang Masuk</h2>
      <DynamicTable<UangMasukDto>
        fetchUrl="http://localhost:8080/api/uang-masuk"
        columns={columns}
      />
    </div>
  );
}