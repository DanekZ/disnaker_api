import { prismaClient } from "../app/database";
import { Validation } from "../validations/validation";
import { CandidateProfileValidation } from "../validations/profile-validation";
import { ResponseError } from "../errors/response-error";
import UserService from "./user-service";

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

  static async getByUserId(user_id: string) {
    const profile = await prismaClient.candidate_profile.findUnique({ where: { user_id } });
    return { data: profile };
  }

  static async getById(id: string) {
    const profile = await prismaClient.candidate_profile.findUnique({ where: { id } });
    return { data: profile };
  }

  static async create(request: any) {
    if (!request.user_id) {
      const email = String(request.user_email || "").trim();
      const password = String(request.user_password || "").trim();
      if (!email || !password) throw new ResponseError(400, "user credentials required");
      const reg = await UserService.register({ email, password, role: "candidate" });
      request.user_id = reg.id;
    }
    const data = Validation.validate(CandidateProfileValidation, request);
    const existsNik = await prismaClient.candidate_profile.count({ where: { nik: data.nik } });
    if (existsNik) throw new ResponseError(400, "nik already exist");
    const created = await prismaClient.candidate_profile.create({ data });
    return { message: "created", data: created };
  }

  static async update(req: any) {
    const id = String(req.id || "");
    if (!id) throw new ResponseError(400, "id is required");
    const existing = await prismaClient.candidate_profile.findUnique({ where: { id } });
    if (!existing) throw new ResponseError(404, "candidate not found");
    const data = Validation.validate(CandidateProfileValidation, { ...req, user_id: existing.user_id });
    const updated = await prismaClient.candidate_profile.update({ where: { id }, data });
    return { message: "updated", data: updated };
  }

  static async delete(id: string) {
    const existing = await prismaClient.candidate_profile.findUnique({ where: { id } });
    if (!existing) throw new ResponseError(404, "candidate not found");
    await prismaClient.candidate_profile.delete({ where: { id } });
    return { message: "deleted" };
  }

  static async list(query: { search?: string; status?: 'APPROVED' | 'REJECTED' | 'PENDING'; page?: number; limit?: number }) {
    const where: any = {};
    if (query.search) {
      const s = query.search;
      where.OR = [
        { full_name: { contains: s } },
        { nik: { contains: s } },
        { place_of_birth: { contains: s } },
      ];
    }
    const page = Math.max(1, Number(query.page || 1));
    const limit = Math.max(1, Number(query.limit || 10));
    const total = await prismaClient.candidate_profile.count({ where });
    const rows = await prismaClient.candidate_profile.findMany({
      where,
      include: { user: true, ak1_documents: { include: { ak1_card: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });
    const data = rows.map((c: any) => {
      const doc = (c.ak1_documents || [])[0] || null;
      const card = doc?.ak1_card || null;
      let ak1_status: 'APPROVED' | 'REJECTED' | 'PENDING' | undefined = undefined;
      if (card?.status) ak1_status = String(card.status).toUpperCase() as any;
      else if (doc) ak1_status = 'PENDING';
      const out = {
        id: c.id,
        user_id: c.user_id,
        full_name: c.full_name,
        birthdate: c.birthdate,
        place_of_birth: c.place_of_birth,
        nik: c.nik,
        province: c.province,
        address: c.address,
        postal_code: c.postal_code,
        gender: c.gender,
        no_handphone: c.no_handphone,
        photo_profile: c.photo_profile,
        last_education: c.last_education,
        graduation_year: c.graduation_year,
        status_perkawinan: c.status_perkawinan,
        email: c.user?.email || null,
        ak1_status,
      };
      return out;
    });
    const filtered = query.status ? data.filter((d) => d.ak1_status === query.status) : data;
    return { data: filtered, pagination: { page, limit, total } };
  }
}
