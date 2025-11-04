import React, { useEffect, useState } from "react";
import apiClient from "../../services/api";
import { UangKeluarRekapDto } from "../../types/UangKeluarRekapDto";

export default function UangKeluarRekapList() {
  const [data, setData] = useState<UangKeluarRekapDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get("/rekap/keluar")
      .then(res => setData(res.data))
      .catch(err => console.error("Gagal ambil data rekap uang keluar", err));
  }, []);

  return (
    <div className="card">
      <h2>Rekap Uang Keluar</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>Tanggal</th>
            <th>Jenis Rekening</th>
            <th>Total Uang Keluar</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={idx}>
              <td>{new Date(item.tanggal).toLocaleDateString("id-ID")}</td>
              <td>{item.jenisRekening}</td>
              <td>Rp{item.totalUangKeluar.toLocaleString("id-ID")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}