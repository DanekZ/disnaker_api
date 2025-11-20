export type CreateApplicationRequest = {
  candidate_id: string;
  company_id: string;
  job_id: string;
  note?: string;
};

export type UpdateApplicationRequest = {
  id: string;
  status?: "pending" | "test" | "interview" | "approve" | "rejected";
  schedule_start?: string | null;
  schedule_end?: string | null;
  note?: string | null;
};

export type ListApplicationsQuery = { candidate_id?: string; company_id?: string; job_id?: string };

export type ApplicationResponse = { message?: string; data?: any };