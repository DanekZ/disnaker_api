import zod from "zod";

export class ContractValidation {
  static readonly CREATE = zod.object({
    tgl_mulai: zod.date(),
    tgl_selesai: zod.date().optional(),
    masa_kontrak: zod.number().int().min(1),
    kontrak_file: zod.string().optional(),
  });
}
