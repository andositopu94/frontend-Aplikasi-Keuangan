import { useEffect, useState } from "react";
import { BukuUtamaDto } from "../../types/BukuUtamaDto";
import apiClient from "../../services/api";
import { modalOverlayStyle, modalContentStyle, gridStyle, cancelButtonStyle, submitButtonStyle } from "../layout/BukuUtamaModal.styles";


interface BukuUtamaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: BukuUtamaDto | null;
}

const BukuUtamaModal: React.FC<BukuUtamaModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}) => {
  const [akunList, setAkunList] = useState<{ kodeAkun: string; namaAkun: string }[]>([]);
  const [kegiatanList, setKegiatanList] = useState<{ kodeKegiatan: string; namaKegiatan: string }[]>([]);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<Partial<BukuUtamaDto>>({
    tanggal: "",
    kodeTransaksi: "",
    jenisRekening: "Cash",
    nominalMasuk: 0,
    nominalKeluar: 0,
    sumberRekening: "",
    rekeningTujuan: "",
    deskripsi: "",
    kodeAkun: "",
    kodeKegiatan: "",
  });

  // load lists + prefill for edit
  useEffect(() => {
    apiClient.get("/akun?size=100").then((res) => { 
      if (res.data?.content) setAkunList(res.data.content);
      else setAkunList(res.data);})
      .catch((err) => console.error("Error fetching akun list:", err));

    apiClient.get("/kegiatan?size=100").then((res) => {
      if (res.data?.content) setKegiatanList(res.data.content);
      else setKegiatanList(res.data);})
      .catch((err) => console.error("Error fetching kegiatan list:", err));
  }, []);
  
  useEffect(() => {
    if (initialData) {
      setFormData({
        tanggal: initialData.tanggal,
        kodeTransaksi: initialData.kodeTransaksi,
        jenisRekening: initialData.jenisRekening || "Cash",
        nominalMasuk: initialData.nominalMasuk,
        nominalKeluar: initialData.nominalKeluar,
        sumberRekening: initialData.sumberRekening,
        rekeningTujuan: initialData.rekeningTujuan,
        deskripsi: initialData.deskripsi,
        kodeAkun: initialData.kodeAkun,
        kodeKegiatan: initialData.kodeKegiatan,
      });
    } else {
      setFormData({
        tanggal: "",
        kodeTransaksi: "",
        jenisRekening: "Cash",
        nominalMasuk: 0,
        nominalKeluar: 0,
        sumberRekening: "",
        rekeningTujuan: "",
        deskripsi: "",
        kodeAkun: "",
        kodeKegiatan: "",
      });
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const val = type === "number" ? parseFloat(value) || 0 : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);

    if (!formData.tanggal) {
      alert("Tanggal wajib diisi");
      return;
    }
    if (!formData.jenisRekening?.trim()) {
      alert("Jenis Rekening wajib diisi");
      return;
    }
    if (!formData.kodeTransaksi?.trim()) {
      alert("Kode transaksi wajib diisi");
      return;
    }

    const inputDate = new Date(formData.tanggal);
    const now = new Date();
    if (inputDate >= now) {
      alert("Tanggal tidak boleh lebih dari hari ini");
      return;
    }

    if (!formData.kodeAkun){
      alert("Kode akun wajid diisi");
      return;
    } 

    if (!formData.kodeKegiatan) {
      alert("Kode kegiatan wajib diisi");
      return;
    }

    const payload = {
    tanggal: new Date(formData.tanggal).toISOString(),
    kodeTransaksi: formData.kodeTransaksi || "",
    jenisRekening: formData.jenisRekening,
    nominalMasuk: formData.nominalMasuk || 0,
    nominalKeluar: formData.nominalKeluar || 0,
    sumberRekening: formData.sumberRekening || "",
    rekeningTujuan: formData.rekeningTujuan || "",
    deskripsi: formData.deskripsi || "",
    kodeAkun: formData.kodeAkun!,
    kodeKegiatan: formData.kodeKegiatan!
  };

  try {
    if (initialData?.traceNumber) {
      await apiClient.put(`/buku-utama/${initialData.traceNumber}`, payload);
      alert("Data berhasil diperbarui");
    } else {
      await apiClient.post("/buku-utama", payload);
      alert("Data berhasil ditambahkan");
    }
    onSuccess();
    onClose();
  } catch (error: any) {
    const backendErrors = error.response?.data || {};
    alert(
      "Gagal menyimpan:\n" +
      Object.entries(backendErrors)
        .map(([key, msg]) => `${key}: ${msg}`)
        .join("\n")
    );
  } finally{
    setSaving(false);
  }
};


  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <h3>{initialData ? "Edit" : "Tambah"} Buku Utama</h3>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={gridStyle}>
            {/* Tanggal */}
            <div>
              <label>Tanggal Transaksi</label>
              <input
                type="datetime-local"
                name="tanggal"
                value={formData.tanggal || ""}
                onChange={handleChange}
                max={new Date().toISOString().slice(0, 16)}
                required
              />
            </div>

            {/* Kode Transaksi */}
            <div>
              <label>Kode Transaksi</label>
              <input
                type="text"
                name="kodeTransaksi"
                value={formData.kodeTransaksi || ""}
                onChange={handleChange}
              />
            </div>

            {/* Jenis Rekening */}
            <div>
              <label>Jenis Rekening</label>
              <select name="jenisRekening" value={formData.jenisRekening || "Cash"} onChange={handleChange}>
                <option value="Cash">Cash</option>
                <option value="Main BCA">Main BCA</option>
                <option value="BCA Dir">BCA Dir</option>
                <option value="PCU">PCU</option>
              </select>
            </div>

            {/* Uang Masuk / Keluar */}
            <div>
              <label>Uang Masuk</label>
              <input type="number" name="nominalMasuk" value={formData.nominalMasuk || 0} onChange={handleChange} />
            </div>
            <div>
              <label>Uang Keluar</label>
              <input type="number" name="nominalKeluar" value={formData.nominalKeluar || 0} onChange={handleChange} />
            </div>

            {/* Sumber / Tujuan */}
            <div>
              <label>Sumber Rekening</label>
              <input type="text" name="sumberRekening" value={formData.sumberRekening || ""} onChange={handleChange} />
            </div>
            <div>
              <label>Rekening Tujuan</label>
              <input type="text" name="rekeningTujuan" value={formData.rekeningTujuan || ""} onChange={handleChange} />
            </div>

            {/* Deskripsi */}
            <div>
              <label>Deskripsi</label>
              <textarea
                name="deskripsi"
                value={formData.deskripsi || ""}
                onChange={handleChange}
                style={{ width: "100%", height: 60 }}
              />
            </div>

            {/* Kode Akun */}
            <div>
              <label>Kode Akun – Nama Akun</label>
              <select
                name="kodeAkun"
                value={formData.kodeAkun}
                onChange={(e) => {
                  const code = e.target.value;
                  const selected = akunList.find((a) => a.kodeAkun === code);
                  setFormData((prev) => ({ ...prev, kodeAkun: selected?.kodeAkun || "" }));
                }}
                required
              >
                <option value="">Pilih Akun</option>
                {akunList.map((a) => (
                  <option key={a.kodeAkun} value={a.kodeAkun}>
                    {a.kodeAkun} – {a.namaAkun}
                  </option>
                ))}
              </select>
            </div>

            {/* Kode Kegiatan */}
            <div>
              <label>Kode Kegiatan – Nama Kegiatan</label>
              <select
                name="kodeKegiatan"
                value={formData.kodeKegiatan}
                onChange={(e) => {
                  const code = e.target.value;
                  const selected = kegiatanList.find((k) => k.kodeKegiatan === code);
                  setFormData((prev) => ({ ...prev, kodeKegiatan: selected?.kodeKegiatan || "" }));
                }}
                required
              >
                <option value="">Pilih Kegiatan</option>
                {kegiatanList.map((k) => (
                  <option key={k.kodeKegiatan} value={k.kodeKegiatan}>
                    {k.kodeKegiatan} – {k.namaKegiatan}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginTop: 20, display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button type="button" onClick={onClose} style={cancelButtonStyle}>
              Batal
            </button>
            <button type="submit" style={submitButtonStyle}>
              {initialData ? "Perbarui" : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BukuUtamaModal;