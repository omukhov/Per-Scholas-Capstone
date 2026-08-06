export interface IJob {
  _id: string;
  title: string;
  company_name: string;
  location: string;
  source: string;
  job_level: string;
  is_remote?: boolean;
  apply_url: string;
}

export interface IPagination {
  currentPage: number;
  totalPages: number;
  totalJobs: number;
}

export interface IJobsResponse {
  pagination: IPagination;
  jobs: IJob[];
}
