export interface IJob {
  _id: string;
  title: string;
  company_name: string;
  location: string;
  source: string;
  job_level: string;
  is_remote?: boolean;
  apply_url: string;
  description?: string;
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

export interface IDashboardData {
  summary: {
    totalJobs: number;
    totalCompanies: number;
    remoteJobs: number;
    internships: number;
  };

  jobsBySource: {
    name: string;
    value: number;
  }[];

  jobsByLevel: {
    name: string;
    value: number;
  }[];

  jobsByDay: {
    date: string;
    jobs: number;
  }[];
}

export interface IJobCoordinates {
  latitude: number;
  longitude: number;
}

export interface IJobDetailsResponse {
  job: IJob;
  coordinates: IJobCoordinates | null;
}
