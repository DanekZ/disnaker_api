import { z } from "zod";

export const CompanyProfileValidation = z.object({
  user_id: z.string().min(1),
  company_name: z.string().min(1),
  company_logo: z.string().optional(),
  no_handphone: z.string().min(1),
  province: z.string().min(1),
  city: z.string().min(1),
  address: z.string().min(1),
  website: z.string().optional(),
  about_company: z.string().min(1),
  disnaker_id: z.string().optional(),
});

export const CandidateProfileValidation = z.object({
  user_id: z.string().min(1),
  full_name: z.string().min(1),
  birthdate: z.string().min(1),
  place_of_birth: z.string().min(1),
  nik: z.string().min(1),
  province: z.string().min(1),
  address: z.string().min(1),
  postal_code: z.string().min(1),
  gender: z.string().min(1),
  no_handphone: z.string().min(1),
  photo_profile: z.string().optional(),
  last_education: z.string().min(1),
  graduation_year: z.number(),
  status_perkawinan: z.string().min(1),
  cv_file: z.string().optional(),
  ak1_file: z.string().optional(),
});

export const DisnakerProfileValidation = z.object({
  user_id: z.string().min(1),
  divisi: z.enum(["superadmin", "adminlayanan", "adminpelatihan", "adminpkwt"]).optional(),
  full_name: z.string().min(1),
});