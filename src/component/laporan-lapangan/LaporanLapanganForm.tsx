import React, { useState } from "react";
import { LaporanLapanganRequest } from "../../types/LaporanLapanganRequest";
import apiClient from "../../services/api";
import { modalOverlayStyle, modalContentStyle, gridStyle } from "../layout/BukuUtamaModal.styles";


export default function LaporanLapanganForm({ isOpen, onClose, onSuccess, initialData }: any) {
  const [formData, setFormData] = useState<Partial<LaporanLapanganRequest>>(initialData || {
    tanggal: "",
    kodeLapangan: "",
    deskripsi: "",
    debit: 0,
    kredit: 0,
    keterangan: "",
    kodeKegiatan: "",
    namaKegiatan: "",
    buktiPath: "",
  });

  const [bukti, setBukti] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string|null>(null);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === "number" ? parseFloat(value) || 0 : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (!file.type.match("image/jpeg|image/png")) {
        setError("Hanya file JPG/PNG yang diperbolehkan");
        return;
      }
      if (file.size > 10*1024*1024){
        setError("Ukuran file maksimal 10 MB");
        return;
      }
      setBukti(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try{
      const data= new FormData();
      const payload = { ...formData };
      delete payload.id;
      data.append("request", new Blob([JSON.stringify(formData)],
    {
      type:"application/json"
    }));
    if (bukti){
      data.append("bukti", bukti);
    }
    await apiClient.post("/laporan-lapangan/upload", data); 
      // {
      // headers: {"Content-Type": "multipart/formdata"},
    // });
    alert("Laporan berhasil ditambahkan");
    onSuccess();
    onClose();
  } catch(err:any) {
    alert(err.response?.data?.message|| "Gagal menyimpan Laporan");
  }
};

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <h3>Form Laporan Lapangan</h3>
        {error && <p style={{ color: "red" }}>{error}</p>}
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
            <label>Upload Bukti</label>
            <input type="file" accept="image/jpeg,image/png" onChange={handleFileChange}/>
            {previewUrl && <img src={previewUrl} alt="preview" style={{ maxWidth:"200px" }} />}
          </div>

          <div style={{ gridColumn: "span 2", textAlign: "right" }}>
            <button type="button" onClick={onClose}>Batal</button>
            <button type="submit">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  );
}
