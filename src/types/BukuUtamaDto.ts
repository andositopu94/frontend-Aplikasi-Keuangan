export interface BukuUtamaDto {
    traceNumber: string;
    tanggal: string;
    kodeTransaksi: string;
    jenisRekening: string;
    nominalMasuk: number;
    nominalKeluar: number;
    sumberRekening: string; 
    rekeningTujuan: string; 
    deskripsi: string;
    saldoMainBCA: number;
    saldoPCU: number;
    saldoBCADir: number;
    saldoCash: number;
    kodeAkun: string;
    namaAkun: string;
    kodeKegiatan: string;
    namaKegiatan: string;
    aksi?: never;
}