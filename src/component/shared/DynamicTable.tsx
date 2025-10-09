import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TableColumn } from '../../types/TableColumn';
// import '../layout/BukuList.css';
import BukuUtamaList from '../buku-utama/BukuUtamaList';

interface DynamicTableProps<T> {
  fetchUrl: string;
  columns: TableColumn<T>[];
  onRowDelete?: (id: string) => void;
  onRowUpdate?: (id: string,  data:T) => void;
  onDataChange?: () => void;
  pageSize?: number;
  refreshKey?: number;
  extraParams?: Record<string, string>;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

export const DynamicTable = <T extends Record<string, any>>({
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
}: DynamicTableProps<T>) => {
  const [data, setData] = useState<T[]>([]);
  const [internalPage, setInternalPage] = useState(0);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const stableParams = JSON.stringify(extraParams);
  const page = currentPage ?? internalPage;

  useEffect(() => {
  const fetchData = async () => {
    setIsLoading(true);
    try {
      //  Gunakan URL untuk membangun query string dengan benar
      const url = new URL(fetchUrl, window.location.origin);
      url.searchParams.set('page', page.toString());
      url.searchParams.set('size', pageSize.toString());
      

      // Tambahkan extraParams
      Object.entries(extraParams).forEach(([key, value]) => {
          url.searchParams.set(key, value ?? '');
      });

       console.log("Request URL:", url.toString());

      const res = await axios.get(url.toString());
      console.log("Response:", res.data);
      const responseData = res.data;

      if (responseData.content !== undefined) {
        setData(responseData.content);
        setTotalPages(responseData.totalPages || 1);
      } else {
        setData(responseData);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Gagal mengambil ", error);
    } finally {
      setIsLoading(false);
    }
  };

  fetchData();
}, [page, fetchUrl, refreshKey, pageSize, stableParams]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
   const  searchValue = (e.target.value);
    if (onPageChange) onPageChange(0);
    else setInternalPage(0); 
  };

  function setPage(arg0: number): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div>
      {isLoading && <div className="table-loading">Memuat data...</div>}

      {/* Table */}
      <table className='data-table'>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                onClick={() => col.sortable && setPage(0)}
                className={col.sortable ? 'sortable-header' : ''}
              >
                {col.label}
              </th>
            ))}
            {(onRowDelete || onRowUpdate) && <th>Aksi</th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 &&  !isLoading ? (
            <tr>
              <td colSpan={columns.length + ((onRowDelete || onRowUpdate) ? 1 : 0)} className='no-data'>Tidak ada data</td>
            </tr>
          ) : (
            data.map((item, idx) => (
              <tr key={idx} className={idx % 2 ===0 ? 'even-row' : 'odd-row'}>
                {columns.map((col) => (
                  <td key={String(col.key)}>
                    {/* {col.render ? col.render(item) : item[col.key]}
                  </td> */}
                  {col.key === "kodeAkun" && item["namaAkun"]
                      ? `${item["kodeAkun"]} - ${item["namaAkun"]}`
                      : col.key === "kodeKegiatan" && item["namaKegiatan"]
                      ? `${item["kodeKegiatan"]} - ${item["namaKegiatan"]}`
                      : col.render
                      ? col.render(item)
                      : item[col.key]}
                  </td>
                ))}
              
                  {(onRowDelete || onRowUpdate) && (
                   <td className="action-cells">
                    {onRowUpdate && (
                      <button 
                        onClick={() => onRowUpdate(item['traceNumber'] as string, item)}
                        className="action-btn edit-btn"
                      >
                        Edit
                      </button>
                    )}
                    {onRowDelete && (
                      <button 
                        onClick={() => onRowDelete(item['traceNumber'] as string)}
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination-controls">
          <button 
            onClick={() => {
              const newPage = Math.max(0, page - 1);
              onPageChange ? onPageChange(newPage) : setInternalPage(newPage);
            }} 
            // setPage(p => Math.max(0, p - 1))} 
            disabled={page === 0 || isLoading}
            className="pagination-btn"
          >
            Sebelumnya
          </button>
          <span className="page-info">Halaman {page + 1} dari {totalPages}</span>
          <button 
            onClick={() => {
              const newPage = page + 1;
              onPageChange ? onPageChange(newPage) : setInternalPage(newPage);
            }}
              // setPage(p => p + 1)} 
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