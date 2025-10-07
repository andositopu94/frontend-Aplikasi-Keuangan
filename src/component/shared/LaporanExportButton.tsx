import { useState } from "react";
import apiClient from "../../services/api";

export default function LaporanExportButton() {
  const today = new Date().toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [loading, setLoading] = useState(false);

  const handleExport = async (type: "excel" | "pdf") => {
    try {
      setLoading(true);

      const endpoint = `/buku-utama/export/${type}`;
      const response = await apiClient.get(endpoint, {
        params: {
          tanggalAwal: startDate,
          tanggalAkhir: endDate
        },
        responseType: "blob" // supaya file bisa di-download
      });

      const fileBlob = new Blob([response.data], {
        type:
          type === "excel"
            ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            : "application/pdf",
      });

      const url = window.URL.createObjectURL(fileBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = type === "excel" ? "Laporan_Keuangan.xlsx" : "Laporan_Keuangan.pdf";
      link.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(`Gagal Export to ${type.toUpperCase()}:`, error);
      alert(`Gagal Export to ${type.toUpperCase()}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <h3>Export Laporan Buku Utama</h3>

      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <div>
          <label style={{ fontSize: 12 }}>Tanggal Awal</label><br />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div>
          <label style={{ fontSize: 12 }}>Tanggal Akhir</label><br />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <button
          onClick={() => handleExport("excel")}
          disabled={loading}
          style={{ padding: "6px 12px", backgroundColor: "#28a745", color: "white", border: "none", cursor: "pointer" }}
        >
          Export Excel
        </button>

        <button
          onClick={() => handleExport("pdf")}
          disabled={loading}
          style={{ padding: "6px 12px", backgroundColor: "#dc3545", color: "white", border: "none", cursor: "pointer" }}
        >
          Export PDF
        </button>
      </div>
    </div>
  );
}
