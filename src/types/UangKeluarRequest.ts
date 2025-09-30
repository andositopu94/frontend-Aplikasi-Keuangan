export interface UangKeluarRequest {
    tanggal: string;
    kodeAkun: string;
    kodeKegiatan: string;
    rekeningTujuan: string;
    nominal: number;
    deskripsi: string;
}