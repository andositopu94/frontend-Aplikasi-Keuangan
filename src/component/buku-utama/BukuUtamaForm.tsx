import React, { useState } from 'react';
import apiClient from '../../services/api';
import { BukuUtamaDto } from '../../types/BukuUtamaDto';

interface BukuUtamaFormProps {
  onSuccess?: () => void;
}

const BukuUtamaForm: React.FC<BukuUtamaFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<Omit<Partial<BukuUtamaDto>, 'traceNumber'>>({
    tanggal: '',
    kodeTransaksi: '',
    jenisRekening: 'Cash',
    nominalMasuk: 0,
    nominalKeluar: 0,
    sumberRekening: '',
    rekeningTujuan: '',
    deskripsi: '',
    kodeAkun: '',
    kodeKegiatan: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const val = type === 'number' ? parseFloat(value) || 0 : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.tanggal) {
      alert('Tanggal wajib diisi');
      return;
    }

    if (!formData.jenisRekening) {
      alert('Jenis Rekening wajib dipilih');
      return;
    }

    const inputDate = new Date(formData.tanggal);
    const now = new Date();
    if (inputDate > now) {
      alert('Tanggal tidak boleh masa depan');
      return;
    }

    try {
      await apiClient.post('/buku-utama', {
        ...formData,
        tanggal: new Date(formData.tanggal).toISOString()
      });
      alert('Data berhasil ditambahkan');
      onSuccess?.();
    } catch (error: any) {
      console.error('Gagal menyimpan ', error);
      alert(`Gagal: ${error.response?.data?.message || 'Periksa kembali data'}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', marginBottom: '20px' }}>
      <h3>Tambah Data Buku Utama</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
        <div>
          <label>Tanggal *</label>
          <input
            type="datetime-local"
            name="tanggal"
            value={formData.tanggal || ''}
            onChange={handleChange}
            max={new Date().toISOString().slice(0, 16)}
            required
          />
        </div>
        <div>
          <label>Kode Transaksi</label>
          <input
            type="text"
            name="kodeTransaksi"
            value={formData.kodeTransaksi || ''}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Jenis Rekening</label>
          <select name="jenisRekening" value={formData.jenisRekening} onChange={handleChange}>
            <option value="Cash">Cash</option>
            <option value="Main BCA">Main BCA</option>
            <option value="BCA Dir">BCA Dir</option>
            <option value="PCU">PCU</option>
          </select>
        </div>
        <div>
          <label>Uang Masuk</label>
          <input
            type="number"
            name="nominalMasuk"
            value={formData.nominalMasuk || 0}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Uang Keluar</label>
          <input
            type="number"
            name="nominalKeluar"
            value={formData.nominalKeluar || 0}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Kode Akun</label>
          <input
            type="text"
            name="kodeAkun"
            value={formData.kodeAkun || ''}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Nama Akun</label>
          <input
            type="text"
            name="namaAkun"
            value={formData.namaAkun || ''}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Kode Kegiatan</label>
          <input
            type="text"
            name="kodeKegiatan"
            value={formData.kodeKegiatan || ''}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Nama Kegiatan</label>
          <input
            type="text"
            name="namaKegiatan"
            value={formData.namaKegiatan || ''}
            onChange={handleChange}
          />
        </div>
      </div>
      <div style={{ marginTop: '20px' }}>
        <button type="submit">Simpan</button>
      </div>
    </form>
  );
};

export default BukuUtamaForm;