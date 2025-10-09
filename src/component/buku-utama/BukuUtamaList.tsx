import React, { useEffect, useState } from "react";
import { DynamicTable } from "../shared/DynamicTable";
import { BukuUtamaDto } from "../../types/BukuUtamaDto";
import { TableColumn } from "../../types/TableColumn";
import BukuUtamaModal from "./BukuUtamaModal";
import apiClient from "../../services/api";
import { Link } from "react-router-dom";
import LaporanExportButton from "../shared/LaporanExportButton";
import { Header } from "../layout/Header";
import { Sidebar } from "../layout/sidebar";
import "../layout/global.css";

export default function BukuUtamaList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BukuUtamaDto | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [jenisRekeningFilter, setJenisRekeningFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleEdit = (item: BukuUtamaDto) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Apakah Anda Yakin Menghapus Data ini?")) {
      apiClient
        .delete(`/buku-utama/${id}`)
        .then(() => {
          alert("Data Berhasil Dihapus");
          setRefreshKey((prev) => prev + 1);
        })
        .catch((err) => {
          console.error("Gagal menghapus", err);
          alert("Gagal Menghapus Data");
        });
    }
  };

  const columns: TableColumn<BukuUtamaDto>[] = [
    {
      key: "tanggal",
      label: "Tanggal Transaksi",
      sortable: true,
      render: (item) => (
        <div style={{ fontSize:'14px', fontWeight:'500' }}>
        {new Date(item.tanggal).toLocaleDateString("id-ID", {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })}
        </div>
      ),
    },

    { 
      key: "kodeTransaksi", 
      label: "Kode Transaksi",
      render: (item) => (
        <div style={{ 
          fontFamily: 'monospace', 
          fontSize: '13px',
          color: 'var(--text-secondary)'
        }}>
          {item.kodeTransaksi}
        </div>
      )
    },
    {
      key: "kodeAkun",
      label: "Akun",
      render: (row) => (
        <div>
          <div style={{ fontWeight: '600', fontSize: '14px' }}>{row.kodeAkun}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            {row.namaAkun || "N/A"}
          </div>
        </div>
      ),
    },
    {
      key: "kodeKegiatan",
      label: "Kegiatan",
      render: (item) => (
        <div>
          <div style={{ fontWeight: '600', fontSize: '14px' }}>{item.kodeKegiatan}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            {item.namaKegiatan || "N/A"}
          </div>
        </div>
      ),
    },
    { 
      key: "jenisRekening", 
      label: "Jenis Rekening",
      render: (item) => (
        <span style={{
          padding: '4px 8px',
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: '600',
          backgroundColor: getJenisRekeningColor(item.jenisRekening).bg,
          color: getJenisRekeningColor(item.jenisRekening).text
        }}>
          {item.jenisRekening}
        </span>
      )
    },
    {
      key: "nominalMasuk",
      label: "Uang Masuk",
      render: (item) => (
        <div style={{ 
          color: 'var(--success-color)', 
          fontWeight: '600',
          textAlign: 'right'
        }}>
          {item.nominalMasuk ? `Rp${item.nominalMasuk.toLocaleString("id-ID")}` : '-'}
        </div>
      ),
    },
    {
      key: "nominalKeluar",
      label: "Uang Keluar",
      render: (item) => (
        <div style={{ 
          color: 'var(--error-color)', 
          fontWeight: '600',
          textAlign: 'right'
        }}>
          {item.nominalKeluar ? `Rp${item.nominalKeluar.toLocaleString("id-ID")}` : '-'}
        </div>
      ),
    },
    {
      key: "saldoCash",
      label: "Saldo Cash",
      render: (item) => (
        <div style={{ fontWeight: '600', textAlign: 'right' }}>
          Rp{(item.saldoCash ?? 0).toLocaleString("id-ID")}
        </div>
      ),
    },
    {
      key: "aksi",
      label: "Aksi",
      render: (item) => (
        <div className="flex gap-2">
          <button 
            className="btn btn-outline"
            onClick={() => handleEdit(item)}
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            ✏️ Edit
          </button>
          <button 
            className="btn btn-danger"
            onClick={() => handleDelete(item.traceNumber)}
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            🗑️ Hapus
          </button>
        </div>
      ),
    },
  ];

  const getJenisRekeningColor = (jenis: string) => {
    const colors: { [key: string]: { bg: string; text: string } } = {
      'Cash': { bg: '#dcfce7', text: '#166534' },
      'Main BCA': { bg: '#dbeafe', text: '#1e40af' },
      'BCA Dir': { bg: '#fef3c7', text: '#92400e' },
      'PCU': { bg: '#f3e8ff', text: '#7e22ce' }
    };
    return colors[jenis] || { bg: '#f1f5f9', text: '#475569' };
  };

  return (
    <div className="app-container">
      <Header 
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        title="Buku Utama"
      />
      
      <div className="main-content">
        <div className="card mb-4">
          {/* Header Section */}
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
              disabled={isLoading}
            >
              <span>➕</span>
              Tambah Transaksi
            </button>
          </div>

          {/* Export Section */}
          <LaporanExportButton />

          {/* Filter dan Pencarian */}
          <div className="card" style={{ backgroundColor: '#f8fafc' }}>
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
                    value={jenisRekeningFilter}
                    onChange={(e) => setJenisRekeningFilter(e.target.value)}
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

        {/* Tabel Data */}
        <div className="card">
          {isLoading && (
            <div className="loading-indicator">
              <div className="loading-spinner"></div>
              Memuat Data...
            </div>
          )}

          <DynamicTable<BukuUtamaDto>
            key={refreshKey}
            fetchUrl="http://localhost:8080/api/buku-utama"
            columns={columns}
            pageSize={10}
            extraParams={{
              jenisRekening: jenisRekeningFilter || "",
              search: searchTerm,
            }}
            onDataChange={handleSuccess}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            refreshKey={refreshKey}
          />
        </div>

        {/* Modal */}
        <BukuUtamaModal
          isOpen={isModalOpen}
          onClose={handleClose}
          onSuccess={handleSuccess}
          initialData={selectedItem}
        />
      </div>
    </div>
  );
}
