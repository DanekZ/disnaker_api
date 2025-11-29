import { query } from "../app/database";
import { Validation } from "../validations/validation";
import { CandidateProfileValidation } from "../validations/profile-validation";
import { ResponseError } from "../errors/response-error";
import UserService from "./user-service";

export default class CandidateProfileService {
  static async upsert(request: any) {
    const data = Validation.validate(CandidateProfileValidation, request);
    const uRows = await query<any>("SELECT id FROM users WHERE id = ? LIMIT 1", [data.user_id]);
    const user = uRows[0];
    if (!user) throw new ResponseError(404, "user not found");
    const cRows = await query<any>("SELECT id FROM candidate_profiles WHERE user_id = ? LIMIT 1", [data.user_id]);
    const existing = cRows[0];
    if (existing) {
      const fields = Object.keys(data);
      const setClause = fields.map((f) => `${f} = ?`).join(", ");
      const values = fields.map((f) => (data as any)[f]);
      await query(`UPDATE candidate_profiles SET ${setClause}, updated_at = NOW() WHERE user_id = ?`, [...values, data.user_id]);
      const updatedRows = await query<any>("SELECT * FROM candidate_profiles WHERE user_id = ?", [data.user_id]);
      return { message: "Candidate profile updated", data: updatedRows[0] };
    }
    await query(
      "INSERT INTO candidate_profiles (id, user_id, full_name, birthdate, place_of_birth, nik, province, address, postal_code, gender, no_handphone, photo_profile, last_education, graduation_year, status_perkawinan, cv_file, ak1_file, created_at, updated_at) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())",
      [
        data.user_id,
        data.full_name,
        data.birthdate,
        data.place_of_birth,
        data.nik,
        data.province,
        data.address,
        data.postal_code,
        data.gender,
        data.no_handphone,
        data.photo_profile || null,
        data.last_education,
        data.graduation_year,
        data.status_perkawinan,
        data.cv_file || null,
        data.ak1_file || null,
      ]
    );
    const createdRows = await query<any>("SELECT * FROM candidate_profiles WHERE user_id = ?", [data.user_id]);
    return { message: "Candidate profile created", data: createdRows[0] };
  }

  static async getByUserId(user_id: string) {
    const rows = await query<any>("SELECT * FROM candidate_profiles WHERE user_id = ? LIMIT 1", [user_id]);
    const profile = rows[0] || null;
    return { data: profile };
  }

  static async getById(id: string) {
    const rows = await query<any>("SELECT * FROM candidate_profiles WHERE id = ? LIMIT 1", [id]);
    const profile = rows[0] || null;
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
    const nikRows = await query<{ cnt: number }>("SELECT COUNT(*) as cnt FROM candidate_profiles WHERE nik = ?", [data.nik]);
    const existsNik = nikRows[0]?.cnt || 0;
    if (existsNik) throw new ResponseError(400, "nik already exist");
    await query(
      "INSERT INTO candidate_profiles (id, user_id, full_name, birthdate, place_of_birth, nik, province, address, postal_code, gender, no_handphone, photo_profile, last_education, graduation_year, status_perkawinan, cv_file, ak1_file, created_at, updated_at) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())",
      [
        data.user_id,
        data.full_name,
        data.birthdate,
        data.place_of_birth,
        data.nik,
        data.province,
        data.address,
        data.postal_code,
        data.gender,
        data.no_handphone,
        data.photo_profile || null,
        data.last_education,
        data.graduation_year,
        data.status_perkawinan,
        data.cv_file || null,
        data.ak1_file || null,
      ]
    );
    const rows = await query<any>("SELECT * FROM candidate_profiles WHERE user_id = ?", [data.user_id]);
    return { message: "created", data: rows[0] };
  }

  static async update(req: any) {
    const id = String(req.id || "");
    if (!id) throw new ResponseError(400, "id is required");
    const eRows = await query<any>("SELECT * FROM candidate_profiles WHERE id = ?", [id]);
    const existing = eRows[0];
    if (!existing) throw new ResponseError(404, "candidate not found");
    const data = Validation.validate(CandidateProfileValidation, { ...req, user_id: existing.user_id });
    const fields = Object.keys(data);
    const setClause = fields.map((f) => `${f} = ?`).join(", ");
    const values = fields.map((f) => (data as any)[f]);
    await query(`UPDATE candidate_profiles SET ${setClause}, updated_at = NOW() WHERE id = ?`, [...values, id]);
    const rows = await query<any>("SELECT * FROM candidate_profiles WHERE id = ?", [id]);
    return { message: "updated", data: rows[0] };
  }

  static async delete(id: string) {
    const eRows = await query<any>("SELECT id FROM candidate_profiles WHERE id = ?", [id]);
    const existing = eRows[0];
    if (!existing) throw new ResponseError(404, "candidate not found");
    await query("DELETE FROM candidate_profiles WHERE id = ?", [id]);
    return { message: "deleted" };
  }

  static async list(params: { search?: string; status?: 'APPROVED' | 'REJECTED' | 'PENDING'; page?: number; limit?: number }) {
    const page = Math.max(1, Number(params.page || 1));
    const limit = Math.max(1, Number(params.limit || 10));
    const s = (params.search || '').trim();
    const whereClause = s ? `WHERE c.full_name LIKE ? OR c.nik LIKE ? OR c.place_of_birth LIKE ?` : '';
    const binds = s ? [`%${s}%`, `%${s}%`, `%${s}%`] : [];
    const totalRows = await query<{ cnt: number }>(`SELECT COUNT(*) as cnt FROM candidate_profiles c ${whereClause}`, binds);
    const total = totalRows[0]?.cnt || 0;
    const rows = await query<any>(
      `SELECT c.*, u.email as user_email, d.id as doc_id, card.status as card_status
       FROM candidate_profiles c
       LEFT JOIN users u ON u.id = c.user_id
       LEFT JOIN candidate_ak1_documents d ON d.candidate_id = c.id
       LEFT JOIN candidate_ak1_cards card ON card.ak1_document_id = d.id
       ${whereClause}
       ORDER BY c.created_at DESC
       LIMIT ? OFFSET ?`,
      [...binds, limit, (page - 1) * limit]
    );
    const data = rows.map((c: any) => {
      const cardStatus = c.card_status ? String(c.card_status).toUpperCase() : (c.doc_id ? 'PENDING' : undefined);
      let ak1_status: 'APPROVED' | 'REJECTED' | 'PENDING' | undefined = undefined;
      if (cardStatus) ak1_status = cardStatus as any;
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
        email: c.user_email || null,
        ak1_status,
      };
      return out;
    });
    const filtered = params.status ? data.filter((d: any) => d.ak1_status === params.status) : data;
    return { data: filtered, pagination: { page, limit, total } };
  }
}
