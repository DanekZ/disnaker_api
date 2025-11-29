import { query } from "../app/database";
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
    const uRows = await query<any>("SELECT id FROM users WHERE id = ? LIMIT 1", [data.user_id]);
    const user = uRows[0];
    if (!user) throw new ResponseError(404, "user not found");
    const dRows = await query<any>("SELECT id FROM disnaker_profiles WHERE user_id = ? LIMIT 1", [data.user_id]);
    const existing = dRows[0];
    if (existing) {
      const fields = Object.keys(data);
      const setClause = fields.map((f) => `${f} = ?`).join(", ");
      const values = fields.map((f) => (data as any)[f]);
      await query(`UPDATE disnaker_profiles SET ${setClause}, updated_at = NOW() WHERE user_id = ?`, [...values, data.user_id]);
      const rows = await query<any>("SELECT * FROM disnaker_profiles WHERE user_id = ?", [data.user_id]);
      return { message: "Disnaker profile updated", data: rows[0] };
    }
    await query(
      "INSERT INTO disnaker_profiles (id, user_id, divisi, full_name, created_at, updated_at) VALUES (UUID(), ?, ?, ?, NOW(), NOW())",
      [data.user_id, data.divisi, data.full_name]
    );
    const createdRows = await query<any>("SELECT * FROM disnaker_profiles WHERE user_id = ?", [data.user_id]);
    return { message: "Disnaker profile created", data: createdRows[0] };
  }

  static async getByUserId(user_id: string) {
    const rows = await query<any>("SELECT * FROM disnaker_profiles WHERE user_id = ? LIMIT 1", [user_id]);
    const profile = rows[0] || null;
    return { data: profile };
  }
}