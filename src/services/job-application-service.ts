import { prismaClient } from "../app/database";
import { Validation } from "../validations/validation";
import { ApplicationValidation } from "../validations/application-validation";
import { ApplicationResponse, CreateApplicationRequest, ListApplicationsQuery, UpdateApplicationRequest } from "../models/application-model";
import { ResponseError } from "../errors/response-error";

export default class JobApplicationService {
  static async apply(req: CreateApplicationRequest): Promise<ApplicationResponse> {
    const data = Validation.validate(ApplicationValidation.CREATE, req);
    const cand = await prismaClient.candidate_profile.findUnique({ where: { id: data.candidate_id } });
    if (!cand) throw new ResponseError(404, "candidate not found");
    const comp = await prismaClient.company_profile.findUnique({ where: { id: data.company_id } });
    if (!comp) throw new ResponseError(404, "company not found");
    const job = await prismaClient.jobs.findUnique({ where: { id: data.job_id } });
    if (!job) throw new ResponseError(404, "job not found");
    const created = await prismaClient.jobs_applications.create({ data: { candidate_id: data.candidate_id, company_id: data.company_id, job_id: data.job_id, note: data.note } });
    return { message: "Application created", data: created };
  }

  static async list(query: ListApplicationsQuery): Promise<ApplicationResponse> {
    const q = Validation.validate(ApplicationValidation.LIST, query);
    const rows = await prismaClient.jobs_applications.findMany({ where: { candidate_id: q.candidate_id, company_id: q.company_id, job_id: q.job_id }, orderBy: { createdAt: "desc" } });
    return { data: rows };
  }

  static async update(req: UpdateApplicationRequest): Promise<ApplicationResponse> {
    const data = Validation.validate(ApplicationValidation.UPDATE, req);
    const app = await prismaClient.jobs_applications.findUnique({ where: { id: data.id } });
    if (!app) throw new ResponseError(404, "application not found");
    const updated = await prismaClient.jobs_applications.update({ where: { id: data.id }, data: { status: (data.status as any) ?? app.status, schedule_start: data.schedule_start ? new Date(data.schedule_start) : data.schedule_start === null ? null : app.schedule_start, schedule_end: data.schedule_end ? new Date(data.schedule_end) : data.schedule_end === null ? null : app.schedule_end, note: typeof data.note !== "undefined" ? data.note || null : app.note } });
    return { message: "Application updated", data: updated };
  }

  static async delete(id: string): Promise<ApplicationResponse> {
    await prismaClient.jobs_applications.delete({ where: { id } });
    return { message: "Application deleted" };
  }
}