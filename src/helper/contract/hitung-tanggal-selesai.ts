export default function HitungTanggalSelesai(tgl_mulai: Date, masa_kontrak: number) {
  const endDate = new Date(tgl_mulai);
  endDate.setMonth(endDate.getMonth() + masa_kontrak);
  return endDate;
}
