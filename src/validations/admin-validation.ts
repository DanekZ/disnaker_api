import { z, ZodType } from "zod";

export class AdminValidation {
  static readonly REGISTER = z.object({
    username: z.string().min(5).max(255),
    password: z.string().min(5).max(255),
    role_code: z.string().min(1).max(15),
    id_perusahaan: z.number().int().min(1).max(10),
  });
}
