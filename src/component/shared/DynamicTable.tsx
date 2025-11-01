import React, { useState, useEffect } from "react";
import { TableColumn } from "../../types/TableColumn";
import apiClient from "../../services/api";

interface DynamicTableProps<T> {
  data?: T[];
  fetchUrl?: string;
  columns: TableColumn<T>[];
  onRowDelete?: (id: string) => void;
  onRowUpdate?: (id: string, data: T) => void;
  onDataChange?: () => void;
  pageSize?: number;
  refreshKey?: number;
  extraParams?: Record<string, string>;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  // When parent performs server-side pagination, provide total items so DynamicTable can render pagination.
  totalItems?: number;
}

export const DynamicTable = <T extends Record<string, any>>({
  data: externalData,
  fetchUrl,
  columns,
  onRowDelete,
  onRowUpdate,
  onDataChange,
  pageSize = 10,
  refreshKey = 0,
  extraParams = {},
  currentPage,
  onPageChange,
  totalItems,
}: DynamicTableProps<T>) => {
  const [data, setData] = useState<T[]>(externalData || []);
  const [internalPage, setInternalPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const stableParams = JSON.stringify(extraParams);
  const page = currentPage ?? internalPage;

  // We intentionally depend on `stableParams` (JSON string) instead of the `extraParams` object
  // to avoid re-running when parent recreates the object identity each render.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (externalData && externalData.length > 0) {
      setData(externalData);
      // If parent passes data array directly, prefer explicit totalItems (server-side) if provided,
      // otherwise infer total pages from array length (client-side/full-data scenario).
      if (typeof totalItems === "number") {
        setTotalPages(Math.max(1, Math.ceil(totalItems / pageSize)));
      } else {
        const inferredTotal = Math.max(1, Math.ceil(externalData.length / pageSize));
        setTotalPages(inferredTotal);
      }
      // make sure internal page is within bounds when parent doesn't control currentPage
      if (currentPage === undefined) {
        setInternalPage((p) => Math.min(p, Math.max(0, Math.ceil((totalItems ?? externalData.length) / pageSize) - 1)));
      }
      return;
    }
    if (!fetchUrl) return;
    
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const parsedExtra: Record<string, any> = stableParams ? JSON.parse(stableParams) : {};
        const params: Record<string, any> = {
          page,
          size: pageSize,
          ...parsedExtra,
        };
        const res = await apiClient.get(fetchUrl, { params });
        const responseData = res.data;

        if (responseData.content !== undefined) {
          setData(responseData.content);
          // server paginated response (Spring Data style)
          if (typeof responseData.totalPages === 'number') {
            setTotalPages(responseData.totalPages || 1);
          } else if (typeof responseData.totalElements === 'number') {
            setTotalPages(Math.max(1, Math.ceil(responseData.totalElements / pageSize)));
          } else {
            setTotalPages(1);
          }
        } else if (Array.isArray(responseData)) {
          const total = Math.ceil(responseData.length / pageSize);
          const start = page * pageSize;
          const paginated = responseData.slice(start, start + pageSize);
          setData(paginated);
          setTotalPages(total);}
        else {
          setData(responseData);
          setTotalPages(1);
        }
      } catch (error: any) {
        console.error("Gagal mengambil data:", error);
        const status = error.response?.status;
        if (status === 403) {
          setErrorMsg(
            "Akses ditolak (403). Anda tidak memiliki izin untuk melihat data ini."
          );
        } else if (status === 401) {
          setErrorMsg("Sesi berakhir (401). Silakan login ulang.");
          localStorage.removeItem("authToken");
          window.location.href = "/login";
        } else {
          setErrorMsg("Terjadi kesalahan saat mengambil data.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [page, fetchUrl, refreshKey, pageSize, stableParams, externalData, currentPage, totalItems]);

  return (
    <div>
      {isLoading && <div className="table-loading">Memuat data...</div>}

      {errorMsg && (
        <div
          style={{
            background: "#fee2e2",
            color: "#b91c1c",
            padding: "8px 12px",
            borderRadius: "8px",
            marginBottom: "10px",
            fontSize: "14px",
          }}
        >
          {errorMsg}
        </div>
      )}

      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)}>{col.label}</th>
            ))}
            {(onRowUpdate || onRowDelete) && <th>Aksi</th>}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 && !isLoading ? (
            <tr>
              <td colSpan={columns.length + (onRowUpdate || onRowDelete ? 1 : 0)} className="no-data">
                Tidak ada data
              </td>
            </tr>
          ) : (
            data.map((item, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? "even-row" : "odd-row"}>
                {columns.map((col) => (
                  <td key={String(col.key)}>
                    {col.render ? col.render(item) : item[col.key] ?? "-"}
                  </td>
                ))}

             {(onRowUpdate || onRowDelete) && (
                  <td className="action-cells">
                    {onRowUpdate && (
                      <button
                        onClick={() => onRowUpdate(item["traceNumber"] || item["id"], item)}
                        className="action-btn edit-btn"
                      >
                        Edit
                      </button>
                    )}
                    {onRowDelete && (
                      <button
                        onClick={() => onRowDelete(item["traceNumber"] || item["id"])}
                        className="action-btn delete-btn"
                      >
                        Hapus
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="pagination-controls">
          <button
            onClick={() => {
              const newPage = Math.max(0, page - 1);
              onPageChange ? onPageChange(newPage) : setInternalPage(newPage);
            }}
            disabled={page === 0 || isLoading}
            className="pagination-btn"
          >
            Sebelumnya
          </button>

          <span className="page-info">
            Halaman {page + 1} dari {totalPages}
          </span>

          <button
            onClick={() => {
              const newPage = page + 1;
              onPageChange ? onPageChange(newPage) : setInternalPage(newPage);
            }}
            disabled={page >= totalPages - 1 || isLoading}
            className="pagination-btn"
          >
            Berikutnya
          </button>
        </div>
      )}
    </div>
  );
};
