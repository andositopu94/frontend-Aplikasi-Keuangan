import React, { useEffect, useState, useCallback } from "react";
import { DynamicTable } from "../shared/DynamicTable";
import { BukuUtamaDto } from "../../types/BukuUtamaDto";
import { TableColumn } from "../../types/TableColumn";
import BukuUtamaModal from "./BukuUtamaModal";
import apiClient from "../../services/api";
import { Link } from "react-router-dom";
import LaporanExportButton from "../shared/LaporanExportButton";
import { Header } from "../layout/Header";
import Sidebar from "../layout/sidebar";
import "../layout/global.css";
import { Edit, Plus, Trash2 } from "lucide-react";
import { count } from "console";

type ColorStyle = {
  bg: string;
  text: string;
  border?: string;
};

export default function BukuUtamaList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BukuUtamaDto | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [jenisRekeningFilter, setJenisRekeningFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [data, setData] = useState<BukuUtamaDto[]>([]);
  const [totalItems, setTotalItems] = useState<number | undefined>(undefined);
  // const [userRole, setUserRole] = useState("USER");
  // useEffect(() => {
  //   const saveRole = localStorage.getItem("userRole");
  //   if (saveRole) setUserRole(saveRole.toUpperCase().trim());
  // }, []);

  const [userRole, setUserRole] = useState<string>(() => {
    // Ambil nilai awal dari localStorage (pastikan trim & uppercase agar konsisten)
    const v = localStorage.getItem("userRole");
    return v ? v.trim().toUpperCase() : "USER";
  });
    
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "userRole") {
        const newVal = e.newValue ? e.newValue.trim().toUpperCase() : "USER";
        setUserRole(newVal);
      }
    };

    const handleRoleChange = (e: Event) => {
      const newVal = localStorage.getItem("userRole");
      setUserRole(newVal ? newVal.trim().toUpperCase() : "USER");
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("userRoleChanged", handleRoleChange); // optional helper jika Anda trigger custom event pada login

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("userRoleChanged", handleRoleChange);
    };
  }, []);

  const fetchData = useCallback(() => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (searchTerm) params.append("search", searchTerm);
    if (jenisRekeningFilter) params.append("jenisRekening", jenisRekeningFilter);
    params.append("size", "10");
    params.append("page", currentPage.toString());

    const url = `/buku-utama?${params.toString()}`;
    console.log('[BukuUtamaList] fetching', { url, page: currentPage, size: 10, searchTerm, jenisRekeningFilter });
    apiClient
      .get(url)
      .then((res) => {
        const result = res.data;
        console.log('[BukuUtamaList] response received', {
          page: result.pageable?.pageNumber ?? result.number ?? null,
          size: result.pageable?.pageSize ?? result.size ?? null,
          totalElements: result.totalElements ?? null,
          totalPages: result.totalPages ?? null,
        });
        const content = result.content || result;
        setData(content);
        // If server returns totalElements (Spring Data), use it to calculate pagination
        if (result.totalElements !== undefined) {
          setTotalItems(result.totalElements);
        } else if (result.totalPages !== undefined) {
          // approximate total items when only totalPages provided
          setTotalItems(result.totalPages * 10);
        } else {
          setTotalItems(Array.isArray(content) ? content.length : undefined);
        }
      })
      .catch((err) => console.error("Gagal ambil data:", err))
      .finally(() => setIsLoading(false));
  }, [searchTerm, jenisRekeningFilter, currentPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshKey]);

  // when user changes search or filter, reset to first page
  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm, jenisRekeningFilter]);

  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1);
    fetchData();
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
    if (userRole !== "SUPERVISI") {
      alert("Anda tidak memiliki izin untuk menghapus data.");
    }
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

  const getJenisRekeningColor = (jenis: string): ColorStyle => {
    const colors: Record<string, ColorStyle> = {
      Cash: { bg: "#dcfce7", text: "#166534", border: "bbf7d0" },
      "Main BCA": { bg: "#dbeafe", text: "#1e40af", border: "#bfdbfe" },
      "BCA Dir": { bg: "#fef3c7", text: "#92400e", border: "#fde68a" },
      PCU: { bg: "#f3e8ff", text: "#7e22ce", border: "#e9d5ff" },
    };
    return (
      colors[jenis] || { bg: "#f1f5f9", text: "#475569", border: "#e2e8f0" }
    );
  };

  const columns: TableColumn<BukuUtamaDto>[] = [
    {
      key: "tanggal",
      label: "Tanggal Transaksi",
      sortable: true,
      render: (item) => (
        <div style={{ fontSize: "14px", fontWeight: "500" }}>
          {new Date(item.tanggal).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </div>
      ),
    },

    {
      key: "traceNumber",
      label: "Trace Number",
      render: (item) => (
        <div
          style={{
            fontFamily: "monospace",
            fontSize: "12px",
            color: "var(--text-secondary)",
          }}
        >
          {item.traceNumber}
        </div>
      ),
    },

    {
      key: "kodeTransaksi",
      label: "Kode Transaksi",
      render: (item) => (
        <div
          style={{
            fontFamily: "monospace",
            fontSize: "13px",
            color: "var(--text-secondary)",
          }}
        >
          {item.kodeTransaksi}
        </div>
      ),
    },
    {
      key: "kodeAkun",
      label: "Akun",
      render: (row) => (
        <div>
          <div style={{ fontWeight: "600", fontSize: "14px" }}>
            {row.kodeAkun}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
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
          <div style={{ fontWeight: "600", fontSize: "14px" }}>
            {item.kodeKegiatan}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
            {item.namaKegiatan || "N/A"}
          </div>
        </div>
      ),
    },
    {
      key: "jenisRekening",
      label: "Jenis Rekening",
      render: (item) => (
        <span
          style={{
            padding: "4px 8px",
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: "600",
            backgroundColor: getJenisRekeningColor(item.jenisRekening).bg,
            color: getJenisRekeningColor(item.jenisRekening).text,
            border: `1px solid ${getJenisRekeningColor(item.jenisRekening).bg}`,
          }}
        >
          {item.jenisRekening}
        </span>
      ),
    },
    {
      key: "sumberRekening",
      label: "Sumber Rekening",
      render: (item) => (
        <div style={{ fontSize: "14px" }}>{item.sumberRekening || "-"}</div>
      ),
    },
    {
      key: "rekeningTujuan",
      label: "Rekening Tujuan",
      render: (item) => (
        <div style={{ fontSize: "14px" }}>{item.rekeningTujuan || "-"}</div>
      ),
    },
    {
      key: "nominalMasuk",
      label: "Uang Masuk",
      render: (item) => (
        <div
          style={{
            color: "var(--success-color)",
            fontWeight: "600",
            textAlign: "right",
            fontSize: "14px",
          }}
        >
          {item.nominalMasuk
            ? `Rp${item.nominalMasuk.toLocaleString("id-ID")}`
            : "-"}
        </div>
      ),
    },
    {
      key: "nominalKeluar",
      label: "Uang Keluar",
      render: (item) => (
        <div
          style={{
            color: "var(--error-color)",
            fontWeight: "600",
            textAlign: "right",
            fontSize: "14px",
          }}
        >
          {item.nominalKeluar
            ? `Rp${item.nominalKeluar.toLocaleString("id-ID")}`
            : "-"}
        </div>
      ),
    },
    {
      key: "deskripsi",
      label: "Deskripsi",
      render: (item) => (
        <div
          style={{
            fontSize: "14px",
            maxWidth: "200px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={item.deskripsi} 
        >
          {item.deskripsi || "-"}
        </div>
      ),
    },
    
    {
      key: "aksi",
      label: "Aksi",
      render: (item) => (
        <div className="flex gap-2">
          {(userRole === "ADMIN" || userRole === "SUPERVISI") && (
          <button
            className="btn btn-outline btn-sm flex items-center gap-2"
            onClick={() => handleEdit(item)}
            style={{ padding: "6px 12px", fontSize: "12px" }}
          >
            <Edit size={14} />
            Edit
          </button>
          )}
          {
            userRole === "SUPERVISI" && (  
          <button
            className="btn btn-danger btn-sm flex items-center gap-2"
            onClick={() => handleDelete(item.traceNumber)}
            style={{ padding: "6px 12px", fontSize: "12px" }}
          >
            <Trash2 size={14} />
            Hapus
          </button>
            )}
        </div>
      ),
    },
  ];

  const totalData = data.length;
  const cashCount = data.filter((d) => d.jenisRekening === "Cash").length;
  const mainBcaCount = data.filter(
    (d) => d.jenisRekening === "Main BCA"
  ).length;
  const bcaDirCount = data.filter((d) => d.jenisRekening === "BCA Dir").length;
  const pcuCount = data.filter((d) => d.jenisRekening === "PCU").length;

  const calculatePercent = (count: number, total: number): string => {
    return total > 0 ? ((count / total) * 100).toFixed(1) : "0";
  };

  return (
    <div>
      <div
        className="card mb-6 "
        style={{
          background:
            "linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%)",
          color: "white",
          border: "none",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="header-background-pattern"></div>
        <div className="flex-between mb-6 relative z-10">
          <div>
            <h1
              style={{
                fontSize: "28px",
                fontWeight: "700",
                marginBottom: "8px",
                color: "white",
              }}
            >
              Buku Utama
            </h1>
            <p style={{ color: 'white' }}>
              Kelola semua transaksi keuangan dalam satu tempat
            </p>
          </div>
        </div>
      </div>

      {/* Export Section */}
      <LaporanExportButton />

      {/* Filter dan Pencarian */}
      <div
        className="card"
        style={{ backgroundColor: "#f8fafc", marginTop: "20px" }}
      >
        <div className="flex-between">
          <div style={{ flex: 1, maxWidth: "400px" }}>
            <div className="form-group">
              <div className="form-label">Cari Data</div>
              <input
                type="text"
                className="form-input"
                placeholder="Cari berdasarkan deskripsi, kode transaksi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ background: "white" }}
              />
            </div>
          </div>

          <div style={{ flex: 1, maxWidth: "300px" }}>
            <div className="form-group">
              <div className="form-label">Filter Jenis Rekening</div>
              <select
                className="form-select"
                value={jenisRekeningFilter}
                onChange={(e) => setJenisRekeningFilter(e.target.value)}
                style={{ background: "white" }}
              >
                <option value="">Semua Jenis Rekening</option>
                <option value="Cash">Cash</option>
                <option value="Main BCA">Main BCA</option>
                <option value="BCA Dir">BCA Dir</option>
                <option value="PCU">PCU</option>
              </select>
            </div>
            <button style={{ display: 'flex', position: 'relative' }}
            className="btn btn-primary flex items-center gap-2"
            onClick={handleCreate}
            disabled={isLoading}
          >
            <span>➕</span>
            Tambah Transaksi
          </button>
          </div>
        </div>
      </div>

      <div className="stats-horizontal-container mb-6">
        <div className="stats-row">
          <div className="stats-card-horizontal total-data">
            <div className="stats-icon-horizontal">
              <span className="icon">📊</span>
            </div>
            <div className="stats-content-horizontal">
              <div className="stats-value-horizontal">{totalData}</div>
              <div className="stats-label-horizontal">Total Data</div>
              <div className="stats-trend-horizontal">
                <span className="trend-up">All Records</span>
              </div>
            </div>
          </div>

          <div className="stats-card-horizontal cash">
            <div className="stats-icon-horizontal">
              <span className="icon">💵</span>
            </div>
            <div className="stats-content-horizontal">
              <div className="stats-value-horizontal">{cashCount}</div>
              <div className="stats-label-horizontal">Cash</div>
              <div className="stats-trend-horizontal">
                <span className="trend-up">
                  {calculatePercent(cashCount, totalData)}%
                </span>
              </div>
            </div>
          </div>

          <div className="stats-card-horizontal main-bca">
            <div className="stats-icon-horizontal">
              <span className="icon">🏦</span>
            </div>
            <div className="stats-content-horizontal">
              <div className="stats-value-horizontal">{mainBcaCount}</div>
              <div className="stats-label-horizontal">Main BCA</div>
              <div className="stats-trend-horizontal">
                <span className="trend-up">
                  {calculatePercent(mainBcaCount, totalData)}%
                </span>
              </div>
            </div>
          </div>

          <div className="stats-card-horizontal bca-dir">
            <div className="stats-icon-horizontal">
              <span className="icon">💳</span>
            </div>
            <div className="stats-content-horizontal">
              <div className="stats-value-horizontal">{bcaDirCount}</div>
              <div className="stats-label-horizontal">BCA Dir</div>
              <div className="stats-trend-horizontal">
                <span className="trend-neutral">
                  {calculatePercent(bcaDirCount, totalData)}%
                </span>
              </div>
            </div>
          </div>

          <div className="stats-card-horizontal pcu">
            <div className="stats-icon-horizontal">
              <span className="icon">🔄</span>
            </div>
            <div className="stats-content-horizontal">
              <div className="stats-value-horizontal">{pcuCount}</div>
              <div className="stats-label-horizontal">PCU</div>
              <div className="stats-trend-horizontal">
                <span className="trend-down">
                  {calculatePercent(pcuCount, totalData)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabel Data - Enhanced Styling */}
      <div className="card">
        {isLoading ? (
          <div className="text-center py-8">
            <div
              className="loading-spinner"
              style={{
                width: "40px",
                height: "40px",
                border: "4px solid #f3f4f6",
                borderTop: "4px solid #3b82f6",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto 16px",
              }}
            ></div>
            <p style={{ color: "var(--text-secondary)" }}>Memuat data...</p>
          </div>
        ) : (
          <DynamicTable<BukuUtamaDto>
            // key={refreshKey}
            fetchUrl="/buku-utama"
            data={data}
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
            totalItems={totalItems}
          />
        )}
      </div>

      {/* Modal */}
      {(userRole === "ADMIN" || userRole === "SUPERVISI") && (
      <BukuUtamaModal
        isOpen={isModalOpen}
        onClose={handleClose}
        onSuccess={handleSuccess}
        initialData={selectedItem}
      />
      )}
      <style>{`@keyframes spin {
          0% {transform:rotate(0deg);}
          100% {transform: rotate(360deg);}}`}</style>
    </div>
  );
}
