import { useState } from "react";
import apiClient from "../../services/api";
import { Download } from "lucide-react";
import "../layout/global.css";

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
   <div className="card mb-6" style={{ 
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none'
    }}>
    <div className="flex-between items-center">
      <div>
      <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px', color:'white' }}>📈 Export Laporan</h3>
      <p style={{ 
        opacity: 0.9, 
        fontSize: '14px',
        color: 'rgba(255,255,255,0.9)'
      }}>
        Download laporan keuangan dalam format Excel atau PDF
      </p>
      </div>
    </div>  

      <div className="export-date-range">
        <div className="date-input-group">
          <div className="date-input">
          <label style={{ 
            display: 'block',
            fontSize: '12px',
            fontWeight: '600',
            marginBottom: '6px',
            color: 'rgba(255,255,255,0.9)'
          }}>Tanggal Awal</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="date-picker"
          />
        </div>

        <div className="date-input">
          <label style={{ 
            display: 'block',
            fontSize: '12px',
            fontWeight: '600',
            marginBottom: '8px',
            color: 'rgba(255,255,255,0.9)'}}>Tanggal Akhir</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="date-picker"
          />
        </div>
      </div>

      <div className="flex gap-3" style={{ justifyContent: 'flex-start' }}>
        <button
          className='btn-export excel'
          onClick={() => handleExport("excel")}
          disabled={loading}
          style={{ opacity: loading ? 0.6 : 1, 
                   cursor: loading ? 'not-allowed' : 'pointer'
           }}
           onMouseOver={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
            }
          }}
          onMouseOut={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
            }
          }}
        >
          <span className="export-icon">📊</span>
          <Download size={16} />
          {loading ? 'Loading...' : 'Export Excel'}
          {/* Export Excel */}
        </button>

        <button
          onClick={() => handleExport("pdf")}
          disabled={loading}
          className="btn-export pdf"
          style={{ cursor: loading ? 'not-allowed' : 'pointer',
                   opacity: loading ? 0.6 : 1
           }}
           onMouseOver={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(239, 68, 68, 0.4)';
            }
          }}
          onMouseOut={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
            }
          }}
        >
          <Download size={16} />
          <span className="export-icon">📄</span>
          {/* Export PDF */}
          {loading ? 'Loading...' : 'Export PDF'}
        </button>
      </div>
    </div>
  </div>
  );
}
