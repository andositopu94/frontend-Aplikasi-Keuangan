import React, { useEffect, useState } from "react";
import { DynamicTable } from "../shared/DynamicTable";
import { BukuUtamaDto } from "../../types/BukuUtamaDto";
import { TableColumn } from "../../types/TableColumn";
import BukuUtamaModal from "./BukuUtamaModal";
import apiClient from "../../services/api";
import "../layout/BukuList.css";
import { Link } from "react-router-dom";
import LaporanExportButton from "../shared/LaporanExportButton";

export default function BukuUtamaList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BukuUtamaDto | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [jenisRekeningFilter, setJenisRekeningFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

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
      render: (item) => new Date(item.tanggal).toLocaleDateString("id-ID"),
    },
    { key: "kodeTransaksi", label: "Kode Transaksi" },
    {
      key: "kodeAkun",
      label: "Kode Akun",
      // render: (item) => item.kodeAkun || "N/A",
      render: (row) => `${row.kodeAkun} - ${row.namaAkun || "N/A"}`,
    },
    {
      key: "namaAkun",
      label: "Nama Akun",
      render: (item) => item.namaAkun || "N/A",
    },
    {
      key: "namaKegiatan",
      label: "Nama Kegiatan",
      render: (item) => item.namaKegiatan || "N/A",
    },
    {
      key: "kodeKegiatan",
      label: "Kode Kegiatan",
      render: (item) => item.kodeKegiatan || "N/A",
    },
    { key: "jenisRekening", label: "Jenis Rekening" },
    { key: "sumberRekening", label: "Sumber Rekening" },
    { key: "rekeningTujuan", label: "Rekening Tujuan" },
    {
      key: "traceNumber",
      label: "Trace Number",
      render: (item) => (
        <span
          title={item.traceNumber}
          style={{ fontSize: "12px", color: "black" }}
        >
          {item.traceNumber.substring(0, 6)}...
        </span>
      ),
    },
    {
      key: "nominalMasuk",
      label: "Uang Masuk",
      render: (item) => `Rp${(item.nominalMasuk ?? 0).toLocaleString("id-ID")}`,
    },
    {
      key: "nominalKeluar",
      label: "Uang Keluar",
      render: (item) =>
        `Rp${(item.nominalKeluar ?? 0).toLocaleString("id-ID")}`,
    },
    {
      key: "saldoCash",
      label: "Saldo Cash",
      render: (item) => `Rp${(item.saldoCash ?? 0).toLocaleString("id-ID")}`,
    },
    {
      key: "saldoMainBCA",
      label: "Saldo Main BCA",
      render: (item) => `Rp${(item.saldoMainBCA ?? 0).toLocaleString("id-ID")}`,
    },
    {
      key: "saldoPCU",
      label: "Saldo PCU",
      render: (item) => `Rp${(item.saldoPCU ?? 0).toLocaleString("id-ID")}`,
    },
    {
      key: "saldoBCADir",
      label: "Saldo BCA Dir",
      render: (item) => `Rp${(item.saldoBCADir ?? 0).toLocaleString("id-ID")}`,
    },
    {
      key: "deskripsi",
      label: "Deskripsi",
    },
    {
      key: "aksi",
      label: "Aksi",
      render: (item) => (
        <div className="action-buttons">
          <button className="btn-edit" onClick={() => handleEdit(item)}>
            EDIT
          </button>
          <button
            className="btn-delete"
            onClick={() => handleDelete(item.traceNumber)}
          >
            HAPUS
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    setRefreshKey((prev) => prev + 1); // reload data
  }, [jenisRekeningFilter, searchTerm]);

  return (
    <div className="buku-utama-container">
      <h2>
        <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
          Buku Utama
        </Link>
      </h2>

      <LaporanExportButton />

      {isLoading && <div className="loading-indicator">Memuat Data...</div>}

      {/* Filter dan Pencarian */}
      <div className="filter-section">
        <div className="search-filter-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Cari data..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-controls">
            <select
              value={jenisRekeningFilter}
              onChange={(e) => setJenisRekeningFilter(e.target.value)}
            >
              <option value="">Semua Jenis Rekening</option>
              <option value="Cash">Cash</option>
              <option value="Main BCA">Main BCA</option>
              <option value="BCA Dir">BCA Dir</option>
              <option value="PCU">PCU</option>
            </select>

            <button
              onClick={handleCreate}
              className="btn-tambah"
              disabled={isLoading}
            >
              + Tambah Data
            </button>
          </div>
        </div>
      </div>

      {/* Tabel Data */}
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
        // {() => setRefreshKey(prev => prev + 1)}
      />

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
