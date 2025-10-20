import React, { useEffect, useState } from 'react';
import { modalOverlayStyle, modalContentStyle } from '../layout/BukuUtamaModal.styles';
import apiClient from '../../services/api';
import { AkunDto } from '../../types/AkunDto';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: AkunDto | null;
}

export default function AkunModal({ isOpen, onClose, onSuccess, initialData }: Props) {
  const [form, setForm] = useState({ kodeAkun: '', namaAkun: '' });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) setForm(initialData);
    else setForm({ kodeAkun: '', namaAkun: '' });
    setError(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (initialData) {
        await apiClient.put(`/akun/${initialData.kodeAkun}`, form);
        alert('Akun berhasil diperbarui');
      } else {
        await apiClient.post('/akun', form);
        alert('Akun berhasil ditambahkan');
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      let msg = "Gagal menyimpan akun";
      if (err.response?.data?.kodeAkun) {
        msg = err.response.data.kodeAkun;
      } else if (err.response?.data?.message) {
        msg = err.response.data.message;
      }
      setError(msg);
    }
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <h3>{initialData ? 'Edit' : 'Tambah'} Akun</h3>
        {error && (
          <div style={{
            color: "white",
            background: "#ef4444",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "12px"
          }}>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label>Kode Akun</label>
            <input
              name="kodeAkun"
              value={form.kodeAkun}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Nama Akun</label>
            <input name="namaAkun" value={form.namaAkun} onChange={handleChange} required />
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