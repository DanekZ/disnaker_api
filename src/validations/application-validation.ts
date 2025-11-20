import { z } from "zod";

export const ApplicationValidation = {
  CREATE: z.object({
    candidate_id: z.string().min(1),
    company_id: z.string().min(1),
    job_id: z.string().min(1),
    note: z.string().optional(),
  }),
  UPDATE: z.object({
    id: z.string().min(1),
    status: z.enum(["pending", "test", "interview", "approve", "rejected"]).optional(),
    schedule_start: z.string().nullable().optional(),
    schedule_end: z.string().nullable().optional(),
    note: z.string().nullable().optional(),
  }),
  LIST: z.object({ candidate_id: z.string().optional(), company_id: z.string().optional(), job_id: z.string().optional() }),
};