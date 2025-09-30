import { bigDecimal } from 'js-big-decimal';

export interface UangMasukDto {
  traceNumber: string;
  tanggal: string; // atau LocalDate jika kamu parsing
  kodeTransaksi: string;
  sumberRekening: string;
  nominal: bigDecimal | number;
  deskripsi: string;
  kodeAkun: string;
  namaAkun: string;
  kodeKegiatan: string;
  namaKegiatan: string;
}
