import { prismaClient } from "../app/database";
import { Validation } from "../validations/validation";
import { DisnakerProfileValidation } from "../validations/profile-validation";
import { ResponseError } from "../errors/response-error";

export default class DisnakerProfileService {
  static async upsert(request: any) {
    const data = Validation.validate(DisnakerProfileValidation, request);
    if (data.divisi) {
      const map: Record<string, string> = {
        superadmin: "SUPERADMIN",
        adminlayanan: "ADMINLAYANAN",
        adminpelatihan: "ADMINPELATIHAN",
        adminpkwt: "ADMINPKWT",
      };
      data.divisi = map[String(data.divisi).toLowerCase()];
    }
    const user = await prismaClient.users.findUnique({ where: { id: data.user_id } });
    if (!user) throw new ResponseError(404, "user not found");
    const existing = await prismaClient.disnaker_profile.findUnique({ where: { user_id: data.user_id } });
    if (existing) {
      const updated = await prismaClient.disnaker_profile.update({ where: { user_id: data.user_id }, data });
      return { message: "Disnaker profile updated", data: updated };
    }
    const created = await prismaClient.disnaker_profile.create({ data });
    return { message: "Disnaker profile created", data: created };
  }

  static async getByUserId(user_id: string) {
    const profile = await prismaClient.disnaker_profile.findUnique({ where: { user_id } });
    return { data: profile };
  }
}