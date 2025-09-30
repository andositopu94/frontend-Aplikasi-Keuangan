import { LaporanLapanganRequest } from "../../types/LaporanLapanganRequest";
import apiClient from "../../services/api";
import React, {useEffect, useState} from "react";
import { modalOverlayStyle, modalContentStyle, gridStyle } from "../layout/BukuUtamaModal.styles";



interface ModalProps{
  isOpen: boolean;
  onSuccess: () => void;
  onClose: () => void;
  initialData?: LaporanLapanganRequest | null;
}
export default function LaporanLapanganModal({
    isOpen,
    onClose,
    onSuccess,
    initialData,
}: ModalProps) {
    const [formData, setFormData] = useState<Partial<LaporanLapanganRequest>>(initialData|| {
        tanggal: '',
        kodeLapangan: '',
        deskripsi: '',
        kodeAkun: '',
        kodeKegiatan: '',
        namaKegiatan:'',
        debit: 0,
        kredit: 0,
        keterangan: '',
        buktiPath:'',
    });

    const [bukti, setBukti] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    
  // Isi form saat mode edit
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);

      if (initialData?.buktiPath) {
        setPreviewUrl(`http://localhost:8080/api/laporan-lapangan/files/${initialData.buktiPath}`);
      }
    }else{
        setFormData({
        tanggal:'',
        kodeLapangan: '',
        deskripsi:'',
        kodeKegiatan: '',
        namaKegiatan: '',
        debit: 0,
        kredit: 0,
        keterangan:'',
        buktiPath:'',
      });
        setBukti(null);
        setPreviewUrl(null);
        setError(null);
    }
},
[initialData]);
if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const {name, value, type} = e.target;
        const val = type === 'number' ? parseFloat(value) || 0 : value;
        setFormData(prev => ({ ...prev, [name]: val}));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        if (e.target.files && e.target.files.length > 0) {
            const file=e.target.files[0];

        if (!file.type.match('image/jpeg|image/png|image/jpg')) {
        setError('Hanya file JPG/PNG yang diperbolehkan');
        setBukti(null);
        setPreviewUrl(null);
        return;
        }

        if (file.size > 10 * 1024 * 1024) { // 10MB
        setError('Ukuran file maksimal 10MB');
        setBukti(null);
        setPreviewUrl(null);
        return;
      }
      setBukti(file);

      // ✅ Buat preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();
      // Kirim seluruh formData sebagai JSON di part 'request'
      data.append("request", new Blob([JSON.stringify(formData)], { type: "application/json" }));
      if (bukti) {
        data.append("bukti", bukti);
      }

      if (initialData?.id) {
        await apiClient.put(`/laporan-lapangan/${initialData.id}`, data);
        alert("Data berhasil diperbarui");
      } else {
        await apiClient.post("/laporan-lapangan/upload", data);
        alert("Data berhasil ditambahkan");
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      alert("Gagal menyimpan: " + error.message);
    }
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <h3>{initialData ? "Edit" : "Tambah"} Laporan Lapangan</h3>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit} style={gridStyle}>
          <div>
            <label>Tanggal</label>
            <input
              type="date"
              name="tanggal"
              value={formData.tanggal || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Kode Lapangan</label>
            <input
              type="text"
              name="kodeLapangan"
              value={formData.kodeLapangan || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Deskripsi</label>
            <textarea
              name="deskripsi"
              value={formData.deskripsi || ""}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Debit</label>
            <input
              type="number"
              name="debit"
              value={formData.debit || 0}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Kredit</label>
            <input
              type="number"
              name="kredit"
              value={formData.kredit || 0}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Keterangan</label>
            <input
              type="text"
              name="keterangan"
              value={formData.keterangan || ""}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Kode Kegiatan</label>
            <input
              type="text"
              name="kodeKegiatan"
              value={formData.kodeKegiatan || ""}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Nama Kegiatan</label>
            <input
              type="text"
              name="namaKegiatan"
              value={formData.namaKegiatan || ""}
              onChange={handleChange}
            />
          </div>
          <div>
          <label>Upload Bukti</label>
          <input type="file" accept="image/jpeg,image/png" onChange={handleFileChange} />
          {previewUrl && (
            <div>
              <p>Preview:</p>
              <img src={previewUrl} alt="Preview" style={{ maxWidth: "200px" }} />
            </div>
          )}
        </div>

          <div style={{ gridColumn: "span 2", textAlign: "right" }}>
            <button type="button" onClick={onClose}>
              Batal
            </button>
            <button type="submit">
              {initialData ? "Update" : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

