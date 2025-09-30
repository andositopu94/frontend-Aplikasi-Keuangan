// import { bigDecimal } from 'js-big-decimal';

export interface UangMasuk {
  traceNumber: string;
  tanggal: string; // ISO format
  kodeTransaksi: string;
  sumberRekening: string;
  nominal: number;
  deskripsi: string;
  akun: Akun;
  kegiatan: Kegiatan;
}

interface Akun {
  kodeAkun: string;
  namaAkun: string;
}

interface Kegiatan {
  kodeKegiatan: string;
  namaKegiatan: string;
}