export interface LaporanLapanganRequest {
  // id?: string;
  tanggal: string; // ISO format
  kodeLapangan: string;
  deskripsi: string;
  kodeAkun: string;
  kodeKegiatan: string;
  debit: number;
  kredit: number;
  keterangan: string;
  buktiPath?: string;
  namaUser: string;
}