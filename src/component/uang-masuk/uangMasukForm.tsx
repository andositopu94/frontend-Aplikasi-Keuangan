import React, { useState } from 'react';
import apiClient from '../../services/api';

export default function UangMasukForm() {
  const [formData, setFormData] = useState({
    tanggal: '',
    kodeAkun: '',
    kodeKegiatan: '',
    sumberRekening: '',
    nominal: 0,
    deskripsi: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try{
      await apiClient.post('/uang-masuk', formData);
      alert('Berhasil tambah transaksi');
    } catch (error) {
      alert('Gagal tambah transaksi: ' + (error as any).message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="tanggal" type="date" onChange={handleChange} value={formData.tanggal} 
      max={new Date().toISOString().split('T')[0]} required />
      <select name="kodeAkun" onChange={handleChange} required>
        <option value="">Pilih Kode Akun</option>
        <option value="1-101">1-101 - Kas</option>
        <option value="1-102">1-102 - Main BCA</option>
      </select>

      <select name="kodeKegiatan" onChange={handleChange} required>
        <option value="">Pilih Kode Kegiatan</option>
        <option value="KGT-001">KGT-001 - Operasional</option>
        <option value="KGT-002">KGT-002 - Proyek A</option>
      </select>

      <input name="sumberRekening" placeholder="Sumber Rekening" onChange={handleChange} required />
      <input name="nominal" type="number" placeholder="Nominal" onChange={handleChange} required />
      <textarea name="deskripsi" placeholder="Deskripsi" onChange={handleChange}></textarea>

      <button type="submit">Simpan</button>
    </form>
  );
}