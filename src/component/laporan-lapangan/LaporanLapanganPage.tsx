import React, { useEffect, useState } from "react";
import { LaporanLapanganRequest } from "../../types/LaporanLapanganRequest";
import apiClient from "../../services/api";
import { TableColumn } from "../../types/TableColumn";
import LaporanLapanganModal from "./LaporanLapanganModal";
import { DynamicTable } from "../shared/DynamicTable";
import { Link } from "react-router-dom";

export default function LaporanLapanganPage() {
  const [isModalOpen, setIsModelOpen] = useState(false);
  const [selectedItem, setSelectedItem] =
    useState<LaporanLapanganRequest | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [laporan, setLaporan] = useState<LaporanLapanganRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchData = async (page = 0) => {
    try {
      const res = await apiClient.get("/laporan-lapangan?size=100", {
        params: { page, size: 20 },
      });
      setLaporan(res.data.content || []);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const handleAdd = () => {
    setSelectedItem(null);
    setIsModelOpen(true);
  };
  const handleCreate = () => {
    setSelectedItem(null);
    setIsModelOpen(true);
  };
  const handleEdit = (item: LaporanLapanganRequest) => {
    setSelectedItem(item);
    setIsModelOpen(true);
  };
  const handleDelete = async (id: string) => {
    if (window.confirm("Apakah anda Yakin Menghapus Data ini?")) {
      try {
        await apiClient.delete(`/laporan-lapangan/${id}`);
        fetchData(currentPage);
        alert("Data berhasil dihapus");
        setRefreshKey((prev) => prev + 1);
      } catch (error: any) {
        alert("Gagal Hapus Data: " + error.message);
      }
    }
    if (loading) return <p>Loading ....</p>;
  };
  const handleClose = () => {
    setIsModelOpen(false);
    setSelectedItem(null);
  };
  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const columns: TableColumn<LaporanLapanganRequest>[] = [
    {
      key: "tanggal",
      label: "Tanggal",
      render: (item) => new Date(item.tanggal).toLocaleDateString("id-ID"),
    },
    { key: "kodeLapangan", label: "Kode Lapangan" },
    { key: "deskripsi", label: "Deskripsi" },
    {
      key: "debit",
      label: "Debit",
      render: (item) => `Rp${item.debit?.toLocaleString("id-ID")}`,
    },
    {
      key: "kredit",
      label: "Kredit",
      render: (item) => `Rp${item.kredit?.toLocaleString("id-ID")}`,
    },
    { key: "keterangan", label: "Keterangan" },
    { key: "kodeKegiatan", label: "Kode Kegiatan" },
    { key: "kodeAkun", label: "Kode Akun" },
    { key: "namaUser", label: "Nama User" },
    {
      key: "buktiPath",
      label: "Bukti",
      render: (item) =>
        item.buktiPath ? (
          <a
            href={`http://localhost:8080/api/laporan-lapangan/files/${item.buktiPath}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Lihat Bukti
          </a>
        ) : (
          "N/A"
        ),
    },
    {
      key: "aksi",
      label: "Aksi",
      render: (item) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => handleEdit(item)}>Edit</button>
          <button onClick={() => handleDelete(item.id!)}>Hapus</button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h2>
        <Link to="/" style={{ color: "inherit" }}>
          Laporan Lapangan
        </Link>
      </h2>
      <button onClick={handleCreate}>+ Tambah Data</button>

      <div>
        <button
          onClick={() => fetchData(currentPage - 1)}
          disabled={currentPage === 0}
        >
          Sebelumnya
        </button>
        <span>
          {" "}
          Halaman {currentPage + 1} dari {totalPages}{" "}
        </span>
        <button
          onClick={() => fetchData(currentPage + 1)}
          disabled={currentPage + 1 === totalPages}
        >
          Berikutnya
        </button>
      </div>

      <DynamicTable<LaporanLapanganRequest>
        key={refreshKey}
        fetchUrl="http://localhost:8080/api/laporan-lapangan"
        data={laporan}
        columns={columns}
        pageSize={20}
        currentPage={currentPage}
        totalItems={totalPages * 20}
        onPageChange={(newPage) => fetchData(newPage)}
      />

      <LaporanLapanganModal
        isOpen={isModalOpen}
        onClose={handleClose}
        onSuccess={handleSuccess}
        initialData={selectedItem}
      />
    </div>
  );
}
