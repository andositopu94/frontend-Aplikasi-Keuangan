import React, { useState } from 'react';
import apiClient from '../../services/api';
import { UangKeluarRequest } from '../../types/UangKeluarRequest';

const UangKeluarForm: React.FC = () => {
    const [formData, setFormData] = useState<UangKeluarRequest>({
        tanggal: '',
        kodeAkun: '',
        kodeKegiatan: '',
        rekeningTujuan: '',
        nominal: 0,
        deskripsi: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiClient.post('/uang-keluar', formData);
            alert('Data uang keluar berhasil disimpan');
        } catch (error) {
            alert('Gagal menyimpan data');
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: 'auto' }}>
            <h2>Input Uang Keluar</h2>

            <div>
                <label>Tanggal:</label>
                <input type="datetime-local" name="tanggal" value={formData.tanggal} onChange={handleChange} 
                 max={new Date().toISOString().split('T')[0]} required />
            </div>

            <div>
                <label>Kode Akun:</label>
                <select name="kodeAkun" onChange={handleChange} required>
                    <option value="">Pilih Kode Akun</option>
                    <option value="1-101">1-101 - Kas</option>
                    <option value="1-102">1-102 - Main BCA</option>
                    <option value="1-103">1-103 - BCA Dir</option>
                    <option value="1-104">1-104 - PCU</option>
                </select>
            </div>

            <div>
                <label>Kode Kegiatan:</label>
                <select name="kodeKegiatan" onChange={handleChange} required>
                    <option value="">Pilih Kode Kegiatan</option>
                    <option value="KGT-001">KGT-001 - Operasional</option>
                    <option value="KGT-002">KGT-002 - Proyek A</option>
                </select>
            </div>

            <div>
                <label>Rekening Tujuan:</label>
                <input type="text" name="rekeningTujuan" onChange={handleChange} required />
            </div>

            <div>
                <label>Nominal:</label>
                <input type="number" name="nominal" onChange={handleChange} required />
            </div>

            <div>
                <label>Deskripsi:</label>
                <textarea name="deskripsi" onChange={handleChange} required />
            </div>

            <button type="submit">Simpan</button>
        </form>
    );
};

export default UangKeluarForm;