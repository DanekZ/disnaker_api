import zod from "zod";

export class EmployeeValidation {
  static readonly CREATE = zod.object({
    NIK: zod.string().min(1),
    nama: zod.string().min(1),
    kode_divisi: zod.number().min(1),
    kode_jabatan: zod.number().min(1),
  });

  static readonly UPDATE = zod.object({
    NIK: zod.string().min(1),
    nama: zod.string().min(1),
    kode_divisi: zod.number().min(1),
    kode_jabatan: zod.number().min(1),
  });
}
