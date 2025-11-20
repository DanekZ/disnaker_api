import { prismaClient } from "../app/database";
import { Validation } from "../validations/validation";
import { JobValidation } from "../validations/job-validation";
import { ApproveJobRequest, CloseJobRequest, CreateJobRequest, JobResponse, ListJobsQuery, UpdateJobRequest } from "../models/job-model";
import { ResponseError } from "../errors/response-error";

export default class JobsService {
  static async create(req: CreateJobRequest): Promise<JobResponse> {
    const data = Validation.validate(JobValidation.CREATE, req);
    const company = await prismaClient.company_profile.findUnique({ where: { id: data.company_id } });
    if (!company) throw new ResponseError(404, "company not found");
    const jobType = data.job_type.replace("-", "_") as any;
    const created = await prismaClient.jobs.create({
      data: {
        company_id: data.company_id,
        job_title: data.job_title,
        job_type: jobType,
        job_description: data.job_description ?? "",
        category: data.category,
        min_salary: data.min_salary,
        max_salary: data.max_salary,
        experience_required: data.experience_required ?? "",
        education_required: data.education_required ?? "",
        skills_required: data.skills_required ?? "",
        work_setup: data.work_setup,
        application_deadline: new Date(data.application_deadline),
      },
    });
    return { message: "Job created", data: created };
  }

  static async list(query: ListJobsQuery): Promise<JobResponse> {
    const q = Validation.validate(JobValidation.LIST, query);
    const status = q.status ? (q.status as any) : undefined;
    const jobs = await prismaClient.jobs.findMany({ where: { company_id: q.company_id, status, category: q.category }, orderBy: { createdAt: "desc" } });
    return { data: jobs };
  }

  static async get(id: string): Promise<JobResponse> {
    const job = await prismaClient.jobs.findUnique({ where: { id } });
    if (!job) throw new ResponseError(404, "job not found");
    return { data: job };
  }

  static async update(req: UpdateJobRequest): Promise<JobResponse> {
    const data = Validation.validate(JobValidation.UPDATE, req);
    const job = await prismaClient.jobs.findUnique({ where: { id: data.id } });
    if (!job) throw new ResponseError(404, "job not found");
    const updated = await prismaClient.jobs.update({
      where: { id: data.id },
      data: {
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
      },
    });
    return { message: "Job updated", data: updated };
  }

  static async approve(req: ApproveJobRequest): Promise<JobResponse> {
    const data = Validation.validate(JobValidation.APPROVE, req);
    const job = await prismaClient.jobs.findUnique({ where: { id: data.id } });
    if (!job) throw new ResponseError(404, "job not found");
    const dis = await prismaClient.disnaker_profile.findUnique({ where: { id: data.disnaker_id } });
    if (!dis) throw new ResponseError(404, "disnaker not found");
    const updated = await prismaClient.jobs.update({ where: { id: data.id }, data: { status: "approved" as any, disnaker_id: data.disnaker_id } });
    return { message: "Job approved", data: updated };
  }

  static async close(req: CloseJobRequest): Promise<JobResponse> {
    const data = Validation.validate(JobValidation.CLOSE, req);
    const job = await prismaClient.jobs.findUnique({ where: { id: data.id } });
    if (!job) throw new ResponseError(404, "job not found");
    const updated = await prismaClient.jobs.update({ where: { id: data.id }, data: { status: "closed" as any } });
    return { message: "Job closed", data: updated };
  }

  static async delete(id: string): Promise<JobResponse> {
    await prismaClient.jobs.delete({ where: { id } });
    return { message: "Job deleted" };
  }
}