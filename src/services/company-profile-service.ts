import { query } from "../app/database";
import { Validation } from "../validations/validation";
import { CompanyProfileValidation } from "../validations/profile-validation";
import { ResponseError } from "../errors/response-error";
import UserService from "./user-service";

export default class CompanyProfileService {
  static async upsert(request: any) {
    const data = Validation.validate(CompanyProfileValidation, request);
    const uRows = await query<any>("SELECT id FROM users WHERE id = ? LIMIT 1", [data.user_id]);
    const user = uRows[0];
    if (!user) throw new ResponseError(404, "user not found");
    const cRows = await query<any>("SELECT id FROM company_profiles WHERE user_id = ? LIMIT 1", [data.user_id]);
    const existing = cRows[0];
    if (existing) {
      const fields = Object.keys(data);
      const setClause = fields.map((f) => `${f} = ?`).join(", ");
      const values = fields.map((f) => (data as any)[f]);
      await query(`UPDATE company_profiles SET ${setClause}, updated_at = NOW() WHERE user_id = ?`, [...values, data.user_id]);
      const updatedRows = await query<any>("SELECT * FROM company_profiles WHERE user_id = ?", [data.user_id]);
      return { message: "Company profile updated", data: updatedRows[0] };
    }
    await query(
      "INSERT INTO company_profiles (id, user_id, company_name, company_logo, no_handphone, province, city, address, website, about_company, status, disnaker_id, created_at, updated_at) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())",
      [
        data.user_id,
        data.company_name,
        data.company_logo || null,
        data.no_handphone,
        data.province,
        data.city,
        data.address,
        data.website || null,
        data.about_company,
        data.status || 'pending',
        data.disnaker_id || null,
      ]
    );
    const createdRows = await query<any>("SELECT * FROM company_profiles WHERE user_id = ?", [data.user_id]);
    return { message: "Company profile created", data: createdRows[0] };
  }

  static async list(opts: { status?: 'APPROVED' | 'PENDING' | 'REJECTED'; search?: string; page?: number; limit?: number }) {
    const clauses: string[] = [];
    const params: any[] = [];
    if (opts.status) { clauses.push("status = ?"); params.push(opts.status); }
    if (opts.search) {
      const s = `%${opts.search}%`;
      clauses.push("(company_name LIKE ? OR city LIKE ? OR province LIKE ?)");
      params.push(s, s, s);
    }
    const page = Math.max(1, Number(opts.page || 1));
    const limit = Math.max(1, Number(opts.limit || 10));
    const whereSql = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
    const totalRows = await query<{ cnt: number }>(`SELECT COUNT(*) as cnt FROM company_profiles ${whereSql}`, params);
    const total = totalRows[0]?.cnt || 0;
    const rows = await query<any>(`SELECT * FROM company_profiles ${whereSql} ORDER BY created_at DESC LIMIT ? OFFSET ?`, [...params, limit, (page - 1) * limit]);
    return { data: rows, pagination: { page, limit, total } };
  }

  static async getByUserId(user_id: string) {
    const rows = await query<any>("SELECT * FROM company_profiles WHERE user_id = ? LIMIT 1", [user_id]);
    const profile = rows[0] || null;
    return { data: profile };
  }

  static async getById(id: string) {
    const rows = await query<any>("SELECT * FROM company_profiles WHERE id = ? LIMIT 1", [id]);
    const profile = rows[0] || null;
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
    const existsRows = await query<{ cnt: number }>("SELECT COUNT(*) as cnt FROM company_profiles WHERE user_id = ?", [data.user_id]);
    const exists = existsRows[0]?.cnt || 0;
    if (exists) throw new ResponseError(400, "company profile already exist for user");
    await query(
      "INSERT INTO company_profiles (id, user_id, company_name, company_logo, no_handphone, province, city, address, website, about_company, status, disnaker_id, created_at, updated_at) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())",
      [
        data.user_id,
        data.company_name,
        data.company_logo || null,
        data.no_handphone,
        data.province,
        data.city,
        data.address,
        data.website || null,
        data.about_company,
        data.status || 'pending',
        data.disnaker_id || null,
      ]
    );
    const createdRows = await query<any>("SELECT * FROM company_profiles WHERE user_id = ?", [data.user_id]);
    return { message: "created", data: createdRows[0] };
  }

  static async update(req: any) {
    const id = String(req.id || "");
    if (!id) throw new ResponseError(400, "id is required");
    const exRows = await query<any>("SELECT * FROM company_profiles WHERE id = ?", [id]);
    const existing = exRows[0];
    if (!existing) throw new ResponseError(404, "company not found");
    const data = Validation.validate(CompanyProfileValidation, { ...req, user_id: existing.user_id });
    const fields = Object.keys(data);
    const setClause = fields.map((f) => `${f} = ?`).join(", ");
    const values = fields.map((f) => (data as any)[f]);
    await query(`UPDATE company_profiles SET ${setClause}, updated_at = NOW() WHERE id = ?`, [...values, id]);
    const rows = await query<any>("SELECT * FROM company_profiles WHERE id = ?", [id]);
    return { message: "updated", data: rows[0] };
  }

  static async delete(id: string) {
    const exRows = await query<any>("SELECT * FROM company_profiles WHERE id = ?", [id]);
    const existing = exRows[0];
    if (!existing) throw new ResponseError(404, "company not found");
    await query("DELETE FROM company_profiles WHERE id = ?", [id]);
    return { message: "deleted" };
  }

  static async approve(req: { id: string; disnaker_id: string }) {
    const cRows = await query<any>("SELECT * FROM company_profiles WHERE id = ?", [req.id]);
    const comp = cRows[0];
    if (!comp) throw new ResponseError(404, 'company not found');
    await query("UPDATE company_profiles SET status = 'APPROVED', disnaker_id = ?, updated_at = NOW() WHERE id = ?", [req.disnaker_id, req.id]);
    const rows = await query<any>("SELECT * FROM company_profiles WHERE id = ?", [req.id]);
    return { message: 'Company approved', data: rows[0] };
  }

  static async reject(req: { id: string; disnaker_id: string }) {
    const cRows = await query<any>("SELECT * FROM company_profiles WHERE id = ?", [req.id]);
    const comp = cRows[0];
    if (!comp) throw new ResponseError(404, 'company not found');
    await query("UPDATE company_profiles SET status = 'REJECTED', disnaker_id = ?, updated_at = NOW() WHERE id = ?", [req.disnaker_id, req.id]);
    const rows = await query<any>("SELECT * FROM company_profiles WHERE id = ?", [req.id]);
    return { message: 'Company rejected', data: rows[0] };
  }
}
