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
        debit: 0,
        kredit: 0,
        keterangan: '',
        buktiPath:'',
        namaUser:'',
    });

    const [bukti, setBukti] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [akunList, setAkunList] = useState<{kodeAkun: string; namaAkun: string}[]>([]);
    const [kegiatanList, setKegiatanList] = useState<{kodeKegiatan: string; namaKegiatan: string}[]>([]);
    
  useEffect(() => {
     apiClient.get("/akun?size=100").then((res) => setAkunList(res.data.content));
     apiClient.get("/kegiatan?size=100").then((res) => setKegiatanList(res.data.content));
  }, []);
  // Isi form saat mode edit
  useEffect(() => {
    if (initialData) {
      let fixTanggal = "";
      if (initialData.tanggal) {
        fixTanggal = initialData.tanggal.split("T")[0];
      }
      setFormData({ ...initialData, 
      tanggal: fixTanggal}
      );

      if (initialData?.buktiPath) {
        setPreviewUrl(`http://localhost:8080/api/laporan-lapangan/files/${initialData.buktiPath}`);
      }
    }else{
        setFormData({
        tanggal:'',
        kodeLapangan: '',
        deskripsi:'',
        kodeKegiatan: '',
        kodeAkun: '',
        debit: 0,
        kredit: 0,
        keterangan:'',
        buktiPath:'',
        namaUser:'',
      });
        setBukti(null);
        setPreviewUrl(null);
        setError(null);
    }
},[initialData]);
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
      let fixedFormData: any = { ...formData };
      
      if (fixedFormData.tanggal && (fixedFormData.tanggal as string).length === 10) {
        fixedFormData.tanggal = (fixedFormData.tanggal as string) + "T00:00:00";
      }
        if (!fixedFormData.namaUser) {
          fixedFormData.namaUser = ""; //namauser yang akan diisi dari form
        }
      data.append("request", new Blob([JSON.stringify(fixedFormData)], { type: "application/json" }));
      if (bukti) {
        data.append("bukti", bukti);
      }

      if (initialData?.id) {
        await apiClient.put(`/laporan-lapangan/${initialData.id}`, data,{
          headers: { "Content-Type": "multipart/form-data" }
        });
        alert("Data berhasil diperbarui");
      } else {
        await apiClient.post("/laporan-lapangan/upload", data, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        alert("Data berhasil ditambahkan");
      }
      
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Gagal menyimpan laporan", error);
      const msg = error?.response?.data || error?.message || "Terjadi kesalahan saat menyimpan laporan";
      alert("Gagal menyimpan: " + JSON.stringify(msg));
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
            <label>Kode Akun</label>
            <select
              name="kodeAkun"
              value={formData.kodeAkun || ""}
              onChange={handleChange}
              required>
                <option value="">-- Pilih Akun --</option>
                {akunList.map((a) => (
                  <option key={a.kodeAkun} value={a.kodeAkun}>
                    {a.kodeAkun} - {a.namaAkun}
                  </option>
                ))}
              </select>
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
            <select
              name="kodeKegiatan"
              value={formData.kodeKegiatan || ""}
              onChange={handleChange}
              required
            >
              <option value="">---Pilih Kegiatan---</option>
              {kegiatanList.map((k) => (
                <option key={k.kodeKegiatan} value={k.kodeKegiatan}>
                  {k.kodeKegiatan} – {k.namaKegiatan}
                </option>
              ))}
            </select>
          </div>
          {/* <div>
            <label>Nama Kegiatan</label>
            <input
              type="text"
              name="namaKegiatan"
              value={formData.namaKegiatan || ""}
              onChange={handleChange}
            />
          </div> */}
          <div>
            <label>Nama User</label>
            <input type="text" name="namaUser" value={formData.namaUser||''}
            onChange={handleChange} />
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

