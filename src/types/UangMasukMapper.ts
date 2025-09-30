import { UangMasukDto } from './UangMasukDto';
import { UangMasuk } from './UangMasuk';

export class UangMasukMapper {
  public static toDTO(uangMasuk: UangMasuk): UangMasukDto {
    return {
      traceNumber: uangMasuk.traceNumber,
      tanggal: uangMasuk.tanggal.split('T')[0], // "2025-04-05"
      kodeTransaksi: uangMasuk.kodeTransaksi,
      sumberRekening: uangMasuk.sumberRekening,
      nominal: parseFloat(uangMasuk.nominal.toString()), // konversi BigDecimal ke number
      deskripsi: uangMasuk.deskripsi,
      kodeAkun: uangMasuk.akun?.kodeAkun || '',
      namaAkun: uangMasuk.akun?.namaAkun || '',
      kodeKegiatan: uangMasuk.kegiatan?.kodeKegiatan || '',
      namaKegiatan: uangMasuk.kegiatan?.namaKegiatan || ''
    };
  }
}