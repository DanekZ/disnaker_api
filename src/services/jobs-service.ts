import { query } from "../app/database";
import { Validation } from "../validations/validation";
import { JobValidation } from "../validations/job-validation";
import { ApproveJobRequest, CloseJobRequest, CreateJobRequest, JobResponse, ListJobsQuery, UpdateJobRequest } from "../models/job-model";
import { ResponseError } from "../errors/response-error";

export default class JobsService {
  static async create(req: CreateJobRequest): Promise<JobResponse> {
    const data = Validation.validate(JobValidation.CREATE, req);
    const cRows = await query<any>("SELECT id FROM company_profiles WHERE id = ? LIMIT 1", [data.company_id]);
    const company = cRows[0];
    if (!company) throw new ResponseError(404, "company not found");
    const jobType = data.job_type.replace("-", "_") as any;
    const idRows = await query<any>("SELECT UUID() as id", []);
    const newId = idRows[0].id;
    await query(
      "INSERT INTO jobs (id, company_id, job_title, job_type, job_description, category, min_salary, max_salary, experience_required, education_required, skills_required, work_setup, application_deadline, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW(), NOW())",
      [newId, data.company_id, data.job_title, jobType, data.job_description ?? "", data.category, data.min_salary, data.max_salary, data.experience_required ?? "", data.education_required ?? "", data.skills_required ?? "", data.work_setup, new Date(data.application_deadline)]
    );
    const createdRows = await query<any>("SELECT * FROM jobs WHERE id = ?", [newId]);
    return { message: "Job created", data: createdRows[0] };
  }

  static async list(opts: ListJobsQuery & { page?: number; limit?: number }): Promise<JobResponse> {
    const q = Validation.validate(JobValidation.LIST, opts as any);
    const status = q.status ? (q.status as any) : undefined;
    const page = Math.max(1, Number((opts as any).page || 1));
    const limit = Math.max(1, Number((opts as any).limit || 10));
    const clauses: string[] = [];
    const params: any[] = [];
    if (q.company_id) { clauses.push("j.company_id = ?"); params.push(q.company_id); }
    if (status) { clauses.push("j.status = ?"); params.push(status); }
    if (q.category) { clauses.push("j.category = ?"); params.push(q.category); }
    const whereSql = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
    const totalRows = await query<{ cnt: number }>(`SELECT COUNT(*) as cnt FROM jobs j ${whereSql}`, params);
    const total = totalRows[0]?.cnt || 0;
    const rows = await query<any>(
      `SELECT j.*, c.company_name FROM jobs j LEFT JOIN company_profiles c ON c.id = j.company_id ${whereSql} ORDER BY j.created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, (page - 1) * limit]
    );
    return { data: rows, pagination: { page, limit, total } };
  }

  static async get(id: string): Promise<JobResponse> {
    const rows = await query<any>("SELECT * FROM jobs WHERE id = ? LIMIT 1", [id]);
    const job = rows[0];
    if (!job) throw new ResponseError(404, "job not found");
    return { data: job };
  }

  static async update(req: UpdateJobRequest): Promise<JobResponse> {
    const data = Validation.validate(JobValidation.UPDATE, req);
    const jRows = await query<any>("SELECT * FROM jobs WHERE id = ?", [data.id]);
    const job = jRows[0];
    if (!job) throw new ResponseError(404, "job not found");
    const next: any = {
      job_title: data.job_title ?? job.job_title,
      job_type: data.job_type ? (data.job_type.replace("-", "_") as any) : job.job_type,
      job_description: data.job_description ?? job.job_description,
      category: data.category ?? job.category,
      min_salary: typeof data.min_salary === "number" ? data.min_salary : job.min_salary,
      max_salary: typeof data.max_salary === "number" ? data.max_salary : job.max_salary,
      experience_required: data.experience_required ?? job.experience_required,
      education_required: data.education_required ?? job.education_required,
      skills_required: data.skills_required ?? job.skills_required,
      work_setup: data.work_setup ?? job.work_setup,
      application_deadline: data.application_deadline ? new Date(data.application_deadline) : job.application_deadline,
      status: data.status ? (data.status as any) : job.status,
      disnaker_id: data.disnaker_id ?? job.disnaker_id,
    };
    const fields = Object.keys(next);
    const setClause = fields.map((f) => `${f} = ?`).join(", ");
    const values = fields.map((f) => (next as any)[f]);
    await query(`UPDATE jobs SET ${setClause}, updated_at = NOW() WHERE id = ?`, [...values, data.id]);
    const rows = await query<any>("SELECT * FROM jobs WHERE id = ?", [data.id]);
    return { message: "Job updated", data: rows[0] };
  }

  static async approve(req: ApproveJobRequest): Promise<JobResponse> {
    const data = Validation.validate(JobValidation.APPROVE, req);
    const jRows = await query<any>("SELECT * FROM jobs WHERE id = ?", [data.id]);
    const job = jRows[0];
    if (!job) throw new ResponseError(404, "job not found");
    const dRows = await query<any>("SELECT * FROM disnaker_profiles WHERE id = ?", [data.disnaker_id]);
    const dis = dRows[0];
    if (!dis) throw new ResponseError(404, "disnaker not found");
    await query("UPDATE jobs SET status = 'approved', disnaker_id = ?, updated_at = NOW() WHERE id = ?", [data.disnaker_id, data.id]);
    const rows = await query<any>("SELECT * FROM jobs WHERE id = ?", [data.id]);
    return { message: "Job approved", data: rows[0] };
  }

  static async close(req: CloseJobRequest): Promise<JobResponse> {
    const data = Validation.validate(JobValidation.CLOSE, req);
    const jRows = await query<any>("SELECT * FROM jobs WHERE id = ?", [data.id]);
    const job = jRows[0];
    if (!job) throw new ResponseError(404, "job not found");
    await query("UPDATE jobs SET status = 'closed', updated_at = NOW() WHERE id = ?", [data.id]);
    const rows = await query<any>("SELECT * FROM jobs WHERE id = ?", [data.id]);
    return { message: "Job closed", data: rows[0] };
  }

  static async reject(req: { id: string }): Promise<JobResponse> {
    const data = Validation.validate(JobValidation.REJECT, req as any);
    const jRows = await query<any>("SELECT * FROM jobs WHERE id = ?", [data.id]);
    const job = jRows[0];
    if (!job) throw new ResponseError(404, "job not found");
    await query("UPDATE jobs SET status = 'rejected', disnaker_id = COALESCE(?, disnaker_id), updated_at = NOW() WHERE id = ?", [(req as any).disnaker_id ?? job.disnaker_id, data.id]);
    const rows = await query<any>("SELECT * FROM jobs WHERE id = ?", [data.id]);
    return { message: "Job rejected", data: rows[0] };
  }

  static async delete(id: string): Promise<JobResponse> {
    await query("DELETE FROM jobs WHERE id = ?", [id]);
    return { message: "Job deleted" };
  }
}
