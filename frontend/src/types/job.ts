export interface Job {
  _id: string;
  title: string;
  companyName: string;
  location: string;
  description?: string;
  jobUrl?: string;
  publicationDate?: string;
}

export interface JobsResponse {
  count: number;
  jobs: Job[];
}
