import { useState } from "react";
import apiClient from "../../services/api";
import { Download } from "lucide-react";

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
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Export Laporan</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">Tanggal Awal</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">Tanggal Akhir</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
          />
        </div>

        <button
          onClick={() => handleExport("excel")}
          disabled={loading}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition disabled:opacity-50"
        >
          <Download size={16} />
          Export Excel
        </button>

        <button
          onClick={() => handleExport("pdf")}
          disabled={loading}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition disabled:opacity-50"
        >
          <Download size={16} />
          Export PDF
        </button>
      </div>
    </div>
  );
}
