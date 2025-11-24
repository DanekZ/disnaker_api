export type CreateJobRequest = {
  company_id: string;
  job_title: string;
  job_type: "full-time" | "part-time" | "internship" | "contract" | "freelance";
  job_description: string;
  category: string;
  min_salary: number;
  max_salary: number;
  experience_required: string;
  education_required: string;
  skills_required: string;
  work_setup: string;
  application_deadline: string;
};

export type UpdateJobRequest = {
  id: string;
  job_title?: string;
  job_type?: "full-time" | "part-time" | "internship" | "contract" | "freelance";
  job_description?: string;
  category?: string;
  min_salary?: number;
  max_salary?: number;
  experience_required?: string;
  education_required?: string;
  skills_required?: string;
  work_setup?: string;
  application_deadline?: string;
  status?: "pending" | "approved" | "rejected" | "closed";
  disnaker_id?: string;
};

export type ApproveJobRequest = { id: string; disnaker_id: string };
export type CloseJobRequest = { id: string };

export type ListJobsQuery = { company_id?: string; status?: "pending" | "approved" | "rejected" | "closed"; category?: string };

export type JobResponse = { message?: string; data?: any };