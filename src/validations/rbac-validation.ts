import { z } from "zod";

export const RbacValidation = {
  CREATE_ROLE: z.object({
    name: z.string().min(2),
    description: z.string().optional(),
  }),
  UPDATE_ROLE: z.object({
    id: z.number().int().positive(),
    name: z.string().min(2).optional(),
    description: z.string().optional(),
  }),
  CREATE_PERMISSION: z.object({
    code: z.string().min(2),
    label: z.string().min(2),
  }),
  ASSIGN_ROLE_PERMISSIONS: z.object({
    role_id: z.number().int().positive(),
    permissions: z.array(z.string()),
  }),
  ASSIGN_USER_ROLE: z.object({
    id: z.string().min(1),
    role_id: z.number().int().positive(),
  }),
};