import { z, ZodType } from "zod";
import { AdminDivisions } from "../generated/prisma/enums";

export class DisnakerValidation {
  static readonly REGISTER = z.object({
    user: z.object({
      username: z.string().min(5).max(255),
      password: z.string().min(5).max(255),
      email: z.email(),
    }),
    confirm_password: z.string().min(5).max(255),
    divisi: z
      .string()
      .transform((v) => v.toUpperCase())
      .pipe(z.enum(Object.values(AdminDivisions) as [string, ...string[]])),
    full_name: z.string().min(5).max(255),
  });

  static readonly LOGIN = z.object({
    username: z.string().min(5).max(255),
    password: z.string().min(5).max(255),
  });
}
