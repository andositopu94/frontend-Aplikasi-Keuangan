import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { DynamicTable } from '../shared/DynamicTable';
import { KegiatanDto } from '../../types/KegiatanDto';
import { TableColumn } from '../../types/TableColumn';
import apiClient from '../../services/api';
import KegiatanModal from './KegiatanModal';

const columns: TableColumn<KegiatanDto>[] = [
  { key: 'kodeKegiatan', label: 'Kode Kegiatan' },
  { key: 'namaKegiatan', label: 'Nama Kegiatan' },
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
          onClick={() => handleDelete(item.kodeKegiatan)}
        >
          <Trash2 size={14} /> Hapus
        </button>
      </div>
    ),
  },
];

let handleEdit: (item: KegiatanDto) => void;
let handleDelete: (kode: string) => void;

export default function KegiatanList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState<KegiatanDto | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  handleEdit = (item: KegiatanDto) => {
    setSelected(item);
    setIsModalOpen(true);
  };

  handleDelete = async (kode: string) => {
    if (!window.confirm('Yakin hapus kegiatan ini?')) return;
    try {
      await apiClient.delete(`/kegiatan/${kode}`);
      alert('Kegiatan berhasil dihapus');
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
      <h1 className="text-2xl font-bold">Kegiatan</h1>
      <button className="btn btn-primary" onClick={() => {
        setSelected(null);
        setIsModalOpen(true)
        }}>
        <Plus size={16} /> Tambah Kegiatan
      </button>
    </div>

    <DynamicTable<KegiatanDto>
      key={refreshKey}
      fetchUrl="http://localhost:8080/api/kegiatan"
      columns={columns}
    />
  </div>

  <KegiatanModal
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