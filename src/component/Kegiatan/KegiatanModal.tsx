import React, { useEffect, useState } from 'react';
import { modalOverlayStyle, modalContentStyle } from '../layout/BukuUtamaModal.styles';
import apiClient from '../../services/api';
import { KegiatanDto } from '../../types/KegiatanDto';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: KegiatanDto | null;
}

export default function KegiatanModal({ isOpen, onClose, onSuccess, initialData }: Props) {
  const [form, setForm] = useState({ kodeKegiatan: '', namaKegiatan: '' });

  useEffect(() => {
    if (initialData) setForm(initialData);
    else setForm({ kodeKegiatan: '', namaKegiatan: '' });
  }, [initialData]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (initialData) {
        // await apiClient.put(`/kegiatan/${initialData.kodeKegiatan}`, form);
        await apiClient.put(`/kegiatan/${encodeURIComponent(initialData.kodeKegiatan)}`, {
          namaKegiatan: form.namaKegiatan,
        });
      } else {
        await apiClient.post('/kegiatan', form);
      }
      onSuccess();
    } catch (err: any) {
      console.error('Save error:', err.response?.status, err.response?.data || err.message);
      alert('Gagal menyimpan: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <h3>{initialData ? 'Edit' : 'Tambah'} Kegiatan</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label>Kode Kegiatan</label>
            <input
              name="kodeKegiatan"
              value={form.kodeKegiatan}
              onChange={handleChange}
              required
              disabled={!!initialData}
            />
          </div>
          <div>
            <label>Nama Kegiatan</label>
            <input name="namaKegiatan" value={form.namaKegiatan} onChange={handleChange} required />
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} className="btn btn-outline">
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              {initialData ? 'Perbarui' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}