import { z } from "zod";

export const UserValidation = {
  REGISTER: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(["candidate", "company", "disnaker"]),
  }),
  LOGIN: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
};