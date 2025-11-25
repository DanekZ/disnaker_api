import { prismaClient } from "../app/database";
import { Validation } from "../validations/validation";
import { CompanyProfileValidation } from "../validations/profile-validation";
import { ResponseError } from "../errors/response-error";
import UserService from "./user-service";

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

  static async list(query: { status?: 'APPROVED' | 'PENDING' | 'REJECTED'; search?: string }) {
    const where: any = {};
    if (query.status) where.status = query.status as any;
    if (query.search) {
      const s = query.search;
      where.OR = [
        { company_name: { contains: s } },
        { city: { contains: s } },
        { province: { contains: s } },
      ];
    }
    const rows = await prismaClient.company_profile.findMany({ where, orderBy: { createdAt: 'desc' } });
    return { data: rows };
  }

  static async getByUserId(user_id: string) {
    const profile = await prismaClient.company_profile.findUnique({ where: { user_id } });
    return { data: profile };
  }

  static async getById(id: string) {
    const profile = await prismaClient.company_profile.findUnique({ where: { id } });
    return { data: profile };
  }

  static async create(request: any) {
    if (!request.user_id) {
      const email = String(request.user_email || "").trim();
      const password = String(request.user_password || "").trim();
      if (!email || !password) throw new ResponseError(400, "user credentials required");
      const reg = await UserService.register({ email, password, role: "company" });
      request.user_id = reg.id;
    }
    const data = Validation.validate(CompanyProfileValidation, request);
    const exists = await prismaClient.company_profile.count({ where: { user_id: data.user_id } });
    if (exists) throw new ResponseError(400, "company profile already exist for user");
    const created = await prismaClient.company_profile.create({ data });
    return { message: "created", data: created };
  }

  static async update(req: any) {
    const id = String(req.id || "");
    if (!id) throw new ResponseError(400, "id is required");
    const existing = await prismaClient.company_profile.findUnique({ where: { id } });
    if (!existing) throw new ResponseError(404, "company not found");
    const data = Validation.validate(CompanyProfileValidation, { ...req, user_id: existing.user_id });
    const updated = await prismaClient.company_profile.update({ where: { id }, data });
    return { message: "updated", data: updated };
  }

  static async delete(id: string) {
    const existing = await prismaClient.company_profile.findUnique({ where: { id } });
    if (!existing) throw new ResponseError(404, "company not found");
    await prismaClient.company_profile.delete({ where: { id } });
    return { message: "deleted" };
  }

  static async approve(req: { id: string; disnaker_id: string }) {
    const comp = await prismaClient.company_profile.findUnique({ where: { id: req.id } });
    if (!comp) throw new ResponseError(404, 'company not found');
    const updated = await prismaClient.company_profile.update({ where: { id: req.id }, data: { status: 'APPROVED' as any, disnaker_id: req.disnaker_id } });
    return { message: 'Company approved', data: updated };
  }

  static async reject(req: { id: string; disnaker_id: string }) {
    const comp = await prismaClient.company_profile.findUnique({ where: { id: req.id } });
    if (!comp) throw new ResponseError(404, 'company not found');
    const updated = await prismaClient.company_profile.update({ where: { id: req.id }, data: { status: 'REJECTED' as any, disnaker_id: req.disnaker_id } });
    return { message: 'Company rejected', data: updated };
  }
}