import zod from "zod";

export class CompanyValidation {
  static readonly LOGIN = zod.object({
    username: zod.string().min(1),
    password: zod.string().min(1),
  });

  static readonly REGISTER = zod.object({
    username: zod.string().min(1),
    password: zod.string().min(1),
    confirm_password: zod.string().min(1),
    email: zod.email(),
    company_name: zod.string().min(1),
    no_handphone: zod.string().min(1),
    province: zod.string().min(1),
    city: zod.string().min(1),
    address: zod.string().min(1),
    about_company: zod.string().min(1),
  });

  static readonly CREATE_POSITION = zod.object({
    nama: zod.string().min(1),
  });

  static readonly UPDATE_POSITION = zod.object({
    nama: zod.string().min(1),
  });

  static readonly CREATE_DIVISION = zod.object({
    nama: zod.string().min(1),
  });

  static readonly UPDATE_DIVISION = zod.object({
    nama: zod.string().min(1),
  });
}
