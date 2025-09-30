import React, { useState } from "react";
import { LaporanLapanganRequest } from "../../types/LaporanLapanganRequest";
import apiClient from "../../services/api";
import { TableColumn } from "../../types/TableColumn";
import LaporanLapanganModal from "./LaporanLapanganModal";
import { DynamicTable } from "../shared/DynamicTable";

export default function LaporanLapanganPage(){
    const [isModalOpen, setIsModelOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<LaporanLapanganRequest | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleCreate = () => {
        setSelectedItem(null);
        setIsModelOpen(true);
    };
    const handleEdit = (item: LaporanLapanganRequest) => {
        setSelectedItem(item);
        setIsModelOpen(true);
    };
    const handleDelete = async (id:string) => {
        if(window.confirm("Apakah anda Yakin Menghapus Data ini?")) {
            try{
                await apiClient.delete(`/laporan-lapangan/${id}`);
                alert("Data berhasil dihapus");
                setRefreshKey((prev) => prev +1);
            }catch(error:any){
                alert("Gagal Hapus Data: " + error.message);
            }
        }
    };
    const handleClose = () => {
        setIsModelOpen(false);
        setSelectedItem(null);
    };
    const handleSuccess = () => {
        setRefreshKey((prev) => prev +1);
    };

    const columns: TableColumn<LaporanLapanganRequest>[] = [
    { key: "tanggal", label: "Tanggal", render: (item) => new Date(item.tanggal).toLocaleDateString("id-ID") },
    { key: "kodeLapangan", label: "Kode Lapangan" },
    { key: "deskripsi", label: "Deskripsi" },
    { key: "debit", label: "Debit", render: (item) => `Rp${item.debit?.toLocaleString("id-ID")}` },
    { key: "kredit", label: "Kredit", render: (item) => `Rp${item.kredit?.toLocaleString("id-ID")}` },
    { key: "keterangan", label: "Keterangan" },
    { key: "kodeKegiatan", label: "Kode Kegiatan" },
    { key: "namaKegiatan", label: "Nama Kegiatan" },
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

  return(
    <div>
        <h2>Laporan Lapangan</h2>
        <button onClick={handleCreate}>+ Tambah Data</button>

        <DynamicTable<LaporanLapanganRequest>
            key= {refreshKey}
            fetchUrl= 'http://localhost:8080/api/laporan-lapangan'
            columns= {columns}
            pageSize={10}
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