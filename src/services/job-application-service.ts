import { query } from "../app/database";
import { Validation } from "../validations/validation";
import { ApplicationValidation } from "../validations/application-validation";
import { ApplicationResponse, CreateApplicationRequest, ListApplicationsQuery, UpdateApplicationRequest } from "../models/application-model";
import { ResponseError } from "../errors/response-error";

export default class JobApplicationService {
  static async apply(req: CreateApplicationRequest): Promise<ApplicationResponse> {
    const data = Validation.validate(ApplicationValidation.CREATE, req);
    const candRows = await query<any>("SELECT id FROM candidate_profiles WHERE id = ? LIMIT 1", [data.candidate_id]);
    const cand = candRows[0];
    if (!cand) throw new ResponseError(404, "candidate not found");
    const compRows = await query<any>("SELECT id FROM company_profiles WHERE id = ? LIMIT 1", [data.company_id]);
    const comp = compRows[0];
    if (!comp) throw new ResponseError(404, "company not found");
    const jobRows = await query<any>("SELECT id FROM jobs WHERE id = ? LIMIT 1", [data.job_id]);
    const job = jobRows[0];
    if (!job) throw new ResponseError(404, "job not found");
    const idRows = await query<any>("SELECT UUID() as id", []);
    const newId = idRows[0].id;
    await query(
      "INSERT INTO jobs_applications (id, candidate_id, company_id, job_id, application_date, status, schedule_start, schedule_end, note, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), 'pending', NULL, NULL, ?, NOW(), NOW())",
      [newId, data.candidate_id, data.company_id, data.job_id, data.note || null]
    );
    const rows = await query<any>("SELECT * FROM jobs_applications WHERE id = ?", [newId]);
    return { message: "Application created", data: rows[0] };
  }

  static async list(input: ListApplicationsQuery): Promise<ApplicationResponse> {
    const q = Validation.validate(ApplicationValidation.LIST, input);
    const clauses: string[] = [];
    const binds: any[] = [];
    if (q.candidate_id) { clauses.push("candidate_id = ?"); binds.push(q.candidate_id); }
    if (q.company_id) { clauses.push("company_id = ?"); binds.push(q.company_id); }
    if (q.job_id) { clauses.push("job_id = ?"); binds.push(q.job_id); }
    const whereSql = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
    const rows = await query<any>(`SELECT * FROM jobs_applications ${whereSql} ORDER BY created_at DESC`, binds);
    return { data: rows };
  }

  static async update(req: UpdateApplicationRequest): Promise<ApplicationResponse> {
    const data = Validation.validate(ApplicationValidation.UPDATE, req);
    const aRows = await query<any>("SELECT * FROM jobs_applications WHERE id = ?", [data.id]);
    const app = aRows[0];
    if (!app) throw new ResponseError(404, "application not found");
    const next: any = {
      status: (data.status as any) ?? app.status,
      schedule_start: data.schedule_start ? new Date(data.schedule_start) : data.schedule_start === null ? null : app.schedule_start,
      schedule_end: data.schedule_end ? new Date(data.schedule_end) : data.schedule_end === null ? null : app.schedule_end,
      note: typeof data.note !== "undefined" ? data.note || null : app.note,
    };
    const fields = Object.keys(next);
    const setClause = fields.map((f) => `${f} = ?`).join(", ");
    const values = fields.map((f) => (next as any)[f]);
    await query(`UPDATE jobs_applications SET ${setClause}, updated_at = NOW() WHERE id = ?`, [...values, data.id]);
    const rows = await query<any>("SELECT * FROM jobs_applications WHERE id = ?", [data.id]);
    return { message: "Application updated", data: rows[0] };
  }

  static async delete(id: string): Promise<ApplicationResponse> {
    await query("DELETE FROM jobs_applications WHERE id = ?", [id]);
    return { message: "Application deleted" };
  }
}