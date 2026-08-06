export interface Job {
  _id: string;
  title: string;
  company_name: string;
  location: string;
  source: string;
  job_level: string;
  is_remote?: boolean;
  apply_url: string;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalJobs: number;
}

export interface JobsResponse {
  pagination: Pagination;
  jobs: Job[];
}
