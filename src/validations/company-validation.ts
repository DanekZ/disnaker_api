import zod from "zod";

export class CompanyValidation {
  static LOGIN = zod.object({
    username: zod.string().min(1),
    password: zod.string().min(1),
  });
}
