import React, { useEffect, useState } from "react";
import apiClient from "../../services/api";
import { UangMasukRekapDto } from "../../types/UangMasukRekapDto";

export default function UangMasukRekapList() {
  const [data, setData] = useState<UangMasukRekapDto[]>([]);

  useEffect(() => {
    apiClient.get("/rekap/masuk")
      .then(res => setData(res.data))
      .catch(err => console.error("Gagal ambil data rekap uang masuk", err));
  }, []);

  return (
    <div className="card">
      <h2>Rekap Uang Masuk</h2>
      <table className="data-table">
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
              <td>{new Date(item.tanggal).toLocaleDateString("id-ID")}</td>
              <td>{item.jenisRekening}</td>
              <td>Rp{item.totalUangMasuk.toLocaleString("id-ID")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}