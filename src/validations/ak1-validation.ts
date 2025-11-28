import { z } from "zod";

export const CandidateAk1DocumentValidation = z.object({
  candidate_id: z.string().min(1),
  ktp: z.string().min(1),
  ijazah: z.string().min(1),
  pas_photo: z.string().min(1),
  certificate: z.string().optional(),
});

export const CandidateAk1VerifyValidation = z.object({
  ak1_document_id: z.string().min(1),
  status: z.enum(["APPROVED", "REJECTED"]),
  note: z.string().optional(),
  file: z.string().optional(),
});
