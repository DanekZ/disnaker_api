import { prismaClient } from "../app/database";
import { Validation } from "../validations/validation";
import { CompanyProfileValidation } from "../validations/profile-validation";
import { ResponseError } from "../errors/response-error";

export default class CompanyProfileService {
  static async upsert(request: any) {
    const data = Validation.validate(CompanyProfileValidation, request);
    const user = await prismaClient.users.findUnique({ where: { id: data.user_id } });
    if (!user) throw new ResponseError(404, "user not found");
    const existing = await prismaClient.company_profile.findUnique({ where: { user_id: data.user_id } });
    if (existing) {
      const updated = await prismaClient.company_profile.update({ where: { user_id: data.user_id }, data });
      return { message: "Company profile updated", data: updated };
    }
    const created = await prismaClient.company_profile.create({ data });
    return { message: "Company profile created", data: created };
  }

  static async getByUserId(user_id: string) {
    const profile = await prismaClient.company_profile.findUnique({ where: { user_id } });
    return { data: profile };
  }
}