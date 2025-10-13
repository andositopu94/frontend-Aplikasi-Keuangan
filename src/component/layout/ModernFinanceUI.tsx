import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import apiClient from "../../services/api";
import { BukuUtamaDto } from "../../types/BukuUtamaDto";
import BukuUtamaModal from "../buku-utama/BukuUtamaModal";
import LaporanExportButton from "../shared/LaporanExportButton";
import "../layout/global.css";

export default function ModernFinanceUI() {
  const [data, setData] = useState<BukuUtamaDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [jenisRekening, setJenisRekening] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BukuUtamaDto | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchData = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (searchTerm) params.append("search", searchTerm);
    if (jenisRekening) params.append("jenisRekening", jenisRekening);
    params.append("size", "100");

    apiClient
      .get(`/buku-utama?${params.toString()}`)
      .then((res) => {
        const result = res.data;
        setData(result.content || result);
      })
      .catch((err) => console.error("Gagal ambil data:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [refreshKey, searchTerm, jenisRekening]);

  const handleCreate = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: BukuUtamaDto) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Apakah Anda yakin menghapus data ini?")) {
      apiClient
        .delete(`/buku-utama/${id}`)
        .then(() => {
          alert("Data berhasil dihapus");
          setRefreshKey((prev) => prev + 1);
        })
        .catch((err) => {
          console.error("Gagal menghapus", err);
          alert("Gagal menghapus data");
        });
    }
  };

  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1);
    setIsModalOpen(false);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const getJenisRekeningColor = (jenis: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-semibold ";
    const colorMap: Record<string, string> = {
      'Cash': 'bg-green-100 text-green-800',
      'Main BCA': 'bg-blue-100 text-blue-800',
      'BCA Dir': 'bg-yellow-100 text-yellow-800',
      'PCU': 'bg-purple-100 text-purple-800'
    };
    return baseClasses + (colorMap[jenis] || 'bg-gray-100 text-gray-800');
  };

  return (
    <div className="page-content">
      {/* Header Section */}
      <div className="card mb-6">
        <div className="flex-between mb-6">
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
              Buku Utama
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Kelola semua transaksi keuangan dalam satu tempat
            </p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={handleCreate}
            disabled={loading}
          >
            <Plus size={16} /> Tambah Transaksi
          </button>
        </div>

        <LaporanExportButton />

        {/* Filter */}
        <div className="card" style={{ backgroundColor: '#f8fafc', marginTop: '20px' }}>
          <div className="flex-between">
            <div style={{ flex: 1, maxWidth: '400px' }}>
              <div className="form-group">
                <div className="form-label">Cari Data</div>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Cari berdasarkan deskripsi, kode transaksi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ background: 'white' }}
                />
              </div>
            </div>
            <div style={{ flex: 1, maxWidth: '300px' }}>
              <div className="form-group">
                <div className="form-label">Filter Jenis Rekening</div>
                <select
                  className="form-select"
                  value={jenisRekening}
                  onChange={(e) => setJenisRekening(e.target.value)}
                  style={{ background: 'white' }}
                >
                  <option value="">Semua Jenis Rekening</option>
                  <option value="Cash">Cash</option>
                  <option value="Main BCA">Main BCA</option>
                  <option value="BCA Dir">BCA Dir</option>
                  <option value="PCU">PCU</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistik Ringkas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card text-center">
          <div className="text-gray-500 text-sm">Total Data</div>
          <div className="text-xl font-bold text-blue-600">{data.length}</div>
        </div>
        <div className="card text-center">
          <div className="text-gray-500 text-sm">Cash</div>
          <div className="text-xl font-bold text-green-600">
            {data.filter(d => d.jenisRekening === 'Cash').length}
          </div>
        </div>
        <div className="card text-center">
          <div className="text-gray-500 text-sm">Main BCA</div>
          <div className="text-xl font-bold text-blue-600">
            {data.filter(d => d.jenisRekening === 'Main BCA').length}
          </div>
        </div>
        <div className="card text-center">
          <div className="text-gray-500 text-sm">BCA Dir</div>
          <div className="text-xl font-bold text-yellow-600">
            {data.filter(d => d.jenisRekening === 'BCA Dir').length}
          </div>
        </div>
      </div>

      {/* Tabel Data */}
      <div className="card">
        {loading ? (
          <div className="text-center py-6 text-gray-500">Memuat data...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full data-table">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Kode Transaksi</th>
                  <th>Akun</th>
                  <th>Kegiatan</th>
                  <th>Jenis Rekening</th>
                  <th>Uang Masuk</th>
                  <th>Uang Keluar</th>
                  <th>Saldo Cash</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      {new Date(item.tanggal).toLocaleDateString("id-ID", {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="font-mono text-gray-500">{item.kodeTransaksi}</td>
                    <td>
                      <div className="font-semibold">{item.kodeAkun}</div>
                      <div className="text-xs text-gray-500">{item.namaAkun || "N/A"}</div>
                    </td>
                    <td>
                      <div className="font-semibold">{item.kodeKegiatan}</div>
                      <div className="text-xs text-gray-500">{item.namaKegiatan || "N/A"}</div>
                    </td>
                    <td>
                      <span className={getJenisRekeningColor(item.jenisRekening)}>
                        {item.jenisRekening}
                      </span>
                    </td>
                    <td className="text-right text-green-600 font-semibold">
                      {item.nominalMasuk ? `Rp${item.nominalMasuk.toLocaleString("id-ID")}` : '-'}
                    </td>
                    <td className="text-right text-red-600 font-semibold">
                      {item.nominalKeluar ? `Rp${item.nominalKeluar.toLocaleString("id-ID")}` : '-'}
                    </td>
                    <td className="text-right font-semibold">
                      Rp{(item.saldoCash ?? 0).toLocaleString("id-ID")}
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button 
                          className="btn btn-outline btn-sm"
                          onClick={() => handleEdit(item)}
                        >
                          <Edit size={14} /> Edit
                        </button>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(item.traceNumber)}
                        >
                          <Trash2 size={14} /> Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <BukuUtamaModal
        isOpen={isModalOpen}
        onClose={handleClose}
        onSuccess={handleSuccess}
        initialData={selectedItem}
      />
    </div>
  );
}
