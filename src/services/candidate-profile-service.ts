import { prismaClient } from "../app/database";
import { Validation } from "../validations/validation";
import { CandidateProfileValidation } from "../validations/profile-validation";
import { ResponseError } from "../errors/response-error";

export default class CandidateProfileService {
  static async upsert(request: any) {
    const data = Validation.validate(CandidateProfileValidation, request);
    const user = await prismaClient.users.findUnique({ where: { id: data.user_id } });
    if (!user) throw new ResponseError(404, "user not found");
    const existing = await prismaClient.candidate_profile.findUnique({ where: { user_id: data.user_id } });
    if (existing) {
      const updated = await prismaClient.candidate_profile.update({ where: { user_id: data.user_id }, data });
      return { message: "Candidate profile updated", data: updated };
    }
    const created = await prismaClient.candidate_profile.create({ data });
    return { message: "Candidate profile created", data: created };
  }
}