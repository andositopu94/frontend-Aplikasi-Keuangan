import React, { useEffect, useState } from "react";
import apiClient from "../../services/api";
import { UangMasukRekapDto } from "../../types/UangMasukRekapDto";
import "../uang-masuk/UangMasukRekap.css";

export default function UangMasukRekapList() {
  const [data, setData] = useState<UangMasukRekapDto[]>([]);

  useEffect(() => {
    apiClient.get("/rekap/masuk")
      .then(res => setData(res.data))
      .catch(err => console.error("Gagal ambil data rekap uang masuk", err));
  }, []);

  return (
    <div className="kartu">
      <h2>Rekap Uang Masuk</h2>
      <table className="kartu-table">
        <thead>
          <tr>  
            <th>Tanggal</th>
            <th>Jenis Rekening</th>
            <th>Total Uang Masuk</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={idx}>
              <td data-label="Tanggal">{new Date(item.tanggal).toLocaleDateString("id-ID")}</td>
              <td data-label="Jenis Rekening">{item.jenisRekening}</td>
              <td data-label="Total Uang Masuk">Rp{item.totalUangMasuk.toLocaleString("id-ID")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}