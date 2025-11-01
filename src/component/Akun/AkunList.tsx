import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { DynamicTable } from '../shared/DynamicTable';
import { AkunDto } from '../../types/AkunDto';
import { TableColumn } from '../../types/TableColumn';
import apiClient from '../../services/api';
import AkunModal from './AkunModal';

const columns: TableColumn<AkunDto>[] = [
  { key: 'kodeAkun', label: 'Kode Akun' },
  { key: 'namaAkun', label: 'Nama Akun' },
  {
    key: 'aksi',
    label: 'Aksi',
    render: (item) => (
      <div className="flex gap-2">
        <button
          className="btn btn-outline btn-sm"
          onClick={() => handleEdit(item)}
        >
          <Edit size={14} /> Edit
        </button>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => handleDelete(item.kodeAkun)}
        >
          <Trash2 size={14} /> Hapus
        </button>
      </div>
    ),
  },
];

let handleEdit: (item: AkunDto) => void;
let handleDelete: (kode: string) => void;

export default function AkunList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState<AkunDto | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  handleEdit = (item: AkunDto) => {
    setSelected(item);
    setIsModalOpen(true);
  };

  handleDelete = async (kode: string) => {
    if (!window.confirm('Yakin hapus akun ini?')) return;
    try {
      await apiClient.delete(`/akun/${kode}`);
      alert('Akun berhasil dihapus');
      setRefreshKey((k) => k + 1);
    } catch (e: any) {
      const msg = e.response?.data?.error || e.response?.data?.message || e.message;
      alert('Gagal hapus: ' + msg);
    }
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    setSelected(null);
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="page-content">
      <div className="card mb-6">
        <div className="flex-between mb-4">
          <h1 className="text-2xl font-bold">Daftar Akun</h1>
          <button className="btn btn-primary" onClick={() => {
            setSelected(null);
            setIsModalOpen(true)
            }}>
            <Plus size={16} /> Tambah Akun
          </button>
        </div>

        <DynamicTable<AkunDto>
          key={refreshKey}
          fetchUrl="http://localhost:8080/api/akun"
          columns={columns}
        />
      </div>

      <AkunModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelected(null);
        }}
        onSuccess={handleSuccess}
        initialData={selected}
      />
    </div>
  );
}