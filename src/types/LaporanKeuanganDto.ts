export interface LaporanKeuanganDto {
    traceNumber : string;
    tanggal : string;
    kodeTransaksi: string;
    deskripsi : string;
    nominalMasuk : number;
    nominalKeluar : number;
    jenisRekening : string;
    kodeAkun : string;
    namaAkun : string;
    kodeKegiatan : string;
    namaKegiatan : string;
}