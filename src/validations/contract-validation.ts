import zod from "zod";

export class ContractValidation {
  static readonly CREATE = zod.object({
    tgl_mulai: zod.string(),
    tgl_selesai: zod.string().optional(),
    masa_kontrak: zod.number().int().min(1),
    kontrak_file: zod.string().optional(),
  });

  static readonly UPDATE = zod.object({
    tgl_mulai: zod.string(),
    tgl_selesai: zod.string().optional(),
    masa_kontrak: zod.number().int().min(1),
    kontrak_file: zod.string().optional(),
  });
}
