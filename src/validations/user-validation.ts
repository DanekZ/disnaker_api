import { z } from "zod";

export const UserValidation = {
  REGISTER: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(["candidate", "company", "super_admin", "disnaker"]),
  }),
  LOGIN: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
};